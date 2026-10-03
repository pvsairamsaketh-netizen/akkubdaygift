"""
Retrieval Service for Saki & Akku RAG Pipeline.
Performs query resolution, vector similarity search, relevance threshold filtering,
chunk deduplication, and context budget management.
"""

import logging
from typing import List, Dict, Any, Optional
from django.conf import settings
from chat.services.embedding_service import EmbeddingService
from documents.services.vector_store import ChromaVectorStore

logger = logging.getLogger(__name__)

class RetrievalService:
    def __init__(self):
        self.embedding_service = EmbeddingService.get_instance()
        self.vector_store = ChromaVectorStore.get_instance()
        self.top_k = getattr(settings, 'RAG_TOP_K', 5)
        self.min_relevance = getattr(settings, 'RAG_MIN_RELEVANCE', 0.25)
        self.max_context_tokens = getattr(settings, 'MAX_CONTEXT_TOKENS', 4096)

    def resolve_query(self, question: str, conversation_history: List[Dict[str, str]]) -> str:
        """
        Expands follow-up questions containing pronouns (he, she, they, that, then)
        using recent context.
        """
        question_clean = question.strip()
        pronouns = ["he", "she", "they", "it", "that", "then", "after that", "afterward", "there", "what happened next"]
        lower_q = question_clean.lower()

        needs_resolution = any(p in lower_q for p in pronouns) and len(conversation_history) > 0

        if needs_resolution:
            # Use last user and assistant message to add topical context
            last_msgs = [m.get("content", "") for m in conversation_history[-2:] if m.get("content")]
            if last_msgs:
                context_hint = " ".join(last_msgs)
                # Extract up to 20 words as context hint
                words = context_hint.split()[:20]
                resolved = f"{question_clean} (Context: {' '.join(words)})"
                return resolved

        return question_clean

    def retrieve(
        self,
        question: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        top_k: Optional[int] = None,
        min_relevance: Optional[float] = None,
        query_embedding: Optional[List[float]] = None
    ) -> List[Dict[str, Any]]:
        """
        High-speed minimal retrieval from ChromaDB.
        Retrieves ONLY the minimum relevant chunks (TOP_K = 1 to 2, max 3).
        Applies exact match boost and early stopping.
        """
        k = min(top_k or self.top_k, 3)
        min_rel = min_relevance if min_relevance is not None else self.min_relevance

        # 1. Resolve query with conversation context
        search_query = self.resolve_query(question, conversation_history or [])

        # 2. Multilingual semantic bridging & exact match extraction
        lower_q = question.lower()
        exact_tokens = []
        bridge_keywords = []

        multilingual_bridge = {
            ("जन्मदिन", "जनमदिन", "janamdin", "janmadin", "birthday", "bday", "20 october", "october 20"): [
                "october 20", "birthday"
            ],
            ("प्रपोज", "इजहार", "propose", "proposal", "4 may", "may 4", "4 मई", "समोसा", "samosa", "कैंटीन", "canteen", "मैकेनिकल", "mechanical"): [
                "may 4, 2022", "may 4", "proposal", "propose", "canteen", "samosa", "mechanical"
            ],
            ("शादी", "विवाह", "shaadi", "shadi", "marry", "marriage"): [
                "marriage", "did they marry"
            ],
            ("story begin", "first meet", "first met", "how did they connect", "first connect", "story start", "meet each other", "how did we meet", "story", "k section", "b section"): [
                "how did they first connect", "college acquaintances", "k section to b section", "early shared memories", "began as college acquaintances"
            ],
            ("आइसक्रीम", "ice cream", "चॉकलेट", "chocolate"): [
                "ice cream", "chocolate"
            ],
            ("सिरदर्द", "सरदर्द", "headache"): [
                "headache"
            ],
            ("मरीना", "marina"): [
                "marina beach", "bay of bengal", "chennai"
            ],
            ("बेसेंट", "besant", "bessie", "beach", "बीच", "sea", "समुद्र", "सागर", "ocean", "bay of bengal", "arabian"): [
                "besant nagar", "bessie", "bay of bengal", "marina beach", "chennai"
            ],
            ("आंध्र", "andhra", "dosa", "डोसा"): [
                "andhra mess"
            ]
        }

        for keys, targets in multilingual_bridge.items():
            if any(k in lower_q for k in keys):
                bridge_keywords.extend(targets)
                exact_tokens.extend(targets)

        # Also add any direct English matches
        for word in ["how did they first connect", "college acquaintances", "k section to b section", "may 4, 2022", "may 4", "2022", "october 20", "oct 20", "birthday", "samosa", "canteen", "proposal", "propose", "marriage", "ice cream", "headache", "bay of bengal", "besant nagar", "marina beach"]:
            if word in lower_q and word not in exact_tokens:
                exact_tokens.append(word)

        # Bridge search query for English embedding store if non-English terms detected
        if bridge_keywords:
            search_query = f"{search_query} {' '.join(dict.fromkeys(bridge_keywords))}"

        # 3. Generate or reuse query embedding
        if query_embedding is None:
            query_embedding = self.embedding_service.embed_query(search_query)

        # 4. Perform lightweight similarity search in ChromaDB (only 3 candidates max)
        results = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=max(k, 3),
            min_relevance=min_rel
        )

        if not results:
            logger.info(f"No chunks retrieved above relevance threshold {min_rel} for query: {question}")
            return []

        # 5. Exact match boost: prioritize chunks containing exact date/entity
        if exact_tokens:
            for item in results:
                chunk_lower = item.get("text", "").lower()
                matches = sum(1 for token in exact_tokens if token in chunk_lower)
                if matches > 0:
                    item["score"] = min(1.0, item["score"] + 0.15 * matches)
            # Re-sort with boost
            results.sort(key=lambda x: x["score"], reverse=True)

        # 6. Deduplicate & early stopping
        deduped = []
        seen_texts = set()

        for item in results:
            text = item.get("text", "").strip()
            first_100_chars = text[:100].lower()
            if first_100_chars in seen_texts:
                continue

            seen_texts.add(first_100_chars)
            deduped.append(item)

            # Early stop: if top chunk has high confidence or exact match, stop at 1-2 chunks
            if len(deduped) == 1 and item["score"] >= 0.78:
                break
            if len(deduped) >= k:
                break

        logger.info(f"High-speed retrieved {len(deduped)} chunks for query: '{question}' (scores: {[round(c['score'], 3) for c in deduped]})")
        return deduped
