import { useState, useEffect } from 'react';
import { Navbar, type NavTab } from './components/Navbar';
import { FloatingHearts } from './components/FloatingHearts';
import { RealisticRosePetals } from './components/RealisticRosePetals';
import { RomanticEnvelopeModal } from './components/RomanticEnvelopeModal';
import { LockedExperience } from './components/LockedExperience';
import { CinematicRevealOverlay } from './components/CinematicRevealOverlay';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { BirthdayPage } from './pages/BirthdayPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { PdfLibraryPage } from './pages/PdfLibraryPage';
import { VoiceSettingsPage } from './pages/VoiceSettingsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { api } from './services/api';
import type { BirthdayConfig } from './types/memories';

const getInitialTab = (): NavTab => {
  try {
    const hash = window.location.hash.toLowerCase().replace('#', '');
    const path = window.location.pathname.toLowerCase();
    if (hash === 'academics' || path.startsWith('/academics')) return 'academics';
    if (hash === 'chat' || path.startsWith('/chat')) return 'chat';
    if (hash === 'birthday' || path.startsWith('/birthday')) return 'birthday';
    if (hash === 'memories' || path.startsWith('/memories')) return 'memories';
    if (hash === 'library' || path.startsWith('/library')) return 'library';
    if (hash === 'voice' || path.startsWith('/voice')) return 'voice';
    if (hash === 'settings' || path.startsWith('/settings')) return 'settings';
  } catch {}
  return 'home';
};

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(getInitialTab);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [floatingHeartsEnabled, setFloatingHeartsEnabled] = useState<boolean>(true);
  
  // Surprise & Password Protection State (Session-persisted)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('saki_akku_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  
  const [isCinematicRevealing, setIsCinematicRevealing] = useState<boolean>(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [birthdayConfig, setBirthdayConfig] = useState<BirthdayConfig | null>(null);

  useEffect(() => {
    api.getBirthdayConfig().then(res => {
      if (res) setBirthdayConfig(res);
    }).catch(err => console.error("Could not fetch birthday config:", err));
  }, []);

  // Synchronize hash with activeTab for refresh & direct navigation
  useEffect(() => {
    try {
      if (activeTab === 'home') {
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname);
        }
      } else {
        history.replaceState(null, '', `#${activeTab}`);
      }
    } catch {}
  }, [activeTab]);

  const handleUnlockSuccess = () => {
    try {
      sessionStorage.setItem('saki_akku_unlocked', 'true');
    } catch {}

    // Trigger the cinematic romantic reveal transition
    setIsCinematicRevealing(true);
  };

  const handleCinematicComplete = () => {
    setIsCinematicRevealing(false);
    setIsUnlocked(true);
  };

  const handleLockApp = () => {
    try {
      sessionStorage.removeItem('saki_akku_unlocked');
    } catch {}
    setIsUnlocked(false);
    setIsEnvelopeOpen(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#fff7f8] via-[#fefaf8] to-[#fff3f5] text-stone-800 flex flex-col font-sans relative overflow-x-hidden ${reduceMotion ? 'motion-reduce' : ''}`}>
      {/* 1. LOCKED EXPERIENCE (Shown initially until 2022 is entered) */}
      {!isUnlocked && !isCinematicRevealing && (
        <LockedExperience
          onUnlockSuccess={handleUnlockSuccess}
          recipientName={birthdayConfig?.recipient_name || 'Akku'}
          creatorName={birthdayConfig?.creator_name || 'Saki'}
        />
      )}

      {/* Cinematic Heart Expansion Reveal Transition */}
      <CinematicRevealOverlay
        isActive={isCinematicRevealing}
        onComplete={handleCinematicComplete}
        recipientName={birthdayConfig?.recipient_name || 'Akku'}
        creatorName={birthdayConfig?.creator_name || 'Saki'}
      />

      {/* 2. POST-UNLOCK BIRTHDAY EXPERIENCE (Revealed only after correct password 2022) */}
      {isUnlocked && (
        <div className="flex-1 flex flex-col animate-fade-in">
          {/* Ambient Floating Hearts & 3D Rose Petals */}
          <FloatingHearts count={18} enabled={floatingHeartsEnabled && !reduceMotion} />
          <RealisticRosePetals enabled={floatingHeartsEnabled && !reduceMotion} />

          {/* Top Navbar with Left-Aligned Elements */}
          <Navbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenSurprise={() => setIsEnvelopeOpen(true)}
            isUnlocked={isUnlocked}
            birthdayConfig={birthdayConfig ? {
              recipient_name: birthdayConfig.recipient_name,
              creator_name: birthdayConfig.creator_name
            } : undefined}
          />

          {/* Main Page Content */}
          <main className="flex-1 relative z-10 overflow-y-auto">
            {activeTab === 'home' && (
              <HomePage 
                onNavigate={setActiveTab} 
                birthdayConfig={birthdayConfig} 
                onOpenSurprise={() => setIsEnvelopeOpen(true)}
                isUnlocked={isUnlocked}
              />
            )}

            {activeTab === 'chat' && (
              <div className="h-[calc(100vh-4rem)]">
                <ChatPage />
              </div>
            )}

            {activeTab === 'birthday' && (
              <BirthdayPage 
                onNavigate={setActiveTab} 
                birthdayConfig={birthdayConfig} 
                isUnlocked={isUnlocked}
                onRequestUnlock={() => setIsEnvelopeOpen(true)}
              />
            )}

            {activeTab === 'memories' && (
              <MemoriesPage />
            )}

            {activeTab === 'library' && (
              <PdfLibraryPage />
            )}

            {activeTab === 'voice' && (
              <VoiceSettingsPage />
            )}

            {activeTab === 'academics' && (
              <AcademicsPage />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                onConfigUpdated={(cfg) => setBirthdayConfig(cfg)}
                reduceMotion={reduceMotion}
                setReduceMotion={setReduceMotion}
                floatingHeartsEnabled={floatingHeartsEnabled}
                setFloatingHeartsEnabled={setFloatingHeartsEnabled}
                onLockApp={handleLockApp}
              />
            )}
          </main>

          {/* 3D Wax-Sealed Romantic Love Letter Envelope Modal */}
          <RomanticEnvelopeModal
            isOpen={isEnvelopeOpen}
            onClose={() => setIsEnvelopeOpen(false)}
            recipientName={birthdayConfig?.recipient_name || 'Akku'}
            creatorName={birthdayConfig?.creator_name || 'Saki'}
            letterMessage={birthdayConfig?.love_letter}
            isUnlocked={true}
            autoOpenFlap={true}
          />
        </div>
      )}
    </div>
  );
}

export default App;
