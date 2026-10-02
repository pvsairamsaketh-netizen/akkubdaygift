from rest_framework import serializers

class TranscribeRequestSerializer(serializers.Serializer):
    audio = serializers.FileField()
    language = serializers.CharField(required=False, default="auto", allow_blank=True)

class SpeakRequestSerializer(serializers.Serializer):
    text = serializers.CharField(required=True)
    voice = serializers.CharField(required=False, default="af_heart")
    speed = serializers.FloatField(required=False, default=1.0)

class VoiceChatRequestSerializer(serializers.Serializer):
    audio = serializers.FileField()
    conversation_id = serializers.UUIDField(required=False, allow_null=True)
    synthesize_voice = serializers.BooleanField(required=False, default=True)
    voice_preset = serializers.CharField(required=False, default="af_heart")
