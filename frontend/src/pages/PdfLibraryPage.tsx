import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  RotateCw, 
  CheckCircle
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
      setMessage({ type: 'success', text: `Successfully indexed "${file.name}" with ${res.chunk_count || 0} passages.` });
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
      setMessage({ type: 'success', text: `Reindexed ${res.total_indexed_documents || 1} documents (${res.total_chunks || 0} vectors).` });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Reindexing failed.' });
    } finally {
      setReindexing(false);
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the knowledge base?`)) return;
    try {
      await api.deleteDocument(docId);
      setMessage({ type: 'success', text: `Deleted "${title}" and its vectors.` });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete document.' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">PDF Love Story Library</h1>
          <p className="text-stone-600 text-sm mt-1">
            Documents containing our emails, stories, and relationship memories. Akku answers questions grounded in these texts.
          </p>
        </div>

        <button
          onClick={handleReindex}
          disabled={reindexing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-rose-50 shadow-sm transition-all disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 text-rose-500 ${reindexing ? 'animate-spin' : ''}`} />
          <span>{reindexing ? 'Reindexing...' : 'Reindex All PDFs'}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{message.text}</span>
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
            ? 'border-rose-500 bg-rose-50/70 scale-[1.01]'
            : 'border-rose-200/80 bg-white/60 hover:bg-rose-50/30 hover:border-rose-300'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Upload className={`w-7 h-7 ${uploading ? 'animate-bounce' : ''}`} />
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
          {uploading ? "Ingesting and generating embeddings..." : "Upload Relationship PDFs"}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-4">
          Drag and drop PDF files here, or browse from your Mac. We split text into overlapping chunks and index them locally into ChromaDB.
        </p>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-white text-xs sm:text-sm font-medium hover:bg-rose-700 shadow-md shadow-rose-200 cursor-pointer transition-all">
          <span>Choose PDF File</span>
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
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Documents</span>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{status.total_documents}</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Indexed</span>
            <p className="text-2xl font-serif font-bold text-rose-600 mt-1">{status.indexed_documents}</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Vector Passages</span>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{status.total_vectors_in_store}</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Database</span>
            <p className="text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Chroma Persistent</span>
            </p>
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-stone-900">Indexed Relationship Files</h3>

        {loading ? (
          <div className="text-center py-8 text-stone-400 text-sm">Loading documents...</div>
        ) : !status?.documents || status.documents.length === 0 ? (
          <div className="bg-white/70 rounded-2xl p-8 text-center border border-rose-100 text-stone-500 text-sm">
            No PDF documents currently indexed. Upload the relationship PDF above to begin.
          </div>
        ) : (
          <div className="space-y-3">
            {status.documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/90 backdrop-blur rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-stone-900 text-sm truncate">{doc.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                      <span>{doc.page_count} Pages</span>
                      <span>•</span>
                      <span>{doc.chunk_count} Chunks</span>
                      <span>•</span>
                      <span className="capitalize text-emerald-600 font-medium">{doc.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete document"
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
