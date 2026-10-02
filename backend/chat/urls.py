from django.urls import path
from chat.views import (
    ConversationListCreateView,
    ConversationDetailView,
    ChatView,
    ChatStreamView,
    RetrievalDebugView
)

urlpatterns = [
    path('conversations/', ConversationListCreateView.as_view(), name='conversation-list-create'),
    path('conversations/<uuid:conv_id>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('chat/', ChatView.as_view(), name='chat'),
    path('chat/stream/', ChatStreamView.as_view(), name='chat-stream'),
    path('retrieval/debug/', RetrievalDebugView.as_view(), name='retrieval-debug'),
]
