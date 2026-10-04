import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  X,
  Flower2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface RomanticMemoryItem {
  id: string;
  src: string;
  tag: string;
  quote: string;
  subtext?: string;
  alt: string;
  objectPosition: string;
}

export const ROMANTIC_MEMORIES: RomanticMemoryItem[] = [
  {
    id: 'memory-1',
    src: '/images/memories/img1.jpeg',
    tag: '✨ Chapter I • Where It All Began ✨',
    quote: 'Somehow, meeting you turned ordinary days into memories I never want to forget. ❤️',
    subtext: 'Every smile standing right beside you feels like home.',
    alt: 'A cherished memory of Saki and Akku smiling together',
    objectPosition: 'center center',
  },
  {
    id: 'memory-2',
    src: '/images/memories/img2.jpeg',
    tag: '✨ Chapter II • Endless Laughter ✨',
    quote: 'Your smile has a way of making even my toughest days feel lighter.',
    subtext: 'Those campus walks and shared jokes mean the entire world to me.',
    alt: 'A joyful memory of Saki and Akku together outdoors',
    objectPosition: 'center 22%',
  },
  {
    id: 'memory-3',
    src: '/images/memories/img3.jpeg',
    tag: '✨ Chapter III • Pure Grace & Elegance ✨',
    quote: 'If I could keep one thing forever, it would be these little moments with you.',
    subtext: 'Dressed in grace and beauty, taking my breath away all over again.',
    alt: 'A beautiful portrait of Akku in traditional attire',
    objectPosition: 'center 20%',
  },
  {
    id: 'memory-4',
    src: '/images/memories/img4.jpeg',
    tag: '✨ Chapter IV • My Sweetheart ✨',
    quote: 'Every picture with you holds a story that my heart never gets tired of remembering.',
    subtext: 'Your pure, radiant laugh melts away every worry in my life.',
    alt: 'A sweet memory of Akku hugging a pink teddy bear',
    objectPosition: 'center 25%',
  },
  {
    id: 'memory-5',
    src: '/images/memories/img5.jpeg',
    tag: '✨ Chapter V • Safe Haven & Peace ✨',
    quote: 'You are not just a beautiful part of my life — you are one of my favorite reasons to smile.',
    subtext: 'Resting on your shoulder, all the noise of the world simply fades away.',
    alt: 'A romantic moment with Saki resting on Akku shoulder',
    objectPosition: 'center 25%',
  },
  {
    id: 'memory-6',
    src: '/images/memories/img6.jpeg',
    tag: '✨ Chapter VI • Forever & Always ✨',
    quote: "And if I had to choose you all over again, I'd choose you every single time. ❤️",
    subtext: 'From the sweetest past to a lifetime of memories ahead of us.',
    alt: 'A memory collage of Akku childhood and present day',
    objectPosition: 'center 20%',
  },
];

interface RomanticPhotoRevealProps {
  onClose?: () => void;
  recipientName?: string;
  creatorName?: string;
}

