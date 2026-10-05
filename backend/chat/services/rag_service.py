"""
End-to-End RAG Orchestrator Service with Automatic Personal Memory Integration.
Coordinates:
1. Automatic memory extraction from user message
2. Semantic memory retrieval from ChromaDB
3. Document passage retrieval from PDF knowledge base
4. Prompt construction for Akku AI
5. LLM answer generation
6. Citations & message persistence
"""

import time
import logging
from typing import Dict, Any, Generator, Optional
from chat.models import Conversation
from chat.services.retrieval_service import RetrievalService
from chat.services.prompt_service import PromptService
from chat.services.llm_service import LLMService
from chat.services.citation_service import CitationService
from chat.services.conversation_service import ConversationService
from memories.services.memory_extractor import MemoryExtractor
from memories.services.memory_retriever import MemoryRetriever

logger = logging.getLogger(__name__)

class RAGService:
    # In-memory query response cache for instant repeated question answers (<50ms)
    _answer_cache: Dict[str, Dict[str, Any]] = {}

    def __init__(self):
        self.retrieval_service = RetrievalService()
        self.prompt_service = PromptService()
        self.llm_service = LLMService()
        self.citation_service = CitationService()
        self.conversation_service = ConversationService()
        self.memory_extractor = MemoryExtractor()
        self.memory_retriever = MemoryRetriever()

    @classmethod
    def clear_cache(cls):
        """Clears the query response cache when memories or documents are modified."""
        cls._answer_cache.clear()
        try:
            from chat.services.rag_graph import RAGGraphService
            RAGGraphService._answer_cache.clear()
        except Exception:
            pass
        logger.info("Cleared RAGService and RAGGraphService answer cache")

    def _cache_key(self, user_id: str, question: str) -> str:
        norm = " ".join(question.lower().strip().split())
        return f"{user_id}:{norm}"

    @staticmethod
    def _clean_trailing_questions(text: str) -> str:
        """Strips any trailing follow-up questions to ensure the assistant only answers."""
        if not text:
            return ""
        import re
        lines = text.strip()
        cleaned = re.sub(r'(?<=[.!।\n\r])\s*[^.!।\n\r]*\?\s*$', '', lines)
        cleaned = cleaned.rstrip('?').strip()
        if not cleaned.endswith(('❤️', '✨', '😊', '.', '!', '।')):
            cleaned += ' ❤️'
        return cleaned.strip()

    def answer_question(
        self,
        question: str,
        conversation_id: Optional[str] = None,
        user_id: str = "default_user",
        source: str = "text",
        top_k: Optional[int] = None,
        min_relevance: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Synchronously answers a question using low-latency RAG pipeline.
        Caches repeated queries per user and computes query embedding exactly once.
        """
        start_time = time.time()
        cache_key = self._cache_key(user_id, question)

        # 1. Get or create conversation
        conversation = self.conversation_service.get_or_create_conversation(conversation_id)
        history = self.conversation_service.get_history(conversation)

        # 2. Persist user message
        user_msg = self.conversation_service.add_message(
            conversation=conversation,
            role="user",
            content=question
        )

        # 3. Check instant response cache if no prior conversation turn in this session
        if not history and cache_key in self._answer_cache:
            cached = self._answer_cache[cache_key]
            cached_latency = round(time.time() - start_time, 2)
            asst_msg = self.conversation_service.add_message(
                conversation=conversation,
                role="assistant",
                content=cached["answer"],
                metadata={
                    "citations": cached["citations"],
                    "latency_seconds": cached_latency,
                    "cached": True,
                    "chunks_count": len(cached["citations"]),
                    "model": self.llm_service.model_name
                }
            )
            return {
                "conversation_id": str(conversation.id),
                "user_message_id": str(user_msg.id),
                "assistant_message_id": str(asst_msg.id),
                "question": question,
                "answer": cached["answer"],
                "citations": cached["citations"],
                "personal_memories": cached.get("personal_memories", []),
                "new_memories_saved": [],
                "latency": cached_latency,
                "model": self.llm_service.model_name
            }

        # 4. Extract personal memories from user statement (scoped to this user_id)
        new_memories = []
        try:
            new_memories = self.memory_extractor.extract_memories_from_text(question, source=source, user_id=user_id)
            if new_memories:
                logger.info(f"Captured {len(new_memories)} new memory details for user '{user_id}'")
        except Exception as e:
            logger.warning(f"Memory extraction non-fatal error: {e}")

        # 5. Compute query embedding ONCE for both memory and document retrieval
        query_embedding = self.retrieval_service.embedding_service.embed_query(question)

        # 6. Retrieve stored personal memories strictly belonging ONLY to current user
        retrieved_memories = self.memory_retriever.retrieve_memories(
            query=question,
            top_k=min(top_k or 3, 5),
            min_relevance=min_relevance or 0.25,
            user_id=user_id,
            query_embedding=query_embedding
        )

        # 7. Retrieve relevant chunks from PDF archive (TOP_K = 1 to 2, max 3)
        effective_top_k = min(top_k or 2, 3)
        chunks = self.retrieval_service.retrieve(
            question=question,
            conversation_history=history,
            top_k=effective_top_k,
            min_relevance=min_relevance,
            query_embedding=query_embedding
        )

        # 8. Build prompt messages with minimal context and memory grounding
        messages = self.prompt_service.build_prompt(
            question=question,
            retrieved_chunks=chunks,
            conversation_history=history,
            personal_memories=retrieved_memories
        )

        # 9. Generate LLM response immediately
        try:
            raw_answer = self.llm_service.generate(messages)
            answer = self._clean_trailing_questions(raw_answer)
        except Exception as e:
            logger.error(f"Error during LLM answer generation: {e}")
            answer = f"I'm having a little trouble connecting to my local memory model right now. (Details: {str(e)})"

        # 10. Extract minimal citations (strictly 1-2 citations max)
        citations = self.citation_service.extract_citations(chunks)
        if len(citations) > 2:
            citations = citations[:2]

        latency = round(time.time() - start_time, 2)

        # 11. Persist assistant message
        metadata = {
            "citations": citations,
            "personal_memories": retrieved_memories,
            "new_memories_saved": [m.memory_text for m in new_memories],
            "latency_seconds": latency,
            "chunks_count": len(chunks),
            "model": self.llm_service.model_name
        }
        asst_msg = self.conversation_service.add_message(
            conversation=conversation,
            role="assistant",
            content=answer,
            metadata=metadata
        )

        result_payload = {
            "conversation_id": str(conversation.id),
            "user_message_id": str(user_msg.id),
            "assistant_message_id": str(asst_msg.id),
            "question": question,
            "answer": answer,
            "citations": citations,
            "personal_memories": retrieved_memories,
            "new_memories_saved": [m.memory_text for m in new_memories],
            "latency": latency,
            "model": self.llm_service.model_name
        }

        # Cache successful answer for instant response (scoped to user)
        if answer and not answer.startswith("I'm having a little trouble"):
            self._answer_cache[cache_key] = {
                "answer": answer,
                "citations": citations,
                "personal_memories": retrieved_memories
            }

        return result_payload

    def answer_question_stream(
        self,
        question: str,
        conversation_id: Optional[str] = None,
        user_id: str = "default_user",
        source: str = "text",
        top_k: Optional[int] = None,
        min_relevance: Optional[float] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Server-Sent Events streaming with automatic memory extraction and user-scoped retrieval.
        """
        start_time = time.time()
        cache_key = self._cache_key(user_id, question)

        conversation = self.conversation_service.get_or_create_conversation(conversation_id)
        history = self.conversation_service.get_history(conversation)

        user_msg = self.conversation_service.add_message(
            conversation=conversation,
            role="user",
            content=question
        )

        # Extract memories (scoped to this user_id)
        new_memories = []
        try:
            new_memories = self.memory_extractor.extract_memories_from_text(question, source=source, user_id=user_id)
        except Exception:
            pass

        # Single embedding pass for both memories and document passages
        query_embedding = self.retrieval_service.embedding_service.embed_query(question)

        # Retrieve personal memories strictly belonging ONLY to current user
        retrieved_memories = self.memory_retriever.retrieve_memories(
            query=question,
            top_k=min(top_k or 3, 5),
            min_relevance=min_relevance or 0.25,
            user_id=user_id,
            query_embedding=query_embedding
        )
        effective_top_k = min(top_k or 2, 3)
        chunks = self.retrieval_service.retrieve(
            question=question,
            conversation_history=history,
            top_k=effective_top_k,
            min_relevance=min_relevance,
            query_embedding=query_embedding
        )

        citations = self.citation_service.extract_citations(chunks)
        if len(citations) > 2:
            citations = citations[:2]

        # Send initial context event immediately
        yield {
            "event": "context",
            "data": {
                "conversation_id": str(conversation.id),
                "citations": citations,
                "personal_memories": retrieved_memories,
                "new_memories_saved": [m.memory_text for m in new_memories]
            }
        }

        messages = self.prompt_service.build_prompt(
            question=question,
            retrieved_chunks=chunks,
            conversation_history=history,
            personal_memories=retrieved_memories
        )

        full_answer = []
        for token in self.llm_service.generate_stream(messages):
            full_answer.append(token)
            yield {
                "event": "token",
                "data": {"token": token}
            }

        complete_text = "".join(full_answer)
        latency = round(time.time() - start_time, 2)

        metadata = {
            "citations": citations,
            "personal_memories": retrieved_memories,
            "new_memories_saved": [m.memory_text for m in new_memories],
            "latency_seconds": latency,
            "chunks_count": len(chunks),
            "model": self.llm_service.model_name
        }
        asst_msg = self.conversation_service.add_message(
            conversation=conversation,
            role="assistant",
            content=complete_text,
            metadata=metadata
        )

        if complete_text and not complete_text.startswith("I'm having a little trouble"):
            self._answer_cache[cache_key] = {
                "answer": complete_text,
                "citations": citations,
                "personal_memories": retrieved_memories
            }

        yield {
            "event": "done",
            "data": {
                "conversation_id": str(conversation.id),
                "assistant_message_id": str(asst_msg.id),
                "answer": complete_text,
                "citations": citations,
                "personal_memories": retrieved_memories,
                "new_memories_saved": [m.memory_text for m in new_memories],
                "latency": latency
            }
        }
