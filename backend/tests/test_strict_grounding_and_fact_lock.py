"""
Automated Test Suite for Akku AI Strict Grounding and Fact-Lock (Prompt Section 25).

Tests:
- TEST 1: Original name "Akshatha" retrieval & fact-lock
- TEST 2: Unknown property ("favorite movie") -> honest fallback, grounded=False, no hallucination
- TEST 3: Preference query ("What does Akku like to eat?") -> answer based ONLY on memory
- TEST 4: Birthplace ("Tanjavur. ❤️")
- TEST 5: Conflicting memories (vanilla vs chocolate) -> conflict detection, no random choice
- TEST 6: Completely unknown personal detail ("What was Akku's school teacher's name?") -> honest fallback, no hallucination
- TEST 7: Immediate retrieval of newly added memory ("Remember that Akku loves jasmine flowers.") without restart
"""

import pytest
from memories.models import PersonalMemory
from memories.services.memory_store import MemoryVectorStore
from memories.services.memory_extractor import MemoryExtractor
from chat.services.rag_graph import RAGGraphService


@pytest.fixture(autouse=True)
def clean_memory_state():
    """Clear memories and ChromaDB state before each test run for deterministic results."""
    PersonalMemory.objects.all().delete()
    MemoryVectorStore.get_instance().clear()
    rag_service = RAGGraphService()
    rag_service.clear_cache()
    yield
    PersonalMemory.objects.all().delete()
    MemoryVectorStore.get_instance().clear()
    rag_service.clear_cache()


@pytest.mark.django_db
def test_case_1_original_name_grounding():
    """
    TEST 1:
    Memory: 'Akku original name is Akshatha.'
    Question: 'What is Akku's original name?'
    Expected: 'Akku's original name is Akshatha. ❤️'
    Grounded: TRUE
    """
    extractor = MemoryExtractor()
    extractor.extract_memories_from_text("Akku original name is Akshatha.", source="text", user_id="test_user")

    rag = RAGGraphService()
    rag.clear_cache()
    res = rag.answer_question("What is Akku's original name?", user_id="test_user")

    assert "Akshatha" in res["answer"]
    assert res["answer"] == "Akku's original name is Akshatha. ❤️"
    assert res["grounded"] is True


@pytest.mark.django_db
def test_case_2_unknown_favorite_movie_no_hallucination():
    """
    TEST 2:
    Memory does NOT contain Akku's favorite movie.
    Question: 'What is Akku's favorite movie?'
    Expected: 'I don't have a reliable saved memory for Akku's favorite movie yet. ❤️'
    Grounded: FALSE, NO invented answer.
    """
    rag = RAGGraphService()
    rag.clear_cache()
    res = rag.answer_question("What is Akku's favorite movie?", user_id="test_user")

    assert res["grounded"] is False
    assert "don't have a reliable saved memory for Akku's favorite movie yet" in res["answer"]
    assert res["answer"] == "I don't have a reliable saved memory for Akku's favorite movie yet. ❤️"


@pytest.mark.django_db
def test_case_3_food_preference_grounded_only_in_memory():
    """
    TEST 3:
    Memory: 'Akku likes dosa and vanilla ice cream.'
    Question: 'What does Akku like to eat?'
    Expected answer based ONLY on that memory. Do not invent additional foods.
    """
    extractor = MemoryExtractor()
    extractor.extract_memories_from_text("Akku likes dosa and vanilla ice cream.", source="text", user_id="test_user")

    rag = RAGGraphService()
    rag.clear_cache()
    res = rag.answer_question("What does Akku like to eat?", user_id="test_user")

    assert res["grounded"] is True
    assert "dosa" in res["answer"].lower()
    assert "vanilla ice cream" in res["answer"].lower()
    # Ensure no fabricated foods like pizza, burger, biryani, pasta
    for invented in ["pizza", "burger", "pasta", "biryani", "noodles"]:
        assert invented not in res["answer"].lower()


