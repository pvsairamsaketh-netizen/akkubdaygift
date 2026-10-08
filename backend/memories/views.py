import hashlib
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Count
from memories.models import PersonalMemory, PersonalVocabulary, BirthdayConfig
from memories.serializers import (
    PersonalMemorySerializer,
    PersonalVocabularySerializer,
    BirthdayConfigSerializer
)
from memories.services.memory_store import MemoryVectorStore
from memories.services.memory_retriever import MemoryRetriever
from memories.services.memory_extractor import MemoryExtractor
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
        status_filter = request.query_params.get('status', 'current')
        source_type = request.query_params.get('source_type')

        memories = PersonalMemory.objects.filter(is_active=True, user_id=user_id)

        if status_filter and status_filter != 'all':
            memories = memories.filter(status=status_filter)
        if category and category != 'all':
            memories = memories.filter(category=category)
        if source_type and source_type != 'all':
            memories = memories.filter(source_type=source_type)
        if search and search.strip():
            s = search.strip()
            memories = memories.filter(
                Q(memory_text__icontains=s) |
                Q(subject__icontains=s) |
                Q(summary__icontains=s) |
                Q(original_input__icontains=s)
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
        importance = float(request.data.get('importance', 0.85))
        speaker = request.data.get('speaker', 'Akku')
        source_type = request.data.get('source_type', 'user_memory')

        if not text or not text.strip():
            return Response({"error": "memory_text is required"}, status=status.HTTP_400_BAD_REQUEST)

        cleaned_text = text.strip()
        content_hash = hashlib.sha256(f"{user_id}:{cleaned_text.lower()}".encode('utf-8')).hexdigest()

        # 1. Exact Deduplication Check
        exact_existing = PersonalMemory.objects.filter(
            user_id=user_id,
            content_hash=content_hash,
            is_active=True
        ).first()

        if exact_existing:
            serializer = PersonalMemorySerializer(exact_existing)
            return Response({
                "success": True,
                "message": "Memory already saved in Akku AI ❤️",
                "is_duplicate": True,
                "memory": serializer.data
            }, status=status.HTTP_200_OK)

        # 2. Semantic Similarity & Conflict Resolution Check
        emb_svc = EmbeddingService.get_instance()
        store = MemoryVectorStore.get_instance()
        emb = emb_svc.embed_query(cleaned_text)

        version = 1
        previous_mem = None
        try:
            # Check for existing memory on same topic/subject/category
            similar = store.find_similar_memory(emb, min_similarity=0.75, user_id=user_id, category=category)
            if not similar:
                similar = store.find_similar_memory(emb, min_similarity=0.78, user_id=user_id)
            
            prev_db = None
            if similar:
                sim_id = similar.get("id") or similar.get("memory_id")
                prev_db = PersonalMemory.objects.filter(id=sim_id, user_id=user_id, is_active=True).first()
            elif subject and subject != "Manual Entry":
                # Fallback to subject / topic keyword match for user
                subj_kw = subject.split()[0].lower()
                prev_db = PersonalMemory.objects.filter(
                    user_id=user_id,
                    is_active=True
                ).filter(
                    Q(subject__icontains=subj_kw) | Q(memory_text__icontains=subj_kw)
                ).first()

            if prev_db:
                # If updating preference: version it!
                logger.info(f"Conflict / Versioning: Memory '{cleaned_text[:40]}' updates existing memory '{prev_db.memory_text[:40]}'")
                prev_db.status = 'historical'
                prev_db.is_active = False
                prev_db.save(update_fields=['status', 'is_active'])
                # Update previous vector status in ChromaDB
                store.upsert_memory(
                    memory_id=str(prev_db.id),
                    text=prev_db.memory_text,
                    metadata={
                        "memory_id": str(prev_db.id),
                        "user_id": user_id,
                        "category": prev_db.category,
                        "status": "historical",
                        "version": prev_db.version
                    },
                    embedding=emb_svc.embed_query(prev_db.memory_text)
                )
                version = prev_db.version + 1
                previous_mem = prev_db
        except Exception as e:
            logger.warning(f"Semantic similarity check non-fatal error: {e}")

        # 3. Create persistent memory in SQLite
        mem = PersonalMemory.objects.create(
            user_id=user_id,
            memory_text=cleaned_text,
            summary=cleaned_text[:140],
            original_input=cleaned_text,
            category=category,
            subject=subject,
            speaker=speaker,
            source="manual",
            source_type=source_type,
            source_reference="Teach Akku a Memory modal",
            confidence=1.0,
            importance=importance,
            content_hash=content_hash,
            version=version,
            status="current",
            event_date=event_date,
            is_active=True,
            is_user_confirmed=True
        )

        if previous_mem:
            previous_mem.superseded_by = mem
            previous_mem.save(update_fields=['superseded_by'])

        # 4. Generate embedding and store in persistent ChromaDB
        try:
            date_str = mem.event_date or mem.conversation_timestamp.strftime("%Y-%m-%d")
            meta = {
                "memory_id": str(mem.id),
                "user_id": str(mem.user_id),
                "category": str(mem.category),
                "subject": str(mem.subject or ""),
                "speaker": str(mem.speaker or "Akku"),
                "source_type": str(mem.source_type or "user_memory"),
                "source": "manual",
                "status": "current",
                "version": int(mem.version),
                "importance": float(mem.importance),
                "confidence": 1.0,
                "date": str(date_str),
                "original_text": str(mem.memory_text),
            }
            store.upsert_memory(
                memory_id=str(mem.id),
                text=mem.memory_text,
                metadata=meta,
                embedding=emb
            )
            logger.info(f"Memory Created (ID: {mem.id}, User: {mem.user_id}, v{mem.version}) → ChromaDB Stored")
        except Exception as e:
            logger.error(f"Error vectorizing memory {mem.id}: {e}", exc_info=True)
            mem.delete()
            return Response(
                {"error": f"Failed to persist memory to vector store: {str(e)}. Please retry."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Invalidate chatbot response cache so new memory is instantly searchable
        try:
            from chat.services.rag_service import RAGService
            from chat.services.rag_graph import RAGGraphService
            RAGService.clear_cache()
            RAGGraphService.clear_cache()
        except Exception as e:
            logger.warning(f"Could not clear RAG answer cache: {e}")

        serializer = PersonalMemorySerializer(mem)
        response_data = dict(serializer.data)
        response_data["success"] = True
        response_data["message"] = "Memory saved successfully to Akku AI ❤️"
        response_data["memory"] = serializer.data
        return Response(response_data, status=status.HTTP_201_CREATED)


class PersonalMemoryDetailView(APIView):
    def get(self, request, mem_id):
        user_id = get_user_id(request)
        mem = PersonalMemory.objects.filter(id=mem_id, is_active=True).filter(
            Q(user_id=user_id) | Q(source_type='initial_pdf') | Q(user_id='default_user')
        ).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PersonalMemorySerializer(mem)
        return Response(serializer.data)

    def patch(self, request, mem_id):
        user_id = get_user_id(request)
        mem = PersonalMemory.objects.filter(id=mem_id, is_active=True).filter(
            Q(user_id=user_id) | Q(source_type='initial_pdf') | Q(user_id='default_user')
        ).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)

        new_text = request.data.get('memory_text')
        new_category = request.data.get('category')
        new_subject = request.data.get('subject')
        new_date = request.data.get('event_date')
        new_importance = request.data.get('importance')

        text_changed = False
        if new_text and new_text.strip() and new_text.strip() != mem.memory_text:
            mem.memory_text = new_text.strip()
            mem.summary = new_text.strip()[:140]
            mem.content_hash = hashlib.sha256(f"{user_id}:{mem.memory_text.lower()}".encode('utf-8')).hexdigest()
            mem.version += 1
            text_changed = True

        if new_category:
            mem.category = new_category
        if new_subject is not None:
            mem.subject = new_subject
        if new_date is not None:
            mem.event_date = new_date
        if new_importance is not None:
            mem.importance = float(new_importance)

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
                "speaker": str(mem.speaker or "Akku"),
                "source_type": str(mem.source_type or "user_memory"),
                "source": str(mem.source),
                "status": str(mem.status),
                "version": int(mem.version),
                "importance": float(mem.importance),
                "confidence": float(mem.confidence),
                "date": str(date_str),
                "original_text": str(mem.memory_text),
            }
            store.upsert_memory(
                memory_id=str(mem.id),
                text=mem.memory_text,
                metadata=meta,
                embedding=emb
            )
            logger.info(f"Memory Updated (ID: {mem.id}, v{mem.version}) → ChromaDB Stored")
        except Exception as e:
            logger.error(f"Error updating memory vector {mem.id}: {e}", exc_info=True)

        # Invalidate answer cache
        try:
            from chat.services.rag_service import RAGService
            from chat.services.rag_graph import RAGGraphService
            RAGService.clear_cache()
            RAGGraphService.clear_cache()
        except Exception as e:
            logger.warning(f"Could not clear RAG answer cache: {e}")

        serializer = PersonalMemorySerializer(mem)
        return Response({
            "success": True,
            "message": "Memory updated successfully ❤️",
            "memory": serializer.data
        })

    def put(self, request, mem_id):
        return self.patch(request, mem_id)

    def delete(self, request, mem_id):
        user_id = get_user_id(request)
        mem = PersonalMemory.objects.filter(id=mem_id).filter(
            Q(user_id=user_id) | Q(source_type='initial_pdf') | Q(user_id='default_user')
        ).first()
        if not mem:
            return Response({"error": "Memory not found"}, status=status.HTTP_404_NOT_FOUND)

        mem_id_str = str(mem.id)
        # Delete from relational DB
        mem.delete()

        # Remove vector from active ChromaDB collection
        try:
            store = MemoryVectorStore.get_instance()
            store.delete_memory(mem_id_str)
            logger.info(f"Memory Deleted (ID: {mem_id_str}) → Removed from ChromaDB active search")
        except Exception as e:
            logger.warning(f"Error removing vector for memory {mem_id_str}: {e}")

        # Invalidate answer cache
        try:
            from chat.services.rag_service import RAGService
            from chat.services.rag_graph import RAGGraphService
            RAGService.clear_cache()
            RAGGraphService.clear_cache()
        except Exception as e:
            logger.warning(f"Could not clear RAG answer cache: {e}")

        return Response({
            "success": True,
            "message": f"Memory {mem_id_str} deleted and removed from active retrieval."
        }, status=status.HTTP_200_OK)


class MemorySearchView(APIView):
    """
    Hybrid search across memories using both semantic similarity and keyword ranking.
    """
    def get(self, request):
        user_id = get_user_id(request)
        q = request.query_params.get('q', '').strip()
        category = request.query_params.get('category')
        top_k = int(request.query_params.get('top_k', 10))

        if not q:
            return Response({"memories": [], "total": 0})

        retriever = MemoryRetriever()
        memories = retriever.retrieve_memories(
            query=q,
            top_k=top_k,
            min_relevance=0.20,
            user_id=user_id,
            category=category
        )

        return Response({
            "query": q,
            "total": len(memories),
            "memories": memories
        })


class MemoryStatsView(APIView):
    """
    Developer / admin observability statistics for persistent memories.
    """
    def get(self, request):
        user_id = get_user_id(request)
        active_mems = PersonalMemory.objects.filter(user_id=user_id, is_active=True)

        total_count = active_mems.count()
        pdf_count = active_mems.filter(source_type='initial_pdf').count()
        user_count = active_mems.filter(source_type='user_memory').count()
        conv_count = active_mems.filter(source_type__in=['conversation', 'agent_extracted']).count()
        historical_count = PersonalMemory.objects.filter(user_id=user_id, status='historical').count()

        category_counts = dict(
            active_mems.values_list('category').annotate(cnt=Count('id'))
        )

        store = MemoryVectorStore.get_instance()
        vector_count = store.collection.count()

        return Response({
            "total_active_memories": total_count,
            "initial_pdf_memories": pdf_count,
            "user_added_memories": user_count,
            "conversation_memories": conv_count,
            "historical_superseded_memories": historical_count,
            "categories": category_counts,
            "chroma_vector_count": vector_count,
            "database_persistent": True
        })


class MemoryReindexView(APIView):
    """
    Rebuilds vector store collection from active database records.
    """
    def post(self, request):
        user_id = get_user_id(request)
        memories = PersonalMemory.objects.filter(user_id=user_id, is_active=True)

        emb_svc = EmbeddingService.get_instance()
        store = MemoryVectorStore.get_instance()
        reindexed_count = 0

        for mem in memories:
            try:
                emb = emb_svc.embed_query(mem.memory_text)
                date_str = mem.event_date or mem.conversation_timestamp.strftime("%Y-%m-%d")
                meta = {
                    "memory_id": str(mem.id),
                    "user_id": str(mem.user_id),
                    "category": str(mem.category),
                    "subject": str(mem.subject or ""),
                    "speaker": str(mem.speaker or "Akku"),
                    "source_type": str(mem.source_type or "user_memory"),
                    "source": str(mem.source),
                    "status": str(mem.status),
                    "version": int(mem.version),
                    "importance": float(mem.importance),
                    "confidence": float(mem.confidence),
                    "date": str(date_str),
                    "original_text": str(mem.memory_text),
                }
                store.upsert_memory(
                    memory_id=str(mem.id),
                    text=mem.memory_text,
                    metadata=meta,
                    embedding=emb
                )
                reindexed_count += 1
            except Exception as e:
                logger.error(f"Error reindexing memory {mem.id}: {e}")

        # Clear answer cache
        try:
            from chat.services.rag_service import RAGService
            from chat.services.rag_graph import RAGGraphService
            RAGService.clear_cache()
            RAGGraphService.clear_cache()
        except Exception:
            pass

        return Response({
            "success": True,
            "message": f"Successfully reindexed {reindexed_count} memories into ChromaDB.",
            "reindexed_count": reindexed_count
        })


class MemoryExportView(APIView):
    """
    Exports structured memories, categories, and PDF document metadata.
    Ensures structured DB remains the permanent source of truth for backup and disaster recovery.
    """
    def get(self, request):
        from django.utils import timezone
        from documents.models import Document
        user_id = get_user_id(request)
        memories = PersonalMemory.objects.filter(user_id=user_id)
        docs = Document.objects.all().values('filename', 'content_hash', 'status', 'total_pages', 'total_chunks', 'last_ingested_at')
        serializer = PersonalMemorySerializer(memories, many=True)
        return Response({
            "export_timestamp": timezone.now().isoformat(),
            "user_id": user_id,
            "total_memories": memories.count(),
            "documents": list(docs),
            "memories": serializer.data
        })


class MemoryDetectView(APIView):
    """
    Analyzes natural conversation text and extracts potential durable memories.
    """
    def post(self, request):
        user_id = get_user_id(request)
        text = request.data.get('text', '').strip()
        if not text:
            return Response({"error": "text is required"}, status=status.HTTP_400_BAD_REQUEST)

        extractor = MemoryExtractor()
        extracted = extractor.extract_memories_from_text(text, user_id=user_id)
        serializer = PersonalMemorySerializer(extracted, many=True)
        return Response({
            "total_detected": len(extracted),
            "memories": serializer.data
        })


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
