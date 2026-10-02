"""
URL configuration for Saki & Akku Relationship Assistant.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    """System health check endpoint."""
    return Response({
        "status": "healthy",
        "app": "Saki & Akku Relationship AI Assistant",
        "version": "1.0.0",
        "models": {
            "llm": settings.OLLAMA_MODEL,
            "embedding": settings.EMBEDDING_MODEL,
            "asr": settings.ASR_MODEL if settings.VOICE_ENABLED else "disabled",
            "tts": settings.TTS_PROVIDER if settings.VOICE_ENABLED else "disabled"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/documents/', include('documents.urls')),
    path('api/', include('chat.urls')),
    path('api/voice/', include('voice.urls')),
    path('api/', include('memories.urls')),
    path('api/academics/', include('academics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
