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

    def extract_memories_from_text(self, text: str, source: str = "text") -> List[PersonalMemory]:
        """
        Extracts relevant facts about Akku from user input and saves them to SQLite + ChromaDB.
        """
        if not text or len(text.strip()) < 5:
            return []

        cleaned_input = text.strip()
        extracted_facts = []

        # 1. Run pattern matching
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
                    "original_input": cleaned_input
                })

        # 2. If user mentions "Remember that..." or "Note that..."
        explicit_match = re.search(r'\b(?:remember|note|save|don\'t\s+forget)\s+(?:that\s+)?([^.\n]+)', cleaned_input, re.IGNORECASE)
        if explicit_match and not extracted_facts:
            extracted_facts.append({
                "memory_text": f"Akku: {explicit_match.group(1).strip()}",
                "category": "personal_preferences",
                "subject": "Noted Fact",
                "original_input": cleaned_input
            })

        saved_memories = []
        for fact in extracted_facts:
            # Check for contradiction / update on same subject (e.g. favorite color)
            existing = PersonalMemory.objects.filter(
                is_active=True,
                category=fact["category"],
                subject=fact["subject"]
            ).first()

            # Create new memory
            mem = PersonalMemory.objects.create(
                memory_text=fact["memory_text"],
                original_input=fact["original_input"],
                category=fact["category"],
                subject=fact["subject"],
                source=source,
                confidence=1.0
            )

            # If superseding previous information
            if existing and existing.id != mem.id:
                existing.is_active = False
                existing.superseded_by = mem
                existing.save(update_fields=['is_active', 'superseded_by'])
                # Remove old memory from vector index
                self.vector_store.delete_memory(str(existing.id))
                logger.info(f"Memory {existing.id} superseded by new memory {mem.id}")

            # Embed and save to ChromaDB
            emb = self.embedding_service.embed_query(mem.memory_text)
            meta = {
                "memory_id": str(mem.id),
                "category": mem.category,
                "subject": str(mem.subject or ""),
                "source": mem.source,
                "created_at": mem.conversation_timestamp.isoformat()
            }
            self.vector_store.upsert_memory(
                memory_id=str(mem.id),
                text=mem.memory_text,
                metadata=meta,
                embedding=emb
            )
            saved_memories.append(mem)

        return saved_memories
