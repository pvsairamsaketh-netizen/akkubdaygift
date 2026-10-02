from rest_framework import serializers
from memories.models import PersonalMemory, PersonalVocabulary, BirthdayConfig

class PersonalMemorySerializer(serializers.ModelSerializer):
    timestamp_formatted = serializers.SerializerMethodField()

    class Meta:
        model = PersonalMemory
        fields = [
            'id', 'memory_text', 'original_input', 'category', 'subject',
            'source', 'confidence', 'event_date', 'conversation_timestamp',
            'timestamp_formatted', 'is_active', 'metadata'
        ]

    def get_timestamp_formatted(self, obj):
        return obj.conversation_timestamp.strftime("%b %d, %Y - %I:%M %p")


class PersonalVocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalVocabulary
        fields = ['id', 'term', 'misrecognitions', 'category', 'times_used', 'created_at']


class BirthdayConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirthdayConfig
        fields = [
            'creator_name', 'recipient_name', 'greeting_title',
            'love_letter', 'surprise_message', 'birthday_date',
            'background_music_enabled', 'theme', 'updated_at'
        ]
