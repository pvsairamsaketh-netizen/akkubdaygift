"""
Automated Verification for Multilingual Language Detection & Grounded RAG Pipeline.
Verifies:
1. Language detection for English, Tamil, Telugu, Hindi, Tanglish, Teluglish, Spanish, French, etc.
2. Grounded answers in user's typed language.
3. Anti-hallucination unknown messages in the user's language for unrecorded facts.
"""

import pytest
from chat.services.prompt_service import PromptService
from chat.services.rag_graph import RAGGraphService

def test_multilingual_language_detection():
    # English
    assert PromptService.detect_language("Where did our story begin?") == "en"
    
    # Hindi (Devanagari)
    assert PromptService.detect_language("हमारी कहानी कहाँ से शुरू हुई?") == "hi"
    
    # Hinglish
    assert PromptService.detect_language("Humari story kaha se shuru hui?") == "hinglish"
    
    # Tamil (Tamil script)
    assert PromptService.detect_language("நம்ம கதை எப்படி தொடங்கியது?") == "ta"
    
    # Tanglish (Romanized Tamil)
    assert PromptService.detect_language("namma story eppadi start aachu?") == "tanglish"
    
    # Telugu (Telugu script)
    assert PromptService.detect_language("మన కథ ఎక్కడ మొదలైంది?") == "te"
    
    # Teluglish (Romanized Telugu)
    assert PromptService.detect_language("mana story ekkada start ayyindi?") == "teluglish"
    
    # Spanish
    assert PromptService.detect_language("Donde empezo nuestra historia de amor?") == "es"
    
    # French
    assert PromptService.detect_language("Comment notre histoire d'amour a commence?") == "fr"

@pytest.mark.django_db
def test_unrecorded_fact_anti_hallucination_multilingual():
    rag = RAGGraphService()
    
    # English unrecorded question
    res_en = rag.answer_question("What is Akku's favorite car brand?")
    assert not res_en.get("evidence_sufficient", True)
    assert "don't have" in res_en["answer"].lower()
    
    # Hinglish unrecorded question
    res_hinglish = rag.answer_question("Akku ki favorite car kaunsi hai?")
    assert not res_hinglish.get("evidence_sufficient", True)
    assert "saved memory nahi hai" in res_hinglish["answer"].lower() or "nahin" in res_hinglish["answer"].lower()
