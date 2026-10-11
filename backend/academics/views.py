import logging
from typing import Any, Optional, Dict, List
from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from academics.models import AcademicNote, AcademicProgress, SQLQueryHistory
from academics.serializers import AcademicNoteSerializer, AcademicProgressSerializer, SQLQueryHistorySerializer
from academics.services.sql_engine import SQLEngine
from academics.services.code_runner import CodeRunner

logger = logging.getLogger(__name__)

def get_user_id(request) -> str:
    """Extracts user_id from headers, query params, or body, defaulting to 'default_user'."""
    user = getattr(request, 'user', None)
    if user and getattr(user, 'is_authenticated', False):
        return str(user.id or user.username)
    user_id = (
        request.headers.get('X-User-ID') or
        request.headers.get('X-User-Id') or
        (request.query_params.get('user_id') if hasattr(request, 'query_params') else None)
    )
    if not user_id and hasattr(request, 'data') and isinstance(request.data, dict):
        user_id = request.data.get('user_id')
    return (str(user_id).strip() if user_id else "default_user")


# --- SQL Playground Endpoints ---

class SQLExecuteView(APIView):
    def post(self, request):
        query = request.data.get('query', '')
        expected_sql = request.data.get('expected_sql')
        user_id = get_user_id(request)

        if not query or not query.strip():
            return Response({"success": False, "error": "Query cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        engine = SQLEngine.get_instance()

        if expected_sql:
            res = engine.validate_exercise(query, expected_sql, user_id=user_id)
            return Response(res)
        
        result = engine.execute_query(query, user_id=user_id)
        return Response(result)


class SQLSchemaView(APIView):
    def get(self, request):
        engine = SQLEngine.get_instance()
        schemas = engine.get_schema()
        return Response({"tables": schemas, "total_tables": len(schemas)})


class SQLResetView(APIView):
    def post(self, request):
        engine = SQLEngine.get_instance()
        engine.reset_database()
        return Response({"message": "Sandbox database reset to original clean state successfully."})


class SQLHistoryView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        history = SQLQueryHistory.objects.filter(user_id=user_id)[:30]
        serializer = SQLQueryHistorySerializer(history, many=True)
        return Response(serializer.data)


# --- Python Code Runner Endpoints ---

class CodeRunnerView(APIView):
    def post(self, request):
        code = request.data.get('code', '')
        stdin_input = request.data.get('stdin_input', '')
        test_cases = request.data.get('test_cases')
        timeout_seconds = float(request.data.get('timeout_seconds', 5.0))

        if not code or not code.strip():
            return Response({"success": False, "error": "No code provided to execute."}, status=status.HTTP_400_BAD_REQUEST)

        runner = CodeRunner.get_instance()
        result = runner.run_code(
            code=code,
            stdin_input=stdin_input,
            timeout_seconds=min(timeout_seconds, 10.0),
            test_cases=test_cases
        )
        return Response(result)


# --- Personal Notes Endpoints ---

class NotesListView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        category = request.query_params.get('category')
        day_number = request.query_params.get('day_number')
        search = request.query_params.get('search')

        notes = AcademicNote.objects.filter(user_id=user_id)

        if category and category != 'All':
            notes = notes.filter(category=category)
        if day_number:
            notes = notes.filter(day_number=int(day_number))
        if search:
            notes = notes.filter(
                Q(title__icontains=search) |
                Q(content__icontains=search) |
                Q(category__icontains=search)
            )

        serializer = AcademicNoteSerializer(notes, many=True)
        return Response({
            "total_notes": notes.count(),
            "notes": serializer.data
        })

    def post(self, request):
        user_id = get_user_id(request)
        title = request.data.get('title')
        content = request.data.get('content', '')
        category = request.data.get('category', 'General')
        day_number = request.data.get('day_number')
        topic_id = request.data.get('topic_id', '')
        tags = request.data.get('tags', [])
        is_pinned = request.data.get('is_pinned', False)

        if not title or not title.strip():
            return Response({"error": "Note title is required."}, status=status.HTTP_400_BAD_REQUEST)

        note = AcademicNote.objects.create(
            user_id=user_id,
            title=title.strip(),
            content=content,
            category=category,
            day_number=int(day_number) if day_number else None,
            topic_id=topic_id,
            tags=tags if isinstance(tags, list) else [],
            is_pinned=bool(is_pinned)
        )

        serializer = AcademicNoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NotesDetailView(APIView):
    def get(self, request, note_id):
        user_id = get_user_id(request)
        note = AcademicNote.objects.filter(id=note_id, user_id=user_id).first()
        if not note:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AcademicNoteSerializer(note)
        return Response(serializer.data)

    def patch(self, request, note_id):
        user_id = get_user_id(request)
        note = AcademicNote.objects.filter(id=note_id, user_id=user_id).first()
        if not note:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

        for field in ['title', 'content', 'category', 'topic_id', 'is_pinned']:
            if field in request.data:
                setattr(note, field, request.data[field])

        if 'day_number' in request.data:
            val = request.data['day_number']
            note.day_number = int(val) if val is not None else None

        if 'tags' in request.data and isinstance(request.data['tags'], list):
            note.tags = request.data['tags']

        note.save()
        serializer = AcademicNoteSerializer(note)
        return Response(serializer.data)

    def delete(self, request, note_id):
        user_id = get_user_id(request)
        note = AcademicNote.objects.filter(id=note_id, user_id=user_id).first()
        if not note:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response({"message": f"Note '{note_id}' deleted successfully."})


# --- Academic Progress Endpoints ---

class ProgressView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        progress, _ = AcademicProgress.objects.get_or_create(user_id=user_id)
        serializer = AcademicProgressSerializer(progress)
        return Response(serializer.data)

    def post(self, request):
        user_id = get_user_id(request)
        progress, _ = AcademicProgress.objects.get_or_create(user_id=user_id)

        # Update fields if passed
        if 'completed_days' in request.data:
            progress.completed_days = request.data['completed_days']
        if 'day_status' in request.data:
            progress.day_status = request.data['day_status']
        if 'quiz_scores' in request.data:
            progress.quiz_scores = request.data['quiz_scores']
        if 'coding_submissions' in request.data:
            progress.coding_submissions = request.data['coding_submissions']
        if 'saved_cheat_sheets' in request.data:
            progress.saved_cheat_sheets = request.data['saved_cheat_sheets']
        if 'bookmarks' in request.data:
            progress.bookmarks = request.data['bookmarks']
        if 'revision_items' in request.data:
            progress.revision_items = request.data['revision_items']
        if 'capstone_progress' in request.data:
            progress.capstone_progress = request.data['capstone_progress']
        if 'streak_count' in request.data:
            progress.streak_count = int(request.data['streak_count'])

        progress.last_active_date = date.today()
        progress.save()

        serializer = AcademicProgressSerializer(progress)
        return Response(serializer.data)


# --- Dedicated Academic Tutor AI Endpoint ---

class AcademicTutorView(APIView):
    """
    Dedicated AI Academic Tutor for DSA & Data Engineering lessons.
    Guarantees strict academic focus without relationship/personal memory pollution.
    Provides resilient, high-quality Socratic answers with automatic pedagogical fallback.
    """
    def post(self, request):
        question = request.data.get('question', '').strip()
        if not question:
            return Response(
                {"success": False, "error": "Question cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        topic_id = str(request.data.get('topic_id', '')).strip()
        day_number = request.data.get('day_number')
        lesson_title = str(request.data.get('lesson_title', 'Data Structures & Algorithms / Data Engineering')).strip()
        lesson_subject = str(request.data.get('lesson_subject', 'General')).strip()
        lesson_summary = str(request.data.get('lesson_summary', '')).strip()
        history = request.data.get('conversation_history', [])

        user_id = get_user_id(request)
        logger.info(f"AcademicTutor request for user '{user_id}' on topic '{topic_id}': '{question[:60]}...'")

        # 1. Attempt LLM generation if service is available
        llm_response = None
        source = "curriculum_knowledge_base"

        try:
            from chat.services.llm_service import LLMService
            llm = LLMService(temperature=0.3, max_tokens=600)
            if llm.is_available():
                system_prompt = (
                    "You are Akku AI's senior academic instructor and mentor specializing in Data Structures & "
                    "Algorithms (DSA) and Data Engineering. Your role is strictly educational.\n"
                    f"Current Lesson: Day {day_number or 'N/A'} - {lesson_title}\n"
                    f"Subject: {lesson_subject}\n"
                    f"Topic ID: {topic_id}\n"
                    f"Lesson Overview: {lesson_summary[:400]}\n\n"
                    "Instructions:\n"
                    "1. Respond directly, concisely, and accurately to the student's question.\n"
                    "2. Use first-principles explanations, real-world engineering analogies, and clear Python/SQL/algorithmic examples.\n"
                    "3. When providing code, include a brief explanation of how it works, its time/space complexity, and common edge-case traps.\n"
                    "4. Maintain a supportive, encouraging, expert teaching tone.\n"
                    "5. Strictly refuse or redirect non-academic or unrelated relationship topics."
                )

                messages = [{"role": "system", "content": system_prompt}]
                if isinstance(history, list):
                    for turn in history[-4:]:
                        if isinstance(turn, dict) and "sender" in turn and "text" in turn:
                            role = "user" if turn["sender"] == "user" else "assistant"
                            messages.append({"role": role, "content": turn["text"]})

                messages.append({"role": "user", "content": question})

                raw_text = llm.generate(messages=messages)
                if raw_text and len(raw_text.strip()) > 10:
                    llm_response = raw_text.strip()
                    source = "ai_tutor"
        except Exception as e:
            logger.warning(f"AcademicTutor LLM generation failed or unavailable: {e}")

        # 2. Resilient pedagogical fallback if LLM offline
        if not llm_response:
            llm_response = self._generate_pedagogical_fallback(
                question=question,
                topic_id=topic_id,
                day_number=day_number,
                lesson_title=lesson_title,
                lesson_subject=lesson_subject,
                lesson_summary=lesson_summary
            )

        return Response({
            "success": True,
            "answer": llm_response,
            "source": source,
            "topic_id": topic_id,
            "lesson_title": lesson_title,
            "day_number": day_number
        }, status=status.HTTP_200_OK)

    def _generate_pedagogical_fallback(self, question: str, topic_id: str, day_number: Any, lesson_title: str, lesson_subject: str, lesson_summary: str) -> str:
        q = question.lower()
        title_lower = lesson_title.lower()

        # Arrays specific fallback
        if "array" in topic_id.lower() or "array" in title_lower or day_number == 102 or "kadane" in q or "prefix sum" in q or "two pointer" in q:
            if "kadane" in q or "maximum subarray" in q or "negative" in q:
                return (
                    "### 💡 Kadane's Algorithm Explained\n\n"
                    "**Core Problem:** Find the contiguous subarray with the largest sum in $O(N)$ time.\n\n"
                    "**How it works:**\n"
                    "At each index `i`, we make an optimal choice: either extend the existing subarray (`current_sum + num`) or start fresh with just `num` (`max(num, current_sum + num)`).\n\n"
                    "```python\n"
                    "def max_sub_array(nums):\n"
                    "    max_so_far = nums[0]\n"
                    "    current_sum = nums[0]\n"
                    "    for x in nums[1:]:\n"
                    "        current_sum = max(x, current_sum + x)\n"
                    "        max_so_far = max(max_so_far, current_sum)\n"
                    "    return max_so_far\n"
                    "```\n\n"
                    "- **All Negative Numbers Edge Case:** Initializing `max_so_far = nums[0]` instead of `0` ensures that if all numbers are negative (e.g., `[-5, -2, -8]`), it correctly returns the least negative number (`-2`) rather than `0`.\n"
                    "- **Complexity:** $O(N)$ Time, $O(1)$ Auxiliary Space."
                )
            if "prefix" in q or "range sum" in q:
                return (
                    "### 💡 Prefix Sum Pattern Explained\n\n"
                    "**Concept:** Precompute cumulative sums so any range query `sum(arr[L..R])` runs in $O(1)$ time instead of $O(N)$!\n\n"
                    "```python\n"
                    "# Precomputation: O(N)\n"
                    "prefix = [0] * (len(arr) + 1)\n"
                    "for i, val in enumerate(arr):\n"
                    "    prefix[i + 1] = prefix[i] + val\n\n"
                    "# Query arr[L..R] (0-indexed, inclusive) in O(1):\n"
                    "def query(L, R):\n"
                    "    return prefix[R + 1] - prefix[L]\n"
                    "```\n\n"
                    "**Common Pitfall:** Off-by-one errors when sizing the prefix array. Using a 1-based size `len(arr) + 1` with `prefix[0] = 0` avoids negative indexing for queries starting at index `0`."
                )
            if "two pointer" in q:
                return (
                    "### 💡 Two Pointers Pattern Explained\n\n"
                    "**Concept:** Maintain two coordinate indices (`left` at start, `right` at end) moving towards each other based on comparison conditions.\n\n"
                    "**Key Prerequisite:** The array must usually be **sorted** for opposing pointers (e.g., Two Sum II, Container With Most Water).\n\n"
                    "```python\n"
                    "left, right = 0, len(nums) - 1\n"
                    "while left < right:\n"
                    "    current = nums[left] + nums[right]\n"
                    "    if current == target:\n"
                    "        return (left, right)\n"
                    "    elif current < target:\n"
                    "        left += 1  # Need larger sum\n"
                    "    else:\n"
                    "        right -= 1 # Need smaller sum\n"
                    "```\n\n"
                    "- **Complexity:** $O(N)$ Time, $O(1)$ Space."
                )

        # General pedagogical queries
        if any(w in q for w in ["analogy", "real life", "simple", "intuition"]):
            return (
                f"### 💡 Real-Life Analogy for {lesson_title}\n\n"
                "Think of this like an organized enterprise library catalog: instead of having to search through every single book stacked randomly on the warehouse floor, you have indexed shelves with contiguous coordinate addresses.\n\n"
                "This allows the CPU cache to prefetch neighboring memory cells instantly with spatial locality, guaranteeing near-instant response times!"
            )
        elif any(w in q for w in ["complexity", "big o", "time", "space", "runtime"]):
            return (
                f"### ⏱️ Asymptotic Complexity Analysis for {lesson_title}\n\n"
                "- **Best Case:** $O(1)$ when finding target or matching boundary immediately.\n"
                "- **Average & Worst Case:** Typically $O(N)$ or $O(N \\log N)$ depending on whether sorting or scanning.\n"
                "- **Auxiliary Space:** Strive for $O(1)$ in-place algorithms; beware of $O(N)$ copies when slicing arrays (`arr[1:]`) in Python loops."
            )
        elif any(w in q for w in ["mistake", "trap", "bug", "gotcha", "error"]):
            return (
                f"### ⚠️ Common Traps & Edge Cases in {lesson_title}\n\n"
                "1. **Empty / Single-element inputs:** Always check `len(data) == 0` or `1` before executing loops.\n"
                "2. **Integer Overflow:** In languages like C++/Java, `(low + high) / 2` can overflow integer boundaries. Use `low + (high - low) // 2`.\n"
                "3. **In-place modification:** Beware of mutating arrays while iterating over them, which causes skipped elements or index out of range exceptions."
            )
        elif any(w in q for w in ["interview", "placement", "company", "faang"]):
            return (
                f"### 🎯 Top Placement & Interview Focus for {lesson_title}\n\n"
                "In technical coding rounds at top product firms:\n"
                "1. State the brute-force approach first ($O(N^2)$), compute its bottleneck, and explain why it won't pass test constraints ($N \\le 10^5$).\n"
                "2. Propose the optimal pattern (e.g. Hash Map, Two Pointers, Prefix Sum, Kadane's).\n"
                "3. Walk through edge cases (negative numbers, duplicates, empty collections) out loud before writing code."
            )

        # Default comprehensive explanation
        return (
            f"### 📚 Concept Deep Dive: {lesson_title}\n\n"
            f"{lesson_summary or 'Mastering this concept provides the foundation for high-performance algorithm design and scalable data pipelines.'}\n\n"
            "**Key Engineering Steps:**\n"
            "1. **Understand Constraints:** Identify the input size $N$ and whether inputs are ordered, distinct, or negative.\n"
            "2. **State Invariants:** Maintain clear loop invariants (e.g. `current_sum` always represents the max contiguous sum ending at index `i`).\n"
            "3. **Verify Edge Cases:** Test with empty inputs, all identical values, and extreme negative/positive bounds.\n\n"
            "Would you like me to walk through a specific code dry-run or explain another pattern?"
        )

