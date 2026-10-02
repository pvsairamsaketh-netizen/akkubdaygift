from rest_framework import serializers
from academics.models import AcademicNote, AcademicProgress, SQLQueryHistory

class AcademicNoteSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = AcademicNote
        fields = [
            'id', 'user_id', 'day_number', 'topic_id', 'title', 'content',
            'category', 'tags', 'is_pinned', 'created_at', 'updated_at', 'formatted_date'
        ]

    def get_formatted_date(self, obj):
        return obj.updated_at.strftime("%b %d, %Y • %I:%M %p")


class AcademicProgressSerializer(serializers.ModelSerializer):
    completion_percentage = serializers.SerializerMethodField()

    class Meta:
        model = AcademicProgress
        fields = [
            'id', 'user_id', 'completed_days', 'day_status', 'quiz_scores',
            'coding_submissions', 'saved_cheat_sheets', 'bookmarks',
            'revision_items', 'capstone_progress', 'streak_count',
            'last_active_date', 'updated_at', 'completion_percentage'
        ]

    def get_completion_percentage(self, obj):
        return round((len(obj.completed_days) / 100) * 100, 1)


class SQLQueryHistorySerializer(serializers.ModelSerializer):
    formatted_time = serializers.SerializerMethodField()

    class Meta:
        model = SQLQueryHistory
        fields = ['id', 'user_id', 'query', 'status', 'execution_time_ms', 'row_count', 'created_at', 'formatted_time']

    def get_formatted_time(self, obj):
        return obj.created_at.strftime("%I:%M:%S %p")
