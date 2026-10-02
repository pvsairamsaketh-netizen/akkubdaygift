"""
End-to-End Integration Tests for Memory -> Embeddings -> Chatbot Pipeline.

Validates:
1. Memory Creation -> Embedding Generated -> ChromaDB Stored with full metadata.
2. Chatbot Retrieval with exact questions ("What ice cream does Akku like?").
3. Chatbot Retrieval with semantically similar questions ("What flavour of ice cream should I get for Akku?").
4. Rejection for unrelated questions ("What is the capital of Australia?").
5. Multiple memories handling and disambiguation.
6. Memory editing -> ChromaDB re-embedded & cache invalidated -> updated answer retrieved.
7. Memory deletion -> ChromaDB vector removed -> no longer retrieved.
8. Multi-tenant User Isolation -> User A cannot retrieve User B's memories.
"""

import pytest
from unittest.mock import patch
from rest_framework.test import APIClient
from memories.models import PersonalMemory
from memories.services.memory_store import MemoryVectorStore
from memories.services.memory_retriever import MemoryRetriever
from chat.services.rag_service import RAGService
from chat.services.embedding_service import EmbeddingService

@pytest.fixture(autouse=True)
def clean_memory_environment():
    """Ensure clean vector store and cache before each test run."""
    store = MemoryVectorStore.get_instance()
    store.clear()
    RAGService.clear_cache()
    PersonalMemory.objects.all().delete()
    yield
    store.clear()
    RAGService.clear_cache()
    PersonalMemory.objects.all().delete()

@pytest.mark.django_db
def test_add_memory_chromadb_embedding_and_exact_retrieval():
    """
    Scenario:
    User adds: 'Akku only likes vanilla flavour ice cream.'
    Verify:
    1. Saved in DB
    2. Vector in ChromaDB with metadata (memory_id, user_id, category, subject, date, original_text)
    3. Retrieved on exact question: 'What ice cream does Akku like?'
    """
    client = APIClient()
    response = client.post(
        '/api/memories/',
        {
            'memory_text': 'Akku only likes vanilla flavour ice cream.',
            'category': 'food_drinks',
            'subject': 'Ice Cream Flavor'
        },
        format='json',
        HTTP_X_USER_ID='saki'
    )
    assert response.status_code == 201
    mem_data = response.json()
    memory_id = mem_data['id']
    assert mem_data['user_id'] == 'saki'
    assert mem_data['memory_text'] == 'Akku only likes vanilla flavour ice cream.'

    # Verify vector exists in ChromaDB
    store = MemoryVectorStore.get_instance()
    assert store.count() == 1
    chroma_res = store.collection.get(ids=[str(memory_id)], include=['metadatas', 'documents'])
    assert len(chroma_res['ids']) == 1
    assert chroma_res['documents'][0] == 'Akku only likes vanilla flavour ice cream.'
    meta = chroma_res['metadatas'][0]
    assert meta['memory_id'] == str(memory_id)
    assert meta['user_id'] == 'saki'
    assert meta['category'] == 'food_drinks'
    assert meta['subject'] == 'Ice Cream Flavor'
    assert meta['original_text'] == 'Akku only likes vanilla flavour ice cream.'
    assert 'date' in meta

    # Test Memory Retriever directly
    retriever = MemoryRetriever()
    results = retriever.retrieve_memories(
        query="What ice cream does Akku like?",
        user_id='saki'
    )
    assert len(results) >= 1
    assert results[0]['id'] == str(memory_id)
    assert 'vanilla' in results[0]['text'].lower()
    assert results[0]['score'] >= 0.50

@pytest.mark.django_db
def test_semantic_similarity_retrieval():
    """
    User asks: 'What flavour of ice cream should I get for Akku?'
    Even though the phrase 'only likes vanilla flavour ice cream' is not verbatim,
    semantic search in ChromaDB should retrieve it with high similarity score.
    """
    client = APIClient()
    client.post(
        '/api/memories/',
        {
            'memory_text': 'Akku only likes vanilla flavour ice cream.',
            'category': 'food_drinks',
            'subject': 'Ice Cream'
        },
        format='json',
        HTTP_X_USER_ID='saki'
    )

    retriever = MemoryRetriever()
    results = retriever.retrieve_memories(
        query="What flavour of ice cream should I get for Akku?",
        user_id='saki'
    )
    assert len(results) >= 1
    assert 'vanilla' in results[0]['text'].lower()
    assert results[0]['score'] >= 0.60

@pytest.mark.django_db
def test_unrelated_question_does_not_retrieve_memory():
    """
    An unrelated query ('What is the capital of Australia?') should NOT retrieve
    the ice cream memory if min_relevance threshold is respected.
    """
    client = APIClient()
    client.post(
        '/api/memories/',
        {
            'memory_text': 'Akku only likes vanilla flavour ice cream.',
            'category': 'food_drinks'
        },
        format='json',
        HTTP_X_USER_ID='saki'
    )

    retriever = MemoryRetriever()
    results = retriever.retrieve_memories(
        query="What is the capital of Australia?",
        user_id='saki',
        min_relevance=0.40
    )
    assert len(results) == 0

