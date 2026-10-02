import React from 'react';
import { Heart, Sparkles, MessageCircle, Gift, BookOpen, Clock } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    {
      title: "How did our story begin?",
      subtitle: "From K-section to B-section college days",
      icon: Clock
    },
    {
      title: "When did Saki propose?",
      subtitle: "The May 4, 2022 proposal over samosa",
      icon: Heart
    },
    {
      title: "What happened during the walk to the canteen?",
      subtitle: "The conversation after mechanical class",
      icon: Sparkles
    },
    {
      title: "Tell me about our college memories.",
      subtitle: "Andhra Mess, Besant Nagar, Forum Mall & presentations",
      icon: BookOpen
    },
    {
      title: "What challenges did they discuss?",
      subtitle: "Distance, career, family & astrology concerns",
      icon: MessageCircle
    },
    {
      title: "Can you tell the story from the beginning?",
      subtitle: "A journey of affection, learning and growing together",
      icon: Gift
    }
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      {/* Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100/80 border border-rose-200/80 text-rose-700 text-xs font-medium mb-4 animate-bounce-subtle">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Personalized Birthday Gift for Akku</span>
      </div>

      {/* Main Title */}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-800 mb-3 tracking-tight">
        Saki & Akku's Love Journey
      </h2>

      {/* Narrative Subtitle */}
      <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto mb-8 font-sans leading-relaxed">
        "Every relationship has little moments that become unforgettable. Ask me about the memories, messages, and moments recorded in Saki and Akku's story."
      </p>

      {/* Suggested Questions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {suggestions.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.title)}
              className="group p-4 rounded-2xl bg-white/80 hover:bg-white border border-rose-200/60 hover:border-rose-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">#0{index + 1}</span>
              </div>
              <div>
                <h3 className="font-medium text-stone-800 text-sm group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
