import pytest
from rest_framework.test import APIClient
from chat.models import Conversation, Message
from chat.services.conversation_service import ConversationService
from chat.services.retrieval_service import RetrievalService

@pytest.mark.django_db
def test_conversation_service():
    conv = ConversationService.get_or_create_conversation()
    assert conv.title == "New Relationship Memory"

    msg1 = ConversationService.add_message(conv, "user", "When did Saki propose to Akku?")
    conv.refresh_from_db()
    assert conv.title == "When did Saki propose to Akku?"

    msg2 = ConversationService.add_message(conv, "assistant", "On May 4, 2022.")
    history = ConversationService.get_history(conv)
    assert len(history) == 2
    assert history[0]["role"] == "user"
    assert history[1]["role"] == "assistant"

def test_query_pronoun_resolution():
    retrieval = RetrievalService()
    history = [
        {"role": "user", "content": "When did Saki propose?"},
        {"role": "assistant", "content": "He proposed on May 4, 2022 after mechanical class."}
    ]
    resolved = retrieval.resolve_query("What happened then?", history)
    assert "Context:" in resolved
    assert "mechanical" in resolved or "propose" in resolved

@pytest.mark.django_db
def test_chat_api_endpoints():
    client = APIClient()
    # Health check
    res_health = client.get('/api/health/')
    assert res_health.status_code == 200
    assert res_health.data['status'] == 'healthy'

    # Create conversation
    res_conv = client.post('/api/conversations/', {'title': 'My Memories'}, format='json')
    assert res_conv.status_code == 201
    conv_id = res_conv.data['id']

    # Chat API with RAG
    res_chat = client.post('/api/chat/', {
        'question': 'When did Saki propose?',
        'conversation_id': conv_id
    }, format='json')
    assert res_chat.status_code == 200
    assert 'answer' in res_chat.data
    assert 'citations' in res_chat.data
    assert len(res_chat.data['citations']) > 0
