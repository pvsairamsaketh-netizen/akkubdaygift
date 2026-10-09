import { useState, useRef, useEffect, useCallback } from 'react';
import { AudioRecorder } from '../services/audio';
import { api } from '../services/api';

export function useVoice(onTranscriptionConfirmed?: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionPreview, setTranscriptionPreview] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setVoiceError(null);
      setTranscriptionPreview(null);
      await recorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setVoiceError(err.message || "Failed to start recording. Please grant microphone access.");
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    try {
      setIsTranscribing(true);
      const audioBlob = await recorderRef.current.stop();
      
      const storedLang = localStorage.getItem('akku_asr_language') || 'en';
      const res = await api.transcribeAudio(audioBlob, storedLang);
      if (res.text) {
        setTranscriptionPreview(res.text);
      } else {
        setVoiceError("No speech detected. Please try speaking again.");
      }
    } catch (err: any) {
      setVoiceError(err.message || "Transcription failed.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
    recorderRef.current.cancel();
  };

  const confirmTranscription = (editedText?: string) => {
    const textToSend = (editedText ?? transcriptionPreview ?? "").trim();
    if (textToSend && onTranscriptionConfirmed) {
      onTranscriptionConfirmed(textToSend);
    }
    setTranscriptionPreview(null);
  };

  const discardTranscription = () => {
    setTranscriptionPreview(null);
  };

  const playAudio = useCallback((url: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const fullUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
    const audio = new Audio(fullUrl);
    audioPlayerRef.current = audio;
    setCurrentAudioUrl(fullUrl);
    setIsPlayingAudio(true);

    audio.onended = () => {
      setIsPlayingAudio(false);
    };

    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      setIsPlayingAudio(false);
      setVoiceError("Unable to play spoken audio response.");
    };

    audio.play().catch(e => {
      console.warn("Audio play prevented:", e);
      setIsPlayingAudio(false);
    });
  }, []);

  const pauseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  const replayAudio = () => {
    if (currentAudioUrl) {
      playAudio(currentAudioUrl);
    }
  };

  return {
    isRecording,
    recordingSeconds,
    isTranscribing,
    transcriptionPreview,
    setTranscriptionPreview,
    voiceError,
    setVoiceError,
    autoSpeak,
    setAutoSpeak,
    isPlayingAudio,
    currentAudioUrl,
    startRecording,
    stopRecording,
    cancelRecording,
    confirmTranscription,
    discardTranscription,
    playAudio,
    pauseAudio,
    stopAudio,
    replayAudio
  };
}
