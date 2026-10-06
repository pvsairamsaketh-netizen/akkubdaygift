import React, { useState } from 'react';
import { X, Cpu, Database, Volume2, Mic, RefreshCw, CheckCircle2, Shield, Heart } from 'lucide-react';
import { api } from '../services/api';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  totalVectors?: number;
  onReindexed?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  totalVectors = 7,
  onReindexed
}) => {
  const [reindexing, setReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);

  if (!isOpen) return null;

  const handleReindex = async () => {
    try {
      setReindexing(true);
      await api.reindexDocuments();
      setReindexSuccess(true);
      if (onReindexed) onReindexed();
      setTimeout(() => setReindexSuccess(false), 3000);
    } catch (err) {
      alert("Reindex failed: " + err);
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-rose-200/80 shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center space-x-2 text-rose-800">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <h3 className="font-serif font-bold text-lg">System & Model Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Target Architecture Badge */}
          <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-start space-x-3">
            <Cpu className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-800">Apple Silicon M4 Local Deployment</h4>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Target: MacBook Air M4 (16 GB Unified Memory). Metal Performance Shaders (MPS) hardware acceleration enabled.
              </p>
            </div>
          </div>

          {/* Model Status Cards */}
          <div className="space-y-2">
            {/* LLM */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="font-medium text-stone-800">LLM Generation</div>
                  <div className="text-[10px] text-stone-400">Ollama local inference</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                Qwen 3.8 8B
              </span>
            </div>

            {/* Embeddings */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="font-medium text-stone-800">Embeddings & Vector Store</div>
                  <div className="text-[10px] text-stone-400">Persistent local ChromaDB</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium text-[11px] border border-rose-200">
                BAAI/bge-small-en
              </span>
            </div>

            {/* Speech-to-Text */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="font-medium text-stone-800">Speech Recognition (ASR)</div>
                  <div className="text-[10px] text-stone-400">faster-whisper local engine</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium text-[11px] border border-rose-200">
                Whisper base.en
              </span>
            </div>

            {/* Text-to-Speech */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="font-medium text-stone-800">Spoken Voice (TTS)</div>
                  <div className="text-[10px] text-stone-400">Kokoro-82M neural model</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium text-[11px] border border-rose-200">
                af_heart / Neural
              </span>
            </div>
          </div>

          {/* Document Ingestion & Vector Index Management */}
          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-rose-900">Knowledge Base Index</div>
              <div className="text-[11px] text-stone-500">
                {totalVectors} memory chunks indexed in ChromaDB
              </div>
            </div>
            <button
              onClick={handleReindex}
              disabled={reindexing}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-medium text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reindexing ? 'animate-spin' : ''}`} />
              <span>{reindexing ? 'Indexing...' : 'Re-Index'}</span>
            </button>
          </div>

          {reindexSuccess && (
            <div className="flex items-center space-x-1.5 text-emerald-600 text-[11px] font-medium animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Relationship document re-indexed successfully!</span>
            </div>
          )}

          {/* Privacy Note */}
          <div className="flex items-start space-x-2 pt-2 text-[11px] text-stone-500">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              100% Private & Local: All messages, audio recordings, and document vectors stay entirely on your Mac. No cloud APIs required.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-rose-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 text-white font-medium text-xs hover:bg-stone-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