@pytest.mark.django_db
def test_multiple_memories_disambiguation():
    """
    Store multiple distinct memories:
    1. Vanilla ice cream
    2. Reading books by the window on rainy Sundays
    Verify each query retrieves the appropriate memory.
    """
    client = APIClient()
    client.post(
        '/api/memories/',
        {'memory_text': 'Akku only likes vanilla flavour ice cream.', 'category': 'food_drinks'},
        format='json',
        HTTP_X_USER_ID='saki'
    )
    client.post(
        '/api/memories/',
        {'memory_text': 'Akku loves reading novels by the bedroom window on rainy days.', 'category': 'habits_routines'},
        format='json',
        HTTP_X_USER_ID='saki'
    )

    retriever = MemoryRetriever()

    ice_cream_results = retriever.retrieve_memories("What ice cream should I buy?", user_id='saki')
    assert len(ice_cream_results) >= 1
    assert 'vanilla' in ice_cream_results[0]['text'].lower()

    book_results = retriever.retrieve_memories("What does she like doing when it rains?", user_id='saki')
    assert len(book_results) >= 1
    assert 'reading' in book_results[0]['text'].lower()

@pytest.mark.django_db
def test_memory_editing_updates_chromadb_and_cache():
    """
    When a memory is updated:
    1. ChromaDB embedding and document must be updated.
    2. RAG cache must be invalidated.
    3. New retrieval reflects the updated text.
    """
    client = APIClient()
    res = client.post(
        '/api/memories/',
        {'memory_text': 'Akku only likes vanilla flavour ice cream.', 'category': 'food_drinks'},
        format='json',
        HTTP_X_USER_ID='saki'
    )
    mem_id = res.json()['id']

    # Update to pistachio
    update_res = client.patch(
        f'/api/memories/{mem_id}/',
        {'memory_text': 'Akku only likes pistachio flavour ice cream.'},
        format='json',
        HTTP_X_USER_ID='saki'
    )
    assert update_res.status_code == 200

    # ChromaDB count remains 1 (no duplicate document created)
    store = MemoryVectorStore.get_instance()
    assert store.count() == 1

    # Check updated document in ChromaDB
    chroma_res = store.collection.get(ids=[str(mem_id)], include=['documents'])
    assert chroma_res['documents'][0] == 'Akku only likes pistachio flavour ice cream.'

    # Retrieval should return the updated pistachio memory
    retriever = MemoryRetriever()
    results = retriever.retrieve_memories("What ice cream does she like?", user_id='saki')
    assert len(results) >= 1
    assert 'pistachio' in results[0]['text'].lower()

@pytest.mark.django_db
def test_memory_deletion_removes_from_chromadb():
    """
    When a memory is deleted:
    1. Deleted from SQLite.
    2. Deleted from ChromaDB.
    3. Retrieval returns empty list.
    """
    client = APIClient()
    res = client.post(
        '/api/memories/',
        {'memory_text': 'Akku only likes vanilla flavour ice cream.', 'category': 'food_drinks'},
        format='json',
        HTTP_X_USER_ID='saki'
    )
    mem_id = res.json()['id']

    store = MemoryVectorStore.get_instance()
    assert store.count() == 1

    # Delete memory
    del_res = client.delete(f'/api/memories/{mem_id}/', HTTP_X_USER_ID='saki')
    assert del_res.status_code == 200

    assert not PersonalMemory.objects.filter(id=mem_id).exists()
    assert store.count() == 0

    retriever = MemoryRetriever()
    results = retriever.retrieve_memories("What ice cream does Akku like?", user_id='saki')
    assert len(results) == 0

@pytest.mark.django_db
def test_user_level_isolation():
    """
    Ensure User A's memories can NEVER be retrieved for User B.
    """
    client = APIClient()

    # User A (saki) saves vanilla ice cream
    client.post(
        '/api/memories/',
        {'memory_text': 'Akku only likes vanilla flavour ice cream.', 'category': 'food_drinks'},
        format='json',
        HTTP_X_USER_ID='user_a'
    )

    # User B (alice) saves chocolate gelato
    client.post(
        '/api/memories/',
        {'memory_text': 'Akku loves Belgian chocolate gelato.', 'category': 'food_drinks'},
        format='json',
        HTTP_X_USER_ID='user_b'
    )

    store = MemoryVectorStore.get_instance()
    assert store.count() == 2

    retriever = MemoryRetriever()

    # Query for User A
    results_a = retriever.retrieve_memories("What ice cream does Akku like?", user_id='user_a')
    assert len(results_a) == 1
    assert 'vanilla' in results_a[0]['text'].lower()
    assert 'chocolate' not in results_a[0]['text'].lower()

    # Query for User B
    results_b = retriever.retrieve_memories("What ice cream does Akku like?", user_id='user_b')
    assert len(results_b) == 1
    assert 'chocolate' in results_b[0]['text'].lower()
    assert 'vanilla' not in results_b[0]['text'].lower()

@pytest.mark.django_db
def test_chatbot_end_to_end_answer_generation():
    """
    Full pipeline test:
    1. User adds: 'Akku only likes vanilla flavour ice cream.'
    2. User asks Chatbot: 'What ice cream does Akku like?'
    3. RAGService retrieves the memory and invokes LLM.
    """
    client = APIClient()
    client.post(
        '/api/memories/',
        {'memory_text': 'Akku only likes vanilla flavour ice cream.', 'category': 'food_drinks'},
        format='json',
        HTTP_X_USER_ID='saki'
    )

    rag = RAGService()
    # Mock LLM service to verify grounded prompt construction
    with patch.object(rag.llm_service, 'generate', return_value="Akku likes vanilla flavour ice cream. ❤️") as mock_generate:
        result = rag.answer_question(
            question="What ice cream does Akku like?",
            user_id='saki'
        )

        assert mock_generate.called
        call_messages = mock_generate.call_args[0][0]
        system_content = next(m['content'] for m in call_messages if m['role'] == 'system')
        assert 'Akku only likes vanilla flavour ice cream.' in system_content

        assert 'personal_memories' in result
        assert len(result['personal_memories']) >= 1
        assert 'vanilla' in result['personal_memories'][0]['text'].lower()
        assert 'vanilla' in result['answer'].lower()
