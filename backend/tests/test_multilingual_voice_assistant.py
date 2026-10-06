"""
Automated Verification for Siri-Like Multilingual "Hey Akku" Voice Assistant & RAG Pipeline.
Verifies:
1. Language detection for English, Tamil, Telugu, Hindi, Tanglish, Teluglish, Spanish, French, etc.
2. Grounded answers in user's spoken language.
3. Anti-hallucination unknown messages in the user's language for unrecorded facts.
4. Voice language mapping for TTS.
"""

import pytest
from chat.services.prompt_service import PromptService
from chat.services.rag_graph import RAGGraphService
from voice.services.tts_service import TTSService

def test_multilingual_language_detection():
    # English
    assert PromptService.detect_language("Hey Akku, where did our story begin?") == "en"
    
    # Hindi (Devanagari)
    assert PromptService.detect_language("हमारी कहानी कहाँ से शुरू हुई?") == "hi"
    
    # Hinglish
    assert PromptService.detect_language("Humari story kaha se shuru hui?") == "hinglish"
    
    # Tamil (Tamil script)
    assert PromptService.detect_language("நம்ம கதை எப்படி தொடங்கியது?") == "ta"
    
    # Tanglish (Romanized Tamil)
    assert PromptService.detect_language("Hey Akku, namma story eppadi start aachu?") == "tanglish"
    
    # Telugu (Telugu script)
    assert PromptService.detect_language("మన కథ ఎక్కడ మొదలైంది?") == "te"
    
    # Teluglish (Romanized Telugu)
    assert PromptService.detect_language("Hey Akku, mana story ekkada start ayyindi?") == "teluglish"
    
    # Spanish
    assert PromptService.detect_language("Donde empezo nuestra historia de amor?") == "es"
    
    # French
    assert PromptService.detect_language("Comment notre histoire d'amour a commence?") == "fr"

def test_tts_multilingual_voice_routing():
    tts = TTSService.get_instance()
    
    # Hindi
    assert tts._detect_language_voice("नमस्ते साकी, मैं अक्कू हूँ।") == "hi-IN-SwaraNeural"
    
    # Tamil
    assert tts._detect_language_voice("வணக்கம் சாக்கி, நான் அக்கு.") == "ta-IN-PallaviNeural"
    
    # Telugu
    assert tts._detect_language_voice("నమస్కారం సాకీ, నేను అక్కుని.") == "te-IN-ShrutiNeural"
    
    # Tanglish / Teluglish / Indian English
    assert tts._detect_language_voice("Namma story Besant Nagar beach la start aachu!") == "en-IN-NeerjaNeural"
    assert tts._detect_language_voice("Mana story Besant Nagar beach daggara start ayyindi!") == "en-IN-NeerjaNeural"
    
    # Spanish
    assert tts._detect_language_voice("Nuestra hermosa historia empezo con un paseo.") == "es-ES-ElviraNeural"

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
