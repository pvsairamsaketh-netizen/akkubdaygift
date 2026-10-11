import { useEffect, useState, useRef } from 'react';
import { 
  MessageCircleHeart, 
  BookmarkCheck, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Heart,
  Lock,
  ChevronDown
} from 'lucide-react';
import type { NavTab } from '../components/Navbar';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { LoveStoryTimeline } from '../components/LoveStoryTimeline';
import { ReasonsLoveSection } from '../components/ReasonsLoveSection';

interface HomePageProps {
  onNavigate: (tab: NavTab) => void;
  birthdayConfig?: any;
  onOpenSurprise: () => void;
  isUnlocked?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  birthdayConfig, 
  onOpenSurprise,
  isUnlocked = false
}) => {
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [docCount, setDocCount] = useState<number>(1);
  const [magneticOffset, setMagneticOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    api.getMemories().then(res => setMemoryCount(res.total_memories || 0)).catch(() => {});
    api.getDocumentStatus().then(res => setDocCount(res.indexed_documents || 1)).catch(() => {});
  }, []);

  const triggerSparkles = () => {
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fda4af', '#f43f5e', '#fb7185', '#fef08a', '#ffffff', '#e11d48']
    });
  };

  // Magnetic button effect on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magneticBtnRef.current || window.innerWidth < 768) return;
    const rect = magneticBtnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.22;
    setMagneticOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  const recipient = birthdayConfig?.recipient_name || 'Akku';
  const creator = birthdayConfig?.creator_name || 'Saki';
  const greeting = birthdayConfig?.greeting_title || `Happy Birthday, ${recipient}!`;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 animate-fade-in">
      {/* Cinematic Ambient Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-rose-400/15 rounded-full blur-3xl animate-warm-breathe" />
        <div className="absolute top-1/3 right-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-pink-300/20 rounded-full blur-3xl animate-warm-breathe" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO SECTION                                */}
      {/* ======================================================== */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6 sm:pt-14 pb-8 sm:pb-12">
        {/* Subtle romantic pill badge */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-rose-100/80 border border-rose-200/80 text-rose-900 text-xs sm:text-sm font-semibold shadow-xs backdrop-blur-md animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-rose-500 fill-rose-300" />
          <span>A Personalized Birthday World Created by {creator}</span>
        </div>

        {/* Editorial Headline with Beating Heart */}
        <div className="space-y-3">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-stone-900 tracking-tight leading-[1.08]">
            {greeting}
          </h1>
          <div className="flex justify-center items-center py-1">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-rose-600 fill-rose-500 drop-shadow-md animate-heartbeat cursor-pointer hover:scale-125 transition-transform" onClick={triggerSparkles} />
          </div>
        </div>

        {/* Romantic Subtitle */}
        <p className="text-stone-700 text-base sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed font-light font-serif italic">
          Welcome to your personal sanctuary. This digital home preserves every cherished memory we share—from our earliest emails and walk dates to your favorite ice creams and inside jokes.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto sm:max-w-none">
          {/* Main Cinematic Surprise Button with Magnetic Hover */}
          <button
            ref={magneticBtnRef}
            id="hero-open-surprise-btn"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              triggerSparkles();
              onOpenSurprise();
            }}
            style={{
              transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
              transition: magneticOffset.x === 0 ? 'transform 0.4s ease-out' : 'none',
            }}
            className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:via-pink-700 hover:to-rose-800 text-white font-medium text-base sm:text-lg shadow-xl shadow-rose-300/80 hover:shadow-2xl hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all overflow-hidden cursor-pointer"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            {isUnlocked ? (
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white group-hover:scale-110 transition-transform animate-pulse" />
            ) : (
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-rose-100 group-hover:scale-110 transition-transform" />
            )}
            
            <span className="font-semibold tracking-wide">
              Open My Surprise ❤️
            </span>

            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          </button>

          {/* Talk to Akku AI Button */}
          <button
            onClick={() => onNavigate('chat')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 sm:py-4.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-xl border border-rose-200/90 text-stone-800 font-semibold text-base sm:text-lg shadow-sm hover:shadow-lg hover:border-rose-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircleHeart className="w-5 h-5 text-rose-600" />
            <span>Talk to Akku AI</span>
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Romantic Proposal Memory Quote Ribbon */}
        <div className="pt-4">
          <p className="font-serif italic text-xs sm:text-sm text-rose-900/90 bg-rose-50/80 border border-rose-200/60 rounded-full px-6 py-2 inline-block backdrop-blur-md shadow-2xs">
            "Besant Nagar shore facing the Bay of Bengal, our favorite songs & every shared smile ✨"
          </p>
        </div>

        {/* Gentle scroll indicator */}
        <div className="pt-6 hidden sm:flex justify-center text-rose-400 animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. OUR LOVE STORY: CHAPTERS OF US TIMELINE               */}
      {/* ======================================================== */}
      <LoveStoryTimeline />

      {/* ======================================================== */}
      {/* 3. REASONS WHY YOU ARE MY FOREVER FLIP CARDS             */}
      {/* ======================================================== */}
      <ReasonsLoveSection />

      {/* ======================================================== */}
      {/* 4. FEATURE NAVIGATION GLASSMORPHIC CARDS                 */}
      {/* ======================================================== */}
      <div className="text-center mt-12 mb-6">
        <h3 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Explore Your Digital Universe
        </h3>
        <p className="text-stone-600 text-sm sm:text-base font-light mt-1">
          Everything crafted, recorded, and protected for Akku
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6 sm:my-8">
        {/* Card 1: Chat with Akku AI */}
        <div 
          onClick={() => onNavigate('chat')}
          className="group relative bg-white/85 hover:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-100/80 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-all shadow-inner">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1.5">Chat with Akku AI</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Ask in any language (English, Hindi, Hinglish, Telugu, Tamil). Akku answers accurately and naturally using our verified relationship memories and documents.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-rose-600">
            <span>Start Conversation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Personal Long-Term Memories */}
        <div 
          onClick={() => onNavigate('memories')}
          className="group relative bg-white/85 hover:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 group-hover:bg-pink-100/80 flex items-center justify-center text-pink-500 mb-4 group-hover:scale-110 transition-all shadow-inner">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Our Memories</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold font-mono">
                {memoryCount} Saved
              </span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Every detail, favorite ice cream flavor, headache note, and shared habit is safely indexed in local ChromaDB vectors.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-pink-600">
            <span>Explore Memories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: PDF Love Story Journey */}
        <div 
          onClick={() => onNavigate('library')}
          className="group relative bg-white/85 hover:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-amber-100/60 hover:border-amber-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 sm:col-span-2 lg:col-span-1"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100/80 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-all shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">PDF Love Journey</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold font-mono">
                {docCount} Indexed
              </span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Documented emails and chapters indexed with RAG. Akku answers questions with deep contextual truth without robotic tags.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>View PDF Library</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. FOOTER INFO & ROMANTIC ASSURANCE                      */}
      {/* ======================================================== */}
      <footer className="pt-8 pb-4 border-t border-rose-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 mt-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Private & Local on Apple M4 — Grounded in our authentic memories</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerSparkles} 
            className="hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Celebrate Love</span>
            <span>✨</span>
          </button>
          <span>•</span>
          <span className="font-medium text-rose-900 font-serif text-sm">Crafted with ❤️ by Saki for Akku</span>
        </div>
      </footer>
    </div>
  );
};
