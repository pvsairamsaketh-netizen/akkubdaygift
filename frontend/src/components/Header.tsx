import React from 'react';
import { Heart, Settings, Sparkles, Volume2, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  voiceEnabled: boolean;
  totalVectors?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  voiceEnabled,
  totalVectors = 8
}) => {
  return (
    <header className="h-16 border-b border-rose-200/60 bg-white/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20 sticky top-0 shadow-xs">
      {/* Left: Assistant Identity */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center shadow-md shadow-rose-200 text-white animate-pulse-subtle">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          {/* Active status pulse */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400/40" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              Akku AI
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 font-semibold hidden sm:inline-flex items-center gap-1 border border-rose-200/80 shadow-2xs">
              <Sparkles className="w-3 h-3 text-rose-500" />
              Agent Mode
            </span>
          </div>
          <p className="text-[11px] text-stone-500 font-sans hidden sm:block">
            Grounded in Saki & Akku's verified relationship memories
          </p>
        </div>
      </div>

      {/* Right: Agent Capabilities & Status Pills */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Real Agent Model Pill (ChatGPT/Gemini style) */}
        <div 
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-stone-700 text-xs shadow-2xs"
          title="Qwen 2.5 Local LLM with ChromaDB Grounding"
        >
          <Cpu className="w-3.5 h-3.5 text-rose-600" />
          <span className="font-semibold text-stone-900">Qwen 2.5</span>
          <span className="text-[10px] text-stone-400">|</span>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Grounded</span>
          </div>
        </div>

        {/* Vector DB Grounding Shield */}
        <div 
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-xs shadow-2xs"
          title={`${totalVectors} Relationship Memories indexed in ChromaDB`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-medium">{totalVectors} Memories</span>
        </div>

        {/* Streaming speed indicator */}
        <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs">
          <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
          <span>Fast SSE</span>
        </div>

        {/* Voice Badge */}
        <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
          voiceEnabled 
            ? 'bg-rose-50 border-rose-200 text-rose-700' 
            : 'bg-stone-100 border-stone-200 text-stone-500'
        }`}>
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{voiceEnabled ? 'Voice Ready' : 'Voice Off'}</span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-rose-50 text-stone-600 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
          title="Assistant Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
