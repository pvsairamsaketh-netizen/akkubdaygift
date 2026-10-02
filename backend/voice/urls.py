from django.urls import path
from voice.views import (
    VoiceTranscribeView,
    VoiceChatView,
    VoiceSpeakView,
    VoiceStatusView
)

urlpatterns = [
    path('transcribe/', VoiceTranscribeView.as_view(), name='voice-transcribe'),
    path('chat/', VoiceChatView.as_view(), name='voice-chat'),
    path('speak/', VoiceSpeakView.as_view(), name='voice-speak'),
    path('status/', VoiceStatusView.as_view(), name='voice-status'),
]
