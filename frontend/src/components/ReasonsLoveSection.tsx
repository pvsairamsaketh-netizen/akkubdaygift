import React, { useState } from 'react';
import { Heart, Sparkles, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoveReason {
  id: number;
  tag: string;
  frontTitle: string;
  frontSubtitle: string;
  backReason: string;
  icon: string;
}

const REASONS: LoveReason[] = [
  {
    id: 1,
    tag: "Reason 01",
    frontTitle: "The Canteen Samosa Moment",
    frontSubtitle: "May 4, 2022",
    backReason: "The afternoon when our forever began over a simple hot samosa. In that crowded college canteen, the entire world melted away, and I knew my heart had found its only home.",
    icon: "🥟",
  },
  {
    id: 2,
    tag: "Reason 02",
    frontTitle: "Besant Nagar Beach Sunsets",
    frontSubtitle: "Bay of Bengal Waves",
    backReason: "Sitting beside you at Bessie shore, listening to the waves crash while we talked about everything and nothing. With your hand in mine, silence felt like poetry.",
    icon: "🌅",
  },
  {
    id: 3,
    tag: "Reason 03",
    frontTitle: "Your Radiant Pure Smile",
    frontSubtitle: "My Daily Sunshine",
    backReason: "The way your entire face lights up when you laugh genuinely, especially when hugging that giant pink teddy bear. Your happiness is my life's most precious purpose.",
    icon: "💖",
  },
  {
    id: 4,
    tag: "Reason 04",
    frontTitle: "Late-Night Study Sessions",
    frontSubtitle: "SQL Notes & DE100D",
    backReason: "Sharing study notes, preparing presentations together, and pushing each other to excel. Seeing your brilliant mind and determination inspires me every single day.",
    icon: "📚",
  },
  {
    id: 5,
    tag: "Reason 05",
    frontTitle: "An Unbreakable Bond",
    frontSubtitle: "Chennai to Nagpur",
    backReason: "No number of kilometers could ever weaken what we share. Even with crazy work commitments at Tessell, knowing I have you waiting is my greatest strength.",
    icon: "✈️",
  },
  {
    id: 6,
    tag: "Reason 06",
    frontTitle: "Your Endless Empathy",
    frontSubtitle: "The Gentlest Soul",
    backReason: "How deeply you care about the people you love. You give warmth and comfort without ever asking for anything in return. You make me want to be a better man.",
    icon: "🌸",
  },
  {
    id: 7,
    tag: "Reason 07",
    frontTitle: "Our Shared Music & Songs",
    frontSubtitle: "Alaakaa Loova & More",
    backReason: "Every song we hum together in the car, on campus, or over late night headphones. Those melodies will forever carry the rhythm of our story.",
    icon: "🎵",
  },
  {
    id: 8,
    tag: "Reason 08",
    frontTitle: "My Forever Choice",
    frontSubtitle: "In Every Lifetime",
    backReason: "Because if the universe reset and gave me a million different lives, in every single one of them, I would search across time until I found you. You are my forever.",
    icon: "💍",
  },
];

export const ReasonsLoveSection: React.FC = () => {
  const [flippedIds, setFlippedIds] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFlip = (id: number) => {
    setFlippedIds((prev) => {
      const willFlipOpen = !prev[id];
      if (willFlipOpen) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#fda4af', '#f43f5e', '#fb7185', '#fef08a']
        });
      }
      return { ...prev, [id]: willFlipOpen };
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REASONS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REASONS.length) % REASONS.length);
  };

  const current = REASONS[currentIndex];
  const isCurrentFlipped = !!flippedIds[current.id];

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-20">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50/90 border border-rose-200/70 text-rose-800 text-xs font-semibold backdrop-blur-md shadow-2xs">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-heartbeat" />
          <span>Intimate Love Letters From Saki</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Reasons Why You Are My Forever
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-rose-700/80 max-w-xl mx-auto">
          Tap each letter below to reveal the secret thoughts my heart whispers every day.
        </p>
      </div>

      {/* Main Interactive Flip Card Container */}
      <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
        <div
          onClick={() => toggleFlip(current.id)}
          className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000 group select-none"
        >
          <div
            className={`relative w-full h-full duration-700 transform-style-preserve-3d transition-transform rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-rose-300/40 border border-rose-200/80 ${
              isCurrentFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF CARD (Sealed Letter Design) */}
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-[#fffdfa] via-[#fef6f8] to-[#fdf2f5] p-7 sm:p-9 flex flex-col justify-between overflow-hidden">
              {/* Subtle vintage border watermark */}
              <div className="absolute inset-2.5 rounded-2xl border border-rose-200/50 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />

              {/* Top Meta */}
              <div className="flex items-center justify-between z-10">
                <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-100/70 px-2.5 py-1 rounded-full">
                  {current.tag}
                </span>
                <span className="text-2xl">{current.icon}</span>
              </div>

              {/* Center Title */}
              <div className="text-center space-y-2 z-10 my-auto">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {current.frontTitle}
                </h3>
                <p className="font-serif italic text-sm sm:text-base text-rose-600">
                  {current.frontSubtitle}
                </p>
              </div>

              {/* Bottom Flip Call to Action */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-700/80 z-10 pt-2">
                <RotateCw className="w-3.5 h-3.5 text-rose-500 group-hover:rotate-180 transition-transform duration-500" />
                <span>Tap to break seal & read letter</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            {/* BACK OF CARD (Revealed Love Letter) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-rose-900 via-stone-950 to-rose-950 text-white p-7 sm:p-9 flex flex-col justify-between overflow-hidden border border-rose-400/40 shadow-2xl">
              <div className="absolute inset-2.5 rounded-2xl border border-rose-400/20 pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Top Header */}
              <div className="flex items-center justify-between z-10 border-b border-rose-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
                  <span className="font-serif font-bold text-sm tracking-wide text-rose-200">
                    To My Dearest Akku
                  </span>
                </div>
                <span className="text-xs text-rose-300 font-mono font-medium">
                  {current.tag}
                </span>
              </div>

              {/* Revealed Love Note */}
              <div className="my-auto py-2 z-10">
                <p className="font-serif text-base sm:text-lg leading-relaxed text-rose-50/95 italic">
                  "{current.backReason}"
                </p>
              </div>

              {/* Back Footer Signature */}
              <div className="flex items-center justify-between z-10 pt-2 border-t border-rose-500/30 text-xs">
                <span className="font-script text-xl text-rose-300">
                  Forever Yours, Saki ❤️
                </span>
                <span className="text-rose-400/80 text-[11px] font-sans">
                  Tap to flip back
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Controls */}
        <div className="flex items-center justify-between w-full mt-6 px-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-900 text-xs font-semibold border border-rose-200/80 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {REASONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-rose-500 rounded-full shadow-xs'
                    : 'w-2 h-2 bg-rose-200 hover:bg-rose-300'
                }`}
                aria-label={`Go to reason ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-900 text-xs font-semibold border border-rose-200/80 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
