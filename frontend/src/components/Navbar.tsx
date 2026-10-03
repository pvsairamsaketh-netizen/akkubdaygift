import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircleHeart, 
  Gift, 
  BookmarkCheck, 
  FileText, 
  Mic, 
  Sliders,
  Menu,
  X,
  Lock,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { RomanticAudioPlayer } from './RomanticAudioPlayer';
import { useMemoryPhotos } from '../context/MemoryPhotoContext';

export type NavTab = 'home' | 'chat' | 'birthday' | 'memories' | 'library' | 'voice' | 'academics' | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenEnvelope?: () => void;
  onOpenSurprise?: () => void;
  isUnlocked?: boolean;
  birthdayConfig?: {
    recipient_name: string;
    creator_name: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onTabChange, 
  onOpenEnvelope,
  onOpenSurprise,
  isUnlocked = false,
  birthdayConfig: _birthdayConfig 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { triggerMemoryPhoto } = useMemoryPhotos();

  const handleSurpriseClick = () => {
    triggerMemoryPhoto('surprise');
    if (onOpenSurprise) {
      onOpenSurprise();
    } else if (onOpenEnvelope) {
      onOpenEnvelope();
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> },
    { id: 'chat', label: 'Chat with Akku', icon: <MessageCircleHeart className="w-3.5 h-3.5 text-rose-600" /> },
    { id: 'birthday', label: 'Birthday', icon: <Gift className="w-3.5 h-3.5 text-rose-500" />, badge: 'Special' },
    { id: 'memories', label: 'Memories', icon: <BookmarkCheck className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'library', label: 'PDF Library', icon: <FileText className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'voice', label: 'Voice', icon: <Mic className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-3.5 h-3.5 text-amber-500" />, badge: 'DE 100D' },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-3.5 h-3.5 text-rose-500" /> },
  ];

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-rose-100/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left Aligned Section: Brand Logo + Navigation Pills */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            {/* Logo & Brand Title */}
            <div 
              onClick={() => handleSelect('home')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
              title="Akku & Saki — A Love Journey"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 flex items-center justify-center shadow-sm shadow-rose-200 group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-serif text-base sm:text-lg font-bold text-rose-950 tracking-tight whitespace-nowrap">
                    Akku & Saki
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100/80 text-rose-700 font-semibold font-sans">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-rose-500/70 font-sans mt-0.5 hidden md:block whitespace-nowrap">
                  For Akku with ❤️
                </span>
              </div>
            </div>

            {/* Desktop Left-Aligned Navigation Elements */}
            <nav className="hidden xl:flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-100 font-semibold'
                        : 'text-stone-600 hover:text-rose-900 hover:bg-rose-50/80'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Open Surprise Button + Romantic Melody + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Open Surprise Button */}
            {(onOpenSurprise || onOpenEnvelope) && (
              <button
                id="nav-open-surprise-btn"
                onClick={handleSurpriseClick}
                className="group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-pink-500/15 to-rose-500/10 hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 text-rose-800 hover:text-white text-xs font-semibold shadow-xs hover:shadow-md hover:shadow-rose-300/40 transition-all hover:scale-105 active:scale-95 border border-rose-200/80 hover:border-transparent cursor-pointer"
                title="Open Romantic Surprise"
              >
                {isUnlocked ? (
                  <Heart className="w-3.5 h-3.5 text-rose-600 group-hover:text-white fill-rose-500/30 group-hover:fill-white transition-colors animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-rose-600 group-hover:text-white transition-colors" />
                )}
                <span className="hidden sm:inline font-sans">Open Surprise</span>
                <span className="text-xs">💌</span>
              </button>
            )}

            {/* Melody Player */}
            <RomanticAudioPlayer />

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-rose-900 hover:bg-rose-100/60 transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile / Compact Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-rose-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1.5 animate-fade-in shadow-lg">
          {/* Mobile Surprise Shortcut */}
          {(onOpenSurprise || onOpenEnvelope) && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSurpriseClick();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm mb-2"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Open Birthday Surprise</span>
              </div>
              <span>💌</span>
            </button>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm font-semibold'
                    : 'text-stone-700 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
