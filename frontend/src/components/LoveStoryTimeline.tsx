import React, { useState } from 'react';
import { Heart, Sparkles, Calendar, MapPin, ArrowRight, Maximize2, X } from 'lucide-react';
import { MEMORY_PHOTOS, type MemoryPhoto } from '../config/memoryPhotos';

interface StoryMilestone {
  id: string;
  date: string;
  title: string;
  location: string;
  summary: string;
  detail: string;
  quote: string;
  photo?: MemoryPhoto;
  icon: string;
}

const MILESTONES: StoryMilestone[] = [
  {
    id: 'chapter-1',
    date: 'Early 2022',
    title: 'The Unplanned First Spark',
    location: 'College Campus Pathways',
    summary: 'Two distinct worlds crossing paths on ordinary campus afternoons, turning simple walk dates into the sweetest habit.',
    detail: 'It started with shared classes, shy smiles, and walking side by side between lectures. What seemed like ordinary days were actually the quiet beginning of the deepest love story of my life.',
    quote: '“Somehow, meeting you turned ordinary days into memories I never want to forget.”',
    photo: MEMORY_PHOTOS[1],
    icon: '🌸',
  },
  {
    id: 'chapter-2',
    date: 'May 4, 2022',
    title: 'The Canteen Samosa Proposal',
    location: 'College Canteen',
    summary: 'The most unforgettable moment of our lives, sealed over a hot canteen samosa that changed our universe forever.',
    detail: 'In the middle of a noisy college canteen, sharing a hot samosa, I looked at you and knew with total certainty: I want you by my side through every joy and storm life brings. That day you said yes, and May 4 became our sacred date.',
    quote: '“Over a simple samosa, two hearts made a forever promise.”',
    photo: MEMORY_PHOTOS[0],
    icon: '💍',
  },
  {
    id: 'chapter-3',
    date: 'Cherished Evenings',
    title: 'Besant Nagar Beach Sunsets',
    location: 'Besant Nagar Beach (Bessie)',
    summary: 'Facing the Bay of Bengal waves, listening to our favorite melodies as the sky turned shades of rose and lavender.',
    detail: 'Walking barefoot along the wet sand at Bessie, watching the gentle tide roll in while the Chennai breeze played with your hair. Those quiet conversations facing the infinite ocean remain etched in my soul.',
    quote: '“Besant Nagar shore facing the Bay of Bengal, our favorite songs & every shared smile ✨”',
    photo: MEMORY_PHOTOS[4],
    icon: '🌊',
  },
  {
    id: 'chapter-4',
    date: 'Academic Journey',
    title: 'Late Night SQL & Study Sessions',
    location: 'Study Desks & Shared Notes',
    summary: 'Preparing for tests, DE100D SQL study notes, presentations, and pushing each other to shine.',
    detail: 'Late-night revisions, clarifying relational queries, and cheering each other on through tough exams. Seeing how brilliantly your mind works and how dedicated you are to your goals made me admire you even more.',
    quote: '“Not just love, but true partners who build dreams together.”',
    photo: MEMORY_PHOTOS[2],
    icon: '📚',
  },
  {
    id: 'chapter-5',
    date: 'Bridging Distance',
    title: 'Distance Between Chennai & Nagpur',
    location: 'Chennai ↔ Nagpur',
    summary: 'Navigating busy workdays at Tessell, late-night phone calls, and an unconditional bond stronger than distance.',
    detail: 'Whether caught up in demanding deployments or balancing placement prep, our late-night voice calls and morning messages always bridged the miles. Distance only proved that our connection is unbreakable.',
    quote: '“No matter the distance, every heartbeat beats only for you.”',
    photo: MEMORY_PHOTOS[3],
    icon: '✈️',
  },
  {
    id: 'chapter-6',
    date: 'Forever & Always',
    title: 'Our Birthday Sanctuary & Forever Promises',
    location: 'Our Shared Future',
    summary: 'Every memory protected in this sanctuary, dedicated with boundless love on your special birthday.',
    detail: 'This digital world is my tribute to you, Akku. Every photo, every memory, and every line of code was crafted to remind you how deeply and endlessly you are cherished by Saki.',
    quote: '“And if I had to choose you all over again, I’d choose you in every lifetime.”',
    photo: MEMORY_PHOTOS[5],
    icon: '❤️',
  },
];

