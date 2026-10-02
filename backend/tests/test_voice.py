import os
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from voice.services.audio_validation import AudioValidator
from voice.services.tts_service import TTSService
from voice.services.asr_service import ASRService

def test_audio_validator_rejection():
    validator = AudioValidator()
    # Empty file
    empty_file = SimpleUploadedFile("test.wav", b"", content_type="audio/wav")
    valid, err = validator.validate_file(empty_file)
    assert not valid
    assert "Empty" in err

    # Unsupported format
    txt_file = SimpleUploadedFile("test.txt", b"hello world", content_type="text/plain")
    valid, err = validator.validate_file(txt_file)
    assert not valid
    assert "Unsupported" in err

def test_audio_validator_acceptance():
    validator = AudioValidator()
    audio_file = SimpleUploadedFile("test.wav", b"RIFF....WAVEfmt ....data....", content_type="audio/wav")
    valid, err = validator.validate_file(audio_file)
    assert valid
    assert err == ""

def test_tts_service_synthesis():
    tts = TTSService.get_instance()
    result = tts.synthesize_speech("Akku, you are the most special part of this story.")
    assert "audio_url" in result
    assert "audio_path" in result
    assert os.path.exists(result["audio_path"])
    assert os.path.getsize(result["audio_path"]) > 1000

def test_asr_service_transcription():
    # Generate audio first
    tts = TTSService.get_instance()
    synth = tts.synthesize_speech("Akku and Saki college days.")
    audio_path = synth["audio_path"]

    asr = ASRService.get_instance()
    trans = asr.transcribe(audio_path)
    assert "text" in trans
    assert len(trans["text"]) > 0
    assert "language" in trans
