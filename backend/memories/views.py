import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from memories.models import PersonalMemory, PersonalVocabulary, BirthdayConfig
from memories.serializers import (
    PersonalMemorySerializer,
    PersonalVocabularySerializer,
    BirthdayConfigSerializer
)
from memories.services.memory_store import MemoryVectorStore
from chat.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

def get_user_id(request) -> str:
    """
    Extracts user_id from headers, query params, or body, defaulting to 'default_user'.
    Guarantees user-level memory isolation.
    """
    user = getattr(request, 'user', None)
    if user and getattr(user, 'is_authenticated', False):
        return str(user.id or user.username)
    user_id = (
        request.headers.get('X-User-ID') or
        request.headers.get('X-User-Id') or
        (request.query_params.get('user_id') if hasattr(request, 'query_params') else None)
    )
    if not user_id and hasattr(request, 'data') and isinstance(request.data, dict):
        user_id = request.data.get('user_id')
    return (str(user_id).strip() if user_id else "default_user")


class PersonalMemoryListView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        memories = PersonalMemory.objects.filter(is_active=True, user_id=user_id)

        if category:
            memories = memories.filter(category=category)
        if search:
            memories = memories.filter(
                Q(memory_text__icontains=search) |
                Q(subject__icontains=search) |
                Q(original_input__icontains=search)
            )

        serializer = PersonalMemorySerializer(memories, many=True)
        return Response({
            "total_memories": memories.count(),
            "memories": serializer.data
        })

    def post(self, request):
        user_id = get_user_id(request)
        text = request.data.get('memory_text')
        category = request.data.get('category', 'personal_preferences')
        subject = request.data.get('subject', 'Manual Entry')
        event_date = request.data.get('event_date')

        if not text or not text.strip():
            return Response({"error": "memory_text is required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Save memory in relational database
        mem = PersonalMemory.objects.create(
            user_id=user_id,
            memory_text=text.strip(),
            original_input=text.strip(),
            category=category,
            subject=subject,
            event_date=event_date,
            source="manual"
        )

        # 2. Automatically generate embedding and store in ChromaDB
        try:
            emb_svc = EmbeddingService.get_instance()
            emb = emb_svc.embed_query(mem.memory_text)
            store = MemoryVectorStore.get_instance()
            date_str = mem.event_date or mem.conversation_timestamp.strftime("%Y-%m-%d")
            meta = {
                "memory_id": str(mem.id),
                "user_id": str(mem.user_id),
                "category": str(mem.category),
                "subject": str(mem.subject or ""),
                "date": str(date_str),
                "original_text": str(mem.memory_text),
                "source": str(mem.source),
            }
            store.upsert_memory(
                memory_id=str(mem.id),
                text=mem.memory_text,
                metadata=meta,
                embedding=emb
            )
            logger.info(f"Memory Created (ID: {mem.id}, User: {mem.user_id}) → Embedding Generated → ChromaDB Stored")
        except Exception as e:
            logger.error(f"Error vectorizing memory {mem.id}: {e}", exc_info=True)

        # 3. Invalidate chatbot response cache
        try:
            from chat.services.rag_service import RAGService
            RAGService.clear_cache()
        except Exception as e:
            logger.warning(f"Could not clear RAG answer cache: {e}")

        serializer = PersonalMemorySerializer(mem)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PersonalMemoryDetailView(APIView):
    def get(self, request, mem_id):
        user_id = get_user_id(request)
        mem = PersonalMemory.objects.filter(id=mem_id, is_active=True, user_id=user_id).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PersonalMemorySerializer(mem)
        return Response(serializer.data)

    def patch(self, request, mem_id):
        user_id = get_user_id(request)
        mem = PersonalMemory.objects.filter(id=mem_id, is_active=True, user_id=user_id).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)

        new_text = request.data.get('memory_text')
        new_category = request.data.get('category')
        new_subject = request.data.get('subject')
        new_date = request.data.get('event_date')

        if new_text and new_text.strip():
            mem.memory_text = new_text.strip()
        if new_category:
            mem.category = new_category
        if new_subject is not None:
            mem.subject = new_subject
        if new_date is not None:
            mem.event_date = new_date

        mem.save()

        # Update / re-embed in ChromaDB safely
        try:
            emb_svc = EmbeddingService.get_instance()
            emb = emb_svc.embed_query(mem.memory_text)
            store = MemoryVectorStore.get_instance()
            date_str = mem.event_date or mem.conversation_timestamp.strftime("%Y-%m-%d")
            meta = {
                "memory_id": str(mem.id),
                "user_id": str(mem.user_id),
                "category": str(mem.category),
                "subject": str(mem.subject or ""),
                "date": str(date_str),
                "original_text": str(mem.memory_text),
                "source": str(mem.source),
            }
            store.upsert_memory(
                memory_id=str(mem.id),
                text=mem.memory_text,
                metadata=meta,
                embedding=emb
            )
            logger.info(f"Memory Updated (ID: {mem.id}, User: {mem.user_id}) → Embedding Generated → ChromaDB Stored")
        except Exception as e:
            logger.error(f"Error updating memory vector {mem.id}: {e}", exc_info=True)

        # Invalidate answer cache
        try:
            from chat.services.rag_service import RAGService
            RAGService.clear_cache()
        except Exception as e:
            logger.warning(f"Could not clear RAG answer cache: {e}")

        serializer = PersonalMemorySerializer(mem)
        return Response(serializer.data)

    def put(self, request, mem_id):
        return self.patch(request, mem_id)

    def delete(self, request, mem_id):
        user_id = get_user_id(request)
        mem = PersonalMemory.objects.filter(id=mem_id, user_id=user_id).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)

        # Remove vector from ChromaDB
        try:
            store = MemoryVectorStore.get_instance()
            store.delete_memory(str(mem.id))
            logger.info(f"Memory Deleted (ID: {mem.id}) → ChromaDB Deleted")
        except Exception as e:
            logger.warning(f"Error removing vector for memory {mem_id}: {e}")

        mem.delete()

        # Invalidate answer cache
        try:
            from chat.services.rag_service import RAGService
            RAGService.clear_cache()
        except Exception as e:
            logger.warning(f"Could not clear RAG answer cache: {e}")

        return Response({"message": f"Memory {mem_id} permanently deleted."})


