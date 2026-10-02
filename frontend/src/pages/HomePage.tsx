import { useEffect, useState } from 'react';
import { 
  MessageCircleHeart, 
  BookmarkCheck, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Heart,
  Lock
} from 'lucide-react';
import type { NavTab } from '../components/Navbar';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

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

  useEffect(() => {
    api.getMemories().then(res => setMemoryCount(res.total_memories || 0)).catch(() => {});
    api.getDocumentStatus().then(res => setDocCount(res.indexed_documents || 1)).catch(() => {});
  }, []);

  const triggerSparkles = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fda4af', '#f43f5e', '#fb7185', '#fef08a', '#ffffff']
    });
  };

  const recipient = birthdayConfig?.recipient_name || 'Akku';
  const creator = birthdayConfig?.creator_name || 'Saki';
  const greeting = birthdayConfig?.greeting_title || `Happy Birthday, ${recipient}! ❤️`;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 animate-fade-in">
      {/* Cinematic Ambient Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-rose-400/15 rounded-full blur-3xl animate-warm-breathe" />
        <div className="absolute bottom-20 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-pink-300/20 rounded-full blur-3xl animate-warm-breathe" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Welcome Banner */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-4 sm:pt-8">
        {/* Subtle romantic pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-medium shadow-xs backdrop-blur-md animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-rose-500 fill-rose-300" />
          <span>A Personalized Birthday World Created by {creator}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight leading-[1.15]">
          {greeting}
        </h1>

        <p className="text-stone-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
          Welcome to your personal sanctuary. This digital home preserves every cherished memory we share—from our earliest emails and walk dates to your favorite ice creams and inside jokes.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 max-w-md mx-auto sm:max-w-none">
          {/* Main Cinematic Surprise Button */}
          <button
            id="hero-open-surprise-btn"
            onClick={onOpenSurprise}
            className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white font-medium text-base shadow-xl shadow-rose-200/90 hover:shadow-2xl hover:shadow-rose-400/50 hover:scale-105 active:scale-95 transition-all overflow-hidden cursor-pointer"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            {isUnlocked ? (
              <Heart className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform animate-pulse" />
            ) : (
              <Lock className="w-5 h-5 text-rose-100 group-hover:scale-110 transition-transform" />
            )}
            
            <span className="font-semibold tracking-wide">
              {isUnlocked ? "Open My Surprise ❤️" : "Open My Surprise ❤️"}
            </span>

            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          </button>

          {/* Talk to Akku AI Button */}
          <button
            onClick={() => onNavigate('chat')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-rose-200/90 text-stone-800 font-medium text-base shadow-sm hover:shadow-md hover:border-rose-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircleHeart className="w-5 h-5 text-rose-600" />
            <span>Talk to Akku AI</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>

        {/* Romantic Proposal Memory Quote Ribbon */}
        <div className="pt-2">
          <p className="font-serif italic text-xs sm:text-sm text-rose-800/80 bg-rose-50/70 border border-rose-200/50 rounded-full px-5 py-1.5 inline-block backdrop-blur-xs">
            "Besant Nagar shore facing the Bay of Bengal, our favorite songs & every shared smile ✨"
          </p>
        </div>
      </div>

      {/* Feature Navigation Glassmorphic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10 sm:my-12">
        {/* Card 1: Chat with Voice & Memory */}
        <div 
          onClick={() => onNavigate('chat')}
          className="group relative bg-white/80 hover:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-100/80 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-all shadow-inner">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1.5">Akku AI Voice Chat</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Speak or type in any language. Akku answers naturally using our relationship memories and speaks aloud using local voice synthesis.
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
          className="group relative bg-white/80 hover:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
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
          className="group relative bg-white/80 hover:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-amber-100/60 hover:border-amber-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 sm:col-span-2 lg:col-span-1"
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

      {/* Footer Info & Romantic Assurance */}
      <div className="pt-6 pb-2 border-t border-rose-100/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Private & Local on Apple M4 — No personal memories leave this MacBook</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerSparkles} 
            className="hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Celebrate</span>
            <span>✨</span>
          </button>
          <span>•</span>
          <span className="font-medium text-rose-900">Crafted with ❤️ by Saki</span>
        </div>
      </div>
    </div>
  );
};
