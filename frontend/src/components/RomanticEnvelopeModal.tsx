import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, ArrowRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RomanticEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  creatorName?: string;
  letterMessage?: string;
  isUnlocked?: boolean;
  onRequestUnlock?: () => void;
  autoOpenFlap?: boolean;
}

export const RomanticEnvelopeModal: React.FC<RomanticEnvelopeModalProps> = ({
  isOpen,
  onClose,
  recipientName = 'Akku',
  creatorName = 'Saki',
  letterMessage,
  isUnlocked = false,
  onRequestUnlock,
  autoOpenFlap = false
}) => {
  const [isOpenFlap, setIsOpenFlap] = useState(false);
  const [isLetterRevealed, setIsLetterRevealed] = useState(false);

  // If autoOpenFlap becomes true after password unlock, automatically unfold envelope
  useEffect(() => {
    if (isOpen && autoOpenFlap && !isOpenFlap) {
      triggerFlapOpen();
    }
  }, [isOpen, autoOpenFlap]);

  if (!isOpen) return null;

  const triggerFlapOpen = () => {
    // Trigger celebration sparkles
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fda4af', '#fde047', '#f472b6', '#ffffff']
    });

    setIsOpenFlap(true);
    setTimeout(() => {
      setIsLetterRevealed(true);
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#fb7185', '#f43f5e', '#ffd166']
      });
    }, 600);
  };

  const handleWaxSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpenFlap) return;

    // If locked, require password first
    if (!isUnlocked && onRequestUnlock) {
      onRequestUnlock();
      return;
    }

    triggerFlapOpen();
  };

  const defaultLetter = letterMessage || `Happy Birthday to the most special person in my life!
Every little detail, from our walks to the canteen over a samosa to your favorite ice creams and songs, means everything to me.
I created this entire assistant and digital world for you, so every memory we share is remembered forever.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-fade-in">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative w-full max-w-xl flex flex-col items-center">
        {/* Close Button on top right */}
        {isLetterRevealed && (
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur transition-all active:scale-90"
            title="Close envelope"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Envelope Container */}
        <div 
          onClick={!isOpenFlap ? handleWaxSealClick : undefined}
          className={`relative w-full transition-all duration-700 select-none ${
            !isOpenFlap ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
          }`}
        >
          {/* Main Envelope Body */}
          <div className="relative w-full bg-[#fdf5ed] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-rose-200/90 overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
            {/* Vintage Airmail Stripe Border along top & bottom */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-pink-300 via-red-400 to-rose-500 opacity-80" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-pink-300 via-red-400 to-rose-500 opacity-80" />

            {/* Vintage Postage Stamp */}
            <div className="absolute top-6 right-6 flex flex-col items-center">
              <div className="w-14 h-16 rounded border border-dashed border-rose-300 bg-rose-50/90 p-1 flex flex-col items-center justify-between shadow-xs">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                <span className="text-[8px] font-bold tracking-widest text-rose-800 uppercase font-sans">OCT 20</span>
                <span className="text-[7px] text-rose-500 font-sans">SPECIAL</span>
              </div>
              <div className="text-[8px] tracking-widest text-rose-300 uppercase mt-0.5 font-mono">POSTAGE PAID</div>
            </div>

            {/* Front Letter Header when sealed */}
            {!isOpenFlap ? (
              <div className="flex flex-col items-center justify-center my-auto text-center space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>A Birthday Surprise Awaits</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight pt-2">
                    For My Dearest {recipientName}
                  </h2>
                  <p className="font-script text-2xl text-rose-600">from {creatorName}</p>
                </div>

                {/* Wax Seal - Click target */}
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 shadow-xl shadow-rose-900/40 border-2 border-rose-400/40 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
                    <div className="w-18 h-18 rounded-full border border-rose-300/40 flex flex-col items-center justify-center text-rose-100">
                      {!isUnlocked ? (
                        <>
                          <Lock className="w-7 h-7 text-rose-200 group-hover:scale-110 transition-transform mb-0.5" />
                          <span className="text-[8px] font-serif font-bold tracking-widest uppercase">UNLOCK</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-8 h-8 fill-rose-200 text-rose-200 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-serif font-bold tracking-widest uppercase mt-0.5">OPEN</span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Subtle pulsing glow */}
                  <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-md animate-ping pointer-events-none" />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-rose-700/80 font-medium">
                  <span>{!isUnlocked ? "Tap the wax seal to unlock surprise" : "Tap the wax seal to break & open"}</span>
                  <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                </div>
              </div>
            ) : (
              /* The Unfolded Love Letter inside */
              <div className="my-auto space-y-5 animate-fade-in">
                <div className="border-b border-rose-200/80 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                    <span className="font-serif font-bold text-stone-900 text-lg sm:text-xl">
                      My Dearest {recipientName} ❤️
                    </span>
                  </div>
                  <span className="text-xs text-rose-600 font-script text-lg">Happy Birthday!</span>
                </div>

                <div className="space-y-3 text-stone-800 text-sm sm:text-base leading-relaxed font-light">
                  <p className="whitespace-pre-line leading-relaxed italic font-serif">
                    {defaultLetter}
                  </p>
                </div>

                <div className="pt-4 border-t border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-rose-900">
                    Forever Yours, {creatorName}
                  </span>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Enter Our World</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
