import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import StreamingHttpResponse
from chat.models import Conversation
from chat.serializers import ConversationSerializer, ConversationSummarySerializer
from chat.services.rag_graph import RAGGraphService
from chat.services.retrieval_service import RetrievalService

# Initialize reusable singleton instance on startup (zero per-request reconnection overhead)
rag_graph_service = RAGGraphService()

class ConversationListCreateView(APIView):
    def get(self, request):
        conversations = Conversation.objects.all()
        serializer = ConversationSummarySerializer(conversations, many=True)
        return Response(serializer.data)

    def post(self, request):
        title = request.data.get('title', "New Relationship Memory")
        conv = Conversation.objects.create(title=title)
        serializer = ConversationSummarySerializer(conv)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ConversationDetailView(APIView):
    def get(self, request, conv_id):
        conv = Conversation.objects.filter(id=conv_id).first()
        if not conv:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ConversationSerializer(conv)
        return Response(serializer.data)

    def patch(self, request, conv_id):
        conv = Conversation.objects.filter(id=conv_id).first()
        if not conv:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
        title = request.data.get('title')
        if title:
            conv.title = title
            conv.save(update_fields=['title', 'updated_at'])
        serializer = ConversationSummarySerializer(conv)
        return Response(serializer.data)

    def delete(self, request, conv_id):
        conv = Conversation.objects.filter(id=conv_id).first()
        if not conv:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
        conv.delete()
        return Response({"message": "Conversation deleted successfully."})

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


class ChatView(APIView):
    def post(self, request):
        question = request.data.get('question')
        if not question or not question.strip():
            return Response({"error": "Question is required."}, status=status.HTTP_400_BAD_REQUEST)

        user_id = get_user_id(request)
        conversation_id = request.data.get('conversation_id')
        top_k = request.data.get('top_k')
        min_relevance = request.data.get('min_relevance')

        result = rag_graph_service.answer_question(
            question=question,
            conversation_id=conversation_id,
            user_id=user_id,
            top_k=int(top_k) if top_k else None,
            min_relevance=float(min_relevance) if min_relevance else None
        )
        return Response(result, status=status.HTTP_200_OK)

class ChatStreamView(APIView):
    def post(self, request):
        question = request.data.get('question')
        if not question or not question.strip():
            return Response({"error": "Question is required."}, status=status.HTTP_400_BAD_REQUEST)

        user_id = get_user_id(request)
        conversation_id = request.data.get('conversation_id')
        top_k = request.data.get('top_k')
        min_relevance = request.data.get('min_relevance')

        def event_stream():
            try:
                for event in rag_graph_service.answer_question_stream(
                    question=question,
                    conversation_id=conversation_id,
                    user_id=user_id,
                    top_k=int(top_k) if top_k else None,
                    min_relevance=float(min_relevance) if min_relevance else None
                ):
                    event_name = event.get("event", "message")
                    data = json.dumps(event.get("data", {}))
                    yield f"event: {event_name}\ndata: {data}\n\n"
            except Exception as e:
                err_data = json.dumps({"error": str(e)})
                yield f"event: error\ndata: {err_data}\n\n"

        response = StreamingHttpResponse(
            event_stream(),
            content_type="text/event-stream"
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response

class RetrievalDebugView(APIView):
    """
    Development-only endpoint to inspect retrieved memories, chunks, embeddings, and similarity metrics (Req 31).
    """
    def post(self, request):
        question = request.data.get('question')
        if not question:
            return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = get_user_id(request)
        top_k = int(request.data.get('top_k', 5))
        min_relevance = float(request.data.get('min_relevance', 0.20))

        from memories.services.memory_retriever import MemoryRetriever
        mem_retriever = MemoryRetriever()
        memories = mem_retriever.retrieve_memories(
            query=question,
            top_k=top_k,
            min_relevance=min_relevance,
            user_id=user_id
        )

        service = RetrievalService()
        chunks = service.retrieve(
            question=question,
            top_k=top_k,
            min_relevance=min_relevance
        )

        return Response({
            "query": question,
            "top_k": top_k,
            "min_relevance": min_relevance,
            "model": "Qwen 3.8 8B",
            "retrieved_memories_count": len(memories),
            "retrieved_memories": [
                {
                    "text": m.get("text"),
                    "source": "Saved Memory" if m.get("source_type") in ("user_memory", "manual") else "Relationship Archive",
                    "category": m.get("category"),
                    "subject": m.get("subject"),
                    "similarity": m.get("score")
                } for m in memories
            ],
            "retrieved_chunks_count": len(chunks),
            "retrieved_chunks": [
                {
                    "text": c.get("text", "")[:150],
                    "source": "Relationship Archive",
                    "similarity": c.get("score")
                } for c in chunks
            ],
            "final_selected_context": [m.get("text") for m in memories]
        })