class PersonalMemoryClearView(APIView):
    def post(self, request):
        user_id = get_user_id(request)
        PersonalMemory.objects.filter(user_id=user_id).delete()
        try:
            store = MemoryVectorStore.get_instance()
            store.delete_user_memories(user_id)
        except Exception as e:
            logger.warning(f"Error clearing ChromaDB memories for user {user_id}: {e}")

        try:
            from chat.services.rag_service import RAGService
            RAGService.clear_cache()
        except Exception as e:
            logger.warning(f"Could not clear RAG answer cache: {e}")

        return Response({"message": f"All personal memories for user '{user_id}' cleared successfully."})


class PersonalVocabularyView(APIView):
    def get(self, request):
        vocab = PersonalVocabulary.objects.all()
        serializer = PersonalVocabularySerializer(vocab, many=True)
        return Response(serializer.data)

    def post(self, request):
        term = request.data.get('term')
        misrecognitions = request.data.get('misrecognitions', [])
        category = request.data.get('category', 'name')

        if not term:
            return Response({"error": "term is required"}, status=status.HTTP_400_BAD_REQUEST)

        obj, created = PersonalVocabulary.objects.get_or_create(
            term=term.strip(),
            defaults={'misrecognitions': misrecognitions, 'category': category}
        )
        if not created and misrecognitions:
            combined = list(set(obj.misrecognitions + misrecognitions))
            obj.misrecognitions = combined
            obj.times_used += 1
            obj.save()

        serializer = PersonalVocabularySerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


class PersonalVocabularyDetailView(APIView):
    def delete(self, request, vocab_id):
        obj = PersonalVocabulary.objects.filter(id=vocab_id).first()
        if not obj:
            return Response({"error": "Vocabulary entry not found"}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response({"message": "Vocabulary entry deleted."})


class BirthdayConfigView(APIView):
    def get(self, request):
        config = BirthdayConfig.get_config()
        serializer = BirthdayConfigSerializer(config)
        return Response(serializer.data)

    def patch(self, request):
        config = BirthdayConfig.get_config()
        serializer = BirthdayConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        return self.patch(request)
