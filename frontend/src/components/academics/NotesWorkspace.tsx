import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Pin, 
  Search, 
  Download, 
  Save, 
  Check, 
  Tag
} from 'lucide-react';
import { api } from '../../services/api';
import type { AcademicNoteItem } from '../../types/academics';

interface NotesWorkspaceProps {
  initialDay?: number;
  initialTopic?: string;
  isRevisionBookOnly?: boolean;
}

const CATEGORIES = [
  'All',
  'Python Notes',
  'SQL Notes',
  'Linux & Cloud Notes',
  'Spark Notes',
  'Streaming Notes',
  'Kafka Notes',
  'Airflow Notes',
  'Placement Revision',
  'Mistakes & Lessons Learned',
  'Custom'
];

export const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({
  initialDay,
  initialTopic,
  isRevisionBookOnly = false
}) => {
  const [notes, setNotes] = useState<AcademicNoteItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<AcademicNoteItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showRevisionOnly, setShowRevisionOnly] = useState(isRevisionBookOnly);

  // Form edit fields
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('Python Notes');
  const [editDay, setEditDay] = useState<number | undefined>(initialDay);
  const [editTags, setEditTags] = useState<string>('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setEditCategory(selectedNote.category || 'Python Notes');
      setEditDay(selectedNote.day_number || undefined);
      setEditTags((selectedNote.tags || []).join(', '));
      setIsPinned(selectedNote.is_pinned || false);
    }
  }, [selectedNote]);

  const loadNotes = async () => {
    try {
      const res = await api.academics.getNotes();
      if (res && Array.isArray(res.notes)) {
        setNotes(res.notes);
        if (res.notes.length > 0 && !selectedNote) {
          setSelectedNote(res.notes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load notes from backend, using local fallback:', err);
      try {
        const local = localStorage.getItem('akku_academic_notes');
        if (local) {
          const parsed = JSON.parse(local);
          setNotes(parsed);
          if (parsed.length > 0 && !selectedNote) setSelectedNote(parsed[0]);
        }
      } catch {}
    }
  };

  const handleCreateNew = () => {
    const newNote: AcademicNoteItem = {
      id: `temp_${Date.now()}`,
      user_id: 'current_user',
      title: initialTopic ? `Notes on ${initialTopic}` : 'New Placement Revision Note',
      content: `# Key Concepts\n- Point 1\n- Point 2\n\n\`\`\`python\n# Implementation snippet\n\`\`\`\n\n### Interview Takeaways\n- `,
      category: editCategory || 'Python Notes',
      day_number: initialDay || 1,
      tags: initialTopic ? [initialTopic] : ['Placement Prep'],
      is_pinned: false
    };

    setSelectedNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditCategory(newNote.category);
    setEditDay(newNote.day_number || undefined);
    setEditTags(newNote.tags.join(', '));
    setIsPinned(false);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('Note title cannot be empty.');
      return;
    }

    setIsSaving(true);
    const tagsArray = editTags.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title: editTitle.trim(),
      content: editContent,
      category: editCategory,
      day_number: editDay,
      tags: tagsArray,
      is_pinned: isPinned
    };

    try {
      let savedNote: AcademicNoteItem;
      if (selectedNote && !selectedNote.id.startsWith('temp_')) {
        savedNote = await api.academics.updateNote(selectedNote.id, payload);
      } else {
        savedNote = await api.academics.createNote(payload);
      }

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);

      // Refresh list
      await loadNotes();
      setSelectedNote(savedNote);
    } catch (err: any) {
      console.error('Failed to save to backend, saving locally:', err);
      // Fallback to local storage
      const fallbackNote: AcademicNoteItem = {
        id: selectedNote?.id || `local_${Date.now()}`,
        user_id: 'default_user',
        ...payload,
        updated_at: new Date().toISOString()
      };
      const updatedList = [fallbackNote, ...notes.filter(n => n.id !== fallbackNote.id)];
      setNotes(updatedList);
      setSelectedNote(fallbackNote);
      try {
        localStorage.setItem('akku_academic_notes', JSON.stringify(updatedList));
      } catch {}
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this study note?')) return;
    try {
      await api.academics.deleteNote(noteId);
      const remaining = notes.filter(n => n.id !== noteId);
      setNotes(remaining);
      setSelectedNote(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      const remaining = notes.filter(n => n.id !== noteId);
      setNotes(remaining);
      setSelectedNote(remaining.length > 0 ? remaining[0] : null);
      try {
        localStorage.setItem('akku_academic_notes', JSON.stringify(remaining));
      } catch {}
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedNote) return;
    const blob = new Blob([`# ${selectedNote.title}\nCategory: ${selectedNote.category}\nDay: ${selectedNote.day_number || 'N/A'}\n\n${selectedNote.content}`], {
      type: 'text/markdown'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedNote.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(n => {
    const matchCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchSearch = searchQuery === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchRevision = !showRevisionOnly || n.is_pinned;
    return matchCategory && matchSearch && matchRevision;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-stone-200">
      {/* Sidebar: Notes List & Categories (4 cols) */}
      <div className="md:col-span-4 flex flex-col gap-3">
        <div className="p-3 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-2.5">
          {/* Header & New Note Button */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-stone-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Study Notes ({notes.length})</span>
            </span>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New Note</span>
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, tags..."
              className="w-full pl-8 pr-2.5 py-1.5 bg-[#161b22] border border-stone-700 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Revision Book toggle */}
          <button
            onClick={() => setShowRevisionOnly(!showRevisionOnly)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showRevisionOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#161b22] text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 fill-current" />
              <span>My Interview Revision Book</span>
            </div>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded font-mono">
              {notes.filter(n => n.is_pinned).length}
            </span>
          </button>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Notes Scrollable List */}
          <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto mt-1 scrollbar-thin">
            {filteredNotes.length === 0 ? (
              <div className="py-8 text-center text-stone-500 text-xs">
                No notes found. Click "New Note" above to write one!
              </div>
            ) : (
              filteredNotes.map(n => {
                const isSelected = selectedNote?.id === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNote(n)}
                    className={`p-2.5 rounded-lg text-left transition-all flex flex-col gap-1 cursor-pointer border ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500 text-sky-100 shadow-sm'
                        : 'bg-[#161b22] border-stone-800/80 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold truncate max-w-[190px]">{n.title}</span>
                      {n.is_pinned && <Pin className="w-3 h-3 text-amber-400 fill-current shrink-0" />}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                      {n.day_number && <span className="text-sky-400">Day {n.day_number}</span>}
                      <span>•</span>
                      <span className="truncate">{n.category}</span>
                    </div>

                    <p className="text-[11px] text-stone-400 line-clamp-1 opacity-80 font-sans">
                      {n.content.replace(/[#*`]/g, '')}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Column: Note Editor (8 cols) */}
      <div className="md:col-span-8 flex flex-col gap-3">
        {selectedNote ? (
          <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-3">
            {/* Note Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-500"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1 text-xs text-stone-400 bg-[#161b22] border border-stone-700 px-2 py-1 rounded-lg">
                  <span>Day:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editDay || ''}
                    onChange={(e) => setEditDay(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="1-100"
                    className="w-12 bg-transparent text-stone-200 focus:outline-none font-mono"
                  />
                </div>

                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isPinned
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#161b22] text-stone-400 border-stone-700 hover:text-stone-200'
                  }`}
                  title="Pin to My Interview Revision Book"
                >
                  <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                  <span>{isPinned ? 'In Revision Book' : 'Pin to Revision Book'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportMarkdown}
                  className="p-1.5 rounded-lg bg-[#161b22] hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
                  title="Download Note as Markdown (.md)"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {selectedNote && !selectedNote.id.startsWith('temp_') && (
                  <button
                    onClick={() => handleDelete(selectedNote.id)}
                    className="p-1.5 rounded-lg bg-[#161b22] hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                    justSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-600 hover:bg-sky-500 text-white'
                  }`}
                >
                  {justSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Note Title Input */}
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note Title (e.g. Window Functions vs Group By Pitfalls)..."
              className="w-full text-base sm:text-lg font-bold bg-transparent text-stone-100 placeholder-stone-600 focus:outline-none"
            />

            {/* Tags input */}
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Tag className="w-3 h-3 text-stone-500" />
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tags comma separated (e.g. SQL, DENSE_RANK, Placement)..."
                className="flex-1 bg-transparent text-stone-300 placeholder-stone-600 text-xs focus:outline-none"
              />
            </div>

            {/* Note Markdown Content Body */}
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={16}
              placeholder="Write your study notes, code snippets, placement formulas, or personal explanations here in Markdown..."
              className="w-full p-3 rounded-lg bg-[#161b22] border border-stone-800 text-stone-200 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-sky-500 resize-y"
            />
          </div>
        ) : (
          <div className="p-16 text-center text-stone-500 bg-[#0d1117] rounded-xl border border-stone-800 flex flex-col items-center gap-3">
            <FileText className="w-8 h-8 opacity-40" />
            <span>Select a note from the left or create a new one to start writing.</span>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold cursor-pointer"
            >
              Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
