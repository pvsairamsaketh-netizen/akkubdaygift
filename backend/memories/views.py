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

class PersonalMemoryListView(APIView):
    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        memories = PersonalMemory.objects.filter(is_active=True)

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
        text = request.data.get('memory_text')
        category = request.data.get('category', 'personal_preferences')
        subject = request.data.get('subject', 'Manual Entry')

        if not text:
            return Response({"error": "memory_text is required"}, status=status.HTTP_400_BAD_REQUEST)

        mem = PersonalMemory.objects.create(
            memory_text=text.strip(),
            category=category,
            subject=subject,
            source="manual"
        )

        # Index in ChromaDB safely
        try:
            store = MemoryVectorStore.get_instance()
            emb_svc = EmbeddingService.get_instance()
            emb = emb_svc.embed_query(mem.memory_text)
            store.upsert_memory(
                memory_id=str(mem.id),
                text=mem.memory_text,
                metadata={"category": mem.category, "subject": mem.subject or ""},
                embedding=emb
            )
        except Exception as e:
            logger.error(f"Error vectorizing memory {mem.id}: {e}")

        serializer = PersonalMemorySerializer(mem)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PersonalMemoryDetailView(APIView):
    def get(self, request, mem_id):
        mem = PersonalMemory.objects.filter(id=mem_id, is_active=True).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PersonalMemorySerializer(mem)
        return Response(serializer.data)

    def patch(self, request, mem_id):
        mem = PersonalMemory.objects.filter(id=mem_id, is_active=True).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)

        new_text = request.data.get('memory_text')
        new_category = request.data.get('category')
        new_subject = request.data.get('subject')

        if new_text:
            mem.memory_text = new_text.strip()
        if new_category:
            mem.category = new_category
        if new_subject:
            mem.subject = new_subject

        mem.save()

        # Update in ChromaDB safely
        try:
            store = MemoryVectorStore.get_instance()
            emb_svc = EmbeddingService.get_instance()
            emb = emb_svc.embed_query(mem.memory_text)
            store.upsert_memory(
                memory_id=str(mem.id),
                text=mem.memory_text,
                metadata={"category": mem.category, "subject": mem.subject or ""},
                embedding=emb
            )
        except Exception as e:
            logger.error(f"Error updating memory vector {mem.id}: {e}")

        serializer = PersonalMemorySerializer(mem)
        return Response(serializer.data)

    def delete(self, request, mem_id):
        mem = PersonalMemory.objects.filter(id=mem_id).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            store = MemoryVectorStore.get_instance()
            store.delete_memory(str(mem.id))
        except Exception as e:
            logger.warning(f"Error removing vector for memory {mem_id}: {e}")

        mem.delete()
        return Response({"message": f"Memory {mem_id} permanently deleted."})


class PersonalMemoryClearView(APIView):
    def post(self, request):
        PersonalMemory.objects.all().delete()
        store = MemoryVectorStore.get_instance()
        store.clear()
        return Response({"message": "All personal memories cleared successfully."})


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
