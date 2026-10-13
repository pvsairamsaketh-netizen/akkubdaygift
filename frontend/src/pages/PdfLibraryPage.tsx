import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  RotateCw, 
  CheckCircle,
  Heart,
  BookOpen,
  Sparkles,
  Layers,
  Scroll
} from 'lucide-react';
import { api } from '../services/api';
import type { DocumentStatus } from '../types/memories';

export const PdfLibraryPage: React.FC = () => {
  const [status, setStatus] = useState<DocumentStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [reindexing, setReindexing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getDocumentStatus();
      setStatus(res);
    } catch (err) {
      console.error("Failed to load document status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setMessage({ type: 'error', text: 'Please upload a PDF document (.pdf)' });
      return;
    }
    try {
      setUploading(true);
      setMessage(null);
      const res = await api.uploadDocument(file);
      setMessage({ type: 'success', text: `Successfully indexed "${file.name}" with ${res.chunk_count || 0} romantic passages into ChromaDB.` });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload and index PDF.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleReindex = async () => {
    try {
      setReindexing(true);
      setMessage(null);
      const res = await api.reindexDocuments();
      setMessage({ type: 'success', text: `Reindexed ${res.total_indexed_documents || 1} love chronicles (${res.total_chunks || 0} vectors) into memory.` });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Reindexing failed.' });
    } finally {
      setReindexing(false);
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the relationship knowledge base?`)) return;
    try {
      await api.deleteDocument(docId);
      setMessage({ type: 'success', text: `Deleted "${title}" and its vector passages.` });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete document.' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in space-y-8">
      {/* Romantic Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-rose-100/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
              <Scroll className="w-5 h-5 text-rose-600" />
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Our Love Letters & Story Library
            </h1>
          </div>
          <p className="text-stone-600 text-sm mt-1.5 leading-relaxed max-w-2xl">
            The chronicles, messages, and relationship letters that ground Akku AI's understanding of our love.
          </p>
        </div>

        <button
          onClick={handleReindex}
          disabled={reindexing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-rose-50 hover:text-rose-700 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 text-rose-500 ${reindexing ? 'animate-spin' : ''}`} />
          <span>{reindexing ? 'Re-reading Pages...' : 'Re-index Chronicles'}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-sm shadow-sm animate-slide-up ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold ml-4 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
          dragActive
            ? 'border-rose-500 bg-rose-50/80 scale-[1.01] shadow-lg'
            : 'border-rose-200/90 bg-white/70 hover:bg-rose-50/40 hover:border-rose-300 shadow-sm'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-100 to-pink-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-200/60">
          <Upload className={`w-7 h-7 ${uploading ? 'animate-bounce text-rose-600' : 'text-rose-500'}`} />
        </div>
        <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
          {uploading ? "Ingesting & weaving memories into ChromaDB..." : "Add a New Chapter or Love Letter"}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-5 leading-relaxed">
          Drag and drop any relationship PDF here, or select from your Mac. We split it into overlapping passages and preserve it in local vector memory.
        </p>

        <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs sm:text-sm font-semibold hover:brightness-105 shadow-md shadow-rose-200/70 cursor-pointer transition-all hover:scale-105 active:scale-95">
          <BookOpen className="w-4 h-4" />
          <span>Select PDF Love Document</span>
          <input
            type="file"
            accept=".pdf"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* Vector Store Summary Badges */}
      {status && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Documents</span>
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-stone-900">{status.total_documents}</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Indexed</span>
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-2xl font-serif font-bold text-rose-600">{status.indexed_documents}</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Vector Passages</span>
              <Layers className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-stone-900">{status.total_vectors_in_store}</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Database</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
            <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Chroma Persistent</span>
            </p>
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-stone-900">Indexed Relationship Chronicles</h3>
          <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Grounding AI with Our Real Words ❤️
          </span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-stone-400 text-sm">
            <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Opening relationship chronicles...</span>
          </div>
        ) : !status?.documents || status.documents.length === 0 ? (
          <div className="bg-white/80 rounded-3xl p-8 text-center border border-rose-100 text-stone-500 text-sm">
            No PDF documents currently indexed. Upload our relationship PDF above to begin.
          </div>
        ) : (
          <div className="space-y-3">
            {status.documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/95 backdrop-blur rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-50 to-pink-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base truncate group-hover:text-rose-600 transition-colors">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                      <span>{doc.page_count} Pages</span>
                      <span>•</span>
                      <span>{doc.chunk_count} Vector Passages</span>
                      <span>•</span>
                      <span className="capitalize text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {doc.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove chronicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
