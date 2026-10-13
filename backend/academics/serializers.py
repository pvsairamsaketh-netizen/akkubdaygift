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


# ============================================================================
# PHD MODULE SERIALIZERS
# ============================================================================

from academics.models import (
    PhDUniversity,
    PhDProgramme,
    PhDSupervisor,
    PhDFundingOpportunity,
    PhDResearchArea,
    PhDUserShortlist,
    PhDUserApplication,
    PhDApplicationDocument,
    PhDUserProfile
)

class PhDResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhDResearchArea
        fields = '__all__'


class PhDSupervisorSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    university_short_name = serializers.CharField(source='university.short_name', read_only=True)
    country = serializers.CharField(source='university.country', read_only=True)

    class Meta:
        model = PhDSupervisor
        fields = [
            'id', 'university', 'university_name', 'university_short_name', 'country',
            'name', 'designation', 'department', 'lab_name', 'lab_url',
            'faculty_profile_url', 'email', 'research_interests',
            'recruitment_status', 'funded_positions_note', 'recent_publications',
            'verification_status', 'last_verified_at', 'created_at'
        ]


class PhDProgrammeSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    university_short_name = serializers.CharField(source='university.short_name', read_only=True)
    country = serializers.CharField(source='university.country', read_only=True)
    country_code = serializers.CharField(source='university.country_code', read_only=True)
    city = serializers.CharField(source='university.city', read_only=True)
    website_url = serializers.CharField(source='university.website_url', read_only=True)
    university_type = serializers.CharField(source='university.university_type', read_only=True)
    supervisors = PhDSupervisorSerializer(many=True, read_only=True)

    class Meta:
        model = PhDProgramme
        fields = '__all__'


class PhDUniversitySerializer(serializers.ModelSerializer):
    programmes_count = serializers.IntegerField(source='programmes.count', read_only=True)
    supervisors_count = serializers.IntegerField(source='supervisors.count', read_only=True)
    programmes = PhDProgrammeSerializer(many=True, read_only=True)

    class Meta:
        model = PhDUniversity
        fields = '__all__'


class PhDFundingOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PhDFundingOpportunity
        fields = '__all__'


class PhDUserShortlistSerializer(serializers.ModelSerializer):
    programme_details = PhDProgrammeSerializer(source='programme', read_only=True)
    university_details = PhDUniversitySerializer(source='university', read_only=True)
    supervisor_details = PhDSupervisorSerializer(source='supervisor', read_only=True)
    funding_details = PhDFundingOpportunitySerializer(source='funding', read_only=True)

    class Meta:
        model = PhDUserShortlist
        fields = '__all__'


class PhDApplicationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhDApplicationDocument
        fields = '__all__'


class PhDUserApplicationSerializer(serializers.ModelSerializer):
    programme_title = serializers.CharField(source='programme.title', read_only=True)
    university_name = serializers.CharField(source='programme.university.name', read_only=True)
    university_short_name = serializers.CharField(source='programme.university.short_name', read_only=True)
    country = serializers.CharField(source='programme.university.country', read_only=True)
    official_url = serializers.CharField(source='programme.official_url', read_only=True)
    application_portal_url = serializers.CharField(source='programme.application_portal_url', read_only=True)
    stipend_amount = serializers.CharField(source='programme.stipend_amount', read_only=True)
    documents = PhDApplicationDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = PhDUserApplication
        fields = '__all__'


class PhDUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhDUserProfile
        fields = '__all__'

