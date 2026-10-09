"""
Django settings for Saki & Akku Relationship Assistant.
Personalized Birthday Gift for Akku (Akshatha) & Saki (Saketh)
"""

import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-saki-akku-birthday-celebration-key-2026')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,0.0.0.0,pvsairamsaketh.in,.pvsairamsaketh.in,*').split(',') if host.strip()]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    
    # Project apps
    'documents.apps.DocumentsConfig',
    'chat.apps.ChatConfig',
    'voice.apps.VoiceConfig',
    'memories.apps.MemoriesConfig',
    'academics.apps.AcademicsConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
    'UNAUTHENTICATED_USER': None,
}

# CORS configuration
CORS_ALLOW_ALL_ORIGINS = True  # For local development convenience
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000'
    ).split(',') if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True
from corsheaders.defaults import default_headers
CORS_ALLOW_HEADERS = list(default_headers) + [
    'x-user-id',
    'X-User-ID',
    'x-user-id'.lower(),
]

# --- Saki & Akku AI Assistant & RAG Settings ---

# Ollama LLM - Low Latency High-Speed Config
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', os.getenv('LLM_MODEL', 'qwen3.8:8b'))
LLM_MODEL = os.getenv('LLM_MODEL', os.getenv('OLLAMA_MODEL', 'qwen3.8:8b'))
OLLAMA_NUM_CTX = int(os.getenv('OLLAMA_NUM_CTX', '2048'))  # Context window for thorough retrieval
OLLAMA_TEMPERATURE = float(os.getenv('OLLAMA_TEMPERATURE', '0.3'))
OLLAMA_TOP_P = float(os.getenv('OLLAMA_TOP_P', '0.9'))
OLLAMA_MAX_TOKENS = int(os.getenv('OLLAMA_MAX_TOKENS', '600'))  # Ample tokens for rich, detailed answers
OLLAMA_KEEP_ALIVE = os.getenv('OLLAMA_KEEP_ALIVE', '60m')  # Keep model warm in RAM

# Gemini Translation & Multilingual Model Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', os.getenv('GOOGLE_API_KEY', ''))
GEMINI_TRANSLATION_MODEL = os.getenv('GEMINI_TRANSLATION_MODEL', 'gemini-1.5-flash')

# Embeddings & ChromaDB
EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'BAAI/bge-small-en-v1.5')
CHROMA_PERSIST_DIRECTORY = str(BASE_DIR / os.getenv('CHROMA_PERSIST_DIRECTORY', 'data/chroma'))
CHROMA_COLLECTION_NAME = 'saki_akku_memories'
CHROMA_MEMORIES_COLLECTION_NAME = 'akku_personal_memories'

# High-Speed RAG Retrieval Settings (TOP_K = 2, max 3)
RAG_TOP_K = int(os.getenv('RAG_TOP_K', '2'))
RAG_MIN_RELEVANCE = float(os.getenv('RAG_MIN_RELEVANCE', '0.25'))
RELEVANCE_THRESHOLD = float(os.getenv('RELEVANCE_THRESHOLD', '0.70'))  # Strict grounding relevance threshold
RAG_CHUNK_SIZE = int(os.getenv('RAG_CHUNK_SIZE', '800'))
RAG_CHUNK_OVERLAP = int(os.getenv('RAG_CHUNK_OVERLAP', '100'))
MAX_CONTEXT_TOKENS = int(os.getenv('MAX_CONTEXT_TOKENS', '1536'))

# Voice Settings
VOICE_ENABLED = os.getenv('VOICE_ENABLED', 'true').lower() in ('true', '1', 't')
ASR_PROVIDER = os.getenv('ASR_PROVIDER', 'faster_whisper')
ASR_MODEL = os.getenv('ASR_MODEL', 'small')
ASR_LANGUAGE = os.getenv('ASR_LANGUAGE', 'en')
ASR_DEVICE = os.getenv('ASR_DEVICE', 'auto')
TTS_PROVIDER = os.getenv('TTS_PROVIDER', 'kokoro')
TTS_FALLBACK = os.getenv('TTS_FALLBACK', 'edge_tts')
TTS_VOICE = os.getenv('TTS_VOICE', 'af_heart')
TTS_SPEED = float(os.getenv('TTS_SPEED', '1.0'))
VOICE_MAX_DURATION_SECONDS = int(os.getenv('VOICE_MAX_DURATION_SECONDS', '60'))
VOICE_MAX_UPLOAD_MB = int(os.getenv('VOICE_MAX_UPLOAD_MB', '15'))
VOICE_RETAIN_AUDIO = os.getenv('VOICE_RETAIN_AUDIO', 'false').lower() in ('true', '1', 't')
VOICE_VAD_ENABLED = os.getenv('VOICE_VAD_ENABLED', 'false').lower() in ('true', '1', 't')

# Ensure required media and data directories exist
os.makedirs(CHROMA_PERSIST_DIRECTORY, exist_ok=True)
os.makedirs(MEDIA_ROOT, exist_ok=True)
os.makedirs(MEDIA_ROOT / 'temp_audio', exist_ok=True)
os.makedirs(MEDIA_ROOT / 'tts_audio', exist_ok=True)
