"""
Text-to-Speech Service for Saki & Akku Assistant.
Primary provider: Kokoro-82M (local offline neural TTS).
Fallback provider: edge-tts (ultra-high-quality neural voices).
Outputs browser-playable audio (WAV / MP3).
"""

import os
import uuid
import asyncio
import logging
from typing import Dict, Any, Optional
import soundfile as sf
from django.conf import settings
from chat.services.citation_service import CitationService

logger = logging.getLogger(__name__)

class TTSService:
    _instance: Optional['TTSService'] = None

    def __init__(self):
        self.provider = getattr(settings, 'TTS_PROVIDER', 'kokoro')
        self.default_voice = getattr(settings, 'TTS_VOICE', 'af_heart')
        self.default_speed = getattr(settings, 'TTS_SPEED', 1.0)
        self.output_dir = os.path.join(settings.MEDIA_ROOT, 'tts_audio')
        os.makedirs(self.output_dir, exist_ok=True)
        self.kokoro_pipeline = None

    @classmethod
    def get_instance(cls) -> 'TTSService':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _init_kokoro(self):
        """Initializes Kokoro pipeline lazily."""
        if self.kokoro_pipeline is not None:
            return

        try:
            from kokoro import KPipeline
            logger.info("Initializing Kokoro TTS KPipeline (lang_code='a')...")
            self.kokoro_pipeline = KPipeline(lang_code='a')
            logger.info("Kokoro TTS initialized successfully.")
        except Exception as e:
            logger.warning(f"Could not initialize Kokoro TTS: {e}. Will fallback to Edge-TTS.")
            self.kokoro_pipeline = None

    @staticmethod
    def _detect_language_voice(text: str, default_voice: str = "en-US-JennyNeural") -> str:
        # Check Devanagari (Hindi / Marathi)
        if any('\u0900' <= char <= '\u097f' for char in text):
            return "hi-IN-SwaraNeural"
        # Check Telugu
        if any('\u0c00' <= char <= '\u0c7f' for char in text):
            return "te-IN-ShrutiNeural"
        # Check Tamil
        if any('\u0b80' <= char <= '\u0bff' for char in text):
            return "ta-IN-PallaviNeural"
        # Check Kannada
        if any('\u0c80' <= char <= '\u0cff' for char in text):
            return "kn-IN-SapnaNeural"
        # Check Malayalam
        if any('\u0d00' <= char <= '\u0d7f' for char in text):
            return "ml-IN-SobhanaNeural"
        # Check Bengali
        if any('\u0980' <= char <= '\u09ff' for char in text):
            return "bn-IN-TanishaaNeural"
        # Check Gujarati
        if any('\u0a80' <= char <= '\u0aff' for char in text):
            return "gu-IN-DhwaniNeural"
        # Check Arabic
        if any('\u0600' <= char <= '\u06ff' for char in text):
            return "ar-SA-ZariyahNeural"
        # Check Cyrillic (Russian)
        if any('\u0400' <= char <= '\u04ff' for char in text):
            return "ru-RU-SvetlanaNeural"
        # Check Japanese
        if any('\u3040' <= char <= '\u30ff' for char in text):
            return "ja-JP-NanamiNeural"
        # Check Chinese
        if any('\u4e00' <= char <= '\u9fff' for char in text):
            return "zh-CN-XiaoxiaoNeural"
        # Check Korean
        if any('\uac00' <= char <= '\ud7af' for char in text):
            return "ko-KR-SunHiNeural"
        
        # Check Romanized Indian languages (Tanglish, Teluglish, Hinglish)
        lower_words = set(text.lower().split())
        hinglish_markers = {"aap", "aapko", "tum", "maine", "hum", "kaise", "kab", "kyun", "kya", "tha", "the", "thi", "hai", "hain", "ke", "ki", "ko", "se", "mein", "bhi", "aur", "yaad"}
        tanglish_markers = {"namma", "story", "eppadi", "start", "aachu", "romba", "pidikkum", "irukku", "unaku", "enakku", "nyabagam", "kalisam"}
        teluglish_markers = {"mana", "story", "ekkada", "start", "ayyindi", "kalisam", "meeru", "nenu", "ela", "unnaru", "istam", "gurthu"}

        if len(lower_words.intersection(hinglish_markers)) >= 2:
            return "hi-IN-SwaraNeural"
        if len(lower_words.intersection(tanglish_markers)) >= 1 or len(lower_words.intersection(teluglish_markers)) >= 1:
            return "en-IN-NeerjaNeural"

        # Check European languages
        spanish_markers = {"como", "donde", "cuando", "nuestra", "historia", "amor", "recuerdo", "hola", "nuestro", "empezo"}
        french_markers = {"comment", "notre", "histoire", "quand", "avec", "amour", "souviens", "bonjour"}
        german_markers = {"unsere", "geschichte", "warum", "liebe", "erinnerst", "hallo"}
        italian_markers = {"nostra", "quando", "dove", "perche", "amore", "ricordi", "ciao"}

        if len(lower_words.intersection(spanish_markers)) >= 2 or any(w in lower_words for w in ["hola", "nuestra", "nuestro"]):
            return "es-ES-ElviraNeural"
        if len(lower_words.intersection(french_markers)) >= 2 or any(w in lower_words for w in ["bonjour", "notre"]):
            return "fr-FR-DeniseNeural"
        if len(lower_words.intersection(german_markers)) >= 2 or any(w in lower_words for w in ["hallo", "unsere"]):
            return "de-DE-KatjaNeural"
        if len(lower_words.intersection(italian_markers)) >= 2 or any(w in lower_words for w in ["ciao", "nostra"]):
            return "it-IT-ElsaNeural"

        # Indian English voice default for Saki & Akku love story context
        if any(name in text.lower() for name in ["saki", "akku", "besant nagar", "samosa", "chennai"]):
            return "en-IN-NeerjaNeural"
            
        return default_voice

    def synthesize_speech(
        self,
        text: str,
        voice: Optional[str] = None,
        speed: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Synthesizes text into speech. Returns audio URL and metadata.
        Automatically detects language (Hindi, Telugu, Tamil, English) for natural speech.
        """
        clean_text = CitationService.clean_text_for_speech(text)
        if not clean_text:
            return {"error": "No speakable text provided"}

        if len(clean_text) > 800:
            clean_text = clean_text[:797] + "..."

        selected_speed = speed or self.default_speed
        audio_filename = f"tts_{uuid.uuid4().hex[:12]}.wav"
        output_path = os.path.join(self.output_dir, audio_filename)

        # Detect native language voice
        detected_voice = self._detect_language_voice(clean_text, default_voice="en-US-JennyNeural")
        if detected_voice != "en-US-JennyNeural" or voice:
            target_voice = voice or detected_voice
            return self._synthesize_edge_tts(clean_text, output_path, audio_filename, voice_override=target_voice)

        selected_voice = voice or self.default_voice

        # Try Kokoro first for English
        if self.provider == 'kokoro':
            try:
                self._init_kokoro()
                if self.kokoro_pipeline is not None:
                    generator = self.kokoro_pipeline(
                        clean_text,
                        voice=selected_voice,
                        speed=selected_speed,
                        split_pattern=r'\n+'
                    )
                    audio_segments = []
                    sample_rate = 24000
                    for _, _, audio in generator:
                        audio_segments.append(audio)

                    if audio_segments:
                        import numpy as np
                        combined_audio = np.concatenate(audio_segments)
                        sf.write(output_path, combined_audio, sample_rate)

                        audio_url = f"{settings.MEDIA_URL}tts_audio/{audio_filename}"
                        return {
                            "audio_url": audio_url,
                            "audio_path": output_path,
                            "provider": "kokoro",
                            "voice": selected_voice,
                            "duration_seconds": round(len(combined_audio) / sample_rate, 2),
                            "format": "audio/wav"
                        }
            except Exception as e:
                logger.warning(f"Kokoro synthesis failed: {e}. Attempting fallback...")

        # Fallback to Edge-TTS
        return self._synthesize_edge_tts(clean_text, output_path, audio_filename)

    def _synthesize_edge_tts(
        self,
        text: str,
        output_path: str,
        filename_base: str,
        voice_override: Optional[str] = None
    ) -> Dict[str, Any]:
        """High quality neural synthesis using edge-tts with multilingual voice matching."""
        try:
            import edge_tts
            mp3_filename = filename_base.replace('.wav', '.mp3')
            mp3_path = os.path.join(self.output_dir, mp3_filename)

            voice = voice_override or self._detect_language_voice(text, "en-US-JennyNeural")

            async def _run():
                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(mp3_path)

            asyncio.run(_run())

            audio_url = f"{settings.MEDIA_URL}tts_audio/{mp3_filename}"
            return {
                "audio_url": audio_url,
                "audio_path": mp3_path,
                "provider": "edge_tts",
                "voice": voice,
                "format": "audio/mpeg"
            }
        except Exception as e:
            logger.error(f"Edge-TTS synthesis error: {e}")
            raise RuntimeError(f"Speech synthesis error: {e}") from e
