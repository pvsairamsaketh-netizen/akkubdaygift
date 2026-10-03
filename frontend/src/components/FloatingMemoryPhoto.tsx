import React from 'react';
import { Heart, X, Sparkles, Music } from 'lucide-react';
import { useMemoryPhotos } from '../context/MemoryPhotoContext';

interface FloatingMemoryPhotoProps {
  reduceMotion?: boolean;
}

export const FloatingMemoryPhoto: React.FC<FloatingMemoryPhotoProps> = ({ reduceMotion = false }) => {
  const { currentPhoto, animationStage, eventType, dismissPhoto, triggerMemoryPhoto } = useMemoryPhotos();

  if (!currentPhoto || animationStage === 'hidden') {
    return null;
  }

  const isEnter = animationStage === 'enter';
  const isFloating = animationStage === 'floating';
  const isExit = animationStage === 'exit';

  // Animation CSS classes based on reduced-motion preference and stage
  const getAnimationClass = () => {
    if (reduceMotion) {
      if (isEnter || isFloating) return 'opacity-100 transition-opacity duration-300';
      if (isExit) return 'opacity-0 transition-opacity duration-300';
      return '';
    }

    if (isEnter) return 'animate-photo-reveal-enter';
    if (isFloating) return 'animate-photo-float-subtle';
    if (isExit) return 'animate-photo-reveal-exit';
    return '';
  };

  const handleImageError = () => {
    if (import.meta.env.DEV) {
      console.warn(`[MemoryPhoto] Image failed to load: ${currentPhoto.src}`);
    }
    // Skip to next photo seamlessly
    triggerMemoryPhoto(eventType);
  };

  return (
    <div
      className={`fixed z-40 bottom-24 right-4 sm:bottom-6 sm:right-6 pointer-events-auto select-none transition-all ${getAnimationClass()}`}
      role="region"
      aria-label="Relationship Memory Photo"
    >
      {/* Delicate floating ambient particles (Hearts & Sparkles) */}
      {!reduceMotion && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
          <span className="absolute -top-3 left-4 text-xs text-rose-400 animate-float-heart-small opacity-80">
            ❤️
          </span>
          <span className="absolute -top-4 right-8 text-[11px] text-pink-400 animate-float-heart-small-delay opacity-70">
            ✨
          </span>
          <span className="absolute bottom-2 -left-3 text-xs text-rose-300 animate-float-heart-small opacity-75">
            ♡
          </span>
          {eventType === 'surprise' && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm animate-bounce text-amber-400">
              💖
            </span>
          )}
        </div>
      )}

      {/* Main Glassmorphic Photo Card */}
      <div
        className={`w-44 sm:w-56 md:w-64 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl border rounded-3xl p-2.5 sm:p-3 shadow-2xl transition-all duration-300 ${
          eventType === 'surprise'
            ? 'border-rose-300/90 shadow-rose-400/25 ring-2 ring-rose-300/40'
            : 'border-rose-200/80 shadow-rose-950/15'
        }`}
      >
        {/* Card Header: Brand Icon, Title, Event Hint, and Dismiss */}
        <div className="flex items-center justify-between gap-1 mb-2 px-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center shrink-0 shadow-xs">
              {eventType === 'melody' ? (
                <Music className="w-2.5 h-2.5 text-white" />
              ) : eventType === 'surprise' ? (
                <Sparkles className="w-2.5 h-2.5 text-amber-200" />
              ) : (
                <Heart className="w-2.5 h-2.5 text-white fill-white" />
              )}
            </div>
            <span className="font-serif text-xs font-bold text-rose-950 truncate tracking-tight">
              {currentPhoto.title}
            </span>
          </div>

          <button
            onClick={dismissPhoto}
            className="w-5 h-5 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-rose-100/60 transition-colors cursor-pointer shrink-0"
            title="Dismiss photo"
            aria-label="Dismiss memory photo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Photo Container with Face-Safe Object Fit & Position */}
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-rose-50/60 border border-rose-100/80 shadow-inner group">
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              objectPosition: currentPhoto.objectPosition,
            }}
            loading="eager"
            decoding="async"
          />

          {/* Subtle bottom vignette gradient for soft photo finish */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />

          {/* Tiny romantic pill badge inside image */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="text-[9px] font-medium text-white/90 bg-stone-900/40 backdrop-blur-md px-2 py-0.5 rounded-full">
              {currentPhoto.person === 'both' ? 'Saki & Akku' : 'Akku ❤️'}
            </span>
            <span className="text-[10px] text-white/90 drop-shadow-sm">
              ✨
            </span>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-2 px-1 text-center">
          <p className="text-[11px] font-sans font-medium text-rose-900/90 leading-tight">
            {currentPhoto.caption}
          </p>
        </div>
      </div>
    </div>
  );
};