export const LoveStoryTimeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<StoryMilestone | null>(null);

  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-20">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50/90 border border-rose-200/70 text-rose-800 text-xs font-semibold backdrop-blur-md shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-300" />
          <span>Chapters of Us • Our Relationship Timeline</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Our Love Story
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-rose-700/80 max-w-2xl mx-auto">
          Every chapter that brought us here, preserved with authentic memories, real moments, and eternal devotion.
        </p>
      </div>

      {/* Vertical Spine Timeline Layout */}
      <div className="relative">
        {/* Central glowing vertical spine line */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-300 via-rose-500 to-rose-200 shadow-sm" />

        <div className="space-y-10 sm:space-y-14">
          {MILESTONES.map((milestone, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={milestone.id}
                className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Central Milestone Pin on Spine */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border-2 border-rose-400 shadow-lg items-center justify-center text-lg z-10 transition-transform hover:scale-125">
                  <span>{milestone.icon}</span>
                </div>

                {/* Left/Right Content Card */}
                <div className="w-full md:w-1/2">
                  <div
                    onClick={() => setSelectedMilestone(milestone)}
                    className="group relative bg-white/85 hover:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-md hover:shadow-2xl hover:shadow-rose-200/50 hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                  >
                    {/* Top Metadata Ribbon */}
                    <div className="flex items-center justify-between gap-2 border-b border-rose-100/80 pb-3 mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{milestone.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span className="truncate max-w-[140px] sm:max-w-none">{milestone.location}</span>
                      </div>
                    </div>

                    {/* Headline and Narrative */}
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-rose-900 transition-colors">
                        {milestone.title}
                      </h3>
                      <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed">
                        {milestone.summary}
                      </p>
                    </div>

                    {/* Romantic Quote Highlight */}
                    <div className="mt-4 pt-3 border-t border-rose-50">
                      <p className="font-serif italic text-xs text-rose-700 bg-rose-50/70 rounded-xl px-3.5 py-2 border border-rose-200/50">
                        {milestone.quote}
                      </p>
                    </div>

                    {/* Expand Link */}
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-rose-600">
                      <span>Read full chapter memory</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Media Side (Real Photo if available) */}
                <div className="w-full md:w-1/2 flex justify-center">
                  {milestone.photo ? (
                    <div
                      onClick={() => setSelectedMilestone(milestone)}
                      className="relative w-64 sm:w-72 aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white/90 group cursor-pointer hover:scale-105 transition-all duration-300"
                    >
                      <img
                        src={milestone.photo.src}
                        alt={milestone.photo.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ objectPosition: milestone.photo.objectPosition }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-rose-300 font-mono">
                          {milestone.date}
                        </span>
                        <p className="font-serif text-sm font-bold truncate">
                          {milestone.title}
                        </p>
                      </div>

                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/70 text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-64 sm:w-72 aspect-[4/5] rounded-3xl border-2 border-dashed border-rose-200 bg-rose-50/40 flex flex-col items-center justify-center p-6 text-center text-rose-800/80">
                      <Heart className="w-8 h-8 text-rose-300 mb-2 animate-pulse" />
                      <p className="font-serif font-bold text-sm">{milestone.title}</p>
                      <p className="text-xs text-rose-600 font-light mt-1">{milestone.location}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Chapter Modal */}
      {selectedMilestone && (
        <div
          onClick={() => setSelectedMilestone(null)}
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 overflow-hidden space-y-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-900 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedMilestone.date}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedMilestone.location}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {selectedMilestone.title}
              </h3>
            </div>

            {/* Photo if available */}
            {selectedMilestone.photo && (
              <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-inner border border-rose-100">
                <img
                  src={selectedMilestone.photo.src}
                  alt={selectedMilestone.photo.alt}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: selectedMilestone.photo.objectPosition }}
                />
              </div>
            )}

            {/* Full narrative */}
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              {selectedMilestone.detail}
            </p>

            {/* Quote */}
            <div className="border-l-2 border-rose-500 pl-4 py-1 bg-rose-50/60 rounded-r-xl">
              <p className="font-serif italic text-rose-800 text-sm">
                {selectedMilestone.quote}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-rose-100 text-xs text-rose-900 font-serif font-bold">
              <span>Saki & Akku • Eternal Story</span>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-sans font-semibold transition-all cursor-pointer"
              >
                Close Chapter
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
