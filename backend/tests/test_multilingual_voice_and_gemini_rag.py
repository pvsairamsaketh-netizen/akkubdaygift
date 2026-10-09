"""
Comprehensive Verification Suite for Akku AI Multilingual Voice Assistant,
Gemini Translation, and Memory-Grounded Intelligence (Prompt Tests A to H).
"""

import pytest
import uuid
from django.urls import reverse
from rest_framework.test import APIClient
from memories.models import PersonalMemory
from memories.services.memory_store import MemoryVectorStore
from memories.services.memory_extractor import MemoryExtractor
from chat.services.rag_graph import RAGGraphService
from chat.services.gemini_translation_service import GeminiTranslationService
from chat.services.multilingual_service import MultilingualService


@pytest.fixture(autouse=True)
def clean_eval_state():
    """Clear memories and cache before/after each test."""
    PersonalMemory.objects.all().delete()
    MemoryVectorStore.get_instance().clear()
    rag = RAGGraphService()
    rag.clear_cache()
    yield
    PersonalMemory.objects.all().delete()
    MemoryVectorStore.get_instance().clear()
    rag.clear_cache()


@pytest.fixture
def ensure_pdf_data():
    from documents.services.knowledge_ingestor import KnowledgeIngestor
    if PersonalMemory.objects.filter(source_type="initial_pdf").count() == 0:
        KnowledgeIngestor().ingest(force=False)


