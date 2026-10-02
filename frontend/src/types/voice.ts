export interface VoiceStatus {
  voice_enabled: boolean;
  asr_provider: string;
  asr_model: string;
  tts_provider: string;
  tts_voice: string;
  vad_enabled: boolean;
  max_duration_seconds: number;
}

export interface VoiceChatResponse {
  conversation_id: string;
  user_message_id: string;
  assistant_message_id: string;
  transcript: string;
  detected_language?: string;
  question: string;
  answer: string;
  citations: any[];
  latency: number;
  audio?: {
    audio_url: string;
    duration_seconds?: number;
    voice?: string;
    format?: string;
  };
  error?: string;
}
