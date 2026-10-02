import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, VolumeX, BookmarkPlus, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  onStartVoice: () => void;
  onOpenAddMemory?: () => void;
  isRecording: boolean;
  disabled?: boolean;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStartVoice,
  onOpenAddMemory,
  isRecording,
  disabled,
  autoSpeak,
  onToggleAutoSpeak
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || disabled || isRecording) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="relative bg-white/90 border border-rose-200/80 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-transparent transition-all">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about Saki & Akku's relationship journey..."
        disabled={disabled || isRecording}
        rows={1}
        className="w-full text-sm text-stone-800 placeholder-stone-400 bg-transparent resize-none outline-none px-2 py-1 font-sans max-h-32 disabled:opacity-50"
      />

      <div className="flex items-center justify-between pt-1 border-t border-rose-100/60 mt-1">
        <div className="flex items-center gap-2">
          {/* Voice Auto-Speak Toggle */}
          <button
            type="button"
            onClick={onToggleAutoSpeak}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              autoSpeak
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-stone-400 hover:text-stone-600'
            }`}
            title={autoSpeak ? "Voice answer enabled" : "Voice answer disabled"}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-rose-500" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden sm:inline">
              {autoSpeak ? "Voice ON" : "Voice OFF"}
            </span>
          </button>

          {/* Quick Add Memory Button */}
          {onOpenAddMemory && (
            <button
              type="button"
              onClick={onOpenAddMemory}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-pink-50 text-pink-700 hover:bg-pink-100/80 border border-pink-200/60 transition-colors shadow-2xs"
              title="Add a special memory about Akku into permanent ChromaDB storage"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-pink-600" />
              <span className="text-[11px] font-semibold hidden sm:inline">+ Remember</span>
              <Sparkles className="w-3 h-3 text-pink-400" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Microphone button */}
          <button
            type="button"
            onClick={onStartVoice}
            disabled={disabled || isRecording}
            className={`p-2 rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title="Ask with Voice (Microphone)"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim() || disabled || isRecording}
            className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 disabled:opacity-40 disabled:hover:from-rose-500 disabled:hover:to-rose-600 transition-all shadow-xs cursor-pointer"
            title="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
