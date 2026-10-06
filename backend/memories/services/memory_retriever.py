"""
Memory Retrieval & Hybrid Reranking Service.
Performs hybrid search (semantic vector + lexical keyword + metadata filtering)
and reranking across persistent memories in SQLite and ChromaDB.
"""

import re
import logging
from typing import List, Dict, Any, Optional
from django.db.models import Q
from memories.models import PersonalMemory
from memories.services.memory_store import MemoryVectorStore
from chat.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class MemoryRetriever:
    def __init__(self):
        self.vector_store = MemoryVectorStore.get_instance()
        self.embedding_service = EmbeddingService.get_instance()

    def retrieve_memories(
        self,
        query: str,
        top_k: int = 5,
        min_relevance: float = 0.25,
        user_id: str = "default_user",
        category: Optional[str] = None,
        query_embedding: Optional[List[float]] = None,
        include_historical: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Executes hybrid retrieval:
        1. Semantic vector search via ChromaDB
        2. Keyword/lexical search via SQLite database
        3. Candidate deduplication & score merging
        4. Multi-factor reranking (source priority, importance, recency)
        """
        if not query or not query.strip():
            return []

        clean_query = query.strip()
        status_filter = None if include_historical else "current"

        # 1. Semantic Vector Search
        try:
            query_emb = query_embedding if query_embedding is not None else self.embedding_service.embed_query(clean_query)
            vec_results = self.vector_store.search_memories(
                query_embedding=query_emb,
                top_k=max(top_k * 2, 10),
                min_relevance=min_relevance,
                user_id=user_id,
                category=category,
                status_filter=status_filter
            )
        except Exception as e:
            logger.error(f"Vector search error: {e}", exc_info=True)
            vec_results = []

        # 2. Keyword / Lexical Search
        kw_results = self._lexical_search(clean_query, user_id=user_id, category=category, include_historical=include_historical)

        # 3. Merge & Deduplicate candidates
        candidate_map: Dict[str, Dict[str, Any]] = {}

        # Process vector candidates (60% weight)
        for item in vec_results:
            mem_id = str(item.get("id") or item.get("memory_id"))
            candidate_map[mem_id] = {
                "id": mem_id,
                "text": item.get("text", ""),
                "category": item.get("category", "personal_preferences"),
                "subject": item.get("subject", ""),
                "speaker": item.get("speaker", "Akku"),
                "source_type": item.get("source_type", "user_memory"),
                "status": item.get("status", "current"),
                "importance": float(item.get("importance", 0.8)),
                "confidence": float(item.get("confidence", 1.0)),
                "vec_score": float(item.get("score", 0.0)),
                "kw_score": 0.0,
                "date": item.get("metadata", {}).get("date", "")
            }

        # Process keyword candidates (40% weight)
        for item in kw_results:
            mem_id = str(item["id"])
            if mem_id in candidate_map:
                candidate_map[mem_id]["kw_score"] = float(item["score"])
            else:
                candidate_map[mem_id] = {
                    "id": mem_id,
                    "text": item.get("text", ""),
                    "category": item.get("category", "personal_preferences"),
                    "subject": item.get("subject", ""),
                    "speaker": item.get("speaker", "Akku"),
                    "source_type": item.get("source_type", "user_memory"),
                    "status": item.get("status", "current"),
                    "importance": float(item.get("importance", 0.8)),
                    "confidence": float(item.get("confidence", 1.0)),
                    "vec_score": 0.0,
                    "kw_score": float(item.get("score", 0.8)),
                    "date": item.get("date", "")
                }

        if not candidate_map:
            return []

        # 4. Multi-Factor Reranker
        # Priority multipliers:
        # 4. Multi-Factor Reranker
        # Priority multipliers:
        # - Explicit user_memory / manual: 2.0x (Absolute top authority)
        # - Conversation-confirmed: 1.25x
        # - Agent extracted: 1.25x
        # - Initial PDF: 1.00x
        # - Historical memory: 0.40x (demoted unless explicitly requested)
        source_multipliers = {
            "user_memory": 2.00,
            "manual": 2.00,
            "conversation": 1.25,
            "agent_extracted": 1.25,
            "initial_pdf": 1.00,
        }

        # Extract content tokens for subject/keyword boosting
        query_words = [w.lower() for w in re.findall(r'\b[a-zA-Z0-9\u0900-\u097f]{3,}\b', clean_query)]
        stop_words = {
            "what", "when", "where", "which", "who", "whom", "this", "that", "with", "from",
            "have", "does", "about", "tell", "like", "akku", "akkus", "saki", "her", "his", "she",
            "kya", "hai", "kaun", "enna", "romba", "pidikkum", "istam", "pasand", "the", "and", "for"
        }
        content_tokens = [t for t in query_words if t not in stop_words] or query_words

        reranked = []
        for mem_id, item in candidate_map.items():
            vec_s = item["vec_score"]
            kw_s = item["kw_score"]

            if vec_s > 0 and kw_s > 0:
                combined_base = (vec_s * 0.60) + (kw_s * 0.40)
            elif vec_s > 0:
                combined_base = vec_s
            else:
                combined_base = kw_s * 0.75

            src_mult = source_multipliers.get(item["source_type"], 1.0)
            status_mult = 0.40 if item["status"] == "historical" else 1.0
            importance_boost = 1.0 + (item["importance"] - 0.5) * 0.2

            # Subject Boost: If query contains the memory's subject (e.g. "Ice Cream" in query)
            subject_boost = 0.0
            item_subj = (item.get("subject") or "").lower()
            if item_subj and (item_subj in clean_query.lower() or any(t in item_subj for t in content_tokens)):
                subject_boost = 0.35

            # Keyword Boost: If content tokens match memory text
            item_text_lower = item.get("text", "").lower()
            kw_matches = sum(1 for t in content_tokens if t in item_text_lower or t in item_subj)
            kw_boost = min(0.30, kw_matches * 0.15) if content_tokens else 0.0

            # Calculate raw composite score
            raw_score = (combined_base * src_mult * status_mult * importance_boost) + subject_boost + kw_boost
            
            # Explicit user memory with topic match receives guaranteed high score
            if item["source_type"] in ("user_memory", "manual") and (subject_boost > 0 or kw_boost > 0):
                raw_score = max(raw_score, 0.95)

            final_score = round(min(1.0, raw_score), 3)

            reranked.append({
                "id": mem_id,
                "memory_id": mem_id,
                "text": item["text"],
                "category": item["category"],
                "subject": item["subject"],
                "speaker": item["speaker"],
                "source_type": item["source_type"],
                "status": item["status"],
                "importance": item["importance"],
                "confidence": item["confidence"],
                "score": final_score,
                "timestamp": item["date"]
            })

        # Sort by final score descending
        reranked.sort(key=lambda x: (
            1 if x["source_type"] in ("user_memory", "manual") else 0,
            x["score"]
        ), reverse=True)
        final_results = reranked[:top_k]

        logger.info(f"Hybrid Retrieval & Reranked: {len(final_results)} memories for query '{clean_query[:50]}' (top score: {final_results[0]['score'] if final_results else 0})")
        return final_results

    def _lexical_search(
        self,
        query: str,
        user_id: str,
        category: Optional[str] = None,
        include_historical: bool = False
    ) -> List[Dict[str, Any]]:
        """Searches SQLite PersonalMemory by token matches in memory_text, subject, or summary."""
        tokens = [w.lower() for w in re.findall(r'\b[a-zA-Z0-9\u0900-\u097f]{3,}\b', query)]
        if not tokens:
            return []

        # Filter out common stop words
        stop_words = {
            "what", "when", "where", "which", "who", "whom", "this", "that", "with", "from",
            "have", "does", "about", "tell", "like", "akku", "akkus", "saki", "her", "his", "she",
            "kya", "hai", "kaun", "enna", "romba", "pidikkum", "istam", "pasand", "the", "and", "or",
            "for", "favorite", "favourite"
        }
        content_tokens = [t for t in tokens if t not in stop_words]
        if not content_tokens:
            content_tokens = tokens

        q_filter = Q()
        for token in content_tokens:
            q_filter |= Q(memory_text__icontains=token) | Q(subject__icontains=token) | Q(summary__icontains=token)

        qs = PersonalMemory.objects.filter(q_filter, is_active=True, user_id=user_id)
        if not include_historical:
            qs = qs.filter(status='current')
        if category and category != 'all':
            qs = qs.filter(category=category)

        matches = []
        for mem in qs[:15]:
            # Score based on how many tokens match
            lower_text = f"{mem.memory_text} {mem.subject or ''} {mem.summary or ''}".lower()
            matched_count = sum(1 for t in content_tokens if t in lower_text)
            
            # Exact subject match boost
            subj_boost = 0.35 if (mem.subject and any(t in mem.subject.lower() for t in content_tokens)) else 0.0
            
            # Source priority boost
            src_boost = 0.25 if mem.source_type in ('user_memory', 'manual') else 0.0

            base_ratio = 0.5 + (matched_count / max(1, len(content_tokens))) * 0.40
            final_ratio = min(1.0, base_ratio + subj_boost + src_boost)

            matches.append({
                "id": str(mem.id),
                "text": mem.memory_text,
                "category": mem.category,
                "subject": mem.subject,
                "speaker": mem.speaker,
                "source_type": mem.source_type,
                "status": mem.status,
                "importance": mem.importance,
                "confidence": mem.confidence,
                "score": round(final_ratio, 3),
                "date": mem.event_date or mem.conversation_timestamp.strftime("%B %d, %Y")
            })

        return matches