@pytest.mark.django_db
class TestMultilingualVoiceAndIntelligence:
    """
    Automated Acceptance Suite Tests A through H.
    """

    def test_a_multilingual_memory_retrieval(self):
        """
        TEST A: Multilingual memory retrieval
        Store: 'Akku's original name is Akshatha.'
        Verify queries in English, Hindi, Telugu, Tamil, Hinglish retrieve the fact
        and answer in the respective language.
        """
        user_id = f"user_test_a_{uuid.uuid4().hex[:6]}"
        extractor = MemoryExtractor()
        extractor.extract_memories_from_text("Akku's original name is Akshatha.", source="text", user_id=user_id)

        rag = RAGGraphService()
        rag.clear_cache()

        # 1. English
        res_en = rag.answer_question("What is Akku's original name?", user_id=user_id)
        assert "Akshatha" in res_en["answer"]
        assert res_en["grounded"] is True

        # 2. Hindi
        res_hi = rag.answer_question("अक्कू का असली नाम क्या है?", user_id=user_id)
        assert any(k in res_hi["answer"] for k in ["अक्षथा", "Akshatha"])
        assert res_hi["grounded"] is True

        # 3. Telugu
        res_te = rag.answer_question("అక్కు అసలు పేరు ఏమిటి?", user_id=user_id)
        assert any(k in res_te["answer"] for k in ["అక్షత", "Akshatha"])
        assert res_te["grounded"] is True

        # 4. Tamil
        res_ta = rag.answer_question("அக்குவின் உண்மையான பெயர் என்ன?", user_id=user_id)
        assert any(k in res_ta["answer"] for k in ["அக்ஷதா", "Akshatha"])
        assert res_ta["grounded"] is True

        # 5. Hinglish
        res_hinglish = rag.answer_question("Akku ka original name kya hai?", user_id=user_id)
        assert "Akshatha" in res_hinglish["answer"]
        assert res_hinglish["grounded"] is True

    def test_b_missing_information_no_hallucination(self):
        """
        TEST B: Missing information
        Ask for personal detail absent from PDF and memories.
        Must report unavailable without inventing facts.
        """
        user_id = f"user_test_b_{uuid.uuid4().hex[:6]}"
        rag = RAGGraphService()

        res = rag.answer_question("What is Akku's favorite car brand?", user_id=user_id)
        assert res["evidence_sufficient"] is False
        assert res["grounded"] is False
        assert "don't have" in res["answer"].lower() or "not have" in res["answer"].lower()

    def test_c_newly_added_memory_immediate_multilingual_retrieval(self):
        """
        TEST C: Newly added memory
        Add a new memory, retrieve immediately without restart in English and Hindi.
        Then simulate app restart (cache clear) and verify persistence.
        """
        user_id = f"user_test_c_{uuid.uuid4().hex[:6]}"
        extractor = MemoryExtractor()
        new_mems = extractor.extract_memories_from_text(
            "Remember that Akku loves jasmine flowers.",
            source="text",
            user_id=user_id
        )
        assert len(new_mems) >= 1

        rag = RAGGraphService()

        # Immediate retrieval in English
        res_en = rag.answer_question("What flowers does Akku love?", user_id=user_id)
        assert "jasmine" in res_en["answer"].lower()
        assert res_en["grounded"] is True

        # Immediate retrieval in Hindi
        res_hi = rag.answer_question("अक्कू को कौन सा फूल पसंद है?", user_id=user_id)
        assert "jasmine" in res_hi["answer"].lower() or "चमेली" in res_hi["answer"]
        assert res_hi["grounded"] is True

        # Simulate redeploy / restart
        rag.clear_cache()
        res_after_restart = rag.answer_question("What flowers does Akku love?", user_id=user_id)
        assert "jasmine" in res_after_restart["answer"].lower()

    def test_d_pdf_retrieval_grounded(self, ensure_pdf_data):
        """
        TEST D: PDF foundational retrieval
        Verify questions answered exclusively from PDF knowledge base.
        """
        rag = RAGGraphService()
        res = rag.answer_question("When and how did Saki propose to Akku?", user_id="eval_user_pdf")
        ans_lower = res["answer"].lower()
        assert "may 4" in ans_lower or "2022" in ans_lower
        assert "canteen" in ans_lower or "samosa" in ans_lower
        assert res["grounded"] is True

    def test_e_conflicting_information_detection(self):
        """
        TEST E: Conflicting information
        Add two conflicting memories and verify system detects conflict rather than guessing.
        """
        user_id = f"user_test_e_{uuid.uuid4().hex[:6]}"
        PersonalMemory.objects.create(
            user_id=user_id,
            memory_text="Akku loves vanilla ice cream.",
            category="food_drinks",
            subject="Ice Cream",
            source_type="user_memory",
            status="current",
            is_active=True
        )
        PersonalMemory.objects.create(
            user_id=user_id,
            memory_text="Akku loves chocolate ice cream.",
            category="food_drinks",
            subject="Ice Cream",
            source_type="user_memory",
            status="current",
            is_active=True
        )

        rag = RAGGraphService()
        rag.clear_cache()
        res = rag.answer_question("What is Akku's favorite ice cream?", user_id=user_id)
        ans_lower = res["answer"].lower()
        assert "conflicting" in ans_lower
        assert "vanilla" in ans_lower
        assert "chocolate" in ans_lower

    def test_f_multilingual_language_detection(self):
        """
        TEST F: Multilingual language detection
        Verify accurate script and language detection across Hindi, Telugu, Tamil, and English.
        """
        multi = MultilingualService.get_instance()
        assert multi.detect_language("नमस्ते साकी") in ("hi", "hindi")
        assert multi.detect_language("నమస్కారం సాకీ") in ("te", "telugu")
        assert multi.detect_language("வணக்கம் சாக்கி") in ("ta", "tamil")
        assert multi.detect_language("Hello Saki") in ("en", "english")

    def test_g_translation_fidelity_safeguards(self):
        """
        TEST G: Translation fidelity
        Verify names (Akku, Saki, Saketh, Akshatha), dates, and negation are preserved.
        """
        service = GeminiTranslationService.get_instance()
        # Heuristic fallback preservation check
        q_hi = "अक्कू का असली नाम क्या है?"
        eng_norm = service.translate_query_to_english(q_hi, "hi")
        assert "Akku" in eng_norm or "akku" in eng_norm.lower()
        assert "original name" in eng_norm.lower()

        ans_eng = "Akku's original name is Akshatha. ❤️"
        ans_hi = service.translate_answer_to_target_language(ans_eng, "hi")
        assert "❤️" in ans_hi
        assert service.verify_translation_fidelity(ans_eng, ans_hi) is True

    def test_h_regression_multilingual_facade_and_chat(self):
        """
        TEST H: Regression verification
        Verify multilingual facade service, language detection, and non-memory questions.
        """
        multi = MultilingualService.get_instance()
        assert multi.detect_language("Akku's birthday is October 20") == "en"
        assert multi.detect_language("अक्कू की पसंदीदा आइसक्रीम") == "hi"
        assert multi.detect_language("Akku ki favorite ice cream") == "hinglish"
        assert len(multi.get_supported_languages()) >= 15

        # Check technical question is not polluted with memory
        rag = RAGGraphService()
        tech_res = rag.answer_question("Explain cosine similarity in face recognition.")
        assert "cosine" in tech_res["answer"].lower()
        assert "similarity" in tech_res["answer"].lower()
        assert "akshatha" not in tech_res["answer"].lower()
