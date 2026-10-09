/**
 * Siri-like "Hey Akku" Continuous Wake-Word & Multilingual Voice Assistant Service.
 * 
 * Features:
 * - Hands-free continuous "Hey Akku" detection in any browser supporting Web Speech API.
 * - Automatic multilingual recognition (Tamil, Telugu, Hindi, Tanglish, Teluglish, English, etc.).
 * - Short affectionate wake-word acknowledgement ("Yes Saki? ❤️").
 * - Instant Barge-In / Interruption (speaking stops when user starts talking).
 * - Conversational follow-up session (no need to repeat "Hey Akku" for continuous dialog).
 * - Fallback to global hotkey (Cmd/Ctrl + Shift + A) and manual microphone activation.
 */

import { api } from './api';

export type AssistantVoiceState =
  | 'OFF'
  | 'IDLE'                 // Listening for "Hey Akku"
  | 'WAKE_WORD_DETECTED'   // Detected wake word, acknowledging
  | 'LISTENING'            // Actively listening to Saki's question
  | 'PROCESSING'           // Thinking & retrieving memories via RAG
  | 'SPEAKING'             // Akku is speaking aloud
  | 'ERROR';

export interface WakeWordServiceCallbacks {
  onStateChange: (state: AssistantVoiceState) => void;
  onTranscriptChange: (text: string, isFinal: boolean) => void;
  onQuestionCaptured: (question: string) => void;
  onError: (message: string) => void;
}

const WAKE_WORD_PATTERNS = [
  /\bhey\s+akku\b/i,
  /\bhi\s+akku\b/i,
  /\bhello\s+akku\b/i,
  /\bok\s+akku\b/i,
  /\bey\s+akku\b/i,
  /\bhey\s+aku\b/i,
  /\bhey\s+akk\b/i,
  /\bnamaste\s+akku\b/i,
  /\bvanakkam\s+akku\b/i,
  /\bnamaskaram\s+akku\b/i,
  /^akku\b/i,
  /ஹே\s*அக்கு/i,
  /வணக்கம்\s*அக்கு/i,
  /హే\s*అక్కు/i,
  /నమస్కారం\s*అక్కు/i,
  /हे\s*अक्कू/i,
  /नमस्ते\s*अक्कू/i
];

const ACKNOWLEDGEMENTS = [
  "Yes Saki? ❤️",
  "I'm listening, Saki. ❤️",
  "Yes, Saki? ❤️",
  "I'm here, tell me. ❤️"
];

export class WakeWordAssistantService {
  private static instance: WakeWordAssistantService | null = null;
  private state: AssistantVoiceState = 'OFF';
  private callbacks: WakeWordServiceCallbacks | null = null;

  // Speech Recognition
  private recognition: any = null;
  private isContinuousRunning: boolean = false;
  private shouldRestartRecognition: boolean = false;
  private capturedQuestion: string = '';
  private silenceTimer: any = null;
  private followUpTimer: any = null;
  private activeTTSAudio: HTMLAudioElement | null = null;
  private lastSpokenText: string = '';
  private currentlySpeakingWords: Set<string> = new Set();

  private constructor() {
    this.setupGlobalHotkey();
  }

  public static getInstance(): WakeWordAssistantService {
    if (!WakeWordAssistantService.instance) {
      WakeWordAssistantService.instance = new WakeWordAssistantService();
    }
    return WakeWordAssistantService.instance;
  }

  public setCallbacks(callbacks: WakeWordServiceCallbacks) {
    this.callbacks = callbacks;
  }

  public getState(): AssistantVoiceState {
    return this.state;
  }

  private setState(newState: AssistantVoiceState) {
    this.state = newState;
    if (this.callbacks) {
      this.callbacks.onStateChange(newState);
    }
  }

