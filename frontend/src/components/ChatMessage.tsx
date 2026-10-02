import React, { useState } from 'react';
import { Copy, Check, Volume2, Heart, User, Sparkles } from 'lucide-react';
import type { Message } from '../types/chat';
import { SourceCitation } from './SourceCitation';

interface ChatMessageProps {
  message: Message;
  onSpeak?: (text: string) => void;
  isPlaying?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSpeak,
  isPlaying
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const citations = message.metadata?.citations || [];
  const latency = message.metadata?.latency_seconds;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start space-x-3 max-w-3xl ${
        isUser ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-xs font-semibold ${
          isUser
            ? 'bg-rose-100 text-rose-700 border border-rose-300'
            : 'bg-gradient-to-tr from-rose-500 to-blush-400 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Heart className="w-4 h-4 fill-current" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`relative group rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all ${
          isUser
            ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-tr-xs shadow-md shadow-rose-200/50'
            : 'bg-white/95 border border-rose-200/70 text-stone-800 rounded-tl-xs shadow-xs backdrop-blur-xs'
        }`}
      >
        {/* Message Content */}
        <div className="whitespace-pre-wrap font-sans">
          {message.content}
        </div>

        {/* Citations (if assistant message has retrieved evidence) */}
        {!isUser && citations.length > 0 && (
          <SourceCitation citations={citations} />
        )}

        {/* Footer Actions */}
        <div
          className={`flex items-center space-x-2 mt-2 pt-1.5 text-[11px] ${
            isUser ? 'text-rose-100 justify-end' : 'text-stone-400 justify-between border-t border-stone-100'
          }`}
        >
          {!isUser && (
            <div className="flex items-center space-x-2 text-[10px]">
              {typeof latency === 'number' && latency > 0 ? (
                <span className="flex items-center gap-1 text-stone-400">
                  <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                  {latency.toFixed(1)}s
                </span>
              ) : typeof latency === 'number' ? (
                <span className="flex items-center gap-1 text-stone-400">
                  <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                  {"Fast (<0.1s)"}
                </span>
              ) : null}
            </div>
          )}

          <div className="flex items-center space-x-1">
            {/* Copy button */}
            <button
              onClick={copyToClipboard}
              className={`p-1 rounded-md transition-colors ${
                isUser ? 'hover:bg-rose-700/50 text-rose-100' : 'hover:bg-rose-50 hover:text-rose-600 text-stone-400'
              }`}
              title="Copy text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* TTS Speak button */}
            {!isUser && onSpeak && (
              <button
                onClick={() => onSpeak(message.content)}
                className={`p-1 rounded-md transition-colors ${
                  isPlaying
                    ? 'text-rose-600 bg-rose-50 animate-pulse'
                    : 'hover:bg-rose-50 hover:text-rose-600 text-stone-400'
                }`}
                title="Speak answer aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
