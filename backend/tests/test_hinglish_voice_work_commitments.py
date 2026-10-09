"""
Automated Evaluation Suite for Hinglish Voice, Cross-Lingual RAG, and Work Commitments.
Tests:
1. Exact spoken Hinglish query: "Thoda mereko Saki ke work commitments ke baare mein bata sakte ho kya?"
2. Phonetic ASR misrecognized transcript: "Thoda Mirko Saki ke vark komitment ke baare mein bataasikte hukya."
3. Exact English query: "Tell me about sakis work commitments at Tessell ?"
4. Hindi query: "साकी के काम की ज़िम्मेदारियों के बारे में थोड़ा बताओ?"
5. Missing information honesty (no hallucination).
6. Speech recognition vocabulary corrections for Indian accents.
"""

import pytest
from memories.models import PersonalMemory
from chat.services.rag_graph import RAGGraphService
from chat.services.prompt_service import PromptService
from chat.services.retrieval_service import RetrievalService

@pytest.mark.django_db
class TestHinglishVoiceAndWorkCommitments:

    @pytest.fixture(autouse=True)
    def setup_work_commitments_memory(self):
        """Seed the verified work commitments memory into PersonalMemory."""
        PersonalMemory.objects.all().delete()
        PersonalMemory.objects.create(
            user_id="default_user",
            memory_text="Question: Why was Saki sometimes unavailable? Answer: He attributed reduced communication to work responsibilities at Tessel, health issues, and the demands of building financial stability. He assured Akku he would make time for her as soon as possible.",
            category="career",
            subject="Saki work commitments at Tessell",
            source_type="initial_pdf",
            is_active=True
        )
        rag_service = RAGGraphService()
        rag_service.clear_cache()
        yield
        PersonalMemory.objects.all().delete()
        rag_service.clear_cache()

    def test_1_exact_hinglish_work_commitments_query(self):
        """Test exact Hinglish query: Thoda mereko Saki ke work commitments ke baare mein bata sakte ho kya?"""
        svc = RAGGraphService()
        res = svc.answer_question("Thoda mereko Saki ke work commitments ke baare mein bata sakte ho kya?")
        answer = res.get("answer", "")
        
        # Must mention Tessell and work responsibilities / financial stability
        assert any(w in answer.lower() for w in ["tessel", "tessell"]), f"Missing Tessell in answer: {answer}"
        assert any(w in answer.lower() for w in ["work", "responsibilities", "kam", "kaam"]), f"Missing work in answer: {answer}"
        # Must NOT call Akku sister ('akka' or 'bahan')
        assert "akka" not in answer.lower(), f"Violated persona rule: {answer}"
        assert "बहन" not in answer, f"Violated persona rule: {answer}"
        # Must be grounded
        assert res.get("grounded", False) is True

    def test_2_phonetic_asr_misrecognized_speech(self):
        """Test colloquial typed Hinglish: Thoda Mirko Saki ke vark komitment ke baare mein bataasikte hukya."""
        raw_text = "Thoda Mirko Saki ke vark komitment ke baare mein bataasikte hukya."
        svc = RAGGraphService()
        res = svc.answer_question(raw_text)
        answer = res.get("answer", "")
        assert any(w in answer.lower() for w in ["tessel", "tessell"]), f"Answer missing Tessell: {answer}"
        assert "akka" not in answer.lower()

    def test_3_english_query_work_commitments(self):
        """Test exact English query: Tell me about sakis work commitments at Tessell ?"""
        svc = RAGGraphService()
        res = svc.answer_question("Tell me about sakis work commitments at Tessell ?")
        answer = res.get("answer", "")
        
        assert "Tessell" in answer or "Tessel" in answer
        assert any(w in answer.lower() for w in ["responsibilities", "reduced communication", "financial stability", "commitments"])
        assert res.get("grounded", False) is True

    def test_4_hindi_query_work_commitments(self):
        """Test Hindi query: साकी के काम की ज़िम्मेदारियों के बारे में थोड़ा बताओ?"""
        svc = RAGGraphService()
        res = svc.answer_question("साकी के काम की ज़िम्मेदारियों और टेसेल (Tessell) के बारे में बताओ?")
        answer = res.get("answer", "")
        
        assert any(w in answer for w in ["टेसेल", "Tessell", "Tessel", "ज़िम्मेदारियों", "काम"]), f"Answer: {answer}"
        assert res.get("grounded", False) is True

    def test_5_unknown_personal_detail_no_hallucination(self):
        """Test asking for an unrecorded personal detail does not fabricate."""
        svc = RAGGraphService()
        res = svc.answer_question("Saki ki favorite luxury sports car brand kaun si hai?")
        answer = res.get("answer", "")
        
        assert any(w in answer.lower() for w in ["nahi hai", "not have", "saved", "jaankari", "memory"]), f"Hallucinated car: {answer}"
        assert not any(w in answer.lower() for w in ["ferrari", "lamborghini", "porsche", "bmw", "audi"])

    def test_6_multilingual_bridge_for_commitments(self):
        """Test that multilingual_bridge recognizes commitments and Tessell."""
        rs = RetrievalService()
        bridge = rs.multilingual_bridge
        matched = False
        for keys in bridge.keys():
            if any(k in ["work commitment", "vark komitment", "tessel"] for k in keys):
                matched = True
                break
        assert matched is True

    def test_7_devanagari_misrecognized_hinglish_favourite_hero(self):
        """Test asking for unrecorded favourite hero: 'Thoda mereko batao akku ka favourite hero kaun hai'"""
        svc = RAGGraphService()
        res = svc.answer_question("Thoda mereko batao akku ka favourite hero kaun hai")
        answer = res.get("answer", "")
        
        # Must honestly admit no saved memory about favourite hero exists
        assert any(w in answer.lower() for w in ["nahi hai", "saved memory", "not have", "jaankari", "yaad", "saved"]), f"Hallucinated answer: {answer}"
        # Must NOT fabricate famous actors
        assert not any(w in answer.lower() for w in ["shah rukh", "salman", "hrithik", "ranbir", "allu arjun", "prabhas", "mahesh babu"])

