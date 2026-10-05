"""
ChromaDB Vector Store for Akku's Personal Memories.
Persists long-term conversational memories across application and system restarts.
"""

import os
import logging
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from django.conf import settings

logger = logging.getLogger(__name__)

class MemoryVectorStore:
    _instance: Optional['MemoryVectorStore'] = None

    def __init__(self):
        self.persist_directory = getattr(settings, 'CHROMA_PERSIST_DIRECTORY', './data/chroma')
        self.collection_name = getattr(settings, 'CHROMA_MEMORIES_COLLECTION_NAME', 'akku_personal_memories')
        os.makedirs(self.persist_directory, exist_ok=True)

        self.client = chromadb.PersistentClient(
            path=self.persist_directory,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "Akku Personal Memories Vector Store", "hnsw:space": "cosine"}
        )

    @classmethod
    def get_instance(cls) -> 'MemoryVectorStore':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def upsert_memory(self, memory_id: str, text: str, metadata: Dict[str, Any], embedding: List[float]) -> None:
        """
        Stores or updates a memory embedding in ChromaDB with complete agent metadata:
        memory_id, user_id, category, subject, speaker, source_type, status, version, importance, confidence.
        """
        clean_metadata = {
            "memory_id": str(metadata.get("memory_id", memory_id)),
            "user_id": str(metadata.get("user_id", "default_user")),
            "category": str(metadata.get("category", "personal_preferences")),
            "subject": str(metadata.get("subject", "") or ""),
            "speaker": str(metadata.get("speaker", "Akku") or "Akku"),
            "source_type": str(metadata.get("source_type", "user_memory")),
            "source": str(metadata.get("source", "text")),
            "status": str(metadata.get("status", "current")),
            "version": int(metadata.get("version", 1)),
            "importance": float(metadata.get("importance", 0.8)),
            "confidence": float(metadata.get("confidence", 1.0)),
            "date": str(metadata.get("date", "") or ""),
            "original_text": str(metadata.get("original_text", text) or text),
        }
        self.collection.upsert(
            ids=[str(memory_id)],
            embeddings=[embedding],
            documents=[text],
            metadatas=[clean_metadata]
        )
        logger.info(f"Memory Record (ID: {memory_id}, User: {clean_metadata['user_id']}, Status: {clean_metadata['status']}) → ChromaDB Stored")

    def search_memories(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        min_relevance: float = 0.25,
        user_id: Optional[str] = None,
        category: Optional[str] = None,
        status_filter: Optional[str] = "current",
        source_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Searches ChromaDB for memories with strict user-level isolation, status filtering, and cosine similarity.
        """
        total = self.collection.count()
        if total == 0:
            return []

        actual_k = min(top_k, total)

        conditions = []
        if user_id:
            conditions.append({"user_id": str(user_id)})
        if category:
            conditions.append({"category": str(category)})
        if status_filter:
            conditions.append({"status": str(status_filter)})
        if source_type:
            conditions.append({"source_type": str(source_type)})

        if len(conditions) == 1:
            where_filter = conditions[0]
        elif len(conditions) > 1:
            where_filter = {"$and": conditions}
        else:
            where_filter = None

        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=actual_k,
                where=where_filter,
                include=["documents", "metadatas", "distances"]
            )
        except Exception as e:
            logger.error(f"Error querying ChromaDB collection '{self.collection_name}': {e}")
            return []

        if not results or not results["ids"] or not results["ids"][0]:
            return []

        retrieved = []
        ids = results["ids"][0]
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0]

        for i in range(len(ids)):
            distance = distances[i]
            similarity = max(0.0, 1.0 - distance)
            if similarity >= min_relevance:
                retrieved.append({
                    "id": ids[i],
                    "memory_id": ids[i],
                    "text": docs[i],
                    "metadata": metas[i],
                    "category": metas[i].get("category", ""),
                    "subject": metas[i].get("subject", ""),
                    "speaker": metas[i].get("speaker", "Akku"),
                    "source_type": metas[i].get("source_type", "user_memory"),
                    "status": metas[i].get("status", "current"),
                    "version": metas[i].get("version", 1),
                    "importance": metas[i].get("importance", 0.8),
                    "confidence": metas[i].get("confidence", 1.0),
                    "score": round(similarity, 3),
                    "distance": distance
                })

        return retrieved

    def find_similar_memory(
        self,
        query_embedding: List[float],
        min_similarity: float = 0.85,
        threshold: Optional[float] = None,
        user_id: Optional[str] = None,
        category: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Finds the single most semantically similar memory above threshold for deduplication or conflict updates.
        """
        cutoff = threshold if threshold is not None else min_similarity
        matches = self.search_memories(
            query_embedding=query_embedding,
            top_k=1,
            min_relevance=cutoff,
            user_id=user_id,
            category=category,
            status_filter=None
        )
        return matches[0] if matches else None

    def delete_memory(self, memory_id: str) -> None:
        try:
            self.collection.delete(ids=[str(memory_id)])
            logger.info(f"Memory Deleted (ID: {memory_id}) → ChromaDB Deleted")
        except Exception as e:
            logger.warning(f"Could not delete memory {memory_id} from Chroma: {e}")

    def delete_user_memories(self, user_id: str) -> None:
        try:
            self.collection.delete(where={"user_id": str(user_id)})
            logger.info(f"All memories for user '{user_id}' → ChromaDB Deleted")
        except Exception as e:
            logger.warning(f"Could not delete memories for user {user_id} from Chroma: {e}")

    def clear(self) -> None:
        try:
            self.client.delete_collection(self.collection_name)
        except Exception:
            pass
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "Akku Personal Memories Vector Store", "hnsw:space": "cosine"}
        )
        logger.info("ChromaDB memories collection cleared and recreated.")

    def count(self) -> int:
        return self.collection.count()
