"""
Automatic Memory Extraction Service.
Extracts facts, preferences, habits, health states, and moments about Akku
from natural user messages (voice or text) without requiring explicit commands.
"""

import re
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from memories.models import PersonalMemory
from memories.services.memory_store import MemoryVectorStore
from chat.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class MemoryExtractor:
    def __init__(self):
        self.vector_store = MemoryVectorStore.get_instance()
        self.embedding_service = EmbeddingService.get_instance()

    # Heuristic pattern definitions for instant local extraction
    PATTERNS = [
        # Preferences & Likes/Dislikes
        (r'\b(?:she|akku)\s+(?:likes?|loves?|enjoys?|adores?)\s+([^.\n]+)', 'likes_dislikes', 'Preference'),
        (r'\b(?:she|akku)\s+(?:dislikes?|hates?|doesn\'t\s+like|can\'t\s+stand)\s+([^.\n]+)', 'likes_dislikes', 'Dislike'),
        (r'\bher\s+favou?rite\s+([a-zA-Z\s]+)\s+is\s+([^.\n]+)', 'personal_preferences', 'Favorite {0}'),
        (r'\b(?:she|akku)\s+(?:prefers?)\s+([^.\n]+)', 'personal_preferences', 'Preference'),
        
        # Health & Feelings
        (r'\b(?:she|akku)\s+(?:had|has|suffered\s+from|is\s+having)\s+(?:a\s+)?(headache|fever|cold|pain|stomach\s+ache|migraine|cough|illness)([^.\n]*)', 'health_wellness', 'Health'),
        (r'\b(?:she|akku)\s+is\s+feeling\s+(tired|exhausted|anxious|nervous|happy|sad|excited|stressed)([^.\n]*)', 'health_wellness', 'Mood & Wellness'),
        
        # Food & Drink
        (r'\b(?:she|akku)\s+(?:likes?|eats?|craves?)\s+(ice\s+cream|chocolate|dosa|samosa|coffee|tea|biryani|pasta|pizza|sweet|salad)([^.\n]*)', 'food_drinks', 'Food Preference'),
        
        # Weather / Habits / Routine
        (r'\b(?:she|akku)\s+told\s+me\s+(?:that\s+)?she\s+([^.\n]+)', 'habits_routines', 'Shared Habit/Thought'),
        (r'\b(?:she|akku)\s+(?:usually|always|never|often)\s+([^.\n]+)', 'habits_routines', 'Habit'),
        
        # Dates & Events
        (r'\bher\s+birthday\s+is\s+(?:on\s+)?([^.\n]+)', 'important_dates', 'Birthday'),
        (r'\bour\s+anniversary\s+is\s+(?:on\s+)?([^.\n]+)', 'important_dates', 'Anniversary'),
        
        # Shared Experiences
        (r'\bwe\s+(?:went\s+to|visited|ate\s+at|walked\s+to|watched)\s+([^.\n]+)', 'shared_experiences', 'Shared Experience'),
        (r'\bwe\s+had\s+([^.\n]+)\s+together', 'shared_experiences', 'Shared Moment'),
    ]

    @staticmethod
    def is_question(text: str) -> bool:
        """Determines if the text is asking a question rather than stating a fact."""
        clean = text.strip().lower()
        if "?" in clean:
            return True
        question_starters = (
            "what", "when", "where", "why", "who", "whom", "whose", "which",
            "how", "is", "are", "do", "does", "did", "can", "could", "would",
            "will", "shall", "should", "tell me", "do you know", "kya", "kab",
            "kahan", "kyun", "kaise", "kaun"
        )
        return any(clean.startswith(starter + " ") or clean == starter for starter in question_starters)

    def extract_memories_from_text(self, text: str, source: str = "text", user_id: str = "default_user") -> List[PersonalMemory]:
        """
        Extracts relevant facts about Akku from user input and saves them to SQLite + ChromaDB
        associated with the specific user_id. Strictly avoids extracting questions as facts.
        """
        if not text or len(text.strip()) < 5:
            return []

        cleaned_input = text.strip()
        is_q = self.is_question(cleaned_input)

        # 1. Explicit Remember Commands (e.g. "Remember that Akku loves chocolate ice cream")
        explicit_match = re.search(
            r'\b(?:remember|note|save|don\'t\s+forget|please\s+remember)\s+(?:that\s+)?([^.\n]+)',
            cleaned_input,
            re.IGNORECASE
        )

        extracted_facts = []
        is_explicit = bool(explicit_match)

        if explicit_match:
            raw_fact = explicit_match.group(1).strip()
            # Determine category from keywords
            raw_lower = raw_fact.lower()
            if any(w in raw_lower for w in ["ice cream", "chocolate", "food", "eat", "drink", "sweet", "tea", "coffee"]):
                cat = "food_drinks"
                subj = "Food Preference"
            elif any(w in raw_lower for w in ["beach", "chennai", "place", "travel", "city"]):
                cat = "places_travel"
                subj = "Place"
            elif any(w in raw_lower for w in ["song", "music", "movie", "book", "film"]):
                cat = "entertainment"
                subj = "Favorite Media"
            else:
                cat = "personal_preferences"
                subj = "Remembered Fact"

            fact_text = raw_fact if raw_fact.lower().startswith("akku") else f"Akku: {raw_fact}"
            extracted_facts.append({
                "memory_text": fact_text,
                "category": cat,
                "subject": subj,
                "original_input": cleaned_input,
                "source_type": "user_memory",
                "importance": 0.9,
                "confidence": 1.0
            })
        elif not is_q:
            # Only run passive heuristic extraction if it is NOT a question
            for pattern, category, subject_template in self.PATTERNS:
                matches = re.finditer(pattern, cleaned_input, re.IGNORECASE)
                for match in matches:
                    groups = match.groups()
                    if len(groups) == 1:
                        detail = groups[0].strip()
                        subject = subject_template
                        fact_text = f"Akku: {match.group(0).strip()}"
                    elif len(groups) == 2:
                        arg1, arg2 = groups[0].strip(), groups[1].strip()
                        subject = subject_template.format(arg1) if '{0}' in subject_template else f"{subject_template} ({arg1})"
                        fact_text = f"Akku: {match.group(0).strip()}"
                    else:
                        fact_text = f"Akku: {match.group(0).strip()}"
                        subject = subject_template

                    extracted_facts.append({
                        "memory_text": fact_text,
                        "category": category,
                        "subject": subject,
                        "original_input": cleaned_input,
                        "source_type": "conversation",
                        "importance": 0.7,
                        "confidence": 0.85
                    })

        saved_memories = []
        for fact in extracted_facts:
            # Check SHA-256 deduplication
            import hashlib
            norm_content = " ".join(fact["memory_text"].lower().strip().split())
            content_hash = hashlib.sha256(norm_content.encode("utf-8")).hexdigest()

            dup = PersonalMemory.objects.filter(
                user_id=user_id,
                content_hash=content_hash,
                is_active=True
            ).first()
            if dup:
                logger.info(f"Skipping exact duplicate memory (ID: {dup.id})")
                continue

            # Check semantic similarity conflict on same user & category
            emb = self.embedding_service.embed_query(fact["memory_text"])
            similar_mem = self.vector_store.find_similar_memory(
                query_embedding=emb,
                user_id=user_id,
                threshold=0.88,
                category=fact["category"]
            )

            version = 1
            if similar_mem:
                try:
                    old_mem = PersonalMemory.objects.get(id=int(similar_mem["memory_id"]))
                    old_mem.status = "historical"
                    old_mem.is_active = False
                    old_mem.save(update_fields=["status", "is_active", "updated_at"])
                    # Update vector store status for old memory
                    self.vector_store.update_memory_status(str(old_mem.id), "historical")
                    version = old_mem.version + 1
                    logger.info(f"Superseding memory {old_mem.id} with version {version}")
                except Exception as e:
                    logger.warning(f"Failed to supersede old memory: {e}")

            # Create new memory
            mem = PersonalMemory.objects.create(
                user_id=user_id,
                memory_text=fact["memory_text"],
                original_input=fact["original_input"],
                category=fact["category"],
                subject=fact["subject"],
                source=source,
                source_type=fact["source_type"],
                importance=fact["importance"],
                confidence=fact["confidence"],
                content_hash=content_hash,
                version=version,
                status="current",
                is_active=True
            )

            # Embed and save to ChromaDB
            try:
                meta = {
                    "memory_id": str(mem.id),
                    "user_id": str(mem.user_id),
                    "category": mem.category,
                    "subject": str(mem.subject or ""),
                    "speaker": mem.speaker,
                    "source_type": mem.source_type,
                    "status": mem.status,
                    "version": mem.version,
                    "importance": mem.importance,
                    "confidence": mem.confidence,
                    "date": mem.conversation_timestamp.strftime("%Y-%m-%d"),
                    "original_text": mem.memory_text,
                    "source": mem.source,
                }
                self.vector_store.upsert_memory(
                    memory_id=str(mem.id),
                    text=mem.memory_text,
                    metadata=meta,
                    embedding=emb
                )
                logger.info(f"Memory Created (ID: {mem.id}, User: {mem.user_id}) → ChromaDB Indexed")
            except Exception as e:
                logger.error(f"Error vectorizing memory {mem.id}: {e}", exc_info=True)

            saved_memories.append(mem)

        return saved_memories
