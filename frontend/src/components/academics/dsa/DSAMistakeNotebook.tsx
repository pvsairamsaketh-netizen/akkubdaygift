import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Copy, 
  Check 
} from 'lucide-react';
import { DSA_QUESTION_BANK } from '../../../data/academics/dsaQuestionBank';

export const DSAMistakeNotebook: React.FC = () => {
  const [mistakeIds, setMistakeIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('akku_dsa_mistakes');
      if (local) return JSON.parse(local);
    } catch {}
    // Seed with 3 default high-yield placement mistakes if empty
    return ['dsa_q_0001', 'dsa_q_0010', 'dsa_q_0025'];
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mistakeQuestions = DSA_QUESTION_BANK.filter(q => mistakeIds.includes(q.id));

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemoveMistake = (id: string) => {
    const updated = mistakeIds.filter(x => x !== id);
    setMistakeIds(updated);
    try {
      localStorage.setItem('akku_dsa_mistakes', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="flex flex-col gap-4 text-stone-200 font-sans max-w-4xl mx-auto my-4">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c1116] via-[#24131b] to-[#1c1116] border border-rose-800/40 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                My DSA Mistake Notebook & Spaced Review
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {mistakeQuestions.length} Questions Flagged
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Reinforces edge-case blindspots, off-by-one index bugs, and suboptimal complexity mistakes before interviews.
            </p>
          </div>
        </div>
      </div>

      {/* 2. MISTAKES LIST */}
      <div className="flex flex-col gap-3">
        {mistakeQuestions.length === 0 ? (
          <div className="p-12 text-center text-stone-500 bg-[#0d1117] rounded-2xl border border-stone-800">
            No mistakes recorded yet! As you test and submit problems in the Question Bank, any runtime errors or edge-case failures will automatically appear here for revision.
          </div>
        ) : (
          mistakeQuestions.map((q) => (
            <div 
              key={q.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-rose-900/40 flex flex-col gap-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-2.5">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60 font-bold">
                      {q.difficulty}
                    </span>
                    <span className="text-sky-400 font-sans font-bold">
                      {q.topic} • {q.pattern}
                    </span>
                    <span className="text-stone-500">
                      Platform: {q.platform}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-stone-100">
                    {q.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleRemoveMistake(q.id)}
                  className="text-[11px] text-stone-500 hover:text-emerald-400 underline cursor-pointer shrink-0"
                >
                  Mark Mastered ✓
                </button>
              </div>

              {/* Mistake Diagnosis Callout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/30 text-rose-200 space-y-1">
                  <span className="font-bold text-rose-300 text-[10px] uppercase block">Common Trap / Why It Failed:</span>
                  <p className="text-[11px] leading-relaxed">
                    Off-by-one boundary checking or missing base case when N=0. Avoid nested loops when a hashmap gives O(N) linear time.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-300 text-[10px] uppercase block">Correct Optimal Invariant:</span>
                  <p className="text-[11px] leading-relaxed">
                    {q.optimalApproach}
                  </p>
                </div>
              </div>

              {/* Solution Preview */}
              <div className="rounded-xl border border-stone-800 bg-[#07090e] p-3 overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5 font-mono">
                  <span>Reference Python Solution</span>
                  <button
                    onClick={() => handleCopy(q.id, q.pythonSolution)}
                    className="flex items-center gap-1 hover:text-white cursor-pointer"
                  >
                    {copiedId === q.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre">
                  {q.pythonSolution}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
