import React, { useState } from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BrainCircuit
} from 'lucide-react';
import type { AcademicProgressData } from '../../types/academics';

interface SpacedRevisionTrackerProps {
  progress: AcademicProgressData;
  onSelectDay: (dayNumber: number) => void;
  onUpdateRevisionStatus?: (topic: string, newDifficulty: 'easy' | 'medium' | 'hard') => void;
}

export const SpacedRevisionTracker: React.FC<SpacedRevisionTrackerProps> = ({
  progress,
  onSelectDay,
  onUpdateRevisionStatus
}) => {
  const [filterMode, setFilterMode] = useState<'due' | 'all' | 'weak'>('due');

  const revisionItems = progress.revision_items || [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Due today or overdue
  const dueItems = revisionItems.filter(item => item.nextReviewDate <= todayStr);
  const weakItems = revisionItems.filter(item => item.difficulty === 'hard');

  const displayedItems = filterMode === 'due'
    ? dueItems
    : filterMode === 'weak'
    ? weakItems
    : revisionItems;

  return (
    <div className="flex flex-col gap-4 text-stone-200">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-stone-900 to-sky-950/40 border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-100 text-sm sm:text-base">
              Spaced Repetition & Weak Topic Engine
            </h3>
            <p className="text-xs text-stone-400">
              Optimal placement retention: 1 day → 3 days → 7 days → 14 days. Never forget a concept before interviews!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-[#161b22] border border-stone-800 text-center">
            <div className="text-[10px] text-stone-400 uppercase">Reviews Due</div>
            <div className="text-sm font-bold font-mono text-purple-400">{dueItems.length}</div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-[#161b22] border border-stone-800 text-center">
            <div className="text-[10px] text-stone-400 uppercase">Weak Topics</div>
            <div className="text-sm font-bold font-mono text-rose-400">{weakItems.length}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setFilterMode('due')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filterMode === 'due' ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Due Today ({dueItems.length})</span>
        </button>

        <button
          onClick={() => setFilterMode('weak')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filterMode === 'weak' ? 'bg-rose-600 text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Needs Practice / Weak ({weakItems.length})</span>
        </button>

        <button
          onClick={() => setFilterMode('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filterMode === 'all' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>All Scheduled ({revisionItems.length})</span>
        </button>
      </div>

      {/* Topics Cards */}
      <div className="flex flex-col gap-2.5">
        {displayedItems.length === 0 ? (
          <div className="p-12 text-center text-stone-500 bg-[#0d1117] rounded-xl border border-stone-800 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400/60" />
            <div className="font-semibold text-stone-300">All caught up!</div>
            <div className="text-xs">No pending revision topics in this category today. Keep progressing through the 100-day roadmap!</div>
          </div>
        ) : (
          displayedItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] hover:border-stone-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Day {item.dayNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.difficulty === 'hard'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : item.difficulty === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.difficulty.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Interval Stage {item.stage || 1}
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-stone-100 font-sans">
                  {item.topic}
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-1">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  <span>Scheduled: {item.nextReviewDate}</span>
                  {item.nextReviewDate <= todayStr && (
                    <span className="text-rose-400 font-semibold">• Ready to Revise</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onUpdateRevisionStatus && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateRevisionStatus(item.topic, 'easy')}
                      className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-[10px] hover:bg-emerald-900/50 cursor-pointer"
                      title="Mark Easy (shifts review 7-14 days)"
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => onUpdateRevisionStatus(item.topic, 'hard')}
                      className="px-2 py-1 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[10px] hover:bg-rose-900/50 cursor-pointer"
                      title="Mark Hard (shifts review to tomorrow)"
                    >
                      Hard
                    </button>
                  </div>
                )}

                <button
                  onClick={() => onSelectDay(item.dayNumber)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <span>Revise Lesson</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
