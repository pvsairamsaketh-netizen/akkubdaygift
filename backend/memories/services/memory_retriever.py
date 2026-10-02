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
        top_k: int = 2,
        min_relevance: float = 0.25,
        category: Optional[str] = None,
        query_embedding: Optional[List[float]] = None
    ) -> List[Dict[str, Any]]:
        """
        Embeds query and searches personal memories.
        """
        if not query or not query.strip():
            return []

        try:
            query_emb = query_embedding if query_embedding is not None else self.embedding_service.embed_query(query)
            results = self.vector_store.search_memories(
                query_embedding=query_emb,
                top_k=min(top_k, 2),
                min_relevance=min_relevance,
                category=category
            )

            # Enrich with database record
            enriched = []
            for item in results:
                mem_id = item.get("memory_id")
                db_mem = PersonalMemory.objects.filter(id=mem_id, is_active=True).first()
                if db_mem:
                    enriched.append({
                        "id": str(db_mem.id),
                        "text": db_mem.memory_text,
                        "category": db_mem.category,
                        "subject": db_mem.subject,
                        "score": item["score"],
                        "timestamp": db_mem.conversation_timestamp.strftime("%B %d, %Y"),
                        "source": db_mem.source
                    })
                elif item.get("text"):
                    meta = item.get("metadata") or {}
                    enriched.append({
                        "id": str(mem_id),
                        "text": item["text"],
                        "category": meta.get("category", "personal_preferences"),
                        "subject": meta.get("subject", ""),
                        "score": item["score"],
                        "timestamp": meta.get("created_at", ""),
                        "source": meta.get("source", "text")
                    })

            return enriched
        except Exception as e:
            logger.error(f"Error retrieving personal memories: {e}")
            return []
