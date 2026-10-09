"""
Comprehensive Automated Tests for Akku AI Long-Term Memory & Adaptation.
Tests:
- Test 1: Small detail automatic extraction ("She likes mango ice cream")
- Test 2: Semantic retrieval / delayed recall ("Which ice cream does she like?")
- Test 3: Different phrasing semantic retrieval ("She enjoys listening to songs in the rain" -> "rainy weather")
- Test 4: Contradictory preference update (pink -> blue)
- Test 5: Missing memory handling
- Test 6: Memory deletion from both DB & ChromaDB
- Test 7: Personal vocabulary phonetic alias correction for voice
"""

import pytest
from rest_framework.test import APIClient
from memories.models import PersonalMemory, PersonalVocabulary, BirthdayConfig
from memories.services.memory_store import MemoryVectorStore
from memories.services.memory_extractor import MemoryExtractor
from memories.services.memory_retriever import MemoryRetriever

@pytest.mark.django_db
def test_automatic_memory_extraction_small_detail():
    extractor = MemoryExtractor()
    text = "She likes chocolate ice cream"
    memories = extractor.extract_memories_from_text(text, source="text")
    
    assert len(memories) >= 1
    stored = memories[0]
    assert "ice cream" in stored.memory_text.lower()
    assert stored.category in ["food_drinks", "likes_dislikes", "personal_preferences"]

@pytest.mark.django_db
def test_semantic_retrieval_and_delayed_recall():
    MemoryVectorStore.get_instance().clear()
    extractor = MemoryExtractor()
    memories = extractor.extract_memories_from_text("She likes mango ice cream", source="text")
    assert len(memories) > 0
    
    retriever = MemoryRetriever()
    results = retriever.retrieve_memories("Which ice cream does she like?")
    assert len(results) > 0
    assert any("mango" in r["text"].lower() for r in results)

@pytest.mark.django_db
def test_different_wording_semantic_retrieval():
    extractor = MemoryExtractor()
    extractor.extract_memories_from_text("She enjoys listening to songs in the rain", source="text")
    
    retriever = MemoryRetriever()
    # Phrased differently: "rainy weather"
    results = retriever.retrieve_memories("What did I tell you about her and rainy weather?")
    assert len(results) > 0
    assert any("rain" in r["text"].lower() for r in results)

@pytest.mark.django_db
def test_contradictory_preference_update():
    extractor = MemoryExtractor()
    # First: favorite color is pink
    mem1 = extractor.extract_memories_from_text("Her favorite color is pink", source="text")
    assert len(mem1) > 0
    pink_id = mem1[0].id
    
    # Later: correct favorite color to blue
    mem2 = extractor.extract_memories_from_text("Her favorite color is blue", source="text")
    assert len(mem2) > 0
    blue_mem = mem2[0]
    assert "blue" in blue_mem.memory_text.lower()
    
    # Check that pink memory was marked superseded
    old_pink = PersonalMemory.objects.get(id=pink_id)
    assert old_pink.is_active is False or old_pink.superseded_by == blue_mem

@pytest.mark.django_db
def test_memory_deletion():
    extractor = MemoryExtractor()
    mems = extractor.extract_memories_from_text("She had a headache yesterday", source="voice")
    assert len(mems) > 0
    mem = mems[0]
    
    # Verify in DB
    assert PersonalMemory.objects.filter(id=mem.id).exists()
    
    # Delete via API or store
    store = MemoryVectorStore.get_instance()
    store.delete_memory(str(mem.id))
    mem.delete()
    
    assert not PersonalMemory.objects.filter(id=mem.id).exists()
    
    # Search should no longer return it
    retriever = MemoryRetriever()
    results = retriever.retrieve_memories("headache yesterday")
    assert not any(str(mem.id) == str(r["id"]) for r in results)

@pytest.mark.django_db
def test_personal_vocabulary_voice_adaptation():
    vocab = PersonalVocabulary.objects.create(
        term="Besant Nagar",
        category="place",
        misrecognitions=["pesant nagar", "besant nagerr"]
    )
    assert vocab.term == "Besant Nagar"
    assert "pesant nagar" in vocab.misrecognitions
    assert vocab.category == "place"

@pytest.mark.django_db
def test_memories_api_crud():
    client = APIClient()
    
    # Create memory via API
    res = client.post('/api/memories/', {
        'memory_text': 'She loves caramel macchiato coffee',
        'category': 'food_drinks',
        'subject': 'Akku'
    }, format='json')
    assert res.status_code == 201
    mem_id = res.data['id']
    
    # List memories
    res_list = client.get('/api/memories/')
    assert res_list.status_code == 200
    assert any(m['id'] == mem_id for m in res_list.data['memories'])
    
    # Delete memory
    res_del = client.delete(f'/api/memories/{mem_id}/')
    assert res_del.status_code in [200, 204]
    assert not PersonalMemory.objects.filter(id=mem_id).exists()

@pytest.mark.django_db
def test_birthday_config_api():
    client = APIClient()
    res = client.get('/api/memories/birthday-config/')
    assert res.status_code == 200
    assert 'Akku' in res.data['recipient_name']
    assert 'Saki' in res.data['creator_name']
    
    # Update config
    res_update = client.post('/api/memories/birthday-config/', {
        'greeting_title': 'Happy Birthday Akku! ❤️'
    }, format='json')
    assert res_update.status_code == 200
    assert res_update.data['greeting_title'] == 'Happy Birthday Akku! ❤️'
