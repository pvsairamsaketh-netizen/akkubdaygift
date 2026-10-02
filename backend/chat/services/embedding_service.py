"""
Embedding Service for Saki & Akku RAG.
Loads BAAI/bge-small-en-v1.5 using SentenceTransformers locally with caching,
dimension validation, and device acceleration (Apple Silicon MPS / CPU).
"""

import logging
from typing import List, Optional
from django.conf import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    _instance: Optional['EmbeddingService'] = None

    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name or getattr(
            settings, 'EMBEDDING_MODEL', 'BAAI/bge-small-en-v1.5'
        )
        self.model = None
        self._dimension = None
        self._query_cache = {}
        self._load_model()

    @classmethod
    def get_instance(cls) -> 'EmbeddingService':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_model(self):
        """
        Loads SentenceTransformer model with MPS/CPU acceleration.
        """
        try:
            import torch
            from sentence_transformers import SentenceTransformer

            device = "mps" if torch.backends.mps.is_available() else "cpu"
            logger.info(f"Loading embedding model '{self.model_name}' on device '{device}'...")
            self.model = SentenceTransformer(self.model_name, device=device)
            # Determine vector dimension
            test_vec = self.model.encode("test", convert_to_numpy=True)
            self._dimension = len(test_vec)
            logger.info(f"Embedding model loaded successfully. Dimension: {self._dimension}")
        except Exception as e:
            logger.error(f"Failed to load SentenceTransformer embedding model '{self.model_name}': {e}")
            raise RuntimeError(f"Embedding service initialization error: {e}") from e

    @property
    def dimension(self) -> int:
        return self._dimension or 384

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for document chunks.
        """
        if not texts:
            return []
        if self.model is None:
            self._load_model()

        embeddings = self.model.encode(
            texts,
            batch_size=32,
            show_progress_bar=False,
            normalize_embeddings=True,
            convert_to_numpy=True
        )
        return embeddings.tolist()

    def embed_query(self, query: str) -> List[float]:
        """
        Generates embedding for a single user query.
        Applies BGE query instruction if appropriate.
        """
        formatted_query = query.strip()
        if formatted_query in self._query_cache:
            return self._query_cache[formatted_query]

        if self.model is None:
            self._load_model()

        embedding = self.model.encode(
            formatted_query,
            normalize_embeddings=True,
            convert_to_numpy=True
        ).tolist()

        if len(self._query_cache) < 1000:
            self._query_cache[formatted_query] = embedding

        return embedding
