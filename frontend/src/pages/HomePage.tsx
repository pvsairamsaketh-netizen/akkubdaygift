import { useEffect, useState, useMemo } from 'react';
import { 
  MessageCircleHeart, 
  BookmarkCheck, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Heart,
  Calendar,
  Flame,
  X,
  RefreshCw,
  Gift,
  Smile
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

const REASONS_WHY_I_LOVE_YOU = [
  "The gentle warmth in your eyes when you look at me after a long day.",
  "How you stayed by my side through college, exams, and every uncertain moment.",
  "Your pure, innocent excitement whenever you get your favorite mango ice cream.",
  "The memories we made walking along Marina Beach with the sea breeze in our hair.",
  "How deeply you care about the little things—my health, my meals, and my peace.",
  "The unforgettable samosa conversation in the canteen on May 4, 2022, where our forever began.",
  "Your soft voice when you say 'Saki' that instantly makes all my stress disappear.",
  "How patient and understanding you are, forgiving my flaws and helping me become a better man.",
  "The beautiful dreams we share of building a quiet, loving future together.",
  "Your laugh—it is genuinely my favorite sound in the entire universe.",
  "How you believe in my dreams even before I believe in them myself.",
  "The way you scrunch your nose when you're teasing me or being playful.",
  "Every single phone call that lasted into the quiet hours of midnight.",
  "Because loving you is the easiest, most natural, and most beautiful decision of my life.",
  "You are not just my love—you are my sanctuary, my best friend, and my home."
];

const POLAROID_MEMORIES = [
  {
    src: '/images/memories/img1.jpeg',
    title: 'Our Warmest Smile',
    date: 'College Days',
    caption: 'Where two strangers became each other’s whole world.'
  },
  {
    src: '/images/memories/img2.jpeg',
    title: 'Every Glance Tells a Story',
    date: 'Sweet Moments',
    caption: 'The quiet looks that spoke louder than any words.'
  },
  {
    src: '/images/memories/img3.jpeg',
    title: 'Marina Beach Breeze',
    date: 'Chennai Shore',
    caption: 'Watching waves with you while time stood completely still.'
  },
  {
    src: '/images/memories/img4.jpeg',
    title: 'Holding Hands Through Life',
    date: 'Unbreakable Bond',
    caption: 'Promising to never let go, through every joy and storm.'
  },
  {
    src: '/images/memories/img5.jpeg',
    title: 'My Favorite Person',
    date: 'Pure Joy',
    caption: 'Your happiness is the only thing that truly matters to me.'
  },
  {
    src: '/images/memories/img6.jpeg',
    title: 'Forever & Always',
    date: 'Our Love Story',
    caption: 'Every yesterday with you was a gift, every tomorrow is a dream.'
  }
];

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  birthdayConfig, 
  onOpenSurprise,
  isUnlocked: _isUnlocked = false
}) => {
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [docCount, setDocCount] = useState<number>(1);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof POLAROID_MEMORIES[0] | null>(null);
  
  // Interactive Love Reason State
  const [reasonIdx, setReasonIdx] = useState<number>(0);
  const [isReasonFlipping, setIsReasonFlipping] = useState<boolean>(false);
  
  // Interactive Hearts Sent Counter
  const [heartsSent, setHeartsSent] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('akku_hearts_sent') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Love Milestone Live Counter (from May 4, 2022 proposal date)
  const proposalDate = useMemo(() => new Date('2022-05-04T13:00:00'), []);
  const [elapsed, setElapsed] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();
      const diff = Math.max(0, now.getTime() - proposalDate.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setElapsed({ days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [proposalDate]);

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

  const handleSendHeart = (e: React.MouseEvent) => {
    const next = heartsSent + 1;
    setHeartsSent(next);
    try {
      localStorage.setItem('akku_hearts_sent', next.toString());
    } catch {}

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48']
    });
  };

  const handleNextReason = () => {
    setIsReasonFlipping(true);
    setTimeout(() => {
      setReasonIdx((prev) => (prev + 1) % REASONS_WHY_I_LOVE_YOU.length);
      setIsReasonFlipping(false);
    }, 200);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#fda4af', '#f43f5e', '#fde047']
    });
  };

  const recipient = birthdayConfig?.recipient_name || 'Akku';
  const creator = birthdayConfig?.creator_name || 'Saki';
  const greeting = birthdayConfig?.greeting_title || `Happy Birthday, ${recipient}! ❤️`;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 animate-fade-in">
      {/* Cinematic Ambient Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-rose-400/15 rounded-full blur-3xl animate-warm-breathe" />
        <div className="absolute bottom-20 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-pink-300/20 rounded-full blur-3xl animate-warm-breathe" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Welcome Banner */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-6">
        {/* Subtle romantic pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-medium shadow-xs backdrop-blur-md animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-rose-500 fill-rose-300" />
          <span>A Personalized Birthday World Created by {creator} for His Forever Love</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight leading-[1.15]">
          {greeting}
        </h1>

        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Welcome to your personal sanctuary. This digital home preserves every cherished memory we share—from our earliest emails and walk dates to your favorite ice creams and inside jokes.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md mx-auto sm:max-w-none">
          {/* Main Cinematic Surprise Button */}
          <button
            id="hero-open-surprise-btn"
            onClick={onOpenSurprise}
            className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white font-medium text-base shadow-xl shadow-rose-200/90 hover:shadow-2xl hover:shadow-rose-400/50 hover:scale-105 active:scale-95 transition-all overflow-hidden cursor-pointer"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <Heart className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform animate-heart-pulse" />
            
            <span className="font-semibold tracking-wide">
              Open My Surprise ❤️
            </span>

            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          </button>

          {/* Talk to Akku AI Button */}
          <button
            onClick={() => onNavigate('chat')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-rose-200/90 text-stone-800 font-medium text-base shadow-sm hover:shadow-md hover:border-rose-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircleHeart className="w-5 h-5 text-rose-600" />
            <span>Talk to Akku AI</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>

          {/* Send Heart Interactive Button */}
          <button
            onClick={handleSendHeart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 text-rose-700 text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            title="Send love to Saki"
          >
            <Flame className="w-4 h-4 text-rose-500 fill-rose-400" />
            <span>Send Love ({heartsSent})</span>
          </button>
        </div>

        {/* Romantic Proposal Memory Quote Ribbon */}
        <div className="pt-1">
          <p className="font-serif italic text-xs sm:text-sm text-rose-800/90 bg-rose-50/80 border border-rose-200/60 rounded-full px-5 py-1.5 inline-block backdrop-blur-xs shadow-2xs">
            "Marina Beach shore facing the Bay of Bengal, our favorite songs & every shared smile ✨"
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LOVE MILESTONE COUNTER — DAYS WE'VE LOVED EACH OTHER                   */}
      {/* ========================================================================= */}
      <div className="my-8 sm:my-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-rose-500/10 border border-rose-200/80 backdrop-blur-xl shadow-lg shadow-rose-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Our Love Milestone Since May 4, 2022</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            Loving You Every Single Second
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm font-light">
            From the canteen samosa proposal to today, every breath is for you.
          </p>
        </div>

        {/* Milestone Digit Boxes */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 shrink-0">
          {[
            { label: 'Days', value: elapsed.days },
            { label: 'Hours', value: elapsed.hours },
            { label: 'Mins', value: elapsed.minutes },
            { label: 'Secs', value: elapsed.seconds }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white/95 border border-rose-100/90 shadow-xs min-w-[62px] sm:min-w-[76px]"
            >
              <span className="font-mono text-xl sm:text-2xl font-bold text-rose-600 tracking-tight">
                {item.value}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500 font-medium uppercase mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE MAGIC CARD: "REASONS WHY SAKI LOVES AKKU"                  */}
      {/* ========================================================================= */}
      <div className="mb-10 sm:mb-12 p-6 sm:p-8 rounded-3xl bg-white/90 border border-rose-200/80 shadow-xl shadow-rose-100/60 backdrop-blur-xl relative overflow-hidden">
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Gift className="w-5 h-5 animate-bounce" style={{ animationDuration: '2.5s' }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider font-mono">
                Reason #{reasonIdx + 1} of {REASONS_WHY_I_LOVE_YOU.length}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Why Saki Loves Akku
              </h3>
            </div>
          </div>

          <button
            onClick={handleNextReason}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100/80 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs self-end sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reveal Another Reason ❤️</span>
          </button>
        </div>

        {/* Reason Text Box with Fade/Slide Transition */}
        <div className="min-h-[72px] flex items-center justify-center text-center px-4 py-3">
          <p className={`font-serif text-base sm:text-xl text-rose-950 font-medium leading-relaxed italic transition-all duration-200 ${
            isReasonFlipping ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
          }`}>
            "{REASONS_WHY_I_LOVE_YOU[reasonIdx]}"
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-stone-400">
          <span>Tap the button above to reveal more reasons written just for you</span>
          <span>✨</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. OUR MEMORY LANE — FLOATING POLAROID PHOTO CAROUSEL                     */}
      {/* ========================================================================= */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between mb-5 px-1">
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
              <span>Our Memory Lane</span>
              <Smile className="w-5 h-5 text-rose-500" />
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-light mt-0.5">
              Snapshots of laughter, ocean waves, and unforgettable memories.
            </p>
          </div>
          <button
            onClick={() => onNavigate('memories')}
            className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Memories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Polaroid Strip Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {POLAROID_MEMORIES.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(photo)}
              className="group bg-white p-2.5 pb-4 rounded-xl border border-rose-100 shadow-sm hover:shadow-xl hover:shadow-rose-100/70 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
              style={{
                transform: `rotate(${idx % 2 === 0 ? '-1.5deg' : '1.5deg'})`
              }}
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-100 mb-2">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium">Tap to view</span>
                </div>
              </div>
              <div className="text-center px-1">
                <h4 className="font-serif text-xs font-bold text-stone-800 truncate">
                  {photo.title}
                </h4>
                <p className="text-[10px] text-rose-600 font-medium font-mono mt-0.5">
                  {photo.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FEATURE NAVIGATION GLASSMORPHIC CARDS                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6 sm:my-8">
        {/* Card 1: Chat with Akku AI */}
        <div 
          onClick={() => onNavigate('chat')}
          className="group relative bg-white/85 hover:bg-white backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-100/80 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-all shadow-inner">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1.5">Chat with Akku AI</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Ask in any language (English, Hindi, Hinglish, Telugu, Tamil). Akku answers accurately using our relationship memories and shared stories.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-rose-600">
            <span>Start Romantic Chat</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Personal Long-Term Memories */}
        <div 
          onClick={() => onNavigate('memories')}
          className="group relative bg-white/85 hover:bg-white backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
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
              Every detail, favorite ice cream flavor, headache note, and shared habit is safely indexed in our private digital scrapbook.
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
          className="group relative bg-white/85 hover:bg-white backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-sm hover:shadow-xl hover:shadow-amber-100/60 hover:border-amber-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 sm:col-span-2 lg:col-span-1"
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
              Documented letters and chapters indexed with RAG. Akku answers questions with deep contextual truth and emotional resonance.
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
          <span>100% Private & Dedicated to Akku — Handcrafted with endless love</span>
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

      {/* ========================================================================= */}
      {/* 6. LIGHTBOX PHOTO MODAL                                                   */}
      {/* ========================================================================= */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white p-4 rounded-3xl shadow-2xl flex flex-col gap-3 my-auto border border-rose-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">{selectedPhoto.title}</h3>
                <span className="text-xs text-rose-600 font-mono font-medium">{selectedPhoto.date}</span>
              </div>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="rounded-2xl overflow-hidden aspect-square w-full bg-stone-100 shadow-inner">
              <img src={selectedPhoto.src} alt={selectedPhoto.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-stone-700 text-sm font-light text-center italic px-2 pt-1">
              "{selectedPhoto.caption}"
            </p>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow-md cursor-pointer"
            >
              Close Memory ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
