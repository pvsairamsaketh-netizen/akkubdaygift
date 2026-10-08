import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FileText, Heart, Sparkles } from 'lucide-react';
import type { Citation } from '../types/chat';

interface SourceCitationProps {
  citations?: Citation[];
  personalMemories?: Array<{
    text?: string;
    category?: string;
    subject?: string;
    source?: string;
    source_type?: string;
    timestamp?: string;
  }>;
}

const formatCategory = (cat?: string): string => {
  if (!cat) return 'Personal Memory';
  const map: Record<string, string> = {
    food_drinks: 'Food & Drinks',
    personal_preferences: 'Preferences',
    likes_dislikes: 'Likes & Dislikes',
    places_travel: 'Places & Travel',
    important_dates: 'Important Dates',
    shared_experiences: 'Shared Moments',
    relationship: 'Relationship',
    health_wellness: 'Health & Wellness',
    habits_routines: 'Habits & Routine',
    music_entertainment: 'Entertainment',
  };
  return map[cat] || cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const SourceCitation: React.FC<SourceCitationProps> = ({ citations = [], personalMemories = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const userMemories = (personalMemories || []).filter(
    m => m.source_type === 'user_memory' || m.source_type === 'manual' || m.source === 'user_memory'
  );
  const otherMemories = (personalMemories || []).filter(
    m => m.source_type !== 'user_memory' && m.source_type !== 'manual' && m.source !== 'user_memory'
  );

  const orderedMemories = [...userMemories, ...otherMemories];
  const relevantMemories = orderedMemories.slice(0, 3);
  const relevantCitations = (citations || []).slice(0, 2);

  const hasUserMemories = userMemories.length > 0;
  const hasMemories = relevantMemories.length > 0;
  const hasCitations = relevantCitations.length > 0;

  if (!hasMemories && !hasCitations) return null;

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  // Construct label according to Requirement 19
  let sourceLabel = 'Source: Relationship Archive';
  if (hasUserMemories && hasCitations) {
    const top = userMemories[0];
    const catStr = formatCategory(top.category);
    const subStr = top.subject && top.subject.trim() && top.subject.toLowerCase() !== 'manual entry' ? ` • ${top.subject.trim()}` : '';
    sourceLabel = `Source: Saved Memory (${catStr}${subStr}) + Relationship Archive`;
  } else if (hasUserMemories) {
    const top = userMemories[0];
    const catStr = formatCategory(top.category);
    const subStr = top.subject && top.subject.trim() && top.subject.toLowerCase() !== 'manual entry' ? ` • ${top.subject.trim()}` : '';
    sourceLabel = `Source: Saved Memory • ${catStr}${subStr}`;
  } else if (hasMemories) {
    sourceLabel = 'Source: Relationship Archive';
  }

  return (
    <div className="mt-2.5 pt-2 border-t border-rose-100/60 text-xs">
      <button
        onClick={handleToggle}
        className="inline-flex items-center gap-1.5 text-stone-600 hover:text-rose-700 font-medium cursor-pointer transition-colors text-[11px]"
      >
        {hasMemories ? (
          <Heart className="w-3 h-3 text-rose-500 fill-rose-400" />
        ) : (
          <BookOpen className="w-3 h-3 text-rose-400" />
        )}
        <span className="font-semibold text-rose-900/90">{sourceLabel}</span>
        {expanded ? <ChevronUp className="w-3 h-3 text-stone-400" /> : <ChevronDown className="w-3 h-3 text-stone-400" />}
      </button>

      {/* Expanded detailed citations & memories */}
      {expanded && (
        <div className="space-y-2 mt-2 animate-fade-in">
          {/* Saved Memories Section */}
          {hasMemories && relevantMemories.map((m, i) => (
            <div
              key={`mem-${i}`}
              className="p-2.5 rounded-xl bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/70 text-stone-800 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-rose-800 mb-1">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-500 fill-rose-400" />
                  <span>Verified User Memory</span>
                </div>
                {m.subject && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-700 font-medium">
                    {m.subject}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-stone-800 font-medium leading-relaxed">
                "{m.text}"
              </p>
              <div className="mt-1 text-[10px] text-stone-500 flex items-center gap-2">
                <span>Category: {formatCategory(m.category)}</span>
                {m.timestamp && <span>• {m.timestamp}</span>}
              </div>
            </div>
          ))}

          {/* Relationship Archive Chunks Section */}
          {hasCitations && relevantCitations.map((c, i) => (
            <div
              key={c.id || `chunk-${i}`}
              className="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/80 text-stone-700"
            >
              <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 mb-0.5">
                <FileText className="w-3 h-3 text-stone-500" />
                <span>Relationship Archive Passage</span>
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
