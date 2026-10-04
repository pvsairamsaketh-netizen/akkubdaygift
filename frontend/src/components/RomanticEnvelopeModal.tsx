import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  X, 
  ArrowRight, 
  Lock, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Music,
  BookOpen,
  Camera,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MEMORY_PHOTOS, type MemoryPhoto } from '../config/memoryPhotos';

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

interface PhotoStory {
  chapter: string;
  title: string;
  quote: string;
  reflection: string;
  photo: MemoryPhoto;
}

const PHOTO_STORIES: PhotoStory[] = [
  {
    chapter: "Chapter I",
    title: "Where It All Began",
    quote: "“Somehow, meeting you turned ordinary days into memories I never want to forget. ❤️”",
    reflection: "From everyday conversations to the moment our smiles aligned, I realized home isn't a place—it's standing right next to you.",
    photo: MEMORY_PHOTOS[0]
  },
  {
    chapter: "Chapter II",
    title: "Campus Walks & Endless Laughs",
    quote: "“Your smile has a way of making even my toughest days feel lighter.”",
    reflection: "Those campus afternoons sharing inside jokes and talking about our dreams. Every second with you felt like pure magic.",
    photo: MEMORY_PHOTOS[1]
  },
  {
    chapter: "Chapter III",
    title: "Elegance Personified",
    quote: "“If I could keep one thing forever, it would be these little moments with you.”",
    reflection: "Seeing you in traditional grace and elegance. I fell in love with your quiet strength and dazzling beauty all over again.",
    photo: MEMORY_PHOTOS[2]
  },
  {
    chapter: "Chapter IV",
    title: "My Precious Sweetheart",
    quote: "“Every picture with you holds a story that my heart never gets tired of remembering.”",
    reflection: "Hugging that giant pink teddy bear with that pure, genuine smile—this is the sweet soul I promise to protect and cherish forever.",
    photo: MEMORY_PHOTOS[3]
  },
  {
    chapter: "Chapter V",
    title: "My Safe Haven & Peace",
    quote: "“You are not just a beautiful part of my life — you are one of my favorite reasons to smile.”",
    reflection: "In this quiet embrace, all the noise of the world faded. Knowing I have you by my side gives me the courage to conquer anything.",
    photo: MEMORY_PHOTOS[4]
  },
  {
    chapter: "Chapter VI",
    title: "From Sweet Past to Forever",
    quote: "“And if I had to choose you all over again, I'd choose you every single time. ❤️”",
    reflection: "From the precious memories of the past to the brilliant, hardworking woman preparing for placements today. I am forever proud of you.",
    photo: MEMORY_PHOTOS[5]
  },
];

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
  const [activeTab, setActiveTab] = useState<'letter' | 'journey'>('journey');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(true);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const slideshowTimerRef = useRef<any>(null);

  // Initialize background romantic soundtrack Alaakaa-loova
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio('/audio/Alaakaa-loova.mp3');
      audio.loop = true;
      audio.volume = 0.65;
      backgroundAudioRef.current = audio;

      return () => {
        audio.pause();
        backgroundAudioRef.current = null;
      };
    }
  }, [isOpen]);

  // Handle auto-slideshow
  useEffect(() => {
    if (isOpen && isLetterRevealed && isPlayingSlideshow && activeTab === 'journey') {
      slideshowTimerRef.current = setInterval(() => {
        setCurrentStoryIndex((prev) => (prev + 1) % PHOTO_STORIES.length);
      }, 4200);
    }
    return () => {
      if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current);
    };
  }, [isOpen, isLetterRevealed, isPlayingSlideshow, activeTab]);

  // Auto-open flap if requested
  useEffect(() => {
    if (isOpen && autoOpenFlap && !isOpenFlap) {
      triggerFlapOpen();
    }
  }, [isOpen, autoOpenFlap]);

  if (!isOpen) return null;

  const triggerFlapOpen = () => {
    // Grand romantic confetti burst
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#f43f5e', '#fda4af', '#fde047', '#f472b6', '#ffffff']
    });

    setIsOpenFlap(true);

    // Play romantic soundtrack smoothly
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {});
    }

    setTimeout(() => {
      setIsLetterRevealed(true);
      confetti({
        particleCount: 60,
        spread: 110,
        origin: { y: 0.4 },
        colors: ['#fb7185', '#f43f5e', '#ffd166']
      });
    }, 600);
  };

  const handleWaxSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpenFlap) return;

    if (!isUnlocked && onRequestUnlock) {
      onRequestUnlock();
      return;
    }

    triggerFlapOpen();
  };

  const toggleMusic = () => {
    if (!backgroundAudioRef.current) return;
    if (isMusicPlaying) {
      backgroundAudioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      backgroundAudioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  const currentStory = PHOTO_STORIES[currentStoryIndex];

  const defaultLetter = letterMessage || `Happy Birthday to the most special person in my whole life! ❤️

Every single detail—from our long walks across campus to the canteen over a samosa, from our quiet talks about the future to your favorite ice cream—means the absolute universe to me.

I built this entire assistant, our private memory archive, and this romantic world just for you. No matter how many days, weeks, or years go by, every cherished moment we share is preserved here forever.

You are my greatest blessing, my favorite adventure, and my forever love.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-rose-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative w-full max-w-2xl flex flex-col items-center my-auto">
        {/* Close Button on top right */}
        {isLetterRevealed && (
          <button
            onClick={() => {
              if (backgroundAudioRef.current) backgroundAudioRef.current.pause();
              onClose();
            }}
            className="absolute -top-11 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur transition-all active:scale-90 z-20 cursor-pointer"
            title="Close surprise"
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
          <div className="relative w-full bg-[#fdf5ed] rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-rose-200/90 overflow-hidden min-h-[420px] sm:min-h-[480px] flex flex-col justify-between">
            {/* Vintage Airmail Stripe Border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-pink-300 via-red-400 to-rose-500 opacity-80" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-pink-300 via-red-400 to-rose-500 opacity-80" />

            {/* Vintage Postage Stamp (visible only when sealed) */}
            {!isOpenFlap && (
              <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex flex-col items-center z-10">
                <div className="w-12 h-14 sm:w-14 sm:h-16 rounded border border-dashed border-rose-300 bg-rose-50/90 p-1 flex flex-col items-center justify-between shadow-xs">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                  <span className="text-[7px] sm:text-[8px] font-bold tracking-widest text-rose-800 uppercase font-sans">OCT 20</span>
                  <span className="text-[6px] sm:text-[7px] text-rose-500 font-sans">SPECIAL</span>
                </div>
                <span className="text-[8px] tracking-widest text-rose-300 uppercase mt-0.5 font-mono">POSTAGE PAID</span>
              </div>
            )}

            {/* Front Letter Header when sealed */}
            {!isOpenFlap ? (
              <div className="flex flex-col items-center justify-center my-auto text-center space-y-6 pt-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
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
              /* The Unfolded Romantic Content */
              <div className="my-auto space-y-4 animate-fade-in pt-1">
                {/* Header with Title and Mode Switcher */}
                <div className="border-b border-rose-200/80 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600 animate-pulse" />
                    <span className="font-serif font-bold text-stone-900 text-lg sm:text-xl">
                      My Dearest {recipientName} ❤️
                    </span>
                  </div>

                  {/* Right Controls: Soundtrack & Mode Pill Switcher */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMusic(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold shadow-2xs hover:bg-rose-200 transition-all cursor-pointer"
                      title={isMusicPlaying ? "Pause romantic soundtrack" : "Play Alaakaa Loova soundtrack"}
                    >
                      <Music className={`w-3.5 h-3.5 text-rose-600 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
                      <span className="hidden sm:inline">{isMusicPlaying ? "Song ON" : "Play Song"}</span>
                    </button>

                    <div className="flex items-center p-1 rounded-full bg-rose-100/70 border border-rose-200/80 text-xs font-semibold">
                      <button
                        onClick={() => setActiveTab('journey')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                          activeTab === 'journey'
                            ? 'bg-rose-500 text-white shadow-xs font-bold'
                            : 'text-rose-800 hover:text-rose-950'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Our 6 Memories</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('letter')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                          activeTab === 'letter'
                            ? 'bg-rose-500 text-white shadow-xs font-bold'
                            : 'text-rose-800 hover:text-rose-950'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Love Letter</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1. CINEMATIC 6-PHOTO MEMORY JOURNEY */}
                {activeTab === 'journey' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Story Card with 3D Polaroid Presentation */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-rose-200/80 shadow-md">
                      {/* Photo Container with Face-Safe Display and Slow Ken Burns Drift */}
                      <div className="relative w-48 sm:w-56 aspect-[4/5] rounded-xl overflow-hidden shadow-lg border-2 border-white shrink-0 group">
                        <img
                          src={currentStory.photo.src}
                          alt={currentStory.photo.alt}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                          style={{ objectPosition: currentStory.photo.objectPosition }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white/95 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                          {currentStory.chapter}
                        </span>
                        <button
                          onClick={() => setIsFullscreenImage(!isFullscreenImage)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/60 hover:bg-white text-stone-800 transition-all opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer"
                          title="Zoom photo"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Story Narrative & Emotional Quotes */}
                      <div className="flex-1 space-y-2.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 font-mono">
                            {currentStory.chapter} • Saki & Akku
                          </span>
                          <span className="text-[11px] text-stone-400 font-sans">
                            {currentStoryIndex + 1} of {PHOTO_STORIES.length}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-snug">
                          {currentStory.title}
                        </h3>

                        <p className="font-serif italic text-rose-700 text-xs sm:text-sm leading-relaxed border-l-2 border-rose-400 pl-3 py-0.5">
                          {currentStory.quote}
                        </p>

                        <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed">
                          {currentStory.reflection}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Controls & Filmstrip Thumbnails */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Left: Previous Button */}
                      <button
                        onClick={() => setCurrentStoryIndex((prev) => (prev - 1 + PHOTO_STORIES.length) % PHOTO_STORIES.length)}
                        className="p-1.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-all cursor-pointer"
                        title="Previous memory"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Filmstrip Milestone Dots */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {PHOTO_STORIES.map((story, idx) => (
                          <button
                            key={story.photo.id}
                            onClick={() => setCurrentStoryIndex(idx)}
                            className={`transition-all rounded-full cursor-pointer flex items-center justify-center ${
                              idx === currentStoryIndex
                                ? 'w-7 h-7 bg-rose-500 text-white font-bold text-[10px] shadow-sm scale-105'
                                : 'w-5 h-5 bg-rose-200/80 hover:bg-rose-300 text-rose-800 text-[9px]'
                            }`}
                            title={story.title}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      {/* Right: Next & Slideshow Toggle */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
                          className={`p-1.5 rounded-full transition-all cursor-pointer ${
                            isPlayingSlideshow ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                          title={isPlayingSlideshow ? "Pause automatic slideshow" : "Play automatic slideshow"}
                        >
                          {isPlayingSlideshow ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>
                        <button
                          onClick={() => setCurrentStoryIndex((prev) => (prev + 1) % PHOTO_STORIES.length)}
                          className="p-1.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-all cursor-pointer"
                          title="Next memory"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. THE UNFOLDED LOVE LETTER */}
                {activeTab === 'letter' && (
                  <div className="space-y-3.5 text-stone-800 text-sm sm:text-base leading-relaxed font-light animate-fade-in max-h-64 sm:max-h-72 overflow-y-auto pr-1">
                    <p className="whitespace-pre-line leading-relaxed italic font-serif text-stone-800">
                      {defaultLetter}
                    </p>
                  </div>
                )}

                {/* Footer with Saki Signature & Enter World Button */}
                <div className="pt-3 border-t border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-rose-900 font-serif">
                    Forever Yours, {creatorName} ❤️
                  </span>

                  <button
                    onClick={() => {
                      if (backgroundAudioRef.current) backgroundAudioRef.current.pause();
                      onClose();
                    }}
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

      {/* Fullscreen Photo Modal Zoom */}
      {isFullscreenImage && (
        <div 
          onClick={() => setIsFullscreenImage(false)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-lg max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <img 
              src={currentStory.photo.src} 
              alt={currentStory.photo.alt} 
              className="w-full h-full object-contain max-h-[85vh]"
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-3 text-white text-center">
              <p className="font-serif font-bold text-sm">{currentStory.title}</p>
              <p className="text-xs text-rose-200 italic">{currentStory.quote}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
