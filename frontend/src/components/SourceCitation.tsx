import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import type { Citation } from '../types/chat';

interface SourceCitationProps {
  citations: Citation[];
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ citations }) => {
  const [expanded, setExpanded] = useState(false);

  // Maximum 1-2 citations directly supporting the answer
  const relevantCitations = (citations || []).slice(0, 2);

  if (relevantCitations.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-rose-100/60 text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 text-stone-500 hover:text-rose-700 font-medium cursor-pointer transition-colors text-[11px]"
      >
        <BookOpen className="w-3 h-3 text-rose-400" />
        <span>Source: Relationship Archive</span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Expanded clean quote */}
      {expanded && (
        <div className="space-y-1.5 mt-2 animate-fade-in">
          {relevantCitations.map((c, i) => (
            <div
              key={c.id || i}
              className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-stone-700"
            >
              <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-800 mb-0.5">
                <FileText className="w-3 h-3 text-rose-500" />
                <span>Reference Passage</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed italic">
                "{c.snippet}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
