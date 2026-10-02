import { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Plus, 
  Trash2, 
  Play, 
  RotateCw 
} from 'lucide-react';
import { api } from '../services/api';
import type { PersonalVocabulary } from '../types/memories';

export const VoiceSettingsPage: React.FC = () => {
  const [vocabList, setVocabList] = useState<PersonalVocabulary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Voice Controls
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [voicePreset, setVoicePreset] = useState<string>('af_heart');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [language, setLanguage] = useState<string>('en');
  const [testingTTS, setTestingTTS] = useState<boolean>(false);

  // New Vocab Modal / Form
  const [newTerm, setNewTerm] = useState<string>('');
  const [newAliases, setNewAliases] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('name');
  const [message, setMessage] = useState<string | null>(null);

  const fetchVocab = async () => {
    try {
      setLoading(true);
      const res = await api.getVocabulary();
      setVocabList(res || []);
    } catch (err) {
      console.error("Failed to load vocabulary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocab();
  }, []);

  const handleAddVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim()) return;

    const aliases = newAliases
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    try {
      await api.addVocabulary(newTerm.trim(), aliases, newCategory);
      setNewTerm('');
      setNewAliases('');
      setMessage(`Added "${newTerm}" to personal speech vocabulary.`);
      fetchVocab();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert("Failed to add vocabulary.");
    }
  };

  const handleDeleteVocab = async (id: string) => {
    try {
      await api.deleteVocabulary(id);
      fetchVocab();
    } catch (err) {
      alert("Failed to delete vocabulary entry.");
    }
  };

  const handleTestVoice = async () => {
    try {
      setTestingTTS(true);
      const res = await api.speakText("Happy Birthday, Akku! I am your AI assistant, running locally on your MacBook.", voicePreset, speechSpeed);
      if (res.audio_url) {
        const audio = new Audio(res.audio_url);
        audio.play();
      }
    } catch (err) {
      alert("Failed to test TTS synthesis.");
    } finally {
      setTestingTTS(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Voice Assistant & Adaptation</h1>
        <p className="text-stone-600 text-sm mt-1">
          Configure local speech recognition (Whisper), Kokoro voice output, and train Akku to recognize personal names and Indian English accents through vocabulary adaptation.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-medium animate-fade-in">
          {message}
        </div>
      )}

      {/* Voice Output Configuration */}
      <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-rose-50 pb-3">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Akku's Voice Output</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Voice Character (Kokoro TTS)
            </label>
            <select
              value={voicePreset}
              onChange={(e) => setVoicePreset(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm bg-white"
            >
              <option value="af_heart">Heart (Warm, caring, gentle - Recommended)</option>
              <option value="af_bella">Bella (Friendly, bright)</option>
              <option value="af_nicole">Nicole (Calm, conversational)</option>
              <option value="af_sky">Sky (Soft, atmospheric)</option>
              <option value="am_adam">Adam (Gentle masculine)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Speaking Rate ({speechSpeed.toFixed(1)}x)
            </label>
            <input
              type="range"
              min="0.75"
              max="1.35"
              step="0.05"
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Slower (0.75x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (1.35x)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Speech Recognition Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm bg-white"
            >
              <option value="en">English / Indian English (Optimized)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="auto">Auto-detect Language</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-stone-400 italic">
            * Generated locally on Apple M4 Neural Engine / CPU without cloud latency.
          </p>
          <button
            onClick={handleTestVoice}
            disabled={testingTTS}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium transition-colors disabled:opacity-50"
          >
            {testingTTS ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{testingTTS ? 'Synthesizing...' : 'Preview Voice'}</span>
          </button>
        </div>
      </div>

      {/* Voice Adaptation & Personal Vocabulary */}
      <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
        <div className="border-b border-rose-50 pb-3">
          <div className="flex items-center gap-2.5">
            <Mic className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Personal Vocabulary & Voice Learning</h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Whisper uses these terms as dynamic contextual prompt hints. Misrecognitions are automatically converted to the correct spelling.
          </p>
        </div>

        {/* Add Term Form */}
        <form onSubmit={handleAddVocab} className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Correct Term
              </label>
              <input
                type="text"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="e.g. Besant Nagar"
                required
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Misrecognitions (comma separated)
              </label>
              <input
                type="text"
                value={newAliases}
                onChange={(e) => setNewAliases(e.target.value)}
                placeholder="e.g. pesant nagar, besant nagerr"
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs sm:text-sm bg-white"
              >
                <option value="name">Name / Nickname</option>
                <option value="place">Place / Location</option>
                <option value="food">Food / Dish</option>
                <option value="custom">Custom Term</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vocabulary Rule</span>
            </button>
          </div>
        </form>

        {/* Existing Terms */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Learned Terms & Aliases</h4>
          {loading ? (
            <div className="text-xs text-stone-400 py-4 text-center">Loading vocabulary...</div>
          ) : vocabList.length === 0 ? (
            <div className="text-xs text-stone-400 py-4 text-center">No custom vocabulary added yet.</div>
          ) : (
            <div className="divide-y divide-rose-50">
              {vocabList.map((v) => (
                <div key={v.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{v.term}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                        {v.category}
                      </span>
                    </div>
                    {v.misrecognitions && v.misrecognitions.length > 0 && (
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Replaces: <span className="font-mono text-rose-600">{v.misrecognitions.join(', ')}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteVocab(v.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
