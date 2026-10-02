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
        self.collection.upsert(
            ids=[str(memory_id)],
            embeddings=[embedding],
            documents=[text],
            metadatas=[metadata]
        )
        logger.info(f"Upserted memory '{memory_id}' into ChromaDB collection '{self.collection_name}'")

    def search_memories(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        min_relevance: float = 0.25,
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        total = self.collection.count()
        if total == 0:
            return []

        actual_k = min(top_k, total)
        where_filter = {"category": category} if category else None

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=actual_k,
            where=where_filter,
            include=["documents", "metadatas", "distances"]
        )

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
                    "memory_id": ids[i],
                    "text": docs[i],
                    "metadata": metas[i],
                    "score": round(similarity, 3),
                    "distance": distance
                })

        return retrieved

    def delete_memory(self, memory_id: str) -> None:
        try:
            self.collection.delete(ids=[str(memory_id)])
            logger.info(f"Deleted memory '{memory_id}' from ChromaDB.")
        except Exception as e:
            logger.warning(f"Could not delete memory {memory_id} from Chroma: {e}")

    def clear(self) -> None:
        try:
            self.client.delete_collection(self.collection_name)
        except Exception:
            pass
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "Akku Personal Memories Vector Store", "hnsw:space": "cosine"}
        )

    def count(self) -> int:
        return self.collection.count()
