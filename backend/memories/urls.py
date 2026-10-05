from django.urls import path
from memories.views import (
    PersonalMemoryListView,
    PersonalMemoryDetailView,
    PersonalMemoryClearView,
    MemorySearchView,
    MemoryStatsView,
    MemoryReindexView,
    MemoryDetectView,
    PersonalVocabularyView,
    PersonalVocabularyDetailView,
    BirthdayConfigView
)

urlpatterns = [
    path('memories/', PersonalMemoryListView.as_view(), name='memory-list-create'),
    path('memories/search/', MemorySearchView.as_view(), name='memory-search'),
    path('memories/stats/', MemoryStatsView.as_view(), name='memory-stats'),
    path('memories/reindex/', MemoryReindexView.as_view(), name='memory-reindex'),
    path('memories/detect/', MemoryDetectView.as_view(), name='memory-detect'),
    path('memories/<uuid:mem_id>/', PersonalMemoryDetailView.as_view(), name='memory-detail'),
    path('memories/clear/', PersonalMemoryClearView.as_view(), name='memory-clear'),
    path('vocabulary/', PersonalVocabularyView.as_view(), name='vocabulary-list-create'),
    path('vocabulary/<uuid:vocab_id>/', PersonalVocabularyDetailView.as_view(), name='vocabulary-detail'),
    path('birthday-config/', BirthdayConfigView.as_view(), name='birthday-config'),
    path('memories/birthday-config/', BirthdayConfigView.as_view(), name='memories-birthday-config'),
    path('memories/vocabulary/', PersonalVocabularyView.as_view(), name='memories-vocabulary-list-create'),
    path('memories/vocabulary/<uuid:vocab_id>/', PersonalVocabularyDetailView.as_view(), name='memories-vocabulary-detail'),
]
