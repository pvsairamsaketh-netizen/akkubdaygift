import React, { useState, useRef, useEffect } from 'react';
import { BookmarkPlus, Sparkles, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  onOpenAddMemory?: () => void;
  disabled?: boolean;
}

const QUICK_PROMPT_SUGGESTIONS = [
  "How did our story begin?",
  "What is Akku's favorite ice cream?",
  "Tell me about Besant Nagar sunset",
  "When did Saki propose to Akku?",
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onOpenAddMemory,
  disabled
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 130)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSelectChip = (chip: string) => {
    onSend(chip);
  };

  return (
    <div className="space-y-2">
      {/* Quick Suggestion Chips */}
      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {QUICK_PROMPT_SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectChip(suggestion)}
            disabled={disabled}
            className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-rose-200/70 hover:border-rose-300 text-stone-600 hover:text-rose-900 shadow-2xs transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Text Prompt Bar */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-rose-200/90 rounded-3xl p-2.5 sm:p-3 shadow-md shadow-rose-900/5 focus-within:ring-2 focus-within:ring-rose-400/60 focus-within:border-transparent transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Akku AI anything about our story, memories, or promises..."
          disabled={disabled}
          rows={1}
          className="w-full text-sm text-stone-800 placeholder-stone-400 bg-transparent resize-none outline-none px-2 py-1 font-sans max-h-32 disabled:opacity-50"
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-1.5 border-t border-rose-100/70 mt-1">
          {/* Left Controls: + Remember */}
          <div className="flex items-center gap-2">
            {onOpenAddMemory && (
              <button
                type="button"
                onClick={onOpenAddMemory}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-50 to-rose-50 text-rose-800 hover:from-pink-100 hover:to-rose-100 border border-rose-200/80 transition-all shadow-2xs cursor-pointer hover:scale-102 active:scale-98"
                title="Add a new permanent relationship memory into ChromaDB"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-[11px] hidden sm:inline">+ Remember</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </button>
            )}
          </div>

          {/* Right Controls: Send Button */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 disabled:opacity-35 disabled:hover:from-rose-500 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
