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

    DEV_MAP = {
        'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
        'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
        'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
        'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
        'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
        'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
        'प': 'p', 'फ': 'f', 'ब': 'b', 'भ': 'bh', 'म': 'm',
        'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
        'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
        'ं': 'n', 'ँ': 'n', 'ः': 'h', '्': '', '़': '', '।': '.', '॥': '.'
    }

    def __init__(self, model_size: Optional[str] = None):
        self.model_size = model_size or getattr(settings, 'ASR_MODEL', 'small')
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

            # Determine device: CPU with int8 for fast Apple Silicon inference
            device = "cpu"
            compute_type = "int8"
            
            logger.info(f"Loading Whisper model '{self.model_size}' on device '{device}' ({compute_type})...")
            self.model = WhisperModel(
                self.model_size,
                device=device,
                compute_type=compute_type,
                cpu_threads=4
            )
            logger.info(f"Whisper model '{self.model_size}' loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Whisper ASR model '{self.model_size}': {e}")
            raise RuntimeError(f"Speech recognition service error: {e}") from e

    @classmethod
    def devanagari_to_roman(cls, text: str) -> str:
        """Transliterates Devanagari script phonetically into clean Roman script."""
        if not text or not re.search(r'[\u0900-\u097F]', text):
            return text

        # Replace specific known Devanagari misrecognitions / phrases before character mapping
        devanagari_phrase_rules = [
            (r'अर\s+अप्रा\s+में\s+अप्रो', 'thoda mereko'),
            (r'एकूका', 'Akku ka'),
            (r'अक्कू\s+का', 'Akku ka'),
            (r'पेवरे|फेवरेट', 'favourite'),
            (r'पहौर|हीरो', 'hero'),
            (r'कोने|कौन\s+है', 'kaun hai'),
            (r'साकी', 'Saki'),
            (r'अक्कू', 'Akku'),
        ]
        res_text = text
        for pat, rep in devanagari_phrase_rules:
            res_text = re.sub(pat, rep, res_text)

        # Transliterate any remaining Devanagari characters
        res = []
        for char in res_text:
            res.append(cls.DEV_MAP.get(char, char))
        return "".join(res)

    def apply_vocabulary_corrections(self, text: str) -> str:
        """Applies learned personal vocabulary corrections, Devanagari transliteration, and Indian-accent phonetic normalization."""
        if not text:
            return ""

        # 1. Transliterate Devanagari script to Roman script if present
        corrected_text = self.devanagari_to_roman(text)

        # 2. Built-in phonetic corrections for common Indian-accent / Hinglish ASR misrecognitions
        phonetic_rules = [
            # Hinglish question openers
            (r'\b(?:ar\s+apra\s+men\s+apro|ar\s+apra\s+mein\s+apro|thoda\s+mirko|thoda\s+mero)\b', 'thoda mereko'),
            (r'\b(?:ekuka|ekooka|akkuka)\b', 'Akku ka'),
            (r'\b(?:pevre|peware|pewre|fevret|favret)\b', 'favourite'),
            (r'\b(?:phaur|pahor|pahaur|heero|heerow)\b', 'hero'),
            (r'\b(?:kone|kaunhe|kon\s+hai)\b', 'kaun hai'),
            
            # Work commitments / Tessell
            (r'\bvark\s+komitments?\b', 'work commitments'),
            (r'\bvark\s+commitments?\b', 'work commitments'),
            (r'\bwork\s+komitments?\b', 'work commitments'),
            (r'\bkomitments?\b', 'commitments'),
            (r'\bvark\b', 'work'),
            (r'\bmirko\b', 'mereko'),
            (r'\bbataasikte\s+hukya\b', 'bata sakte ho kya'),
            (r'\bbataasikte\b', 'bata sakte'),
            (r'\bhukya\b', 'ho kya'),
            (r'\bshaki\b', 'Saki'),
            (r'\bsakhi\b', 'Saki'),
            (r'\btesel\b', 'Tessell'),
            (r'\btessel\b', 'Tessell'),
            (r'\bpesant\s+nagar\b', 'Besant Nagar'),
            (r'\bvesant\s+nagar\b', 'Besant Nagar'),
        ]
        for pattern, replacement in phonetic_rules:
            corrected_text = re.sub(pattern, replacement, corrected_text, flags=re.IGNORECASE)

        # 3. Apply user-defined dynamic personal vocabulary
        try:
            from memories.models import PersonalVocabulary
            for vocab in PersonalVocabulary.objects.all():
                for mis in vocab.misrecognitions:
                    if mis and mis.lower() in corrected_text.lower():
                        pat = re.compile(re.escape(mis), re.IGNORECASE)
                        corrected_text = pat.sub(vocab.term, corrected_text)
        except Exception as e:
            logger.warning(f"Error applying vocabulary corrections: {e}")
            
        # Clean extra spaces
        corrected_text = re.sub(r'\s+', ' ', corrected_text).strip()
        return corrected_text

    def transcribe(self, audio_path: str, language: Optional[str] = None) -> Dict[str, Any]:
        """
        Transcribes the given audio file.
        Returns:
            { "text": str, "language": str, "probability": float, "duration": float }
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        self._load_model()

        # Build dynamic prompt hints purely in Roman alphabet to ensure Romanized Hinglish transcription
        prompt_terms = [
            "Saki", "Akku", "Saketh", "Akshatha", "favourite hero", "favourite actor",
            "favourite actress", "favourite movie", "favourite food", "vanilla ice cream",
            "sunset", "Besant Nagar", "Marina Beach", "Podi Dosa", "Tessell",
            "work commitments", "responsibilities", "deadlines", "thoda mereko batao",
            "mereko", "bata sakte ho kya", "kaun hai", "kya hai", "kaise hai"
        ]
        try:
            from memories.models import PersonalVocabulary
            vocab_terms = list(PersonalVocabulary.objects.values_list('term', flat=True))
            if vocab_terms:
                prompt_terms.extend(vocab_terms)
        except Exception:
            pass

        initial_prompt = ", ".join(list(dict.fromkeys(prompt_terms))) + "."

        # Default to 'en' for Indian English & Romanized Hinglish transcription unless explicitly set otherwise
        lang = language or getattr(settings, 'ASR_LANGUAGE', 'en')
        if lang in ('auto', 'all', '', None):
            lang = 'en'

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
