"""
Multilingual Service Facade for Akku AI Assistant.
Orchestrates language detection, Gemini translation, language normalization,
and multilingual metadata for voice and chat pipelines.
"""

import logging
from typing import Dict, Any, List, Optional
from chat.services.prompt_service import PromptService
from chat.services.gemini_translation_service import GeminiTranslationService

logger = logging.getLogger(__name__)

SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "native": "English", "tts_voice": "en-IN-NeerjaNeural"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "tts_voice": "hi-IN-SwaraNeural"},
    "te": {"name": "Telugu", "native": "తెలుగు", "tts_voice": "te-IN-ShrutiNeural"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "tts_voice": "ta-IN-PallaviNeural"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "tts_voice": "kn-IN-SapnaNeural"},
    "ml": {"name": "Malayalam", "native": "മലയാളം", "tts_voice": "ml-IN-SobhanaNeural"},
    "bn": {"name": "Bengali", "native": "বাংলা", "tts_voice": "bn-IN-TanishaaNeural"},
    "mr": {"name": "Marathi", "native": "मराठी", "tts_voice": "hi-IN-SwaraNeural"},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી", "tts_voice": "gu-IN-DhwaniNeural"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "tts_voice": "hi-IN-SwaraNeural"},
    "ur": {"name": "Urdu", "native": "اردو", "tts_voice": "hi-IN-SwaraNeural"},
    "es": {"name": "Spanish", "native": "Español", "tts_voice": "es-ES-ElviraNeural"},
    "fr": {"name": "French", "native": "Français", "tts_voice": "fr-FR-DeniseNeural"},
    "de": {"name": "German", "native": "Deutsch", "tts_voice": "de-DE-KatjaNeural"},
    "ar": {"name": "Arabic", "native": "العربية", "tts_voice": "ar-SA-ZariyahNeural"},
    "hinglish": {"name": "Hinglish", "native": "Hinglish", "tts_voice": "hi-IN-SwaraNeural"},
    "tanglish": {"name": "Tanglish", "native": "Tanglish", "tts_voice": "en-IN-NeerjaNeural"},
    "teluglish": {"name": "Teluglish", "native": "Teluglish", "tts_voice": "en-IN-NeerjaNeural"},
}

class MultilingualService:
    _instance: Optional['MultilingualService'] = None

    def __init__(self):
        self.translator = GeminiTranslationService.get_instance()

    @classmethod
    def get_instance(cls) -> 'MultilingualService':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @staticmethod
    def detect_language(text: str) -> str:
        """Accurately detects source language and script."""
        return PromptService.detect_language(text)

    @staticmethod
    def get_supported_languages() -> List[Dict[str, Any]]:
        """Returns structured metadata of officially supported languages."""
        return [
            {"code": code, **meta}
            for code, meta in SUPPORTED_LANGUAGES.items()
        ]

    def normalize_and_translate_query(self, query: str) -> Dict[str, str]:
        """
        Detects query language and translates it into English if needed
        for grounded retrieval from English-only PDF & memories.
        """
        source_lang = self.detect_language(query)
        if source_lang == "en":
            return {
                "source_language": "en",
                "original_query": query,
                "normalized_english_query": query
            }

        eng_query = self.translator.translate_query_to_english(query, source_lang)
        return {
            "source_language": source_lang,
            "original_query": query,
            "normalized_english_query": eng_query
        }

    def translate_response(self, response: str, target_language: str, original_query: Optional[str] = None) -> str:
        """Translates the response to the target language preserving warmth and facts."""
        if target_language in ("en", "english"):
            return response
        return self.translator.translate_answer_to_target_language(
            response,
            target_language=target_language,
            original_question=original_query
        )

    def get_service_status(self) -> Dict[str, Any]:
        """Exposes multilingual readiness diagnostics."""
        return {
            "gemini_translation_available": self.translator.is_available(),
            "gemini_model": self.translator.model_name,
            "total_supported_languages": len(SUPPORTED_LANGUAGES),
            "supported_languages": list(SUPPORTED_LANGUAGES.keys())
        }
