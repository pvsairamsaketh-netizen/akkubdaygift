import React, { useState, useRef, useEffect } from 'react';
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
  GraduationCap,
  MoreHorizontal,
  ChevronDown
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

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const { triggerMemoryPhoto } = useMemoryPhotos();

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    if (moreDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [moreDropdownOpen]);

  const handleSurpriseClick = () => {
    triggerMemoryPhoto('surprise');
    if (onOpenSurprise) {
      onOpenSurprise();
    } else if (onOpenEnvelope) {
      onOpenEnvelope();
    }
  };

  // Exact 8 Navigation Items in required visual order
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" /> },
    { id: 'chat', label: 'Chat with Akku', icon: <MessageCircleHeart className="w-4 h-4 text-rose-600 shrink-0" /> },
    { id: 'birthday', label: 'Birthday', icon: <Gift className="w-4 h-4 text-rose-500 shrink-0" />, badge: 'SPECIAL' },
    { id: 'memories', label: 'Memories', icon: <BookmarkCheck className="w-4 h-4 text-rose-500 shrink-0" /> },
    { id: 'library', label: 'PDF Library', icon: <FileText className="w-4 h-4 text-rose-500 shrink-0" /> },
    { id: 'voice', label: 'Voice', icon: <Mic className="w-4 h-4 text-rose-500 shrink-0" /> },
    { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />, badge: 'DE100D' },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4 text-rose-500 shrink-0" /> },
  ];

  // Primary 4 items for medium screens
  const primaryFour = navItems.slice(0, 4);
  // Secondary 4 items for medium screen dropdown
  const secondaryFour = navItems.slice(4);

  const isSecondaryActive = secondaryFour.some(item => item.id === activeTab);
  const activeSecondaryItem = secondaryFour.find(item => item.id === activeTab);

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/90 shadow-xs transition-all">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* ========================================================== */}
          {/* LEFT: Compact Brand + Tightly Grouped Navigation Items     */}
          {/* ========================================================== */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 justify-start">
            {/* Compact Brand Logo */}
            <div 
              onClick={() => handleSelect('home')}
              className="flex items-center gap-2 cursor-pointer group shrink-0 pr-1 border-r border-rose-100 hidden sm:flex"
              title="Akku & Saki — A Love Journey"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 flex items-center justify-center shadow-xs shadow-rose-200 group-hover:scale-105 transition-transform">
                <Heart className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
              </div>
              <span className="font-serif text-sm font-bold text-rose-950 tracking-tight whitespace-nowrap hidden lg:inline">
                Akku & Saki
              </span>
            </div>

            {/* Mobile Brand (When < sm) */}
            <div 
              onClick={() => handleSelect('home')}
              className="flex items-center gap-1.5 cursor-pointer sm:hidden shrink-0"
            >
              <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
            </div>

            {/* Desktop Left-Aligned Navigation Group (Screens >= 1180px: All 8 items) */}
            <nav className="hidden min-[1180px]:flex items-center gap-1 sm:gap-1.5 lg:gap-2 justify-start">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-rose-500 text-white font-semibold shadow-xs shadow-rose-200'
                        : 'text-stone-700 hover:text-rose-950 hover:bg-rose-50/80 font-medium'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none uppercase ${
                        isActive 
                          ? 'bg-white/25 text-white' 
                          : item.id === 'academics' 
                            ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                            : 'bg-rose-100 text-rose-600 border border-rose-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Medium Desktop Left-Aligned Navigation (820px - 1179px: Top 4 + More Dropdown) */}
            <nav className="hidden md:flex min-[1180px]:hidden items-center gap-1.5 justify-start">
              {primaryFour.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-rose-500 text-white font-semibold shadow-xs shadow-rose-200'
                        : 'text-stone-700 hover:text-rose-950 hover:bg-rose-50/80 font-medium'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none uppercase ${
                        isActive ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-600 border border-rose-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* More ⋯ Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                    isSecondaryActive
                      ? 'bg-rose-500 text-white border-rose-500 font-semibold shadow-xs'
                      : 'border-rose-100 text-stone-700 hover:text-rose-900 hover:bg-rose-50/80 bg-white'
                  }`}
                  aria-label="More navigation links"
                >
                  <MoreHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : 'More'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-xl py-2 z-50 animate-fade-in flex flex-col gap-1">
                    {secondaryFour.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                            isActive
                              ? 'bg-rose-500 text-white font-semibold'
                              : 'text-stone-700 hover:bg-rose-50/80 hover:text-rose-950'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none uppercase ${
                              isActive 
                                ? 'bg-white/25 text-white' 
                                : item.id === 'academics' 
                                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                  : 'bg-rose-100 text-rose-600 border border-rose-200'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* ========================================================== */}
          {/* RIGHT: Special Controls (Open Surprise + Audio Player)     */}
          {/* ========================================================== */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            {/* Open Surprise Button */}
            {(onOpenSurprise || onOpenEnvelope) && (
              <button
                id="nav-open-surprise-btn"
                onClick={handleSurpriseClick}
                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-pink-500/15 to-rose-500/10 hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 text-rose-800 hover:text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95 border border-rose-200/80 hover:border-transparent cursor-pointer"
                title="Open Romantic Surprise"
                aria-label="Open surprise"
              >
                {isUnlocked ? (
                  <Heart className="w-3.5 h-3.5 text-rose-600 group-hover:text-white fill-rose-500/30 group-hover:fill-white transition-colors animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-rose-600 group-hover:text-white transition-colors" />
                )}
                <span className="hidden lg:inline font-sans">Open Surprise</span>
                <span className="text-xs">💌</span>
              </button>
            )}

            {/* Audio Player */}
            <div className="shrink-0">
              <RomanticAudioPlayer />
            </div>

            {/* Mobile Hamburger Toggle (< md / 768px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-rose-900 hover:bg-rose-100/60 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================== */}
      {/* MOBILE DRAWER (< md)                                       */}
      {/* ========================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1.5 animate-fade-in shadow-xl">
          {(onOpenSurprise || onOpenEnvelope) && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSurpriseClick();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm mb-3 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Open Birthday Surprise</span>
              </div>
              <span>💌</span>
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-sm font-semibold'
                      : 'text-stone-700 hover:bg-rose-50 hover:text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isActive 
                        ? 'bg-white/25 text-white' 
                        : item.id === 'academics' 
                          ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                          : 'bg-rose-100 text-rose-600 border border-rose-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
