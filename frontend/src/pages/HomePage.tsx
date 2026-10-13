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
  Smile,
  Mail,
  Compass,
  Award,
  Clock
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
  "Your pure, innocent excitement whenever you get your favorite mango or vanilla ice cream.",
  "The memories we made walking along Marina Beach with the sea breeze in our hair.",
  "How deeply you care about the little things—my health, my meals, and my peace of mind.",
  "The unforgettable samosa conversation in the canteen on May 4, 2022, where our forever began.",
  "Your soft voice when you say 'Saki' that instantly makes all my stress disappear.",
  "How patient and understanding you are, forgiving my flaws and helping me become a better man.",
  "The beautiful dreams we share of building a quiet, loving, and successful future together.",
  "Your laugh—it is genuinely my favorite sound in the entire universe.",
  "How you believe in my dreams even before I believe in them myself.",
  "The way you scrunch your nose when you're teasing me or being playful.",
  "Every single phone call that lasted into the quiet hours of midnight.",
  "Because loving you is the easiest, most natural, and most beautiful decision of my life.",
  "You are not just my love—you are my sanctuary, my best friend, and my home."
];

const POLAROID_MEMORIES = [
  {
    id: 'img1',
    src: '/images/memories/img1.jpeg',
    title: 'Our Warmest Smile',
    date: 'College Days',
    caption: 'Where two strangers met in mechanical class and became each other’s whole world.'
  },
  {
    id: 'img2',
    src: '/images/memories/img2.jpeg',
    title: 'Every Glance Tells a Story',
    date: 'Sweet Moments',
    caption: 'The quiet looks that spoke louder than any words we could ever say.'
  },
  {
    id: 'img3',
    src: '/images/memories/img3.jpeg',
    title: 'Marina Beach Breeze',
    date: 'Chennai Shore',
    caption: 'Watching the rolling ocean waves with you while time stood completely still.'
  },
  {
    id: 'img4',
    src: '/images/memories/img4.jpeg',
    title: 'Holding Hands Through Life',
    date: 'Unbreakable Bond',
    caption: 'Promising to never let go, through every joy, placement exam, and storm.'
  },
  {
    id: 'img5',
    src: '/images/memories/img5.jpeg',
    title: 'My Favorite Person',
    date: 'Pure Joy',
    caption: 'Your bright, genuine happiness is the only thing that truly matters to me.'
  },
  {
    id: 'img6',
    src: '/images/memories/img6.jpeg',
    title: 'Forever & Always',
    date: 'Our Love Story',
    caption: 'Every yesterday with you was a gift, every tomorrow with you is a dream come true.'
  }
];

interface OpenWhenLetter {
  id: string;
  envelopeTitle: string;
  badge: string;
  icon: string;
  letterTitle: string;
  letterMessage: string;
  color: string;
}

