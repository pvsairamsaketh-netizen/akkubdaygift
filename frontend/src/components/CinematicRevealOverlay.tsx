import React, { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CinematicRevealOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  recipientName?: string;
  creatorName?: string;
}

export const CinematicRevealOverlay: React.FC<CinematicRevealOverlayProps> = ({
  isActive,
  onComplete,
  recipientName = 'Akku',
  creatorName = 'Saki'
}) => {
  const [phase, setPhase] = useState<'appear' | 'expand' | 'done'>('appear');

  useEffect(() => {
    if (!isActive) {
      setPhase('appear');
      return;
    }

    setPhase('appear');

    // Confetti shower
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#fda4af', '#fde047', '#f472b6', '#ffffff']
    });

    const expandTimer = setTimeout(() => {
      setPhase('expand');
    }, 700);

    const completeTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1450);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive || phase === 'done') return null;

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-500 ${
      phase === 'expand' ? 'bg-rose-950/85 backdrop-blur-xl' : 'bg-stone-950/90 backdrop-blur-lg'
    }`}>
      {/* Radiant Glow Burst */}
      <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
        phase === 'expand' 
          ? 'scale-[2.5] bg-gradient-to-tr from-rose-500/50 via-pink-400/50 to-amber-300/40 opacity-90' 
          : 'scale-100 bg-rose-500/30 opacity-60'
      }`} />

      {/* Cinematic Heart Centerpiece */}
      <div className={`relative flex flex-col items-center text-center space-y-6 select-none transition-all duration-700 ${
        phase === 'expand' ? 'scale-125 opacity-90' : 'scale-100 opacity-100'
      }`}>
        {/* Glowing Heart with Pulse */}
        <div className="relative">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 flex items-center justify-center shadow-[0_0_60px_rgba(244,63,94,0.8)] border-2 border-white/40 animate-pulse">
            <Heart className="w-14 h-14 sm:w-18 sm:h-18 text-white fill-white animate-bounce" />
          </div>

          {/* Floating Sparkles around heart */}
          <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <Heart className="absolute -bottom-2 -left-2 w-6 h-6 text-pink-300 fill-pink-300 animate-ping" />
        </div>

        {/* Cinematic Subtitles */}
        <div className="space-y-2 px-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/15 text-rose-200 text-xs font-semibold backdrop-blur tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Memory Unlocked</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
            For My Dearest {recipientName}
          </h2>

          <p className="font-serif italic text-rose-200 text-base sm:text-lg drop-shadow">
            "Something crafted especially for you, with all my love."
          </p>

          <p className="text-xs text-rose-300/80 font-mono tracking-widest pt-2">
            FROM {creatorName.toUpperCase()} WITH FOREVER LOVE
          </p>
        </div>
      </div>
    </div>
  );
};
