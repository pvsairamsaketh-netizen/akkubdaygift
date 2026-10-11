import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircleHeart, 
  Gift, 
  BookmarkCheck, 
  FileText, 
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

export type NavTab = 'home' | 'chat' | 'birthday' | 'memories' | 'library' | 'academics' | 'settings';

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
    if (onOpenSurprise) {
      onOpenSurprise();
    } else if (onOpenEnvelope) {
      onOpenEnvelope();
    }
  };

  // Primary Navigation Items
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircleHeart className="w-3.5 h-3.5 text-rose-600 shrink-0" /> },
    { id: 'birthday', label: 'Birthday', icon: <Gift className="w-3.5 h-3.5 text-rose-500 shrink-0" /> },
    { id: 'memories', label: 'Memories', icon: <BookmarkCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" /> },
    { id: 'library', label: 'Library', icon: <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" /> },
    { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-3.5 h-3.5 text-rose-500 shrink-0" /> },
  ];

  // Top 5 items for medium screens (1000px - 1239px)
  const primaryFive = [navItems[0], navItems[1], navItems[2], navItems[3], navItems[5]]; // Home, Chat, Birthday, Memories, Academics
  // Secondary 2 items inside More dropdown for medium screens
  const secondaryTwo = [navItems[4], navItems[6]]; // Library, Settings

  const isSecondaryActive = secondaryTwo.some(item => item.id === activeTab);
  const activeSecondaryItem = secondaryTwo.find(item => item.id === activeTab);

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  // Fixed uniform bounding box classes for all navbar buttons
  const navBtnBase = "w-[96px] h-8.5 rounded-full flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 select-none";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/90 shadow-xs transition-all w-full">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="navbar flex items-center justify-between h-16 w-full min-w-0 gap-3">
          
          {/* ========================================================== */}
          {/* GROUP 1 & 2: BRAND LOGO + LEFT-ALIGNED NAVIGATION          */}
          {/* ========================================================== */}
          <div className="navbar-left flex items-center min-w-0 flex-1 justify-start gap-2.5 sm:gap-3.5">
            {/* Brand Logo (Always compact, never pushes nav buttons) */}
            <div 
              onClick={() => handleSelect('home')}
              className="flex items-center gap-2 cursor-pointer group shrink-0 pr-2 border-r border-rose-100/80"
              title="Akku & Saki — A Love Journey"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 flex items-center justify-center shadow-xs shadow-rose-200 group-hover:scale-105 transition-transform shrink-0">
                <Heart className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
              </div>
              <span className="font-serif text-sm font-bold text-rose-950 tracking-tight whitespace-nowrap hidden sm:inline">
                Akku & Saki
              </span>
            </div>

            {/* Desktop Left Navigation (>= 1320px: All 7 Items with Fixed Pink BBox Size) */}
            <nav className="primary-navigation hidden min-[1320px]:flex items-center gap-1.5 lg:gap-2 justify-start min-w-0">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`${navBtnBase} ${
                      isActive
                        ? 'bg-rose-500 text-white font-semibold shadow-xs shadow-rose-200'
                        : 'text-stone-700 hover:text-rose-950 hover:bg-rose-50/80 font-medium'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Medium Desktop Left Navigation (1000px - 1319px: Top 5 + More Dropdown) */}
            <nav className="primary-navigation hidden min-[1000px]:flex min-[1320px]:hidden items-center gap-1.5 justify-start min-w-0">
              {primaryFive.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`${navBtnBase} ${
                      isActive
                        ? 'bg-rose-500 text-white font-semibold shadow-xs shadow-rose-200'
                        : 'text-stone-700 hover:text-rose-950 hover:bg-rose-50/80 font-medium'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* More ⋯ Dropdown */}
              <div className="relative shrink-0" ref={moreRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`${navBtnBase} border ${
                    isSecondaryActive
                      ? 'bg-rose-500 text-white border-rose-500 font-semibold shadow-xs'
                      : 'border-rose-100 text-stone-700 hover:text-rose-900 hover:bg-rose-50/80 bg-white font-medium'
                  }`}
                  aria-label="More navigation links"
                >
                  <MoreHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : 'More'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-xl py-2 z-50 animate-fade-in flex flex-col gap-1">
                    {secondaryTwo.map((item) => {
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
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* ========================================================== */}
          {/* GROUP 3: RIGHT ACTIONS (Open Surprise + Audio Player)      */}
          {/* ========================================================== */}
          <div className="navbar-right flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
            {/* Open Surprise Button */}
            {(onOpenSurprise || onOpenEnvelope) && (
              <button
                id="nav-open-surprise-btn"
                onClick={handleSurpriseClick}
                className="group relative flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-pink-500/15 to-rose-500/10 hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 text-rose-800 hover:text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95 border border-rose-200/80 hover:border-transparent cursor-pointer shrink-0 whitespace-nowrap"
                title="Open Romantic Surprise"
                aria-label="Open surprise"
              >
                {isUnlocked ? (
                  <Heart className="w-3.5 h-3.5 text-rose-600 group-hover:text-white fill-rose-500/30 group-hover:fill-white transition-colors animate-pulse shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-rose-600 group-hover:text-white transition-colors shrink-0" />
                )}
                <span className="hidden sm:inline font-sans whitespace-nowrap">
                  <span className="hidden min-[1200px]:inline">Open </span>Surprise
                </span>
                <span className="text-xs shrink-0">💌</span>
              </button>
            )}

            {/* Audio Player */}
            <div className="shrink-0">
              <RomanticAudioPlayer />
            </div>

            {/* Mobile Hamburger Toggle (< 1000px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-[1000px]:hidden p-1.5 rounded-lg text-rose-900 hover:bg-rose-100/60 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================== */}
      {/* MOBILE DRAWER (< 1000px)                                   */}
      {/* ========================================================== */}
      {mobileMenuOpen && (
        <div className="min-[1000px]:hidden border-b border-rose-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1.5 animate-fade-in shadow-xl">
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
                  className={`w-full h-11 flex items-center justify-start gap-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-sm font-semibold'
                      : 'text-stone-700 hover:bg-rose-50 hover:text-rose-950'
                  }`}
                >
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
