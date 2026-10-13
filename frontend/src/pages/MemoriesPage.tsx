import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookmarkCheck, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Heart,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Calendar,
  ZoomIn
} from 'lucide-react';
import { api } from '../services/api';
import type { PersonalMemory } from '../types/memories';

interface ScrapbookPhoto {
  src: string;
  title: string;
  date: string;
  caption: string;
  location?: string;
  rotation: string;
}

const SCRAPBOOK_PHOTOS: ScrapbookPhoto[] = [
  {
    src: '/images/memories/img1.jpeg',
    title: 'Our Warmest Smile',
    date: 'College Days',
    caption: 'Where two strangers met, talked, and became each other’s whole world.',
    location: 'Campus Walkways',
    rotation: '-rotate-2'
  },
  {
    src: '/images/memories/img2.jpeg',
    title: 'Every Glance Tells a Story',
    date: 'Sweet Moments',
    caption: 'The quiet looks that spoke louder than any words we could ever say.',
    location: 'Quiet Cafes & Corners',
    rotation: 'rotate-2'
  },
  {
    src: '/images/memories/img3.jpeg',
    title: 'Marina Beach Sunset',
    date: 'Chennai Shore',
    caption: 'Watching the rolling waves with you while time stood completely still.',
    location: 'Marina Beach, Chennai',
    rotation: '-rotate-1'
  },
  {
    src: '/images/memories/img4.jpeg',
    title: 'Holding Hands Through Life',
    date: 'Unbreakable Bond',
    caption: 'Promising to never let go, through every joy, trial, and storm.',
    location: 'Every Step Together',
    rotation: 'rotate-1'
  },
  {
    src: '/images/memories/img5.jpeg',
    title: 'My Favorite Person',
    date: 'Pure Happiness',
    caption: 'Your radiant smile is the only thing that truly brightens my darkest days.',
    location: 'Heart to Heart',
    rotation: '-rotate-2'
  },
  {
    src: '/images/memories/img6.jpeg',
    title: 'Forever & Always',
    date: 'Our Love Story',
    caption: 'Every yesterday with you was a gift, every tomorrow with you is a dream.',
    location: 'To Eternity & Beyond',
    rotation: 'rotate-2'
  }
];

