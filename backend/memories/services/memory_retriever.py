"""
Memory Retrieval Service.
Performs semantic search across persistent personal memories in ChromaDB.
"""

import logging
from typing import List, Dict, Any, Optional
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
        top_k: int = 3,
        min_relevance: float = 0.25,
        user_id: str = "default_user",
        category: Optional[str] = None,
        query_embedding: Optional[List[float]] = None
    ) -> List[Dict[str, Any]]:
        """
        Embeds query using the shared embedding model and searches ChromaDB for
        memories belonging ONLY to the current user.
        """
        if not query or not query.strip():
            return []

        try:
            query_emb = query_embedding if query_embedding is not None else self.embedding_service.embed_query(query)
            results = self.vector_store.search_memories(
                query_embedding=query_emb,
                top_k=min(top_k, 5),
                min_relevance=min_relevance,
                user_id=user_id,
                category=category
            )

            # Enrich with database record
            enriched = []
            for item in results:
                mem_id = item.get("memory_id")
                db_mem = PersonalMemory.objects.filter(id=mem_id, is_active=True, user_id=user_id).first()
                if db_mem:
                    enriched.append({
                        "id": str(db_mem.id),
                        "user_id": str(db_mem.user_id),
                        "text": db_mem.memory_text,
                        "category": db_mem.category,
                        "subject": db_mem.subject,
                        "score": item["score"],
                        "timestamp": db_mem.conversation_timestamp.strftime("%B %d, %Y"),
                        "source": db_mem.source
                    })
                elif item.get("text"):
                    meta = item.get("metadata") or {}
                    # Enforce user isolation on raw vector metadata
                    if meta.get("user_id") and meta.get("user_id") != user_id:
                        continue
                    enriched.append({
                        "id": str(mem_id),
                        "user_id": meta.get("user_id", user_id),
                        "text": item["text"],
                        "category": meta.get("category", "personal_preferences"),
                        "subject": meta.get("subject", ""),
                        "score": item["score"],
                        "timestamp": meta.get("date", meta.get("created_at", "")),
                        "source": meta.get("source", "text")
                    })

            logger.info(f"Retrieval Successful: {len(enriched)} personal memories retrieved for user '{user_id}' with query '{query[:60]}'")
            return enriched
        except Exception as e:
            logger.error(f"Error retrieving personal memories: {e}", exc_info=True)
            return []