@pytest.mark.django_db
def test_case_4_birthplace_tanjavur():
    """
    TEST 4:
    Memory: 'Akku was born in Tanjavur.'
    Question: 'Where was Akku born?'
    Expected: 'Tanjavur. ❤️'
    """
    extractor = MemoryExtractor()
    extractor.extract_memories_from_text("Akku was born in Tanjavur.", source="text", user_id="test_user")

    rag = RAGGraphService()
    rag.clear_cache()
    res = rag.answer_question("Where was Akku born?", user_id="test_user")

    assert res["grounded"] is True
    assert "Tanjavur" in res["answer"]
    assert res["answer"] == "Tanjavur. ❤️"


@pytest.mark.django_db
def test_case_5_conflicting_memories_detection():
    """
    TEST 5:
    Conflicting memories:
    'Akku likes vanilla ice cream.'
    'Akku likes chocolate ice cream.'
    Question: 'What is Akku's favorite ice cream?'
    Expected: Detect conflict. Do not randomly choose.
    """
    PersonalMemory.objects.create(
        user_id="test_user",
        memory_text="Akku likes vanilla ice cream.",
        category="food_drinks",
        subject="Ice Cream",
        source_type="user_memory",
        status="current",
        is_active=True
    )
    PersonalMemory.objects.create(
        user_id="test_user",
        memory_text="Akku likes chocolate ice cream.",
        category="food_drinks",
        subject="Ice Cream",
        source_type="user_memory",
        status="current",
        is_active=True
    )

    rag = RAGGraphService()
    rag.clear_cache()
    res = rag.answer_question("What is Akku's favorite ice cream?", user_id="test_user")

    assert "conflicting" in res["answer"].lower()
    assert "vanilla" in res["answer"].lower()
    assert "chocolate" in res["answer"].lower()
    assert "Which one should I remember as the latest?" in res["answer"]


@pytest.mark.django_db
def test_case_6_completely_unknown_detail_no_hallucination():
    """
    TEST 6:
    Completely unknown:
    'What was Akku's school teacher's name?'
    If not present:
    Do not hallucinate.
    """
    rag = RAGGraphService()
    rag.clear_cache()
    res = rag.answer_question("What was Akku's school teacher's name?", user_id="test_user")

    assert res["grounded"] is False
    assert "don't have a reliable saved memory" in res["answer"]
    assert "school teacher" in res["answer"].lower()


@pytest.mark.django_db
def test_case_7_immediate_retrieval_new_memory_no_restart():
    """
    TEST 7:
    Add new memory:
    'Remember that Akku loves jasmine flowers.'
    Immediately ask:
    'What flowers does Akku love?'
    Expected:
    'Akku loves jasmine flowers. ❤️'
    No restart.
    """
    rag = RAGGraphService()
    rag.clear_cache()

    # Step 1: Add new memory via natural language command
    add_res = rag.answer_question("Remember that Akku loves jasmine flowers.", user_id="test_user")
    assert "jasmine flowers" in add_res["answer"]

    # Step 2: Immediately query without server restart
    rag.clear_cache()
    query_res = rag.answer_question("What flowers does Akku love?", user_id="test_user")

    assert query_res["grounded"] is True
    assert "jasmine flowers" in query_res["answer"].lower()
    assert query_res["answer"] == "Akku loves jasmine flowers. ❤️"


@pytest.mark.django_db
def test_case_8_akku_and_saki_names_coexist_no_false_conflict():
    """
    TEST 8:
    Database contains:
    - 'Akku original name is Akshatha.'
    - 'Saki original name is Saketh'
    Question: 'What is Akku original name?'
    Expected:
    'Akku's original name is Akshatha. ❤️'
    Must NOT trigger false conflict about Saketh/Saki.
    """
    extractor = MemoryExtractor()
    extractor.extract_memories_from_text("Akku original name is Akshatha.", source="text", user_id="test_user")
    extractor.extract_memories_from_text("Saki original name is Saketh.", source="text", user_id="test_user")

    rag = RAGGraphService()
    rag.clear_cache()
    res = rag.answer_question("What is Akku original name?", user_id="test_user")

    assert res["grounded"] is True
    assert res["answer"] == "Akku's original name is Akshatha. ❤️"
    assert "conflicting" not in res["answer"].lower()


