import React, { useState } from 'react';
import { BookmarkCheck, Sparkles, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

interface QuickAddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoryAdded?: (memory: any) => void;
}

export const QuickAddMemoryModal: React.FC<QuickAddMemoryModalProps> = ({
  isOpen,
  onClose,
  onMemoryAdded
}) => {
  const [memoryText, setMemoryText] = useState('');
  const [category, setCategory] = useState('personal_preferences');
  const [subject, setSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { text: 'She loves chocolate ice cream with waffles', cat: 'food_drinks', sub: 'Favorite Dessert' },
    { text: 'She told me she loves walking in the rain', cat: 'likes_dislikes', sub: 'Rainy Weather' },
    { text: 'Her favorite song is from A.R. Rahman', cat: 'music_entertainment', sub: 'Music' },
    { text: 'She had a mild headache and likes ginger tea', cat: 'health_wellness', sub: 'Health' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryText.trim() || saving) return;

    try {
      setSaving(true);
      const res = await api.createMemory({
        memory_text: memoryText.trim(),
        category,
        subject: subject.trim() || undefined
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#f43f5e', '#f472b6', '#fef08a']
      });

      setSuccess(true);
      if (onMemoryAdded) onMemoryAdded(res);

      setTimeout(() => {
        setSuccess(false);
        setMemoryText('');
        setSubject('');
        onClose();
      }, 1500);
    } catch (err) {
      alert("Failed to save memory. Please verify backend is running.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                Teach Akku a Memory ❤️
              </h3>
              <p className="text-[11px] text-stone-500">
                Permanently saved in local ChromaDB across MacBook restarts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block mb-1.5">
            Quick Ideas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setMemoryText(p.text);
                  setCategory(p.cat);
                  setSubject(p.sub);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors text-left"
              >
                + {p.text.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>

        {/* Memory Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              What should Akku remember about her?
            </label>
            <textarea
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              placeholder="e.g. She likes mango ice cream, or she told me she loves rainy mornings..."
              rows={3}
              required
              className="w-full px-3.5 py-2.5 rounded-2xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs bg-white"
              >
                <option value="personal_preferences">Personal Preferences</option>
                <option value="likes_dislikes">Likes & Dislikes</option>
                <option value="food_drinks">Food & Drinks</option>
                <option value="health_wellness">Health & Wellness</option>
                <option value="habits_routines">Habits & Routine</option>
                <option value="important_dates">Important Dates</option>
                <option value="shared_experiences">Shared Moments</option>
                <option value="music_entertainment">Music & Movies</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Subject / Tag (Optional)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Ice Cream, Headache"
                className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-stone-400">
              {success ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Saved permanently!
                </span>
              ) : (
                "ChromaDB local vector memory"
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !memoryText.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium text-xs hover:from-rose-600 hover:to-rose-700 shadow-md shadow-rose-200 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{saving ? 'Embedding & Saving...' : 'Save to Akku AI'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
