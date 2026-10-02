import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Heart, 
  Eye, 
  EyeOff, 
  KeyRound,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LockedExperienceProps {
  onUnlockSuccess: () => void;
  recipientName?: string;
  creatorName?: string;
}

export const LockedExperience: React.FC<LockedExperienceProps> = ({
  onUnlockSuccess,
  recipientName = 'Akku',
  creatorName: _creatorName = 'Saki'
}) => {
  const [step, setStep] = useState<'welcome' | 'password' | 'unlocking'>('welcome');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [unlockPhase, setUnlockPhase] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering password step
  useEffect(() => {
    if (step === 'password') {
      setPassword('');
      setErrorMessage(null);
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [step]);

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step === 'unlocking') return;

    const trimmed = password.trim();

    if (trimmed === '2022') {
      setErrorMessage(null);
      setStep('unlocking');
      setUnlockPhase(1);

      // Phase 2: Lock opens & warm glow
      setTimeout(() => {
        setUnlockPhase(2);
      }, 350);

      // Phase 3: Confetti burst
      setTimeout(() => {
        setUnlockPhase(3);
        confetti({
          particleCount: 75,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#f43f5e', '#fda4af', '#fde047', '#f472b6', '#ffffff']
        });
      }, 700);

      // Phase 4: Dissolve card
      setTimeout(() => {
        setUnlockPhase(4);
      }, 1100);

      // Phase 5: Reveal birthday world
      setTimeout(() => {
        setUnlockPhase(5);
        onUnlockSuccess();
      }, 1500);
    } else {
      setIsShaking(true);
      setErrorMessage("Hmm... that's not the year I'm looking for ❤️");

      setTimeout(() => {
        setIsShaking(false);
      }, 500);

      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#fff3f5] via-[#fefaf8] to-[#fff0f3] overflow-hidden select-none">
      {/* Cinematic Ambient Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Breathing glowing orbs */}
        <div className={`absolute top-1/4 left-1/4 w-[420px] h-[420px] rounded-full blur-3xl transition-all duration-1000 ${
          unlockPhase >= 2 
            ? 'bg-rose-400/50 scale-150' 
            : 'bg-rose-400/20 animate-warm-breathe'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[460px] h-[460px] rounded-full blur-3xl transition-all duration-1000 ${
          unlockPhase >= 2 
            ? 'bg-pink-300/50 scale-150' 
            : 'bg-pink-400/20 animate-warm-breathe'
        }`} style={{ animationDelay: '3s' }} />

        {/* Ambient floating heart particles */}
        <div className="absolute top-16 left-12 opacity-40 animate-float-gentle text-rose-300">
          <Heart className="w-8 h-8 fill-rose-200" />
        </div>
        <div className="absolute bottom-20 left-16 opacity-30 animate-float-gentle text-pink-300" style={{ animationDelay: '2s' }}>
          <Heart className="w-10 h-10 fill-pink-200" />
        </div>
        <div className="absolute top-24 right-16 opacity-40 animate-float-gentle text-rose-300" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-7 h-7 text-amber-300 fill-amber-200" />
        </div>
        <div className="absolute bottom-24 right-20 opacity-35 animate-float-gentle text-pink-300" style={{ animationDelay: '2.5s' }}>
          <Heart className="w-7 h-7 fill-pink-200" />
        </div>
      </div>

      {/* Screen 1: Welcome / Initial Locked Surprise Landing Screen */}
      {step === 'welcome' && (
        <div className="relative w-full max-w-md text-center animate-fade-in z-10">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-rose-200/90 space-y-6 sm:space-y-7 hover:shadow-rose-200/50 transition-all duration-500">
            {/* Top Emblem */}
            <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 flex items-center justify-center shadow-xl shadow-rose-300/60 border-4 border-white">
              <div className="absolute inset-0 rounded-full bg-rose-400/30 blur-md animate-ping pointer-events-none" />
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white shadow-md text-amber-500 border border-rose-100 animate-bounce">
                <Sparkles className="w-4 h-4 fill-amber-400" />
              </div>
            </div>

            {/* Header Titles */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Special Surprise for {recipientName}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
                A little surprise is waiting for you ❤️
              </h1>
              <p className="font-serif italic text-rose-700 text-base sm:text-lg">
                "But this one is only meant for you."
              </p>
            </div>

            {/* Open My Surprise Button */}
            <div className="pt-2">
              <button
                id="open-locked-surprise-btn"
                onClick={() => setStep('password')}
                className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white font-medium text-base shadow-xl shadow-rose-200/90 hover:shadow-2xl hover:shadow-rose-400/50 hover:scale-105 active:scale-95 transition-all overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                <Lock className="w-5 h-5 text-rose-100 group-hover:scale-110 transition-transform" />
                <span className="font-semibold tracking-wide">Open My Surprise 🔐</span>
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen 2 & 3: Custom Password Experience & Cinematic Unlock Sequence */}
      {(step === 'password' || step === 'unlocking') && (
        <div 
          className={`relative w-full max-w-md transition-all duration-700 z-10 ${
            isShaking ? 'animate-shake' : ''
          } ${
            unlockPhase >= 4 ? 'opacity-0 scale-110 blur-sm pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <div className={`relative bg-gradient-to-b from-white/95 via-[#fffafb]/95 to-[#fff2f5]/95 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 shadow-2xl border transition-all duration-500 ${
            unlockPhase >= 1 
              ? 'border-rose-400 shadow-[0_0_50px_rgba(244,63,94,0.45)]' 
              : 'border-rose-200/90'
          }`}>
            {/* Back Button (only active before unlocking) */}
            {step === 'password' && (
              <button
                onClick={() => setStep('welcome')}
                className="absolute top-6 left-6 p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Glowing Accent Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 rounded-t-3xl" />

            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              {/* Lock / Unlock Icon Header */}
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md ${
                  unlockPhase >= 2 
                    ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white animate-unlock-spring shadow-rose-300/60 scale-110' 
                    : unlockPhase === 1
                    ? 'bg-rose-100 text-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-105'
                    : 'bg-rose-50 text-rose-500 border border-rose-100 hover:scale-105'
                }`}>
                  {unlockPhase >= 2 ? (
                    <Unlock className="w-9 h-9" />
                  ) : (
                    <Lock className="w-9 h-9" />
                  )}
                </div>

                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-white shadow-md text-amber-500 border border-rose-100 animate-bounce">
                  <Sparkles className="w-4 h-4 fill-amber-400" />
                </div>
              </div>

              {/* Romantic Title & Secret Prompt */}
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                  Before you enter...
                </h2>
                <p className="font-serif italic text-rose-700 text-sm sm:text-base leading-relaxed px-2">
                  There's a little secret standing between you and your surprise. ❤️
                </p>
              </div>

              {/* Password Input Section */}
              <div className="w-full pt-1">
                <label 
                  htmlFor="locked-secret-input" 
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-500 text-left mb-1.5"
                >
                  Enter the secret
                </label>

                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                      <KeyRound className="w-4 h-4" />
                    </div>

                    <input
                      id="locked-secret-input"
                      ref={inputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Enter secret year..."
                      disabled={step === 'unlocking'}
                      maxLength={10}
                      className={`w-full pl-10 pr-11 py-3.5 bg-white/90 border rounded-2xl text-stone-800 placeholder-stone-400 text-center font-mono tracking-widest text-base sm:text-lg transition-all focus:outline-none ${
                        errorMessage 
                          ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/50 shadow-[0_0_20px_rgba(244,63,94,0.25)]' 
                          : step === 'unlocking'
                          ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                          : 'border-rose-200/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/80 focus:shadow-[0_0_20px_rgba(244,114,182,0.35)]'
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

                  {/* Romantic playful error message */}
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
                      disabled={step === 'unlocking' || !password.trim()}
                      className={`w-full py-3.5 px-6 rounded-2xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                        step === 'unlocking'
                          ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-300'
                          : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white shadow-rose-200 hover:shadow-xl hover:scale-102 active:scale-98 disabled:opacity-60 disabled:hover:scale-100 disabled:shadow-none cursor-pointer'
                      }`}
                    >
                      {step === 'unlocking' ? (
                        <>
                          <Unlock className="w-4 h-4 animate-bounce" />
                          <span>Unlocking Your Surprise... ❤️</span>
                        </>
                      ) : (
                        <>
                          <span>Unlock My Surprise 🔓</span>
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
      )}
    </div>
  );
};
