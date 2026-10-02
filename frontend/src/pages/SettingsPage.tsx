import { useState, useEffect } from 'react';
import { 
  Sliders, 
  Heart, 
  Gift, 
  Save, 
  Trash2,
  Check,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import type { BirthdayConfig } from '../types/memories';

interface SettingsPageProps {
  onConfigUpdated?: (config: BirthdayConfig) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  floatingHeartsEnabled: boolean;
  setFloatingHeartsEnabled: (val: boolean) => void;
  onLockApp?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onConfigUpdated,
  reduceMotion,
  setReduceMotion,
  floatingHeartsEnabled,
  setFloatingHeartsEnabled,
  onLockApp
}) => {
  const [config, setConfig] = useState<BirthdayConfig>({
    creator_name: 'Saki',
    recipient_name: 'Akku',
    greeting_title: 'Happy Birthday, Akku! ❤️',
    love_letter: 'Happy Birthday to the most special person in my life. Every little moment, message, and memory we have shared means the world to me. I made this little world just for you.',
    surprise_message: 'You are my favorite journey, my dearest Akku. Every day with you is a gift. Happy Birthday!',
    birthday_date: 'October 20',
    background_music_enabled: false,
    theme: 'romantic_rose'
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    api.getBirthdayConfig().then(res => {
      if (res) setConfig(res);
    }).catch(err => console.error("Could not load config:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateBirthdayConfig(config);
      setSavedSuccess(true);
      if (onConfigUpdated) onConfigUpdated(res);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearMemories = async () => {
    if (!confirm("Are you sure you want to delete all saved memories? This is permanent.")) return;
    try {
      await api.clearAllMemories();
      alert("All personal memories cleared.");
    } catch (err) {
      alert("Failed to clear memories.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Gift Customization & Settings</h1>
        <p className="text-stone-600 text-sm mt-1">
          Personalize the birthday message, names, love letter, and privacy settings before presenting this to Akku.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personalization Section */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-rose-50 pb-3">
            <Gift className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Personal Identities</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Name (Giver / Creator)
              </label>
              <input
                type="text"
                value={config.creator_name}
                onChange={(e) => setConfig({ ...config, creator_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm"
                placeholder="Saki"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Saki is the name Akku lovingly calls you.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Recipient Name (The Birthday Girl)
              </label>
              <input
                type="text"
                value={config.recipient_name}
                onChange={(e) => setConfig({ ...config, recipient_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm"
                placeholder="Akku"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Akku is the person for whom this gift and AI chatbot is dedicated.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Birthday Date
            </label>
            <input
              type="text"
              value={config.birthday_date}
              onChange={(e) => setConfig({ ...config, birthday_date: e.target.value })}
              className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm"
              placeholder="October 2"
            />
          </div>
        </div>

        {/* Birthday Content Section */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-rose-50 pb-3">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Birthday Messages & Card Letter</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Hero Greeting Title
            </label>
            <input
              type="text"
              value={config.greeting_title}
              onChange={(e) => setConfig({ ...config, greeting_title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm"
              placeholder="Happy Birthday, Akku! ❤️"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Personal Love Letter (Displayed inside digital card)
            </label>
            <textarea
              rows={4}
              value={config.love_letter}
              onChange={(e) => setConfig({ ...config, love_letter: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm leading-relaxed"
              placeholder="Write your personal letter for Akku..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Surprise Reveal Message (Unlocked by clicking surprise button)
            </label>
            <textarea
              rows={3}
              value={config.surprise_message}
              onChange={(e) => setConfig({ ...config, surprise_message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm leading-relaxed"
              placeholder="The secret message to reveal..."
            />
          </div>
        </div>

        {/* Visual & Accessibility Options */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-rose-50 pb-3">
            <Sliders className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Aesthetics & Accessibility</h3>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-rose-50">
            <div>
              <span className="font-medium text-stone-800 text-sm">Floating Hearts Particles</span>
              <p className="text-xs text-stone-500">Gentle soft hearts ascending in the background</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={floatingHeartsEnabled}
                onChange={(e) => setFloatingHeartsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-medium text-stone-800 text-sm">Reduce Motion (Accessibility)</span>
              <p className="text-xs text-stone-500">Disables 3D card flips and fast keyframe animations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs sm:text-sm font-semibold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-stone-400">Settings persist in SQLite backend.</span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 shadow-md shadow-rose-200 transition-all text-xs sm:text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Privacy & Reset Controls */}
      <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100 space-y-4">
        <div className="flex items-center gap-2 text-rose-950 font-serif font-bold text-base">
          <Lock className="w-4 h-4 text-rose-600" />
          <span>Local Privacy Guarantee</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          All memories, audio recordings, and uploaded PDFs are stored strictly on this MacBook Air (M4). No telemetry or external cloud APIs are invoked for chat memories.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          {onLockApp && (
            <button
              type="button"
              onClick={onLockApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-100/80 border border-rose-300 text-rose-900 text-xs font-semibold hover:bg-rose-200 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>Lock Surprise Experience (Test Lock Screen)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearMemories}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-medium hover:bg-rose-100 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Saved Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
};
