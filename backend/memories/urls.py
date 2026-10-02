from django.urls import path
from memories.views import (
    PersonalMemoryListView,
    PersonalMemoryDetailView,
    PersonalMemoryClearView,
    PersonalVocabularyView,
    PersonalVocabularyDetailView,
    BirthdayConfigView
)

urlpatterns = [
    path('memories/', PersonalMemoryListView.as_view(), name='memory-list-create'),
    path('memories/<uuid:mem_id>/', PersonalMemoryDetailView.as_view(), name='memory-detail'),
    path('memories/clear/', PersonalMemoryClearView.as_view(), name='memory-clear'),
    path('vocabulary/', PersonalVocabularyView.as_view(), name='vocabulary-list-create'),
    path('vocabulary/<uuid:vocab_id>/', PersonalVocabularyDetailView.as_view(), name='vocabulary-detail'),
    path('birthday-config/', BirthdayConfigView.as_view(), name='birthday-config'),
    path('memories/birthday-config/', BirthdayConfigView.as_view(), name='memories-birthday-config'),
    path('memories/vocabulary/', PersonalVocabularyView.as_view(), name='memories-vocabulary-list-create'),
    path('memories/vocabulary/<uuid:vocab_id>/', PersonalVocabularyDetailView.as_view(), name='memories-vocabulary-detail'),
]
