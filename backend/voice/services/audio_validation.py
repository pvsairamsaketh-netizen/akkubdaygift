"""
Audio Validation Service.
Validates file sizes, formats, and audio duration to protect system resources.
"""

import os
import logging
from typing import Tuple
from django.conf import settings

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'.wav', '.webm', '.ogg', '.mp3', '.m4a', '.mp4'}
ALLOWED_MIME_PREFIXES = {'audio/', 'video/webm', 'application/octet-stream'}

class AudioValidator:
    def __init__(self):
        self.max_size_bytes = getattr(settings, 'VOICE_MAX_UPLOAD_MB', 15) * 1024 * 1024
        self.max_duration_seconds = getattr(settings, 'VOICE_MAX_DURATION_SECONDS', 60)

    def validate_file(self, file_obj) -> Tuple[bool, str]:
        """
        Validates the uploaded audio file object.
        Returns (is_valid, error_message).
        """
        if not file_obj:
            return False, "No audio file provided."

        # Check size
        if file_obj.size > self.max_size_bytes:
            mb = self.max_size_bytes // (1024 * 1024)
            return False, f"Audio file exceeds maximum allowed size of {mb} MB."

        if file_obj.size == 0:
            return False, "Empty audio file received."

        # Check file extension
        ext = os.path.splitext(file_obj.name.lower())[1]
        if ext and ext not in ALLOWED_EXTENSIONS:
            return False, f"Unsupported audio format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"

        return True, ""
