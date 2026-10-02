"""
Voice Pipeline Orchestrator.
Connects Audio Upload -> Whisper ASR -> RAG Pipeline -> TTS Synthesis.
Ensures temporary audio files are safely cleaned up.
"""

import os
import uuid
import logging
from typing import Dict, Any, Optional
from django.conf import settings
from voice.services.audio_validation import AudioValidator
from voice.services.asr_service import ASRService
from voice.services.tts_service import TTSService
from chat.services.rag_service import RAGService

logger = logging.getLogger(__name__)

class VoicePipeline:
    def __init__(self):
        self.validator = AudioValidator()
        self.asr_service = ASRService.get_instance()
        self.tts_service = TTSService.get_instance()
        self.rag_service = RAGService()
        self.temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp_audio')
        os.makedirs(self.temp_dir, exist_ok=True)

    def save_temp_audio(self, file_obj) -> str:
        """Saves uploaded audio file temporarily."""
        ext = os.path.splitext(file_obj.name)[1] or '.webm'
        filename = f"rec_{uuid.uuid4().hex[:12]}{ext}"
        filepath = os.path.join(self.temp_dir, filename)
        with open(filepath, 'wb+') as f:
            for chunk in file_obj.chunks():
                f.write(chunk)
        return filepath

    def transcribe_audio(self, file_obj, language: Optional[str] = None) -> Dict[str, Any]:
        """
        Validates audio, transcribes it, and cleans up the temporary file.
        """
        is_valid, err = self.validator.validate_file(file_obj)
        if not is_valid:
            raise ValueError(err)

        temp_path = self.save_temp_audio(file_obj)
        try:
            result = self.asr_service.transcribe(temp_path, language=language)
            return result
        finally:
            if not getattr(settings, 'VOICE_RETAIN_AUDIO', False) and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception as e:
                    logger.warning(f"Could not remove temp audio file {temp_path}: {e}")

    def voice_chat(
        self,
        file_obj,
        conversation_id: Optional[str] = None,
        synthesize_voice: bool = True,
        voice_preset: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes end-to-end Voice Chat:
        1. Transcribe audio to user question.
        2. Execute grounded RAG pipeline.
        3. Optionally synthesize spoken audio answer.
        """
        # 1. Transcribe
        transcribe_result = self.transcribe_audio(file_obj)
        transcript = transcribe_result.get("text", "").strip()

        if not transcript:
            return {
                "error": "No speech could be recognized from the recording.",
                "transcript": "",
                "answer": "I couldn't hear any speech clearly. Could you please try again or type your question?",
                "citations": [],
                "audio_url": None
            }

        # 2. Run existing RAG pipeline
        rag_result = self.rag_service.answer_question(
            question=transcript,
            conversation_id=conversation_id
        )

        # 3. Text to speech
        audio_info = None
        if synthesize_voice and rag_result.get("answer"):
            try:
                audio_info = self.tts_service.synthesize_speech(
                    text=rag_result["answer"],
                    voice=voice_preset
                )
            except Exception as e:
                logger.error(f"TTS synthesis failed during voice chat: {e}")
                audio_info = {"error": str(e), "audio_url": None}

        return {
            "conversation_id": rag_result["conversation_id"],
            "user_message_id": rag_result["user_message_id"],
            "assistant_message_id": rag_result["assistant_message_id"],
            "transcript": transcript,
            "detected_language": transcribe_result.get("language"),
            "question": transcript,
            "answer": rag_result["answer"],
            "citations": rag_result["citations"],
            "latency": rag_result["latency"],
            "audio": audio_info
        }
