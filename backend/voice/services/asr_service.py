"""
Speech-to-Text Service using Whisper.
Uses faster-whisper with local caching and model reuse on Apple Silicon CPU/MPS.
"""

import os
import re
import logging
from typing import Dict, Any, Optional
from django.conf import settings

logger = logging.getLogger(__name__)

class ASRService:
    _instance: Optional['ASRService'] = None

    def __init__(self, model_size: Optional[str] = None):
        self.model_size = model_size or getattr(settings, 'ASR_MODEL', 'base')
        self.device = getattr(settings, 'ASR_DEVICE', 'auto')
        self.model = None

    @classmethod
    def get_instance(cls) -> 'ASRService':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_model(self):
        """Loads faster-whisper model with appropriate compute device."""
        if self.model is not None:
            return

        try:
            from faster_whisper import WhisperModel
            import torch

            # Determine device: CPU with int8 or float32 for Apple Silicon
            device = "cpu"
            compute_type = "int8"
            
            logger.info(f"Loading Whisper model '{self.model_size}' on device '{device}' ({compute_type})...")
            self.model = WhisperModel(
                self.model_size,
                device=device,
                compute_type=compute_type,
                cpu_threads=4
            )
            logger.info("Whisper model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Whisper ASR model '{self.model_size}': {e}")
            raise RuntimeError(f"Speech recognition service error: {e}") from e

    def apply_vocabulary_corrections(self, text: str) -> str:
        """Applies learned personal vocabulary corrections to raw transcription text."""
        if not text:
            return ""
        try:
            from memories.models import PersonalVocabulary
            for vocab in PersonalVocabulary.objects.all():
                for mis in vocab.misrecognitions:
                    if mis and mis.lower() in text.lower():
                        pattern = re.compile(re.escape(mis), re.IGNORECASE)
                        text = pattern.sub(vocab.term, text)
        except Exception as e:
            logger.warning(f"Error applying vocabulary corrections: {e}")
        return text

    def transcribe(self, audio_path: str, language: Optional[str] = None) -> Dict[str, Any]:
        """
        Transcribes the given audio file.
        Returns:
            { "text": str, "language": str, "probability": float, "duration": float }
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        self._load_model()

        # Build dynamic multilingual prompt hints from personal vocabulary
        prompt_terms = ["Saki", "Akku", "साकी", "अक्कू", "Saketh", "Akshatha", "जन्मदिन", "प्रपोज", "Besant Nagar", "Marina Beach", "Podi Dosa"]
        try:
            from memories.models import PersonalVocabulary
            vocab_terms = list(PersonalVocabulary.objects.values_list('term', flat=True))
            if vocab_terms:
                prompt_terms.extend(vocab_terms)
        except Exception:
            pass

        initial_prompt = ", ".join(list(dict.fromkeys(prompt_terms))) + "."

        lang = language or getattr(settings, 'ASR_LANGUAGE', 'auto')
        if lang in ('auto', 'all', '', None):
            lang = None

        try:
            segments, info = self.model.transcribe(
                audio_path,
                beam_size=3,
                language=lang,
                initial_prompt=initial_prompt,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500)
            )

            full_text = " ".join([segment.text.strip() for segment in segments]).strip()
            full_text = self.apply_vocabulary_corrections(full_text)

            return {
                "text": full_text,
                "language": info.language if info else "en",
                "probability": round(info.language_probability, 3) if info else 1.0,
                "duration": round(info.duration, 2) if info else 0.0
            }

        except Exception as e:
            logger.error(f"Transcription error for {audio_path}: {e}")
            raise RuntimeError(f"Transcription failed: {e}") from e
