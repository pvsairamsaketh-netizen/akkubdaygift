import logging
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
