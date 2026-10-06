import React from 'react';
import { Heart, Sparkles, MessageCircleHeart, BookOpen, Clock, ShieldCheck, Cpu } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    {
      title: "Where did our story begin?",
      subtitle: "From college mechanical class to B-section days",
      icon: Clock
    },
    {
      title: "When did Saki propose to Akku?",
      subtitle: "The May 4th proposal over samosa & campus walk",
      icon: Heart
    },
    {
      title: "What is Akku's favorite ice cream?",
      subtitle: "Vanilla flavor & favorite food treats",
      icon: Sparkles
    },
    {
      title: "Tell me about Besant Nagar beach sunset",
      subtitle: "Watching the waves, ocean breeze & quiet promises",
      icon: BookOpen
    },
    {
      title: "What are our future dreams together?",
      subtitle: "Placement success, life journey & forever partnership",
      icon: MessageCircleHeart
    },
    {
      title: "What made our bond so strong?",
      subtitle: "Supporting each other through thick and thin",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-center animate-fade-in">
      {/* Agent Model Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200/80 text-rose-800 text-xs font-semibold mb-4 shadow-2xs">
        <Cpu className="w-3.5 h-3.5 text-rose-600" />
        <span>Qwen 3.8 8B Agent • Grounded in Our ChromaDB</span>
      </div>

      {/* Main Title */}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2 tracking-tight">
        Akku & Saki's Memory Sanctuary
      </h2>

      {/* Narrative Subtitle */}
      <p className="text-sm text-stone-600 max-w-lg mx-auto mb-6 font-sans leading-relaxed">
        I am your personal relationship agent. Every walk, message, and milestone we shared is indexed here. Ask me anything, or tap a memory below to begin.
      </p>

      {/* Suggested Questions Grid (like ChatGPT & Gemini) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {suggestions.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.title)}
              className="group p-3.5 sm:p-4 rounded-2xl bg-white/90 hover:bg-white border border-rose-200/60 hover:border-rose-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-500 group-hover:bg-gradient-to-tr group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">0{index + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 text-xs sm:text-sm group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
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
