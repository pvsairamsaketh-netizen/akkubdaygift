import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  X, 
  KeyRound,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PasswordSurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  recipientName?: string;
  creatorName?: string;
}

export const PasswordSurpriseModal: React.FC<PasswordSurpriseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  recipientName = 'Akku',
  creatorName: _creatorName = 'Saki'
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage(null);
      setIsShaking(false);
      setIsUnlocking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isUnlocking) return;

    const trimmed = password.trim();

    // The secret year
    if (trimmed === '2022') {
      setErrorMessage(null);
      setIsUnlocking(true);

      // Trigger celebratory heart sparkles
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#f43f5e', '#fda4af', '#fde047', '#f472b6', '#ffffff']
      });

      // Allow unlock animation to play, then proceed to cinematic reveal
      setTimeout(() => {
        onSuccess();
      }, 750);
    } else {
      // Gentle shake and playful romantic message
      setIsShaking(true);
      setErrorMessage("Hmm... that's not the year I'm looking for ❤️ Try again.");

      // Reset shake class after animation finishes
      setTimeout(() => {
        setIsShaking(false);
      }, 500);

      // Keep focus on input
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-fade-in">
      {/* Ambient glowing romantic atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          isUnlocking 
            ? 'bg-rose-400/45 scale-125' 
            : 'bg-rose-500/20 animate-pulse'
        }`} />
        <div className={`absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          isUnlocking 
            ? 'bg-pink-300/40 scale-125' 
            : 'bg-pink-400/20 animate-pulse'
        }`} style={{ animationDelay: '1.2s' }} />
      </div>

      {/* Main Password Card */}
      <div 
        className={`relative w-full max-w-md transition-all duration-500 ${
          isShaking ? 'animate-shake' : ''
        } ${isUnlocking ? 'scale-105 opacity-90' : ''}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isUnlocking}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur transition-all active:scale-90 disabled:opacity-50"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Content with Glassmorphic Gradient */}
        <div className={`relative bg-gradient-to-b from-white/95 via-[#fffafb]/95 to-[#fff2f5]/95 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 shadow-2xl border border-rose-200/90 overflow-hidden transition-all duration-500 ${
          isUnlocking ? 'shadow-[0_0_50px_rgba(244,63,94,0.4)] border-rose-300' : ''
        }`}>
          {/* Subtle Decorative Top Glow Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500" />

          {/* Animated Lock / Unlock Icon Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md ${
                isUnlocking 
                  ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white animate-unlock-spring shadow-rose-300/60 scale-110' 
                  : 'bg-rose-50 text-rose-500 border border-rose-100 hover:scale-105'
              }`}>
                {isUnlocking ? (
                  <Unlock className="w-8 h-8 sm:w-9 sm:h-9" />
                ) : (
                  <Lock className="w-8 h-8 sm:w-9 sm:h-9" />
                )}
              </div>
              
              {/* Floating Sparkle Pill */}
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-white shadow-md text-amber-500 border border-rose-100 animate-bounce">
                <Sparkles className="w-4 h-4 fill-amber-400" />
              </div>
            </div>

            {/* Romantic Heading */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Special Surprise for {recipientName}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                Before you open this little surprise...
              </h2>
              <p className="font-serif italic text-rose-700 text-sm sm:text-base">
                There is one thing only you should know. ❤️
              </p>
            </div>

            {/* Sub-label */}
            <div className="w-full pt-1">
              <label 
                htmlFor="surprise-password-input" 
                className="block text-xs font-semibold uppercase tracking-wider text-stone-500 text-left mb-1.5"
              >
                Enter the password
              </label>

              {/* Form & Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                    <KeyRound className="w-4 h-4" />
                  </div>

                  <input
                    id="surprise-password-input"
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter secret year..."
                    disabled={isUnlocking}
                    maxLength={10}
                    className={`w-full pl-10 pr-11 py-3 bg-white/90 border rounded-2xl text-stone-800 placeholder-stone-400 text-center font-mono tracking-widest text-base sm:text-lg transition-all focus:outline-none ${
                      errorMessage 
                        ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/50' 
                        : isUnlocking
                        ? 'border-emerald-400 ring-2 ring-emerald-200 bg-emerald-50/30'
                        : 'border-rose-200/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/80'
                    }`}
                  />

                  {/* Show/Hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-rose-600 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Hint below input */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600/90 font-medium pt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Hint: The year I proposed to you ❤️</span>
                </div>

                {/* Gentle Error Message if incorrect */}
                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-medium animate-fade-in flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Unlock Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUnlocking || !password.trim()}
                    className={`w-full py-3.5 px-6 rounded-2xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isUnlocking
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200'
                        : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white shadow-rose-200 hover:shadow-xl hover:scale-102 active:scale-98 disabled:opacity-60 disabled:hover:scale-100 disabled:shadow-none cursor-pointer'
                    }`}
                  >
                    {isUnlocking ? (
                      <>
                        <Unlock className="w-4 h-4 animate-bounce" />
                        <span>Unlocking Your Surprise... ❤️</span>
                      </>
                    ) : (
                      <>
                        <span>Unlock My Surprise ❤️</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
