from django.urls import path
from academics.views import (
    SQLExecuteView,
    SQLSchemaView,
    SQLResetView,
    SQLHistoryView,
    CodeRunnerView,
    NotesListView,
    NotesDetailView,
    ProgressView
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
]
