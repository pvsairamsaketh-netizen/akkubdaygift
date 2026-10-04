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
  secondary?: boolean; // Shown in "More" on medium screens
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

  // Primary navigation items (Always visible on desktop)
  const primaryNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" /> },
    { id: 'chat', label: 'Chat with Akku', icon: <MessageCircleHeart className="w-4 h-4 text-rose-600 shrink-0" /> },
    { id: 'birthday', label: 'Birthday', icon: <Gift className="w-4 h-4 text-rose-500 shrink-0" />, badge: 'Special' },
    { id: 'memories', label: 'Memories', icon: <BookmarkCheck className="w-4 h-4 text-rose-500 shrink-0" /> },
  ];

  // Secondary navigation items (Visible on wide screens, folded into "More" on medium screens)
  const secondaryNavItems: NavItem[] = [
    { id: 'library', label: 'PDF Library', icon: <FileText className="w-4 h-4 text-rose-500 shrink-0" />, secondary: true },
    { id: 'voice', label: 'Voice', icon: <Mic className="w-4 h-4 text-rose-500 shrink-0" />, secondary: true },
    { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />, badge: 'DE 100D', secondary: true },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4 text-rose-500 shrink-0" />, secondary: true },
  ];

  // All items combined for mobile drawer & wide screens
  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  // Check if an item inside "More" is currently active
  const isSecondaryActive = secondaryNavItems.some(item => item.id === activeTab);
  const activeSecondaryItem = secondaryNavItems.find(item => item.id === activeTab);

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100/80 shadow-xs transition-all">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-3">
          
          {/* ==================================================== */}
          {/* LEFT SIDE: Brand Logo + Primary Desktop Navigation   */}
          {/* ==================================================== */}
          <div className="flex items-center gap-4 lg:gap-6 min-w-0">
            {/* Logo & Brand Title */}
            <div 
              onClick={() => handleSelect('home')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
              title="Akku & Saki — A Love Journey"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 flex items-center justify-center shadow-xs shadow-rose-200 group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-serif text-base sm:text-lg font-bold text-rose-950 tracking-tight whitespace-nowrap">
                    Akku & Saki
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100/90 text-rose-700 font-semibold font-sans">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-rose-500/70 font-sans mt-0.5 hidden xl:block whitespace-nowrap">
                  For Akku with ❤️
                </span>
              </div>
            </div>

            {/* Desktop Navigation Elements (>= 1024px) */}
            <nav className="hidden lg:flex items-center gap-1.5 sm:gap-2">
              {/* 1. Primary Navigation Pills */}
              {primaryNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-200 font-semibold scale-100'
                        : 'text-stone-600 hover:text-rose-950 hover:bg-rose-50/80'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full leading-none ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* 2. Secondary Navigation Items on Ultra-Wide Screens (>= 1400px) */}
              <div className="hidden 2xl:flex items-center gap-1.5">
                {secondaryNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-500 text-white shadow-sm shadow-rose-200 font-semibold scale-100'
                          : 'text-stone-600 hover:text-rose-950 hover:bg-rose-50/80'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full leading-none ${
                          isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 3. "More ⋯" Dropdown on Medium/Desktop Screens (< 1400px) */}
              <div className="relative 2xl:hidden" ref={moreRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                    isSecondaryActive
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm font-semibold'
                      : 'border-rose-100 text-stone-600 hover:text-rose-900 hover:bg-rose-50/80 bg-white/80'
                  }`}
                  aria-label="More navigation items"
                  aria-expanded={moreDropdownOpen}
                >
                  <MoreHorizontal className="w-4 h-4 shrink-0" />
                  <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : 'More'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-xl py-2 z-50 animate-fade-in flex flex-col gap-1">
                    {secondaryNavItems.map((item) => {
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
                          <div className="flex items-center gap-2.5">
                            <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full leading-none ${
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
              </div>
            </nav>
          </div>

          {/* ==================================================== */}
          {/* RIGHT SIDE: Open Surprise + Audio Player + Hamburger */}
          {/* ==================================================== */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Open Surprise Button */}
            {(onOpenSurprise || onOpenEnvelope) && (
              <button
                id="nav-open-surprise-btn"
                onClick={handleSurpriseClick}
                className="group relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-pink-500/15 to-rose-500/10 hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 text-rose-800 hover:text-white text-xs font-semibold shadow-xs hover:shadow-md hover:shadow-rose-300/40 transition-all hover:scale-105 active:scale-95 border border-rose-200/80 hover:border-transparent cursor-pointer"
                title="Open Romantic Surprise"
                aria-label="Open surprise"
              >
                {isUnlocked ? (
                  <Heart className="w-3.5 h-3.5 text-rose-600 group-hover:text-white fill-rose-500/30 group-hover:fill-white transition-colors animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-rose-600 group-hover:text-white transition-colors" />
                )}
                <span className="hidden md:inline font-sans">Open Surprise</span>
                <span className="text-xs">💌</span>
              </button>
            )}

            {/* Combined Compact Audio Player */}
            <div className="shrink-0">
              <RomanticAudioPlayer />
            </div>

            {/* Mobile / Tablet Menu Button (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-rose-900 hover:bg-rose-100/60 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ==================================================== */}
      {/* MOBILE / COMPACT MENU DRAWER (< 1024px)              */}
      {/* ==================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-rose-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1.5 animate-fade-in shadow-xl">
          {/* Mobile Surprise Shortcut */}
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

          {/* Mobile Navigation List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allNavItems.map((item) => {
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
        </div>
      )}
    </header>
  );
};
