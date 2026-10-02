import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from voice.services.voice_pipeline import VoicePipeline
from voice.services.tts_service import TTSService
from voice.serializers import (
    TranscribeRequestSerializer,
    SpeakRequestSerializer,
    VoiceChatRequestSerializer
)

logger = logging.getLogger(__name__)

class VoiceTranscribeView(APIView):
    def post(self, request):
        serializer = TranscribeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file_obj = request.FILES.get('audio')
        language = serializer.validated_data.get('language')

        pipeline = VoicePipeline()
        try:
            result = pipeline.transcribe_audio(file_obj, language=language)
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Voice transcribe error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VoiceChatView(APIView):
    def post(self, request):
        serializer = VoiceChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file_obj = request.FILES.get('audio')
        conversation_id = serializer.validated_data.get('conversation_id')
        synthesize_voice = serializer.validated_data.get('synthesize_voice', True)
        voice_preset = serializer.validated_data.get('voice_preset')

        pipeline = VoicePipeline()
        try:
            result = pipeline.voice_chat(
                file_obj=file_obj,
                conversation_id=str(conversation_id) if conversation_id else None,
                synthesize_voice=synthesize_voice,
                voice_preset=voice_preset
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Voice chat error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VoiceSpeakView(APIView):
    def post(self, request):
        serializer = SpeakRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text = serializer.validated_data['text']
        voice = serializer.validated_data.get('voice')
        speed = serializer.validated_data.get('speed')

        tts = TTSService.get_instance()
        try:
            result = tts.synthesize_speech(text=text, voice=voice, speed=speed)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Voice speak error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VoiceStatusView(APIView):
    def get(self, request):
        return Response({
            "voice_enabled": getattr(settings, 'VOICE_ENABLED', True),
            "asr_provider": getattr(settings, 'ASR_PROVIDER', 'faster_whisper'),
            "asr_model": getattr(settings, 'ASR_MODEL', 'base'),
            "tts_provider": getattr(settings, 'TTS_PROVIDER', 'kokoro'),
            "tts_voice": getattr(settings, 'TTS_VOICE', 'af_heart'),
            "vad_enabled": getattr(settings, 'VOICE_VAD_ENABLED', False),
            "max_duration_seconds": getattr(settings, 'VOICE_MAX_DURATION_SECONDS', 60)
        })
