import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, VolumeX, Keyboard } from 'lucide-react';
import { wakeWordAssistant, type AssistantVoiceState } from '../services/wakeWordService';

interface HeyAkkuAssistantProps {
  onQuestionCaptured: (question: string) => void;
  className?: string;
}

export const HeyAkkuAssistant: React.FC<HeyAkkuAssistantProps> = ({
  onQuestionCaptured,
  className = ''
}) => {
  const [voiceState, setVoiceState] = useState<AssistantVoiceState>('OFF');
  const [transcript, setTranscript] = useState<string>('');
  const [isHandsFreeEnabled, setIsHandsFreeEnabled] = useState<boolean>(() => {
    return localStorage.getItem('akku_hands_free_voice') === 'true';
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    wakeWordAssistant.setCallbacks({
      onStateChange: (newState) => {
        setVoiceState(newState);
        if (newState === 'IDLE' || newState === 'OFF') {
          setTranscript('');
        }
      },
      onTranscriptChange: (text) => {
        setTranscript(text);
      },
      onQuestionCaptured: (question) => {
        setTranscript('');
        onQuestionCaptured(question);
      },
      onError: (err) => {
        setErrorMessage(err);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    });

    // Auto-start hands-free if user previously enabled it
    if (isHandsFreeEnabled) {
      wakeWordAssistant.startHandsFree();
    }

    return () => {
      // Don't kill global listener unmount unless disabled
    };
  }, [onQuestionCaptured]);

  const toggleHandsFree = async () => {
    if (isHandsFreeEnabled) {
      wakeWordAssistant.stopHandsFree();
      setIsHandsFreeEnabled(false);
      localStorage.setItem('akku_hands_free_voice', 'false');
    } else {
      const started = await wakeWordAssistant.startHandsFree();
      if (started) {
        setIsHandsFreeEnabled(true);
        localStorage.setItem('akku_hands_free_voice', 'true');
      }
    }
  };

  const handleManualActivate = () => {
    wakeWordAssistant.triggerManualActivation();
  };

  const handleStopSpeaking = () => {
    wakeWordAssistant.stopSpeaking();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Floating Pill Voice Assistant Controller */}
      <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-200 shadow-md hover:shadow-lg transition-all">
        {/* State Icon Indicator */}
        <button
          onClick={handleManualActivate}
          title={
            voiceState === 'SPEAKING'
              ? 'Click to stop Akku speaking (or speak to interrupt)'
              : 'Click to speak or press Cmd+Shift+A'
          }
          className={`relative p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
            voiceState === 'LISTENING'
              ? 'bg-rose-500 text-white animate-pulse shadow-md ring-4 ring-rose-200'
              : voiceState === 'WAKE_WORD_DETECTED'
              ? 'bg-amber-400 text-white animate-bounce'
              : voiceState === 'PROCESSING'
              ? 'bg-purple-500 text-white animate-spin'
              : voiceState === 'SPEAKING'
              ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-200'
              : isHandsFreeEnabled
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
          }`}
        >
          {voiceState === 'SPEAKING' ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : voiceState === 'PROCESSING' ? (
            <Sparkles className="w-4 h-4" />
          ) : isHandsFreeEnabled ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4" />
          )}

          {/* Glowing pulse ring while actively listening */}
          {voiceState === 'LISTENING' && (
            <span className="absolute -inset-1 rounded-full bg-rose-400/40 animate-ping"></span>
          )}
        </button>

        {/* Dynamic Voice Status Label & Transcript */}
        <div className="flex flex-col pr-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-semibold tracking-wide">
              {voiceState === 'LISTENING' ? (
                <span className="text-rose-600 flex items-center space-x-1">
                  <span>🎙️ Listening...</span>
                  <span className="flex space-x-0.5 ml-1">
                    <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                  </span>
                </span>
              ) : voiceState === 'WAKE_WORD_DETECTED' ? (
                <span className="text-amber-600 font-medium">✨ "Yes Saki?"</span>
              ) : voiceState === 'PROCESSING' ? (
                <span className="text-purple-600 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 animate-spin inline mr-1" />
                  <span>Thinking...</span>
                </span>
              ) : voiceState === 'SPEAKING' ? (
                <span className="text-emerald-700 flex items-center space-x-1">
                  <span>🔊 Akku is speaking...</span>
                  <button
                    onClick={handleStopSpeaking}
                    className="ml-1 text-[10px] underline hover:text-emerald-900 cursor-pointer"
                    title="Stop audio"
                  >
                    (Stop)
                  </button>
                </span>
              ) : isHandsFreeEnabled ? (
                <span className="text-stone-700 font-medium">
                  Say <strong className="text-rose-600">"Hey Akku"</strong>
                </span>
              ) : (
                <span className="text-stone-500 font-normal">Voice Assistant</span>
              )}
            </span>

            {/* Hotkey Badge */}
            <span
              className="hidden sm:inline-flex items-center text-[9px] text-stone-400 font-mono px-1 py-0.5 bg-stone-100 rounded border border-stone-200"
              title="Shortcut: Cmd/Ctrl + Shift + A"
            >
              <Keyboard className="w-2.5 h-2.5 mr-0.5 text-stone-400" />
              ⌘⇧A
            </span>
          </div>

          {/* Real-time Speech Transcript Preview */}
          {transcript && (
            <p className="text-[10px] text-rose-700 italic max-w-[200px] truncate animate-fade-in font-medium">
              "{transcript}"
            </p>
          )}
        </div>

        {/* Toggle Hands-Free Button */}
        <button
          onClick={toggleHandsFree}
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
            isHandsFreeEnabled
              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
          }`}
          title={isHandsFreeEnabled ? 'Disable hands-free listening' : 'Enable hands-free "Hey Akku" wake word'}
        >
          {isHandsFreeEnabled ? 'Hands-Free: ON' : 'Hands-Free: OFF'}
        </button>

        {/* Barge-In Stop button if speaking */}
        {voiceState === 'SPEAKING' && (
          <button
            onClick={handleStopSpeaking}
            className="p-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
            title="Interrupt & Stop Speaking"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Error Toast */}
      {errorMessage && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 p-2.5 bg-rose-600 text-white text-xs rounded-xl shadow-lg animate-fade-in">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
