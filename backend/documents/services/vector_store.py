"""
Vector Store Abstraction for Saki & Akku RAG Pipeline.
Wraps persistent local ChromaDB with clean interface for insert, search, delete, and reindex.
Allows seamless swap to PostgreSQL pgvector in the future.
"""

import os
import logging
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from django.conf import settings

logger = logging.getLogger(__name__)

class BaseVectorStore:
    def add_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> None:
        raise NotImplementedError

    def search(self, query_embedding: List[float], top_k: int = 5, min_relevance: float = 0.25) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def delete_document(self, document_id: str) -> None:
        raise NotImplementedError

    def clear(self) -> None:
        raise NotImplementedError

    def count(self) -> int:
        raise NotImplementedError


class ChromaVectorStore(BaseVectorStore):
    _instance: Optional['ChromaVectorStore'] = None

    def __init__(self, persist_directory: Optional[str] = None, collection_name: Optional[str] = None):
        self.persist_directory = persist_directory or getattr(
            settings, 'CHROMA_PERSIST_DIRECTORY', './data/chroma'
        )
        self.collection_name = collection_name or getattr(
            settings, 'CHROMA_COLLECTION_NAME', 'saki_akku_memories'
        )
        os.makedirs(self.persist_directory, exist_ok=True)
        
        # Initialize persistent Chroma client
        self.client = chromadb.PersistentClient(
            path=self.persist_directory,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "Saki & Akku Relationship Memories Vector Store", "hnsw:space": "cosine"}
        )

    @classmethod
    def get_instance(cls) -> 'ChromaVectorStore':
        """Singleton accessor to avoid re-opening database instances."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def add_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> None:
        """
        Inserts or updates chunks with embeddings and metadata.
        """
        if not chunks:
            return

        ids = [chunk["chunk_id"] for chunk in chunks]
        documents = [chunk["text"] for chunk in chunks]
        metadatas = [
            {
                "document_id": str(chunk.get("document_id", "")),
                "filename": str(chunk.get("filename", "")),
                "page_number": int(chunk.get("page_number", 0)),
                "chunk_index": int(chunk.get("chunk_index", 0)),
                "email_subject": str(chunk.get("email_subject", "")),
                "email_date": str(chunk.get("email_date", "")),
                "token_count": int(chunk.get("token_count", 0)),
                "source_type": str(chunk.get("source_type", "pdf"))
            }
            for chunk in chunks
        ]

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
        logger.info(f"Successfully upserted {len(chunks)} chunks into ChromaDB collection '{self.collection_name}'")

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        min_relevance: float = 0.25
    ) -> List[Dict[str, Any]]:
        """
        Cosine similarity search.
        ChromaDB cosine distance d is in [0, 2], where 0 is identical and 1 is orthogonal.
        Cosine similarity s = 1.0 - d.
        """
        total_items = self.count()
        if total_items == 0:
            logger.warning("Vector store is empty, returning 0 results.")
            return []

        actual_k = min(top_k, total_items)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=actual_k,
            include=["documents", "metadatas", "distances"]
        )

        retrieved = []
        if not results or not results["ids"] or not results["ids"][0]:
            return []

        doc_ids = results["ids"][0]
        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]

        for i in range(len(doc_ids)):
            distance = distances[i]
            # Convert cosine distance to similarity score
            similarity = max(0.0, 1.0 - distance)
            
            # Filter by relevance threshold
            if similarity < min_relevance:
                continue

            retrieved.append({
                "chunk_id": doc_ids[i],
                "text": documents[i],
                "metadata": metadatas[i],
                "score": similarity,
                "distance": distance
            })

        return retrieved

    def delete_document(self, document_id: str) -> None:
        """
        Deletes all chunks belonging to a given document_id.
        """
        try:
            self.collection.delete(where={"document_id": document_id})
            logger.info(f"Deleted chunks for document {document_id} from vector store.")
        except Exception as e:
            logger.error(f"Error deleting document {document_id} from Chroma: {e}")

    def clear(self) -> None:
        """
        Deletes and recreates the collection.
        """
        try:
            self.client.delete_collection(self.collection_name)
        except Exception:
            pass
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "Saki & Akku Relationship Memories Vector Store", "hnsw:space": "cosine"}
        )

    def count(self) -> int:
        return self.collection.count()