export const MemoriesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'scrapbook' | 'databank'>('scrapbook');
  const [memories, setMemories] = useState<PersonalMemory[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<ScrapbookPhoto | null>(null);

  // Cherished (Favorited) Memories persisted locally
  const [cherishedIds, setCherishedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('akku_cherished_memories') || '[]');
    } catch {
      return [];
    }
  });

  // Modals & form state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingMemory, setEditingMemory] = useState<PersonalMemory | null>(null);
  const [newText, setNewText] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('personal_preferences');
  const [newSubject, setNewSubject] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleCherish = (id: string) => {
    setCherishedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('akku_cherished_memories', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const categories = [
    { id: '', label: 'All Memories' },
    { id: 'cherished', label: 'Cherished ❤️' },
    { id: 'food_drinks', label: 'Food & Drinks 🍨' },
    { id: 'likes_dislikes', label: 'Likes & Dislikes 💖' },
    { id: 'personal_preferences', label: 'Preferences ✨' },
    { id: 'health_wellness', label: 'Health & Care 🌿' },
    { id: 'habits_routines', label: 'Habits & Routine ☕' },
    { id: 'important_dates', label: 'Important Dates 📅' },
    { id: 'shared_experiences', label: 'Shared Moments 🌸' },
    { id: 'music_entertainment', label: 'Music & Cinema 🎵' },
  ];

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const res = await api.getMemories({
        category: selectedCategory === 'cherished' ? undefined : (selectedCategory || undefined),
        search: search.trim() || undefined
      });
      let memList = res.memories || [];
      if (selectedCategory === 'cherished') {
        memList = memList.filter(m => cherishedIds.includes(m.id));
      }
      setMemories(memList);
      setTotal(res.total_memories || 0);
    } catch (err) {
      console.error("Failed to fetch memories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [selectedCategory, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setEditingMemory(null);
        setSelectedPhoto(null);
      }
    };
    if (isAddModalOpen || editingMemory || selectedPhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAddModalOpen, editingMemory, selectedPhoto]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || isSaving) return;
    try {
      setIsSaving(true);
      await api.createMemory({
        memory_text: newText.trim(),
        category: newCategory,
        subject: newSubject.trim() || undefined
      });
      setNewText('');
      setNewSubject('');
      setIsAddModalOpen(false);
      showToast("Memory saved into Akku's permanent memory sanctuary! ❤️", "success");
      await fetchMemories();
    } catch (err: any) {
      showToast(err.message || "Failed to save memory. Please ensure backend is active.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory || !newText.trim() || isSaving) return;
    try {
      setIsSaving(true);
      await api.updateMemory(editingMemory.id, {
        memory_text: newText.trim(),
        category: newCategory,
        subject: newSubject.trim() || undefined
      });
      setEditingMemory(null);
      showToast("Memory updated successfully! ✨", "success");
      await fetchMemories();
    } catch (err: any) {
      showToast(err.message || "Failed to update memory.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this memory from Akku's memory store?")) return;
    try {
      await api.deleteMemory(id);
      if (editingMemory?.id === id) {
        setEditingMemory(null);
      }
      showToast("Memory removed.", "success");
      await fetchMemories();
    } catch (err: any) {
      showToast(err.message || "Failed to delete memory.", "error");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Caution: Are you sure you want to delete ALL saved memories? This action is permanent.")) return;
    try {
      await api.clearAllMemories();
      showToast("All memories cleared.", "success");
      fetchMemories();
    } catch (err) {
      alert("Failed to clear memories.");
    }
  };

  const openEditModal = (mem: PersonalMemory) => {
    setEditingMemory(mem);
    setNewText(mem.memory_text);
    setNewCategory(mem.category || 'personal_preferences');
    setNewSubject(mem.subject || '');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in space-y-8">
      {/* Top Header & Romantic Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-rose-100/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-heart-pulse" />
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Our Memory Sanctuary
            </h1>
          </div>
          <p className="text-stone-600 text-sm mt-1.5 leading-relaxed max-w-2xl">
            A romantic treasure trove of every laugh, photograph, preference, and sweet detail we cherish together.
          </p>
        </div>

        {/* View Mode Toggle Buttons (Uniform Segmented Pill) */}
        <div className="inline-flex items-center p-1 rounded-full bg-rose-50/90 border border-rose-200/80 shadow-2xs self-stretch md:self-auto">
          <button
            onClick={() => setViewMode('scrapbook')}
            className={`flex-1 md:flex-none h-9 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none whitespace-nowrap border ${
              viewMode === 'scrapbook'
                ? 'bg-white text-rose-700 shadow-xs border-rose-200/60'
                : 'text-stone-600 hover:text-rose-700 hover:bg-white/50 border-transparent'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Our Photo Scrapbook 📸</span>
          </button>
          <button
            onClick={() => setViewMode('databank')}
            className={`flex-1 md:flex-none h-9 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none whitespace-nowrap border ${
              viewMode === 'databank'
                ? 'bg-white text-rose-700 shadow-xs border-rose-200/60'
                : 'text-stone-600 hover:text-rose-700 hover:bg-white/50 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Love Notes & AI Memory Bank 💌</span>
            <span className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-bold ${
              viewMode === 'databank' ? 'bg-rose-100 text-rose-800' : 'bg-rose-100/70 text-stone-600'
            }`}>
              {total}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: OUR PHOTO SCRAPBOOK */}
      {viewMode === 'scrapbook' && (
        <div className="space-y-6 animate-fade-in">
          {/* Romantic Banner Note */}
          <div className="bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-rose-50/80 border border-rose-200/60 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-sm">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
                  <span>Frozen in Time • Chennai & Beyond</span>
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Every Moment with You Is My Favorite Memory
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
                  Tap any polaroid below to step closer into the photograph and relive the warmth of that special day.
                </p>
              </div>
              <button
                onClick={() => setViewMode('databank')}
                className="shrink-0 px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium hover:bg-rose-50 transition-colors shadow-2xs"
              >
                View Stored Facts & Notes →
              </button>
            </div>
          </div>

          {/* Polaroid Scrapbook Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-8">
            {SCRAPBOOK_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(photo)}
                className={`group relative bg-white p-4 pt-5 pb-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-rose-100/80 hover:-translate-y-2 hover:scale-[1.02] ${photo.rotation}`}
              >
                {/* Vintage Washi Tape Top Accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-r from-amber-100/90 via-rose-100/90 to-amber-100/90 border border-amber-200/50 shadow-2xs opacity-90 backdrop-blur-xs rounded-xs transform -rotate-1 z-10 pointer-events-none" />

                {/* Photo Image Frame */}
                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-stone-100 mb-4 shadow-inner">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                    <span className="text-xs font-medium flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                    </span>
                    <span className="text-xs font-mono">{photo.date}</span>
                  </div>
                </div>

                {/* Polaroid Bottom Note */}
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-stone-800 group-hover:text-rose-600 transition-colors">
                      {photo.title}
                    </h3>
                    <Heart className="w-4 h-4 text-rose-400 group-hover:fill-rose-500 group-hover:text-rose-500 transition-colors" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed italic font-serif line-clamp-2">
                    "{photo.caption}"
                  </p>
                  {photo.location && (
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-stone-400">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      <span>{photo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: LOVE NOTES & AI MEMORY BANK */}
      {viewMode === 'databank' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar: Search, Add, Clear */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search memories (e.g. ice cream, favorite song, headache remedy, movie)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-rose-200/80 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNewText('');
                  setNewSubject('');
                  setNewCategory('personal_preferences');
                  setIsAddModalOpen(true);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 hover:brightness-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save New Memory</span>
              </button>
              {total > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-2.5 rounded-xl bg-white border border-rose-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Clear all stored memories"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-200 scale-105'
                      : 'bg-white border border-rose-100 text-stone-600 hover:bg-rose-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Memories Cards Grid */}
          {loading ? (
            <div className="text-center py-20 text-stone-400 text-sm">
              <div className="w-8 h-8 border-3 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Gathering our cherished memories...</span>
            </div>
          ) : memories.length === 0 ? (
            <div className="bg-white/80 backdrop-blur rounded-3xl p-12 text-center border border-rose-100 shadow-sm max-w-md mx-auto my-8">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-3">
                <BookmarkCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">No Memories Found</h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-4">
                {search || selectedCategory
                  ? "No memories match your search filter."
                  : "Every sweet detail you tell Akku in chat or add manually is preserved forever."}
              </p>
              {(search || selectedCategory) && (
                <button
                  onClick={() => { setSearch(''); setSelectedCategory(''); }}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memories.map((mem) => {
                const isCherished = cherishedIds.includes(mem.id);
                return (
                  <div
                    key={mem.id}
                    className={`bg-white/95 backdrop-blur rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between group relative shadow-2xs hover:shadow-lg hover:-translate-y-1 ${
                      isCherished 
                        ? 'border-rose-300 shadow-rose-100/60 ring-1 ring-rose-200' 
                        : 'border-rose-100 hover:border-rose-200'
                    }`}
                  >
                    <div>
                      {/* Card Header: Category & Controls */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 capitalize border border-rose-100">
                          {mem.category.replace('_', ' ')}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {/* Cherish Heart Button */}
                          <button
                            type="button"
                            onClick={() => toggleCherish(mem.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isCherished 
                                ? 'text-rose-600 bg-rose-50' 
                                : 'text-stone-300 hover:text-rose-500 hover:bg-rose-50/50'
                            }`}
                            title={isCherished ? "Cherished memory" : "Mark as cherished"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isCherished ? 'fill-rose-500 text-rose-500 animate-heart-pulse' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(mem)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Edit memory"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDelete(mem.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete memory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Memory Content */}
                      <p className="text-stone-800 text-sm font-medium leading-relaxed mb-3">
                        {mem.memory_text}
                      </p>

                      {mem.subject && (
                        <p className="text-[11px] text-stone-500 mb-2 font-mono">
                          Topic: <span className="text-stone-700 font-semibold">{mem.subject}</span>
                        </p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-rose-50 flex items-center justify-between text-[11px] text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <span title={mem.source === 'voice' ? "Captured from conversation" : "Captured from chat"}>
                          <MessageSquare className="w-3 h-3 text-rose-400" />
                        </span>
                        <span>
                          {new Date(mem.conversation_timestamp).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {mem.source_type === 'initial_pdf' ? (
                          <span className="text-[10px] text-amber-700 font-medium bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                            Relationship Book 📖
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-700 font-medium bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">
                            Sanctuary Memory ❤️
                          </span>
                        )}
                        {mem.version && mem.version > 1 && (
                          <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-1 py-0.5 rounded" title="Version">
                            v{mem.version}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: PHOTO ENLARGED LIGHTBOX */}
      {selectedPhoto && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border border-rose-100 space-y-4 my-auto relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">{selectedPhoto.title}</h3>
                <p className="text-xs text-stone-500">{selectedPhoto.date} {selectedPhoto.location ? `• ${selectedPhoto.location}` : ''}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[60vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain max-h-[60vh]"
              />
            </div>

            <p className="font-serif text-sm sm:text-base text-stone-700 italic text-center px-4 leading-relaxed">
              "{selectedPhoto.caption}"
            </p>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: ADD / EDIT MEMORY PORTAL */}
      {(isAddModalOpen || editingMemory) && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
              setEditingMemory(null);
            }
          }}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-rose-100 space-y-4 my-auto relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <BookmarkCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {editingMemory ? "Edit Saved Memory" : "Save New Memory"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setEditingMemory(null); }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingMemory ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Memory Statement
                </label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Akku loves vanilla ice cream and sunny morning tea walks with Saki"
                  rows={3}
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm bg-white cursor-pointer"
                  >
                    <option value="personal_preferences">Personal Preferences</option>
                    <option value="likes_dislikes">Likes & Dislikes</option>
                    <option value="favorite">Favorites</option>
                    <option value="food_drinks">Food & Drinks</option>
                    <option value="places_travel">Places & Travel</option>
                    <option value="important_dates">Important Dates</option>
                    <option value="shared_experiences">Shared Moments</option>
                    <option value="relationship">Relationship</option>
                    <option value="health_wellness">Health & Wellness</option>
                    <option value="habits_routines">Habits & Routines</option>
                    <option value="music_entertainment">Music & Entertainment</option>
                    <option value="movie">Movies & Shows</option>
                    <option value="family_friends">Family & Friends</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject / Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Ice Cream, Sai Pallavi, Marina Beach"
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-rose-50">
                {editingMemory ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingMemory.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingMemory(null); }}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs sm:text-sm font-medium hover:brightness-105 shadow-md shadow-rose-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                    <span>{isSaving ? "Saving..." : editingMemory ? "Save Changes" : "Create Memory"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border animate-slide-up ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
