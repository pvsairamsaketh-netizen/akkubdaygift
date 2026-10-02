from django.urls import path
from documents.views import (
    DocumentListView,
    DocumentIngestView,
    DocumentStatusView,
    DocumentReindexView,
    DocumentDetailView
)

urlpatterns = [
    path('', DocumentListView.as_view(), name='document-list'),
    path('ingest/', DocumentIngestView.as_view(), name='document-ingest'),
    path('status/', DocumentStatusView.as_view(), name='document-status'),
    path('reindex/', DocumentReindexView.as_view(), name='document-reindex'),
    path('<uuid:doc_id>/', DocumentDetailView.as_view(), name='document-detail'),
]