  private setupGlobalHotkey() {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + A
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        this.triggerManualActivation();
      }
    });
  }

  /**
   * Initializes Web Speech API Recognition
   */
  private initRecognition(): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API not supported in this browser.");
      return false;
    }

    if (this.recognition) return true;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      // Allow multi-language recognition (starts with browser default / en-IN for Indian phonetics)
      const navLang = navigator.language || 'en-IN';
      this.recognition.lang = navLang;

      this.recognition.onstart = () => {
        this.isContinuousRunning = true;
      };

      this.recognition.onresult = (event: any) => {
        this.handleRecognitionResult(event);
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          // Normal background silence, continue listening
          return;
        }
        if (event.error === 'not-allowed') {
          this.setState('ERROR');
          this.callbacks?.onError("Microphone access was denied. Please allow microphone permissions in your browser.");
          this.shouldRestartRecognition = false;
          return;
        }
        console.warn("Speech recognition notice:", event.error);
      };

      this.recognition.onend = () => {
        this.isContinuousRunning = false;
        // Auto-restart if we should still be running
        if (this.shouldRestartRecognition) {
          setTimeout(() => {
            try {
              if (this.shouldRestartRecognition && !this.isContinuousRunning) {
                this.recognition.start();
              }
            } catch (err) {
              // Ignore if already started
            }
          }, 300);
        }
      };

      return true;
    } catch (e: any) {
      console.error("Failed to initialize SpeechRecognition:", e);
      return false;
    }
  }

  /**
   * Starts hands-free continuous "Hey Akku" listening
   */
  public async startHandsFree(): Promise<boolean> {
    const initialized = this.initRecognition();
    if (!initialized) {
      this.setState('ERROR');
      this.callbacks?.onError("Your browser does not support continuous voice detection. You can click the microphone button instead.");
      return false;
    }

    try {
      this.shouldRestartRecognition = true;
      this.setState('IDLE');
      if (!this.isContinuousRunning) {
        this.recognition.start();
      }
      return true;
    } catch (err: any) {
      console.warn("Could not start recognition:", err);
      return false;
    }
  }

  /**
   * Stops hands-free listening
   */
  public stopHandsFree() {
    this.shouldRestartRecognition = false;
    this.clearTimers();
    this.stopSpeaking();
    if (this.recognition && this.isContinuousRunning) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
    }
    this.setState('OFF');
  }

  /**
   * Triggers manual listen mode (bypasses "Hey Akku" wake word)
   */
  public triggerManualActivation() {
    this.stopSpeaking();
    this.clearTimers();
    this.initRecognition();
    this.capturedQuestion = '';

    this.playWakeWordAcknowledgement(() => {
      this.setState('LISTENING');
      this.startSilenceDetection();
    });
  }

  /**
   * Interruption / Barge-in: stops any currently playing spoken response immediately
   */
  public stopSpeaking() {
    if (this.activeTTSAudio) {
      this.activeTTSAudio.pause();
      this.activeTTSAudio.currentTime = 0;
      this.activeTTSAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.state === 'SPEAKING') {
      this.setState('IDLE');
    }
  }

  /**
   * Speaks Akku's answer aloud with automatic language and barge-in support
   */
  public async speakAnswer(text: string): Promise<void> {
    if (!text || !text.trim()) {
      this.startFollowUpWindow();
      return;
    }

    this.stopSpeaking();
    this.setState('SPEAKING');
    this.lastSpokenText = text;

    // Clean text for speech: remove Markdown symbols, emojis, citation brackets
    const cleanSpokenText = text
      .replace(/\[\^?.*?\]/g, '')
      .replace(/[*_#`~>]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    this.currentlySpeakingWords = new Set(
      cleanSpokenText.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );

    try {
      // 1. Fetch high-quality neural TTS from backend
      const res = await api.speakText(cleanSpokenText);
      if (res?.audio_url) {
        const fullUrl = res.audio_url.startsWith('http')
          ? res.audio_url
          : `${window.location.origin}${res.audio_url}`;

        const audio = new Audio(fullUrl);
        this.activeTTSAudio = audio;

        audio.onended = () => {
          this.activeTTSAudio = null;
          this.startFollowUpWindow();
        };

        audio.onerror = () => {
          console.warn("Backend TTS playback failed, falling back to browser synthesis.");
          this.fallbackBrowserSpeech(cleanSpokenText);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("TTS API request error:", err);
    }

    // 2. Fallback to Web Speech Synthesis API
    this.fallbackBrowserSpeech(cleanSpokenText);
  }

  private fallbackBrowserSpeech(cleanText: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.startFollowUpWindow();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const isHindi = /[\u0900-\u097F]/.test(cleanText);
    const isTamil = /[\u0B80-\u0BFF]/.test(cleanText);
    const isTelugu = /[\u0C00-\u0C7F]/.test(cleanText);

    let matchedVoice = null;
    if (isHindi) matchedVoice = voices.find(v => v.lang.startsWith('hi'));
    else if (isTamil) matchedVoice = voices.find(v => v.lang.startsWith('ta'));
    else if (isTelugu) matchedVoice = voices.find(v => v.lang.startsWith('te'));
    else matchedVoice = voices.find(v => v.lang.startsWith('en-IN')) || voices.find(v => v.lang.startsWith('en'));

    if (matchedVoice) utterance.voice = matchedVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Gentle sweet warm tone

    utterance.onend = () => {
      this.startFollowUpWindow();
    };

    utterance.onerror = () => {
      this.startFollowUpWindow();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Conversational follow-up session:
   * Keeps listening for 8-10 seconds so Saki can ask follow-ups without repeating "Hey Akku".
   */
  private startFollowUpWindow() {
    this.setState('LISTENING');
    this.capturedQuestion = '';
    this.clearTimers();

    this.followUpTimer = setTimeout(() => {
      if (this.state === 'LISTENING') {
        this.setState('IDLE');
      }
    }, 9000); // 9 seconds follow-up window
  }

  private clearTimers() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.followUpTimer) {
      clearTimeout(this.followUpTimer);
      this.followUpTimer = null;
    }
  }

  /**
   * Handles SpeechRecognition result events
   */
  private handleRecognitionResult(event: any) {
    let latestTranscript = '';
    let isFinal = false;

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const res = event.results[i];
      const text = res[0].transcript;
      latestTranscript += text;
      if (res.isFinal) {
        isFinal = true;
      }
    }

    const trimmed = latestTranscript.trim();
    if (!trimmed) return;

    // 1. If Akku is speaking, check for acoustic echo vs genuine user barge-in
    if (this.state === 'SPEAKING') {
      const words = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      if (words.length > 0 && this.currentlySpeakingWords.size > 0) {
        const overlap = words.filter(w => this.currentlySpeakingWords.has(w)).length;
        if (overlap / words.length >= 0.5) {
          // Audio feedback from assistant's own speaker output into mic - ignore
          return;
        }
      }
      this.stopSpeaking();
      this.setState('LISTENING');
      this.capturedQuestion = trimmed;
      this.startSilenceDetection();
      return;
    }

    // 2. If IDLE, check for Wake Word
    if (this.state === 'IDLE' || this.state === 'OFF') {
      const hasWakeWord = WAKE_WORD_PATTERNS.some(p => p.test(trimmed));
      if (hasWakeWord) {
        this.handleWakeWordTriggered(trimmed);
      }
      return;
    }

    // 3. If in LISTENING state, capture Saki's question
    if (this.state === 'LISTENING') {
      // Strip initial "Hey Akku" if present in the same utterance
      let cleanQuestion = trimmed;
      for (const pattern of WAKE_WORD_PATTERNS) {
        cleanQuestion = cleanQuestion.replace(pattern, '').trim();
      }

      this.capturedQuestion = cleanQuestion;
      this.callbacks?.onTranscriptChange(this.capturedQuestion, isFinal);

      // Reset and trigger silence detection
      this.startSilenceDetection();
    }
  }

  private handleWakeWordTriggered(rawUtterance: string) {
    this.setState('WAKE_WORD_DETECTED');
    this.clearTimers();

    // Check if question was asked in the same sentence (e.g. "Hey Akku where did we meet?")
    let remainder = rawUtterance;
    for (const pattern of WAKE_WORD_PATTERNS) {
      remainder = remainder.replace(pattern, '').trim();
    }

    this.playWakeWordAcknowledgement(() => {
      this.setState('LISTENING');
      if (remainder.length > 2) {
        this.capturedQuestion = remainder;
        this.callbacks?.onTranscriptChange(remainder, false);
        this.startSilenceDetection();
      } else {
        this.capturedQuestion = '';
        this.startSilenceDetection();
      }
    });
  }

  private playWakeWordAcknowledgement(onDone: () => void) {
    // Short loving voice acknowledgement
    const randomAck = ACKNOWLEDGEMENTS[Math.floor(Math.random() * ACKNOWLEDGEMENTS.length)];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(randomAck);
        utterance.rate = 1.05;
        utterance.pitch = 1.15;
        utterance.onend = () => onDone();
        utterance.onerror = () => onDone();
        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        // Fallback to instant proceed
      }
    }
    onDone();
  }

  private startSilenceDetection() {
    this.clearTimers();
    // After 1.8 seconds of silence while listening, finalize question
    this.silenceTimer = setTimeout(() => {
      this.finishQuestionCapture();
    }, 1800);
  }

  private finishQuestionCapture() {
    if (this.state !== 'LISTENING') return;
    const q = this.capturedQuestion.trim();
    if (q.length > 0) {
      this.setState('PROCESSING');
      this.callbacks?.onQuestionCaptured(q);
      this.capturedQuestion = '';
    } else {
      // Nothing said, return to idle
      this.setState('IDLE');
    }
  }

  public cancelListening() {
    this.clearTimers();
    this.capturedQuestion = '';
    this.stopSpeaking();
    if (this.isContinuousRunning) {
      this.setState('IDLE');
    } else {
      this.setState('OFF');
    }
    this.callbacks?.onTranscriptChange('', true);
  }

  public async replayLastAnswer(): Promise<void> {
    if (this.lastSpokenText) {
      await this.speakAnswer(this.lastSpokenText);
    }
  }

  public getLastSpokenText(): string {
    return this.lastSpokenText;
  }
}

export const wakeWordAssistant = WakeWordAssistantService.getInstance();
