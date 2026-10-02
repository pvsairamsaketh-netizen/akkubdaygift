import { useState, useEffect } from 'react';
import { 
  BookmarkCheck, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Mic, 
  FileText, 
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import type { PersonalMemory } from '../types/memories';

export const MemoriesPage: React.FC = () => {
  const [memories, setMemories] = useState<PersonalMemory[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
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

  const categories = [
    { id: '', label: 'All Memories' },
    { id: 'food_drinks', label: 'Food & Drinks 🍨' },
    { id: 'likes_dislikes', label: 'Likes & Dislikes ❤️' },
    { id: 'personal_preferences', label: 'Preferences ✨' },
    { id: 'health_wellness', label: 'Health & Wellness 🌿' },
    { id: 'habits_routines', label: 'Habits & Routine ☕' },
    { id: 'important_dates', label: 'Important Dates 📅' },
    { id: 'shared_experiences', label: 'Shared Moments 🌸' },
    { id: 'music_entertainment', label: 'Music & Movies 🎵' },
  ];

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const res = await api.getMemories({
        category: selectedCategory || undefined,
        search: search.trim() || undefined
      });
      setMemories(res.memories || []);
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
      showToast("Memory saved successfully into Akku's permanent memory! ❤️", "success");
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
    if (!confirm("Are you sure you want to delete this memory? It will be removed from both the database and vector search.")) return;
    try {
      await api.deleteMemory(id);
      showToast("Memory deleted.", "success");
      await fetchMemories();
    } catch (err: any) {
      showToast(err.message || "Failed to delete memory.", "error");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Caution: Are you sure you want to delete ALL saved memories? This action is permanent.")) return;
    try {
      await api.clearAllMemories();
      fetchMemories();
    } catch (err) {
      alert("Failed to clear memories.");
    }
  };

  const openEditModal = (mem: PersonalMemory) => {
    setEditingMemory(mem);
    setNewText(mem.memory_text);
    setNewCategory(mem.category);
    setNewSubject(mem.subject || '');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-stone-900">Our Saved Memories</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
              {total} Total
            </span>
          </div>
          <p className="text-stone-600 text-sm mt-1">
            Every little thing you tell Akku through voice or text is automatically remembered here for days, weeks, and months.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          <button
            onClick={() => {
              setNewText('');
              setNewSubject('');
              setNewCategory('personal_preferences');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-medium shadow-md shadow-rose-200 hover:bg-rose-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
          {total > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2.5 rounded-xl bg-white border border-rose-200 text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Clear all memories"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories (e.g. mango ice cream, headache, rainy weather, favorite song)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm shadow-sm"
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

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                    : 'bg-white/80 border border-rose-100 text-stone-600 hover:bg-rose-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Memories Grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-sm">
          <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Searching persistent memory store...</span>
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white/70 backdrop-blur rounded-3xl p-12 text-center border border-rose-100/80 shadow-sm max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto mb-3">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">No Memories Found</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-4">
            {search || selectedCategory
              ? "No memories match your search filter."
              : "Whenever you talk to Akku about her, facts and small preferences will automatically be saved here."}
          </p>
          {(search || selectedCategory) && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory(''); }}
              className="text-xs text-rose-600 font-medium underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-rose-100/80 shadow-sm hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 capitalize">
                    {mem.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(mem)}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Edit memory"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(mem.id)}
                      className="p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-stone-800 text-sm font-medium leading-relaxed mb-3">
                  {mem.memory_text}
                </p>

                {mem.subject && (
                  <p className="text-[11px] text-stone-400 mb-2">
                    Subject: <span className="text-stone-600 font-medium">{mem.subject}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-rose-50 flex items-center justify-between text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5">
                  {mem.source === 'voice' ? (
                    <span title="Captured from Voice">
                      <Mic className="w-3 h-3 text-rose-500" />
                    </span>
                  ) : (
                    <span title="Captured from Text">
                      <FileText className="w-3 h-3 text-stone-400" />
                    </span>
                  )}
                  <span>{new Date(mem.conversation_timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                  ChromaDB
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingMemory) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingMemory ? "Edit Memory" : "Save New Memory"}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingMemory(null); }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
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
                  placeholder="e.g. She likes mango ice cream with chocolate toppings"
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
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
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm bg-white"
                  >
                    <option value="personal_preferences">Personal Preferences</option>
                    <option value="likes_dislikes">Likes & Dislikes</option>
                    <option value="food_drinks">Food & Drinks</option>
                    <option value="health_wellness">Health & Wellness</option>
                    <option value="habits_routines">Habits & Routines</option>
                    <option value="important_dates">Important Dates</option>
                    <option value="shared_experiences">Shared Moments</option>
                    <option value="music_entertainment">Music & Entertainment</option>
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
                    placeholder="e.g. Ice Cream, Headache"
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingMemory(null); }}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-medium hover:bg-rose-700 shadow-md shadow-rose-200 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                  <span>{isSaving ? "Saving..." : editingMemory ? "Save Changes" : "Create Memory"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Floating Toast Notification */}
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
