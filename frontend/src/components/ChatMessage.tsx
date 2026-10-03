import React, { useState } from 'react';
import { Copy, Check, Volume2, Heart, User, Sparkles, ShieldCheck, Zap } from 'lucide-react';
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
  const [liked, setLiked] = useState(false);
  const isUser = message.role === 'user';
  const citations = message.metadata?.citations || [];
  const latency = message.metadata?.latency_seconds;
  const isCached = message.metadata?.cached;
  const modelName = message.metadata?.model || 'qwen2.5:3b';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 max-w-3xl animate-fade-in ${
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto w-full'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-xs font-semibold ${
          isUser
            ? 'bg-gradient-to-tr from-stone-700 to-stone-900 text-white'
            : 'bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-200'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-stone-200" />
        ) : (
          <Sparkles className="w-4 h-4 fill-white text-white animate-pulse" />
        )}
      </div>

      {/* Message Body & Metadata */}
      <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start flex-1'}`}>
        {/* Name & Model Label */}
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-xs font-bold text-stone-900 font-serif">
            {isUser ? 'Saki' : 'Akku AI'}
          </span>
          {!isUser && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-rose-500" />
              <span>Grounded Memory</span>
            </span>
          )}
        </div>

        {/* Message Bubble Container */}
        <div
          className={`relative group rounded-3xl px-4 sm:px-5 py-3.5 text-sm leading-relaxed transition-all ${
            isUser
              ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white rounded-tr-xs shadow-md shadow-rose-200/40 font-medium'
              : 'bg-white/95 border border-rose-100/90 text-stone-800 rounded-tl-xs shadow-sm backdrop-blur-md hover:border-rose-200 w-full'
          }`}
        >
          {/* Main Text Content */}
          <div className="whitespace-pre-wrap font-sans text-[13.5px] sm:text-sm leading-relaxed">
            {message.content}
          </div>

          {/* Citations (if assistant retrieved relationship evidence) */}
          {!isUser && citations.length > 0 && (
            <SourceCitation citations={citations} />
          )}

          {/* Footer Actions / Telemetry Bar (ChatGPT/Gemini style) */}
          {!isUser && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-rose-100/70 text-[11px] text-stone-400">
              {/* Latency and Model Tag */}
              <div className="flex items-center gap-2">
                {typeof latency === 'number' && latency > 0 ? (
                  <span className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>{latency.toFixed(1)}s</span>
                  </span>
                ) : isCached ? (
                  <span className="text-[11px] text-emerald-600 font-medium">⚡ Instant (Cached)</span>
                ) : null}

                <span className="text-[10px] text-stone-400">
                  {modelName.replace(':3b', ' 3B').replace(':1.5b', ' 1.5B')}
                </span>
              </div>

              {/* Action Buttons: Copy, Read Aloud, Like */}
              <div className="flex items-center gap-1">
                {/* Copy button */}
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-700 text-stone-400 transition-colors cursor-pointer"
                  title={copied ? "Copied to clipboard!" : "Copy response"}
                  aria-label="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Speak Aloud Button */}
                {onSpeak && (
                  <button
                    onClick={() => onSpeak(message.content)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isPlaying
                        ? 'text-rose-600 bg-rose-100 animate-pulse'
                        : 'hover:bg-rose-50 hover:text-rose-700 text-stone-400'
                    }`}
                    title="Listen with Voice"
                    aria-label="Listen with Voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Like / Love Reaction */}
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    liked
                      ? 'text-rose-500 bg-rose-50'
                      : 'hover:bg-rose-50 hover:text-rose-600 text-stone-400'
                  }`}
                  title={liked ? "Loved" : "Love this response"}
                  aria-label="Love this response"
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
