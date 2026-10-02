import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { CURRICULUM_DAYS, MODULES } from '../../data/academics/curriculum';
import type { AcademicProgressData } from '../../types/academics';

interface RoadmapViewProps {
  progress: AcademicProgressData;
  onSelectDay: (dayNumber: number) => void;
  currentDay?: number;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  progress,
  onSelectDay,
  currentDay = 1
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('All');

  const completedDays = new Set(progress.completed_days || []);

  const filteredDays = selectedModuleId === 'All'
    ? CURRICULUM_DAYS
    : CURRICULUM_DAYS.filter(d => d.subject === selectedModuleId);

  return (
    <div className="flex flex-col gap-6 text-stone-200">
      {/* Top Module Navigator Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedModuleId('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedModuleId === 'All'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-900/40'
              : 'bg-[#161b22] text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          All 100 Days (12 Modules)
        </button>

        {MODULES.map(m => {
          const isSelected = selectedModuleId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModuleId(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-900/40'
                  : 'bg-[#161b22] text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.title.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75 font-mono">({m.dayRange})</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Roadmap Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredDays.map(day => {
          const isCompleted = completedDays.has(day.dayNumber);
          const isCurrent = day.dayNumber === currentDay;

          return (
            <div
              key={day.dayNumber}
              onClick={() => onSelectDay(day.dayNumber)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group hover:scale-[1.01] ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/60'
                  : isCurrent
                  ? 'bg-sky-950/30 border-sky-500 shadow-md shadow-sky-900/30 hover:border-sky-400'
                  : 'bg-[#0d1117] border-stone-800 hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      isCompleted
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-sky-500 text-white'
                        : 'bg-[#161b22] text-stone-400'
                    }`}>
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono truncate max-w-[140px]">
                      {day.subject.toUpperCase()}
                    </span>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                      <span>Completed</span>
                    </div>
                  ) : isCurrent ? (
                    <div className="flex items-center gap-1 text-[11px] text-sky-400 font-semibold animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>In Progress</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{day.durationMinutes}m</span>
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-sm text-stone-100 group-hover:text-sky-300 transition-colors line-clamp-2">
                  {day.title}
                </h4>

                <p className="text-xs text-stone-400 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                  {day.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  day.difficulty === 'Advanced'
                    ? 'text-rose-400 bg-rose-950/40'
                    : day.difficulty === 'Intermediate'
                    ? 'text-amber-400 bg-amber-950/40'
                    : 'text-emerald-400 bg-emerald-950/40'
                }`}>
                  {day.difficulty}
                </span>

                <div className="flex items-center gap-1 text-sky-400 group-hover:translate-x-1 transition-transform font-semibold text-[11px]">
                  <span>{isCompleted ? 'Review' : 'Start'} Lesson</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
