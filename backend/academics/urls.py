from django.urls import path
from academics.views import (
    SQLExecuteView,
    SQLSchemaView,
    SQLResetView,
    SQLHistoryView,
    CodeRunnerView,
    NotesListView,
    NotesDetailView,
    ProgressView,
    AcademicTutorView
)
from academics.phd_views import (
    PhDStatsView,
    PhDUniversitiesListView,
    PhDUniversityDetailView,
    PhDProgrammesListView,
    PhDProgrammeDetailView,
    PhDResearchAreasListView,
    PhDSupervisorsListView,
    PhDFundingOpportunitiesListView,
    PhDDeadlinesCalendarView,
    PhDCompareView,
    PhDEligibilityAssessmentView,
    PhDShortlistListView,
    PhDShortlistDetailView,
    PhDShortlistExportCSVView,
    PhDApplicationsListView,
    PhDApplicationDetailView,
    PhDApplicationDocumentToggleView,
    PhDUserProfileView,
    PhDAISearchAdvisorView,
    PhDExportDataView
)

urlpatterns = [
    # SQL Playground
    path('sql/execute/', SQLExecuteView.as_view(), name='academics_sql_execute'),
    path('sql/schema/', SQLSchemaView.as_view(), name='academics_sql_schema'),
    path('sql/reset/', SQLResetView.as_view(), name='academics_sql_reset'),
    path('sql/history/', SQLHistoryView.as_view(), name='academics_sql_history'),

    # Code Runner
    path('code/run/', CodeRunnerView.as_view(), name='academics_code_run'),

    # Personal Notes
    path('notes/', NotesListView.as_view(), name='academics_notes_list'),
    path('notes/<uuid:note_id>/', NotesDetailView.as_view(), name='academics_notes_detail'),

    # Academic Progress
    path('progress/', ProgressView.as_view(), name='academics_progress'),

    # Academic AI Tutor
    path('tutor/', AcademicTutorView.as_view(), name='academics_tutor'),

    # =========================================================================
    # PHD OPTIONS IN INDIA & ABROAD ENDPOINTS (PHASE 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 20)
    # =========================================================================
    path('phd/stats/', PhDStatsView.as_view(), name='phd_stats'),
    path('phd/universities/', PhDUniversitiesListView.as_view(), name='phd_universities_list'),
    path('phd/universities/<uuid:uni_id>/', PhDUniversityDetailView.as_view(), name='phd_university_detail'),
    path('phd/programmes/', PhDProgrammesListView.as_view(), name='phd_programmes_list'),
    path('phd/programmes/<uuid:prog_id>/', PhDProgrammeDetailView.as_view(), name='phd_programme_detail'),
    path('phd/research-areas/', PhDResearchAreasListView.as_view(), name='phd_research_areas'),
    path('phd/supervisors/', PhDSupervisorsListView.as_view(), name='phd_supervisors'),
    path('phd/funding/', PhDFundingOpportunitiesListView.as_view(), name='phd_funding'),
    path('phd/deadlines/', PhDDeadlinesCalendarView.as_view(), name='phd_deadlines'),
    path('phd/compare/', PhDCompareView.as_view(), name='phd_compare'),
    path('phd/eligibility/', PhDEligibilityAssessmentView.as_view(), name='phd_eligibility'),
    path('phd/shortlist/', PhDShortlistListView.as_view(), name='phd_shortlist_list'),
    path('phd/shortlist/<uuid:item_id>/', PhDShortlistDetailView.as_view(), name='phd_shortlist_detail'),
    path('phd/shortlist/export/', PhDShortlistExportCSVView.as_view(), name='phd_shortlist_export'),
    path('phd/applications/', PhDApplicationsListView.as_view(), name='phd_applications_list'),
    path('phd/applications/<uuid:app_id>/', PhDApplicationDetailView.as_view(), name='phd_application_detail'),
    path('phd/documents/<uuid:doc_id>/', PhDApplicationDocumentToggleView.as_view(), name='phd_document_toggle'),
    path('phd/profile/', PhDUserProfileView.as_view(), name='phd_user_profile'),
    path('phd/ai-search/', PhDAISearchAdvisorView.as_view(), name='phd_ai_search'),
    path('phd/export/', PhDExportDataView.as_view(), name='phd_export'),
]
