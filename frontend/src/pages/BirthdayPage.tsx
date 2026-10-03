import { useState } from 'react';
import { 
  Heart, 
  Gift, 
  Sparkles, 
  MessageCircleHeart, 
  RotateCw, 
  Calendar,
  Lock,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { NavTab } from '../components/Navbar';
import { useMemoryPhotos } from '../context/MemoryPhotoContext';

interface BirthdayPageProps {
  onNavigate: (tab: NavTab) => void;
  birthdayConfig?: any;
  isUnlocked?: boolean;
  onRequestUnlock?: () => void;
}

export const BirthdayPage: React.FC<BirthdayPageProps> = ({ 
  onNavigate, 
  birthdayConfig, 
  isUnlocked = false,
  onRequestUnlock
}) => {
  const { triggerMemoryPhoto } = useMemoryPhotos();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const recipient = birthdayConfig?.recipient_name || 'Akku';
  const creator = birthdayConfig?.creator_name || 'Saki';
  const greeting = birthdayConfig?.greeting_title || `Happy Birthday, ${recipient}! ❤️`;
  const letter = birthdayConfig?.love_letter || `Happy Birthday to the most special person in my life. Every little moment, message, and memory we have shared means the world to me. I made this little world just for you.`;
  const surprise = birthdayConfig?.surprise_message || `You are my favorite journey, my dearest Akku. Every day with you is a gift. Happy Birthday!`;
  const bdayDate = birthdayConfig?.birthday_date || 'October 20';

  const triggerCelebration = () => {
    // If locked, request unlock first
    if (!isUnlocked && onRequestUnlock) {
      onRequestUnlock();
      return;
    }

    setIsRevealed(true);
    triggerMemoryPhoto('surprise');
    // Burst of hearts and golden sparkles
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#fda4af', '#f472b6', '#fde047', '#e11d48']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fda4af', '#fb7185', '#ffe4e6']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fda4af', '#fb7185', '#ffe4e6']
      });
    }, 250);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 animate-fade-in flex flex-col items-center">
      {/* Cinematic Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-12 left-1/4 w-80 h-80 bg-rose-400/15 rounded-full blur-3xl animate-warm-breathe" />
        <div className="absolute bottom-16 right-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-warm-breathe" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Header Greeting */}
      <div className="text-center space-y-3.5 mb-8 sm:mb-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs sm:text-sm font-semibold shadow-xs border border-rose-200/80 backdrop-blur-md">
          <Calendar className="w-4 h-4 text-rose-500" />
          <span>{bdayDate} • A Day to Celebrate You</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
          {greeting}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto font-light leading-relaxed">
          Tap the card to read your handwritten love letter, and unlock the secret surprise below.
        </p>
      </div>

      {/* 3D Flippable Birthday Card */}
      <div 
        className="w-full max-w-lg perspective-1000 mb-8 sm:mb-10 cursor-pointer group" 
        onClick={() => {
          triggerMemoryPhoto('surprise');
          setIsFlipped(!isFlipped);
        }}
      >
        <div
          className={`relative w-full h-[400px] sm:h-[450px] transition-transform duration-700 transform-style-preserve-3d rounded-3xl shadow-xl hover:shadow-2xl border border-rose-200/80 group-hover:scale-[1.01] ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front: Elegant Cover */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-rose-400 via-pink-400 to-rose-300 rounded-3xl p-8 flex flex-col justify-between text-white shadow-inner overflow-hidden select-none">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/15 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-600/25 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-rose-100 font-mono">Special Edition</span>
              <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>

            <div className="text-center space-y-3.5 my-auto z-10">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-md border border-white/30">
                <Gift className="w-9 h-9 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">For My Dearest Akku</h2>
              <p className="text-rose-100 text-sm font-script text-2xl">with all my love,</p>
              <p className="text-sm font-semibold tracking-wider text-white font-serif">{creator}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-rose-100/95 z-10 bg-white/10 py-1.5 px-4 rounded-full backdrop-blur-xs mx-auto">
              <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Tap anywhere to flip card & read letter</span>
            </div>
          </div>

          {/* Card Back: The Love Letter */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fffdfb] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-stone-800 shadow-inner overflow-y-auto select-none">
            <div>
              <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="font-serif text-base font-bold text-rose-950">A Letter for Akku</span>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">Written with love</span>
              </div>

              <div className="space-y-3.5 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p className="font-serif italic text-rose-900 text-base sm:text-lg">Dearest Akku,</p>
                <p className="whitespace-pre-line leading-relaxed font-serif italic text-stone-800">{letter}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-100/80 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-rose-900 font-serif">Forever & Always, {creator}</span>
              <span className="text-[11px] text-stone-400">Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Surprise Reveal Section */}
      <div className="w-full max-w-lg bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-md text-center space-y-4 mb-8">
        {!isRevealed ? (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mx-auto shadow-inner border border-rose-100">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">A Secret Surprise Just for You</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto font-light leading-relaxed">
              I have prepared a special secret birthday message inside. Click below when you are ready.
            </p>
            <div className="pt-2">
              <button
                onClick={triggerCelebration}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white font-medium shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
              >
                {!isUnlocked ? (
                  <>
                    <Lock className="w-4 h-4 text-rose-200" />
                    <span>Unlock Birthday Surprise ✨</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Reveal Birthday Surprise ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-scale-up space-y-4 py-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300/50">
              <Heart className="w-8 h-8 fill-white text-white animate-bounce" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Special Memory</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">You Unlocked the Surprise! ❤️</h3>
              <p className="text-stone-800 text-base sm:text-lg leading-relaxed max-w-md mx-auto italic font-serif bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                "{surprise}"
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={triggerCelebration}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium underline transition-colors cursor-pointer"
              >
                Trigger Sparkles Again ✨
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('chat')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-md shadow-rose-200 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
        >
          <MessageCircleHeart className="w-4 h-4" />
          <span>Talk to Akku AI Now</span>
        </button>
        <button
          onClick={() => onNavigate('memories')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 hover:bg-white border border-rose-200 text-rose-900 font-medium shadow-sm hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
        >
          <BookmarkCheck className="w-4 h-4 text-pink-500" />
          <span>See Stored Memories</span>
        </button>
      </div>
    </div>
  );
};