export const RomanticPhotoReveal: React.FC<RomanticPhotoRevealProps> = ({
  onClose,
  recipientName = 'Akku',
  creatorName = 'Saki',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFinalScreen, setIsFinalScreen] = useState<boolean>(false);
  const [isPhotoReady, setIsPhotoReady] = useState<boolean>(false);
  const [showRomanticText, setShowRomanticText] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<any>(null);

  // Preload all 6 images immediately
  useEffect(() => {
    ROMANTIC_MEMORIES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Fire celebratory rose petal & gold sparkle confetti on initial mount and slide transitions
  const triggerRoseConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fde047', '#fff1f2'],
    });
  };

  useEffect(() => {
    triggerRoseConfetti();
  }, [currentIndex, isFinalScreen]);

  // Transition animation orchestrator: Photo appears -> 400ms delay -> Text smoothly rises & fades in
  useEffect(() => {
    setIsPhotoReady(false);
    setShowRomanticText(false);

    // Image mount
    const photoTimer = setTimeout(() => {
      setIsPhotoReady(true);
    }, 50);

    // Text reveal delay (350-500ms as requested)
    const textTimer = setTimeout(() => {
      setShowRomanticText(true);
    }, 420);

    return () => {
      clearTimeout(photoTimer);
      clearTimeout(textTimer);
    };
  }, [currentIndex, isFinalScreen]);

  // Auto-play handling (Default OFF, user controlled)
  useEffect(() => {
    if (isAutoPlay && !isFinalScreen) {
      autoPlayTimerRef.current = setTimeout(() => {
        handleNext();
      }, 5500);
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, currentIndex, isFinalScreen]);

  const handleNext = () => {
    if (currentIndex < ROMANTIC_MEMORIES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinalScreen(true);
      // Grand celebratory fireworks
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#e11d48', '#f43f5e', '#fda4af', '#f59e0b', '#fde047'],
      });
    }
  };

  const handlePrev = () => {
    if (isFinalScreen) {
      setIsFinalScreen(false);
      setCurrentIndex(ROMANTIC_MEMORIES.length - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setIsFinalScreen(false);
    setCurrentIndex(0);
    triggerRoseConfetti();
  };

  const currentMemory = ROMANTIC_MEMORIES[currentIndex];

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none animate-fade-in my-2">
      
      {/* ================================================================= */}
      {/* CELEBRATORY FLOATING ROSES & BLOSSOMS ANIMATION (Falling Petals)  */}
      {/* ================================================================= */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
        {/* Soft Pink / Rose Ambient Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl" />

        {/* Floating Rose Petals & Flower Blooms */}
        <span className="absolute -top-6 left-6 text-xl sm:text-2xl animate-float-heart-small opacity-80">
          🌹
        </span>
        <span className="absolute top-1/4 -left-6 text-lg sm:text-xl animate-float-heart-small-delay opacity-75">
          🌸
        </span>
        <span className="absolute top-1/2 -right-6 text-xl sm:text-2xl animate-float-heart-small opacity-80">
          🌹
        </span>
        <span className="absolute -bottom-4 right-10 text-lg sm:text-xl animate-float-heart-small-delay opacity-75">
          🌺
        </span>
        <span className="absolute -top-4 right-8 text-sm sm:text-base animate-ping opacity-70">
          ✨
        </span>
        <span className="absolute bottom-1/4 -left-4 text-sm sm:text-base animate-pulse opacity-70">
          💖
        </span>
      </div>

      {/* ================================================================= */}
      {/* MAIN CENTERED ROMANTIC MEMORY CARD                                */}
      {/* ================================================================= */}
      <div className="relative w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-rose-200/90 shadow-2xl shadow-rose-950/15 transition-all duration-300">
        
        {/* Top Header Bar: Romantic Title & Subtle Close Button */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-rose-100/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 flex items-center justify-center shadow-xs">
              <Heart className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
            </div>
            <span className="font-serif text-sm sm:text-base font-bold text-rose-950 tracking-tight">
              ❤️ For My {recipientName} ❤️
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Play Toggle */}
            {!isFinalScreen && (
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer border ${
                  isAutoPlay 
                    ? 'bg-rose-500 text-white border-rose-500' 
                    : 'bg-rose-50/80 hover:bg-rose-100 text-rose-700 border-rose-200/80'
                }`}
                title={isAutoPlay ? "Pause Auto-play" : "Start Auto-play"}
              >
                {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                <span className="hidden sm:inline">{isAutoPlay ? 'Auto' : 'Play'}</span>
              </button>
            )}

            {/* Subtle Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-rose-100/60 transition-colors cursor-pointer"
                title="Return to letter"
                aria-label="Close photo reveal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content: Either Active Memory Photo OR Final Love Message */}
        {!isFinalScreen ? (
          <div className="flex flex-col items-center">
            
            {/* 1. Large Centered Photo Frame */}
            <div 
              onClick={handleNext}
              className="relative w-full max-h-[380px] sm:max-h-[440px] aspect-[4/3] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-rose-200/90 shadow-lg shadow-rose-950/10 cursor-pointer group bg-rose-50/50"
              title="Tap to see the next memory ❤️"
            >
              {/* Photo element with smooth 95% -> 100% scale and fade-in */}
              <img
                src={currentMemory.src}
                alt={currentMemory.alt}
                style={{ objectPosition: currentMemory.objectPosition }}
                className={`w-full h-full object-cover transition-all duration-500 ease-out select-none group-hover:scale-[1.02] ${
                  isPhotoReady 
                    ? 'opacity-100 scale-100 blur-0' 
                    : 'opacity-0 scale-95 blur-xs'
                }`}
              />

              {/* Romantic overlay gradient for photo depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

              {/* Top Chapter Tag inside photo */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium border border-white/20 shadow-xs">
                  <Flower2 className="w-3 h-3 text-pink-300" />
                  <span>{currentMemory.tag}</span>
                </span>
              </div>

              {/* Bottom photo hint */}
              <div className="absolute bottom-2.5 right-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white/90 bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  Tap for next memory →
                </span>
              </div>
            </div>

            {/* 2. Romantic Text (Fades in with 350-500ms delay & gentle upward slide) */}
            <div 
              className={`w-full mt-5 px-2 text-center transition-all duration-500 ease-out min-h-[90px] flex flex-col justify-center ${
                showRomanticText 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
            >
              <p className="font-serif italic text-stone-800 text-base sm:text-lg lg:text-xl font-medium leading-relaxed">
                "{currentMemory.quote}"
              </p>
              {currentMemory.subtext && (
                <p className="text-rose-600 text-xs sm:text-sm font-sans mt-2 tracking-wide font-medium">
                  {currentMemory.subtext}
                </p>
              )}
            </div>

            {/* 3. Memory Navigation Bar: [← Previous] [1 / 6] [Next Memory →] */}
            <div className="w-full flex items-center justify-between gap-3 mt-5 pt-3 border-t border-rose-100">
              
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  currentIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-stone-400'
                    : 'text-stone-700 hover:text-rose-950 hover:bg-rose-50 active:scale-95'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Counter Indicator Pill: e.g. 1 / 6 */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 text-xs font-bold shadow-2xs font-mono">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>{currentIndex + 1} / {ROMANTIC_MEMORIES.length}</span>
              </div>

              {/* Next Memory Button */}
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-300/50 hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>{currentIndex === ROMANTIC_MEMORIES.length - 1 ? 'Final Memory' : 'Next Memory'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        ) : (
          /* ================================================================= */
          /* 4. SPECIAL FINALE CARD (Shown after all 6 memories)               */
          /* ================================================================= */
          <div className="flex flex-col items-center text-center py-4 px-2 space-y-5 animate-scale-up">
            
            {/* Heart & Sparkle Celebration Crest */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 flex items-center justify-center shadow-xl shadow-rose-300/60 mx-auto">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white animate-bounce" />
              </div>
              <span className="absolute -top-1 -right-1 text-2xl animate-spin" style={{ animationDuration: '8s' }}>
                ✨
              </span>
              <span className="absolute -bottom-1 -left-1 text-2xl">
                🌹
              </span>
            </div>

            {/* Final Romantic Message */}
            <div className="space-y-3 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Happy Birthday, My Akku</span>
              </span>

              <p className="font-serif italic text-stone-800 text-base sm:text-xl leading-relaxed bg-gradient-to-b from-rose-50/80 to-pink-50/50 p-5 rounded-2xl border border-rose-100 shadow-inner">
                "Six memories, countless little moments,<br />
                and a whole future of memories waiting for us.<br /><br />
                Happy Birthday, my Akku. ❤️"
              </p>

              <p className="font-serif text-rose-900 font-bold text-sm sm:text-base pt-1">
                — {creatorName}
              </p>
            </div>

            {/* Our Story Continues Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-serif font-bold text-xs sm:text-sm shadow-md shadow-rose-300/40 animate-pulse">
                <span>❤️</span>
                <span>Our Story Continues</span>
                <span>❤️</span>
              </div>
            </div>

            {/* Action Buttons: Replay & Return to Letter */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold border border-rose-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Replay Our Memories</span>
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium border border-stone-200 transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" />
                  <span>Return to Letter</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
