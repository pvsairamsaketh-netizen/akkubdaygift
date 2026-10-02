import React, { useState, useEffect } from 'react';
import { Square, X, Send, Sparkles, AlertCircle, Edit3 } from 'lucide-react';

interface VoiceInputProps {
  isRecording: boolean;
  recordingSeconds: number;
  isTranscribing: boolean;
  transcriptionPreview: string | null;
  voiceError: string | null;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  onConfirmTranscription: (editedText: string) => void;
  onDiscardTranscription: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  isRecording,
  recordingSeconds,
  isTranscribing,
  transcriptionPreview,
  voiceError,
  onStopRecording,
  onCancelRecording,
  onConfirmTranscription,
  onDiscardTranscription
}) => {
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (transcriptionPreview !== null) {
      setEditedText(transcriptionPreview);
    }
  }, [transcriptionPreview]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <>
      {/* Recording State Overlay Bar */}
      {isRecording && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-500 text-white shadow-lg animate-fade-in mb-3">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
            </span>
            <div className="text-xs">
              <span className="font-semibold">Listening to your voice...</span>
              <span className="ml-2 font-mono opacity-90">{formatTime(recordingSeconds)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onStopRecording}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Done & Transcribe</span>
            </button>
            <button
              onClick={onCancelRecording}
              className="p-1.5 rounded-full hover:bg-rose-600 text-white transition-colors"
              title="Cancel recording"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Transcribing Indicator */}
      {isTranscribing && (
        <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-cream-100 border border-cream-300 text-stone-700 text-xs font-medium mb-3 animate-pulse">
          <Sparkles className="w-4 h-4 text-rose-500 animate-spin" />
          <span>Whisper is transcribing your spoken memory locally...</span>
        </div>
      )}

      {/* Voice Error Notification */}
      {voiceError && (
        <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Transcription Preview & Edit Modal */}
      {transcriptionPreview !== null && !isRecording && (
        <div className="p-4 rounded-2xl bg-white border border-rose-300 shadow-xl mb-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-800">
              <Edit3 className="w-3.5 h-3.5 text-rose-500" />
              <span>Review & Edit Spoken Question</span>
            </div>
            <span className="text-[10px] text-stone-400">
              Check names like Saki / Akku if misheard
            </span>
          </div>

          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full text-xs text-stone-800 bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white resize-none font-sans"
            rows={2}
            placeholder="Review transcribed question..."
          />

          <div className="flex items-center justify-end space-x-2 mt-2.5">
            <button
              onClick={onDiscardTranscription}
              className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-medium hover:bg-stone-100 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={() => onConfirmTranscription(editedText)}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
            >
              <span>Ask Assistant</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