const OPEN_WHEN_LETTERS: OpenWhenLetter[] = [
  {
    id: 'miss_me',
    envelopeTitle: 'Open when you miss me',
    badge: 'Anytime • Distance',
    icon: '💌',
    letterTitle: 'For When Distance Feels Heavy...',
    letterMessage: `Dearest Akku,\n\nClose your eyes for just ten seconds. Take a deep breath. Can you feel that quiet warmth in your chest? That is my heart beating right alongside yours.\n\nNo matter where we are, no matter how busy the days get, there is not a single hour where you aren't in my thoughts. Every kilometer between us is just temporary, but what we share is forever. You are holding my hand in spirit, and I will always, always come back to you.\n\nForever yours,\nSaki ❤️`,
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'stressful_day',
    envelopeTitle: "Open when you're stressed or tired",
    badge: 'Comfort • Peace',
    icon: '💖',
    letterTitle: 'Take a Breath, My Brilliant Girl...',
    letterMessage: `My sweet Akku,\n\nI know how hard you push yourself. I know how deeply you care about everything you do, and how exhausting some days can be.\n\nRight now, put all your worries on pause. You don't have to carry the whole world today. Go grab a cup of warm tea or your favorite vanilla ice cream. Remember how resilient and intelligent you are. I am so ridiculously proud of you, today and every single day.\n\nRest your mind, my love. Saki is always in your corner.\n❤️`,
    color: 'from-pink-500 to-rose-400'
  },
  {
    id: 'want_to_smile',
    envelopeTitle: 'Open when you want to smile',
    badge: 'Happiness • Joy',
    icon: '🍦',
    letterTitle: 'Here Is A Little Reason To Smile...',
    letterMessage: `Hey you,\n\nDo you remember the day we ate ice cream together, and you laughed so hard your eyes completely crinkled up? That little crinkle in your eyes is hands down my favorite view in this entire universe.\n\nYour smile has an unfair amount of power over me—one look at you laughing, and whatever bad day I was having simply disappears. So please keep smiling, because the world is infinitely prettier when you do.\n\nSending you a million hugs,\nSaki ✨`,
    color: 'from-amber-400 to-rose-400'
  },
  {
    id: 'birthday_midnight',
    envelopeTitle: 'Open on your birthday midnight',
    badge: 'Birthday Special • 12:00 AM',
    icon: '🎂',
    letterTitle: 'Happy Birthday, The Love Of My Life!',
    letterMessage: `Happy Birthday, my precious Akku! 🎂🎉\n\nAnother year of your existence, and another year that I get to love you. Thank you for being born. Thank you for walking into my life, for your patience, your warmth, and your endless sweetness.\n\nMay this coming year bring you placement triumphs, boundless laughter, and everything your gentle heart desires. I promise to stand by your side for every single milestone. Happy Birthday, my wife-to-be, my sanctuary, my everything.\n\nWith all my love to eternity,\nSaki ❤️🎂✨`,
    color: 'from-rose-600 to-pink-600'
  }
];

const LOVE_MILESTONES = [
  {
    year: 'College Days',
    title: 'Where Two Worlds Collided',
    subtitle: 'Mechanical B-Section Class',
    desc: 'From quiet glances across the classroom to endless discussions, discovering a friend unlike anyone else.',
    icon: '🎓'
  },
  {
    year: 'May 4, 2022',
    title: 'The Samosa Proposal',
    subtitle: 'Campus Canteen & Walkways',
    desc: 'Sharing warm samosas and honest feelings, taking the leap of faith that turned into our forever promise.',
    icon: '💍'
  },
  {
    year: 'Chennai Days',
    title: 'Marina Beach Sunsets',
    subtitle: 'Rolling Waves & Quiet Promises',
    desc: 'Walking barefoot on the shore with the ocean breeze, realizing that home is standing next to each other.',
    icon: '🌊'
  },
  {
    year: 'Present Day',
    title: 'Growing Together',
    subtitle: 'Career & Placement Dreams',
    desc: 'Cheering each other on through late-night coding, study calls, and supporting each other’s highest ambitions.',
    icon: '🌟'
  },
  {
    year: 'October 20 & Beyond',
    title: 'To Eternity & Forever',
    subtitle: 'Akku’s Birthday Sanctuary',
    desc: 'Celebrating the incredible woman you are today, and looking forward to a lifetime of adventures together.',
    icon: '🎂'
  }
];

interface FlowerItem {
  id: string;
  name: string;
  symbol: string;
  meaning: string;
  description: string;
  color: string;
  bloomEmoji: string;
}

