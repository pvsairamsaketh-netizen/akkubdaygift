import React, { useState } from 'react';
import { 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  Code2, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import { DSA_MODULES, DSA_CURRICULUM_DAYS } from '../../../data/academics/dsaCurriculum';
import type { AcademicProgressData } from '../../../types/academics';

interface DSARoadmapViewProps {
  progress: AcademicProgressData;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const DSARoadmapView: React.FC<DSARoadmapViewProps> = ({
  progress,
  currentDay,
  onSelectDay
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const completedDays = progress.completed_days || [];
  const dsaCompleted = completedDays.filter(d => d >= 101 && d <= 130).length;
  const dsaProgressPct = Math.round((dsaCompleted / 30) * 100);

  const filteredDays = selectedModuleId === 'all'
    ? DSA_CURRICULUM_DAYS
    : DSA_CURRICULUM_DAYS.filter(d => {
        const mod = DSA_MODULES.find(m => m.id === selectedModuleId);
        return mod && d.dayNumber >= mod.startDay && d.dayNumber <= mod.endDay;
      });

  return (
    <div className="flex flex-col gap-5 text-stone-200">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d141e] via-[#10192a] to-[#0d141e] border border-sky-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              30-Day Complete DSA & Coding Interview Roadmap
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Days 101–130
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            From first-principles complexity analysis and MRCET academic foundations to FAANG dynamic programming, graph algorithms, and timed mock coding rounds.
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400">
            <span className="flex items-center gap-1 text-sky-300">
              <ExternalLink className="w-3 h-3" /> MRCET R20 Syllabus Mapped
            </span>
            <span>•</span>
            <span className="text-amber-300">3,000+ Placement Practice Questions</span>
            <span>•</span>
            <span className="text-emerald-300">Python, C++, Java Multi-Language</span>
          </div>
        </div>

        {/* Progress Circular Badge */}
        <div className="flex items-center gap-3 bg-[#131b26] p-3 rounded-2xl border border-stone-800 shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-mono text-stone-400">DSA Track</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{dsaCompleted} / 30</span>
            <span className="text-[10px] text-stone-500">{dsaProgressPct}% Completed</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-stone-800 border-t-emerald-500 flex items-center justify-center font-bold text-xs text-white">
            {dsaProgressPct}%
          </div>
        </div>
      </div>

      {/* 2. STAGE SELECTOR PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedModuleId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedModuleId === 'all'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
              : 'bg-[#0d1117] text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          All 30 Days (101–130)
        </button>

        {DSA_MODULES.map(mod => (
          <button
            key={mod.id}
            onClick={() => setSelectedModuleId(mod.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedModuleId === mod.id
                ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
                : 'bg-[#0d1117] text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            <span>{mod.icon}</span>
            <span>{mod.title.split('&')[0]} ({mod.dayRange})</span>
          </button>
        ))}
      </div>

      {/* 3. ROADMAP TIMELINE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredDays.map((day) => {
          const isDone = completedDays.includes(day.dayNumber);
          const isCurrent = day.dayNumber === currentDay;

          return (
            <div
              key={day.id}
              onClick={() => onSelectDay(day.dayNumber)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-md group ${
                isCurrent
                  ? 'bg-gradient-to-br from-[#121b2b] to-[#0c121e] border-sky-500 ring-2 ring-sky-500/20 shadow-sky-950/40'
                  : isDone
                  ? 'bg-[#0b1312] border-emerald-900/50 hover:border-emerald-600'
                  : 'bg-[#0d1117] border-stone-800 hover:border-sky-800/80 hover:bg-[#121622]'
              }`}
            >
              <div>
                {/* Header row: Day badge, Status, MRCET Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${
                      isDone 
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' 
                        : isCurrent
                        ? 'bg-sky-950 text-sky-300 border-sky-700'
                        : 'bg-[#161c28] text-stone-300 border-stone-700'
                    }`}>
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40">
                      {day.academicLevel || 'Interview Essential'}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-500 font-mono">
                      {day.durationMinutes}m
                    </span>
                  )}
                </div>

                {/* Day Title */}
                <h4 className="font-bold text-sm text-stone-100 group-hover:text-sky-300 transition-colors leading-snug line-clamp-2">
                  {day.title}
                </h4>

                {/* MRCET Unit mapping */}
                {day.mrcetUnit && (
                  <div className="text-[10px] text-sky-400/80 font-mono mt-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span className="truncate">{day.mrcetUnit}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {day.description}
                </p>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Python • C++ • Java</span>
                </span>
                <span className="text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-semibold text-[11px]">
                  <span>Study Day</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