@pytest.mark.django_db
def test_case_9_saki_parents_retrieval_and_no_original_name_leak():
    """
    TEST 9:
    Database contains:
    - 'Akku original name is Akshatha.' (v3)
    - 'Saki original name is Saketh.' (v3)
    - 'sakis father name is PYN Srinivas and moms name is P Sushma' (v1)
    
    Verifies:
    1. Query 'sakis father name ?' answers 'Saki's father's name is PYN Srinivas. ❤️'
    2. Query 'sakis moms name and fathers name ?' answers 'Saki's father's name is PYN Srinivas and his mother's name is P Sushma. ❤️'
    3. Query 'sakis mother name ?' answers 'Saki's mother's name is P Sushma. ❤️'
    4. ABSOLUTELY NEVER leaks 'Akku original name is Akshatha. ❤️' on parent queries!
    """
    extractor = MemoryExtractor()
    extractor.extract_memories_from_text("Akku original name is Akshatha.", source="text", user_id="test_parents_user")
    extractor.extract_memories_from_text("Saki original name is Saketh.", source="text", user_id="test_parents_user")
    extractor.extract_memories_from_text("sakis father name is PYN Srinivas and moms name is P Sushma", source="text", user_id="test_parents_user")

    rag = RAGGraphService()
    rag.clear_cache()

    # 1. Father query
    res_dad = rag.answer_question("sakis father name ?", user_id="test_parents_user")
    assert res_dad["grounded"] is True
    assert "PYN Srinivas" in res_dad["answer"]
    assert "Akshatha" not in res_dad["answer"]
    assert res_dad["answer"] == "Saki's father's name is PYN Srinivas. ❤️"

    # 2. Both parents query
    rag.clear_cache()
    res_both = rag.answer_question("sakis moms name and fathers name ?", user_id="test_parents_user")
    assert res_both["grounded"] is True
    assert "PYN Srinivas" in res_both["answer"]
    assert "P Sushma" in res_both["answer"]
    assert "Akshatha" not in res_both["answer"]

    # 3. Mother query
    rag.clear_cache()
    res_mom = rag.answer_question("sakis mother name ?", user_id="test_parents_user")
    assert res_mom["grounded"] is True
    assert "P Sushma" in res_mom["answer"]
    assert "Akshatha" not in res_mom["answer"]


@pytest.mark.django_db
def test_case_10_who_loves_akku_and_lover_name():
    """
    TEST 10:
    Queries like 'who loves akku the most ?' and 'akkus lover name'
    must identify Saki warmly and NEVER return 'Akku original name is Akshatha. ❤️'.
    """
    rag = RAGGraphService()
    rag.clear_cache()

    res_love = rag.answer_question("who loves akku the most ?", user_id="test_lover_user")
    assert "Saki" in res_love["answer"]
    assert "Akshatha" not in res_love["answer"]

    rag.clear_cache()
    res_lover = rag.answer_question("akkus lover name", user_id="test_lover_user")
    assert "Saki" in res_lover["answer"]
    assert "Akshatha" not in res_lover["answer"]


@pytest.mark.django_db
def test_case_11_general_question_not_overwritten_by_latest_saved_memory():
    """
    TEST 11:
    Even when the latest memory saved is 'Akku original name is Akshatha.',
    asking general or external queries (e.g., 'Explain cosine similarity in face recognition.')
    must return the actual LLM generated answer and NEVER be replaced by the latest memory!
    """
    extractor = MemoryExtractor()
    extractor.extract_memories_from_text("Akku original name is Akshatha.", source="text", user_id="test_general_user")

    rag = RAGGraphService()
    rag.clear_cache()

    res = rag.answer_question("Explain cosine similarity in face recognition.", user_id="test_general_user")
    assert "cosine" in res["answer"].lower()
    assert "Akku original name is Akshatha" not in res["answer"]