const FLOWER_BOUQUET: FlowerItem[] = [
  {
    id: 'rose',
    name: 'Eternal Crimson Rose',
    symbol: '🌹',
    meaning: 'Unconditional Love & Forever Promise',
    description: 'For the day you chose to walk by my side. My love for you is as deep, vibrant, and unwavering as this crimson bloom.',
    color: 'from-rose-500 to-red-600',
    bloomEmoji: '🌹'
  },
  {
    id: 'sakura',
    name: 'Cherry Blossom (Sakura)',
    symbol: '🌸',
    meaning: 'Gentle Grace & Sweetness',
    description: 'For your gentle voice, the kindness in your eyes, and the peace that fills my heart whenever I am near you.',
    color: 'from-pink-400 to-rose-400',
    bloomEmoji: '🌸'
  },
  {
    id: 'sunflower',
    name: 'Sunlit Golden Sunflower',
    symbol: '🌻',
    meaning: 'Warmth, Laughter & Pure Joy',
    description: 'Because your smile brings warmth into my days. You are my sunshine, Akku, turning even the gloomy days bright.',
    color: 'from-amber-400 to-yellow-500',
    bloomEmoji: '🌻'
  },
  {
    id: 'tulip',
    name: 'Blushing Pink Tulip',
    symbol: '🌷',
    meaning: 'Affection & Shared Dreams',
    description: 'For all our campus canteen walks, inside jokes, and the quiet dreams of the beautiful life we are building together.',
    color: 'from-rose-400 to-pink-500',
    bloomEmoji: '🌷'
  },
  {
    id: 'lavender',
    name: 'Velvet Calm Lavender',
    symbol: '🪻',
    meaning: 'Peace, Healing & Safe Haven',
    description: 'For being my safe sanctuary. When the world gets noisy and exhausting, holding your hand brings pure peace.',
    color: 'from-purple-400 to-indigo-400',
    bloomEmoji: '🪻'
  },
  {
    id: 'jasmine',
    name: 'Star White Jasmine',
    symbol: '🌼',
    meaning: 'Brilliance, Hope & Strength',
    description: 'For your brilliant mind, your dedication to your goals, and how proud I am to watch you shine every single day.',
    color: 'from-amber-300 to-yellow-400',
    bloomEmoji: '🌼'
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
  const [selectedLetter, setSelectedLetter] = useState<OpenWhenLetter | null>(null);
  const [isFlowerSurpriseOpen, setIsFlowerSurpriseOpen] = useState<boolean>(false);
  const [bloomedFlowers, setBloomedFlowers] = useState<Record<string, boolean>>({
    rose: true,
    sakura: true
  });
  
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

  // Photo Likes Persisted
  const [photoLikes, setPhotoLikes] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('akku_photo_likes') || '{}');
    } catch {
      return {};
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

  const handleLikePhoto = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    const current = photoLikes[photoId] || 0;
    const updated = { ...photoLikes, [photoId]: current + 1 };
    setPhotoLikes(updated);
    try {
      localStorage.setItem('akku_photo_likes', JSON.stringify(updated));
    } catch {}

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { x, y },
      colors: ['#fda4af', '#f43f5e', '#ffffff']
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

  const handleOpenLetter = (letter: OpenWhenLetter) => {
    setSelectedLetter(letter);
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#fda4af', '#f43f5e', '#fde047', '#ffffff']
    });
  };

  const handleTriggerFlowerSurprise = () => {
    setIsFlowerSurpriseOpen(true);
    // Grand celebratory floral explosion
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#fda4af', '#f43f5e', '#fb7185', '#fde047', '#f472b6', '#ffffff']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ['#f43f5e', '#fda4af', '#fb7185', '#ffe4e6']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ['#f43f5e', '#fda4af', '#fb7185', '#ffe4e6']
      });
    }, 220);
  };

  const handleToggleBloom = (id: string) => {
    const nextState = !bloomedFlowers[id];
    setBloomedFlowers(prev => ({ ...prev, [id]: nextState }));
    if (nextState) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#f43f5e', '#fde047']
      });
    }
  };

  const handleBloomAll = () => {
    const all: Record<string, boolean> = {};
    FLOWER_BOUQUET.forEach(f => { all[f.id] = true; });
    setBloomedFlowers(all);
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.4 },
      colors: ['#fda4af', '#f43f5e', '#fde047', '#f472b6', '#ffffff']
    });
  };

  const handleShowerPetals = () => {
    confetti({
      particleCount: 80,
      spread: 110,
      origin: { y: 0.3 },
      colors: ['#fda4af', '#f43f5e', '#fb7185', '#ffe4e6']
    });
  };

  const recipient = birthdayConfig?.recipient_name || 'Akku';
  const creator = birthdayConfig?.creator_name || 'Saki';
  const greeting = birthdayConfig?.greeting_title || `Happy Birthday, ${recipient}! ❤️`;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 animate-fade-in space-y-10 sm:space-y-12">
      {/* Cinematic Ambient Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-rose-400/15 rounded-full blur-3xl animate-warm-breathe" />
        <div className="absolute bottom-20 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-pink-300/20 rounded-full blur-3xl animate-warm-breathe" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Welcome Banner */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-4">
        {/* Subtle romantic pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-medium shadow-xs backdrop-blur-md animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-rose-500 fill-rose-300" />
          <span>A Personalized Birthday World Created by {creator} for His Forever Love</span>
        </div>

        {/* Romantic Main Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
          {greeting}
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Welcome to your private memory sanctuary. Every laugh, message, promise, and cherished detail is remembered here forever.
        </p>

        {/* Quick Action CTA Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenSurprise ? onOpenSurprise() : onNavigate('birthday')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-200/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Gift className="w-4 h-4 animate-bounce" />
            <span>Open Birthday Surprise</span>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-900 font-semibold text-xs sm:text-sm shadow-xs border border-rose-200/80 hover:border-rose-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircleHeart className="w-4 h-4 text-rose-500" />
            <span>Talk to Akku AI</span>
          </button>

          <button
            onClick={handleSendHeart}
            className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-rose-50 hover:bg-rose-100/80 text-rose-700 font-medium text-xs sm:text-sm border border-rose-200/60 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
            title="Send love to Saki"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-heart-pulse" />
            <span>Send Love ({heartsSent})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE RELATIONSHIP MILESTONE COUNTER                                     */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-50/90 via-pink-50/80 to-rose-50/90 border border-rose-200/80 shadow-lg shadow-rose-100/50 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-200/60 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-200/80 text-rose-700">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Days We've Loved Each Other
              </h2>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm font-light mt-1">
              Counting every heartbeat since our proposal on May 4, 2022
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-rose-200 text-rose-700 text-xs font-semibold shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>May 4, 2022 • The Samosa Walk Proposal</span>
          </div>
        </div>

        {/* Live Milestone Time Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/95 border border-rose-100 shadow-xs">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-rose-600">{elapsed.days}</div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mt-1 block">Days Together</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/95 border border-rose-100 shadow-xs">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-800">{elapsed.hours}</div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mt-1 block">Hours</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/95 border border-rose-100 shadow-xs">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-800">{elapsed.minutes}</div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mt-1 block">Minutes</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/95 border border-rose-100 shadow-xs">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-rose-600 font-mono animate-pulse">{elapsed.seconds}</div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mt-1 block">Seconds</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE MAGIC CARD: "REASONS WHY SAKI LOVES AKKU"                  */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-rose-200/80 shadow-xl shadow-rose-100/60 backdrop-blur-xl relative overflow-hidden">
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
      {/* 4. OUR MEMORY LANE — WITH SURPRISE FLOWER BOUQUET BUTTON                  */}
      {/* ========================================================================= */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-1">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
              <span>Our Memory Lane</span>
              <Smile className="w-6 h-6 text-rose-500" />
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-light mt-1">
              Snapshots of laughter, ocean waves, and unforgettable memories with you.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
            {/* The Grand Surprise Flower Button! */}
            <button
              onClick={handleTriggerFlowerSurprise}
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-600 hover:via-pink-600 hover:to-amber-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-200/80 hover:shadow-xl hover:shadow-rose-300/80 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/30"
              title="Open Secret Flower Surprise for Akku"
            >
              <span className="text-base animate-bounce" style={{ animationDuration: '1.8s' }}>🌸</span>
              <span className="font-serif tracking-wide">Flower Surprise for Akku 💐</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            </button>

            <button
              onClick={() => onNavigate('memories')}
              className="text-xs sm:text-sm text-rose-700 font-semibold hover:text-rose-900 flex items-center gap-1 cursor-pointer bg-rose-50/90 hover:bg-rose-100/90 px-3.5 py-2 rounded-full border border-rose-200/80 shadow-2xs transition-colors"
            >
              <span>View All Memories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Polaroid Strip Grid with Washi Tape & Full Titles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 pt-3">
          {POLAROID_MEMORIES.map((photo, idx) => {
            const likes = photoLikes[photo.id] || 0;
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-white p-3 pt-4 pb-5 rounded-2xl border border-rose-100 shadow-md hover:shadow-2xl hover:shadow-rose-100/80 transition-all duration-300 hover:-translate-y-2 hover:rotate-0 cursor-pointer flex flex-col justify-between"
                style={{
                  transform: `rotate(${idx % 2 === 0 ? '-1.5deg' : '1.5deg'})`
                }}
              >
                {/* Washi Tape Ribbon Accent */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-gradient-to-r from-amber-100/90 via-rose-100/90 to-amber-100/90 border border-amber-200/50 shadow-2xs rounded-xs transform -rotate-1 pointer-events-none z-10" />

                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-2.5 shadow-inner">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                    <span className="text-[10px] text-white font-medium">Zoom Photo</span>
                  </div>
                </div>

                {/* Polaroid Text (Guaranteed No Ellipsis / No Truncation) */}
                <div className="text-center px-0.5 flex flex-col justify-between flex-1">
                  <h4 className="font-serif text-xs font-bold text-stone-900 leading-snug min-h-[32px] flex items-center justify-center text-center">
                    {photo.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-rose-50">
                    <span className="text-[10px] text-rose-600 font-semibold font-mono">
                      {photo.date}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleLikePhoto(e, photo.id)}
                      className="p-1 rounded-full hover:bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors flex items-center gap-0.5"
                      title="Send love to this memory"
                    >
                      <Heart className={`w-3.5 h-3.5 ${likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                      {likes > 0 && <span className="text-[9px] font-bold text-rose-600">{likes}</span>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. "OPEN WHEN..." DIGITAL LOVE LETTERS (SURPRISE FOR AKKU)                */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/70 via-cream-50/60 to-pink-50/70 border border-rose-200/80 shadow-lg shadow-rose-100/50 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
                <Mail className="w-5 h-5" />
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                "Open When..." Love Envelopes 💌
              </h3>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm font-light mt-1">
              Four digital letters sealed with love. Tap an envelope whenever you need comfort or a reminder of my love.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-rose-200 text-rose-700 shadow-2xs">
            Handwritten by Saki ❤️
          </span>
        </div>

        {/* 4 Envelopes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OPEN_WHEN_LETTERS.map((letter) => (
            <div
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className="group relative bg-white/95 rounded-2xl p-5 border border-rose-200/80 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{letter.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono">
                    {letter.badge}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-rose-600 transition-colors mb-1.5">
                  {letter.envelopeTitle}
                </h4>
                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                  A personal message waiting just for you. Tap to break wax seal and read.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-semibold text-rose-600">
                <span>Break Seal & Read</span>
                <span className="group-hover:translate-x-1 transition-transform">💌 →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. OUR LOVE STORY JOURNEY — INTERACTIVE MILESTONES ROADMAP                 */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-rose-200/80 shadow-lg shadow-rose-100/50 backdrop-blur-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-rose-500" />
            <span>Our Journey Together</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            How Two Strangers Became Everything
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm font-light mt-1">
            Every step, every year, every quiet promise that brought us to today.
          </p>
        </div>

        {/* Milestones Road */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {LOVE_MILESTONES.map((m, idx) => (
            <div 
              key={idx}
              className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 shadow-2xs hover:shadow-md hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-[10px] font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-100">
                    {m.year}
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-stone-900 mb-0.5">
                  {m.title}
                </h4>
                <p className="text-[11px] font-semibold text-rose-600 mb-2">
                  {m.subtitle}
                </p>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                  {m.desc}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-rose-100/60 flex items-center gap-1 text-[10px] text-stone-400">
                <Clock className="w-3 h-3 text-rose-400" />
                <span>Chapter 0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. FEATURE NAVIGATION GLASSMORPHIC CARDS                                  */}
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
      {/* 8. LIGHTBOX PHOTO MODAL                                                   */}
      {/* ========================================================================= */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white p-5 rounded-3xl shadow-2xl flex flex-col gap-3.5 my-auto border border-rose-200"
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

            <p className="text-stone-700 text-sm font-light text-center italic px-2 pt-1 leading-relaxed">
              "{selectedPhoto.caption}"
            </p>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow-md cursor-pointer hover:brightness-105"
            >
              Close Memory ❤️
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. "OPEN WHEN..." LETTER REVEAL MODAL                                     */}
      {/* ========================================================================= */}
      {selectedLetter && (
        <div
          onClick={() => setSelectedLetter(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#fffdfb] p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-4 my-auto border border-rose-200 relative overflow-hidden animate-scale-up"
          >
            {/* Wax Seal Stamp Accent */}
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedLetter.icon}</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-rose-950">
                    {selectedLetter.letterTitle}
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {selectedLetter.envelopeTitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Letter Content */}
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <p className="font-serif italic text-sm sm:text-base text-stone-800 whitespace-pre-line leading-relaxed">
                {selectedLetter.letterMessage}
              </p>
            </div>

            <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Written with Saki's Whole Heart</span>
              </span>
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-xs cursor-pointer hover:brightness-105"
              >
                Keep In My Heart ❤️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. AKKU'S SECRET FLOWER GARDEN SURPRISE MODAL                            */}
      {/* ========================================================================= */}
      {isFlowerSurpriseOpen && (
        <div
          onClick={() => setIsFlowerSurpriseOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-gradient-to-b from-rose-50 via-white to-pink-50/70 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-5 my-auto border border-rose-200 relative overflow-hidden animate-scale-up"
          >
            {/* Soft background petal particle floating effect */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-rose-200/70 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-md animate-floral-sway">
                  💐
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold font-mono tracking-wider uppercase mb-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Saki's Eternal Floral Sanctuary</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    A Bouquet That Will Never Wither 🌸
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsFlowerSurpriseOpen(false)}
                className="p-2 rounded-full hover:bg-rose-100 text-stone-400 hover:text-stone-800 cursor-pointer transition-colors"
                title="Close bouquet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Emotional Lead Note */}
            <div className="bg-white/80 p-4 rounded-2xl border border-rose-100 shadow-2xs relative z-10 text-center">
              <p className="font-serif italic text-stone-800 text-xs sm:text-sm leading-relaxed">
                "Real flowers fade in a few days, but these digital blooms carry my love that will stay fresh, fragrant, and vibrant forever. Tap each flower below to watch it bloom!"
              </p>
            </div>

            {/* 6 Interactive Blooming Flowers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 relative z-10 max-h-[48vh] overflow-y-auto pr-1">
              {FLOWER_BOUQUET.map((flower) => {
                const isBloomed = !!bloomedFlowers[flower.id];
                return (
                  <div
                    key={flower.id}
                    onClick={() => handleToggleBloom(flower.id)}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isBloomed
                        ? 'bg-white shadow-md border-rose-200/90 hover:shadow-lg'
                        : 'bg-white/60 border-stone-200/60 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl transition-transform duration-300 ${
                          isBloomed ? 'animate-flower-bloom scale-110' : 'scale-90 opacity-70'
                        }`}>
                          {flower.symbol}
                        </span>
                        <div>
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900">
                            {flower.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-rose-600 font-mono">
                            {flower.meaning}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isBloomed
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}>
                        {isBloomed ? 'Bloomed 🌸' : 'Tap to Bloom'}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 font-light leading-relaxed mt-1">
                      {flower.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-rose-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBloomAll}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-semibold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Bloom Entire Garden 🌺✨
                </button>
                <button
                  onClick={handleShowerPetals}
                  className="px-3 py-2 rounded-xl bg-rose-100/80 hover:bg-rose-200 text-rose-800 font-medium text-xs transition-colors cursor-pointer"
                >
                  Shower Petals 🌹🌧️
                </button>
              </div>

              <button
                onClick={() => setIsFlowerSurpriseOpen(false)}
                className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
              >
                Keep in My Heart ❤️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
