import React from 'react';
import { Heart, Settings, Sparkles, Volume2, Cpu, Database } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  voiceEnabled: boolean;
  totalVectors?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  voiceEnabled,
  totalVectors = 7
}) => {
  return (
    <header className="h-16 border-b border-rose-200/60 bg-white/75 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 sticky top-0 shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-blush-400 flex items-center justify-center shadow-md shadow-rose-200 text-white animate-pulse-subtle">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 bg-clip-text text-transparent">
              Akku AI
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium hidden sm:inline-flex items-center gap-1 border border-rose-200">
              <Sparkles className="w-3 h-3 text-rose-500" />
              Birthday Gift Edition
            </span>
          </div>
          <p className="text-xs text-rose-900/60 font-sans hidden sm:block">
            Akku & Saki • A little world made just for us.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Model Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cream-100 border border-cream-300/60 text-stone-700 text-xs shadow-2xs">
          <Cpu className="w-3.5 h-3.5 text-rose-600" />
          <span className="font-medium">Qwen 2.5 3B</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        {/* Vector DB Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-800 text-xs">
          <Database className="w-3.5 h-3.5 text-rose-500" />
          <span>{totalVectors} Memories Indexed</span>
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
          className="p-2 rounded-full hover:bg-rose-50 text-stone-600 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-200"
          title="Assistant Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
