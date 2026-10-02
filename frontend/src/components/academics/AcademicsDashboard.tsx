import React from 'react';
import { 
  Play, 
  Flame, 
  Target, 
  Code2, 
  Award, 
  BrainCircuit, 
  Rocket, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Database, 
  Calendar, 
  Layers
} from 'lucide-react';
import { CURRICULUM_DAYS, MODULES } from '../../data/academics/curriculum';
import type { AcademicProgressData, DayLesson } from '../../types/academics';
import type { AcademicsViewMode } from './AcademicsHeader';

interface AcademicsDashboardProps {
  progress: AcademicProgressData;
  onNavigate: (view: AcademicsViewMode) => void;
  onSelectDay: (dayNumber: number) => void;
}

export const AcademicsDashboard: React.FC<AcademicsDashboardProps> = ({
  progress,
  onNavigate,
  onSelectDay
}) => {
  const completedDays = progress.completed_days || [];
  const completedCount = completedDays.length;
  const progressPct = Math.round((completedCount / 100) * 100);

  // Compute next day to learn
  const currentDayNumber = completedDays.length > 0
    ? Math.min(100, Math.max(...completedDays) + 1)
    : 1;

  const currentLesson: DayLesson = CURRICULUM_DAYS.find(d => d.dayNumber === currentDayNumber) || CURRICULUM_DAYS[0];
  const nextLesson: DayLesson = CURRICULUM_DAYS.find(d => d.dayNumber === Math.min(100, currentDayNumber + 1)) || CURRICULUM_DAYS[1];

  const codingSolvedCount = Object.values(progress.coding_submissions || {}).filter(c => c.passed).length;
  const quizScores = Object.values(progress.quiz_scores || {});
  const avgMcqAccuracy = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  const weakTopics = (progress.revision_items || []).filter(i => i.difficulty === 'hard');
  const streak = progress.streak_count || 1;

  return (
    <div className="flex flex-col gap-5 text-stone-200">
      {/* Hero Continue Learning Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 via-[#0d1117] to-indigo-950/50 border border-sky-800/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold">
              Today's Recommended Focus: Day {currentLesson.dayNumber}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {currentLesson.moduleTitle}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
            {currentLesson.title}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 font-sans mt-1.5 line-clamp-2 max-w-2xl leading-relaxed">
            {currentLesson.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentLesson.durationMinutes} mins estimated</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLesson.practiceExercise.language.toUpperCase()} Practice Lab</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>{currentLesson.mcqs.length} Assessment MCQs</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => {
              onSelectDay(currentLesson.dayNumber);
              onNavigate('lesson');
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continue Learning Day {currentLesson.dayNumber}</span>
          </button>

          <button
            onClick={() => onNavigate('roadmap')}
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Explore 100-Day Roadmap</span>
          </button>
        </div>
      </div>

      {/* Live Data-Driven Progress Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Roadmap Progress</span>
            <Target className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-sky-300">{progressPct}%</div>
          <div className="text-[11px] text-stone-500">{completedCount} of 100 Days</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Learning Streak</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{streak} Days</div>
          <div className="text-[11px] text-stone-500">Daily Momentum</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Challenges Solved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">{codingSolvedCount}</div>
          <div className="text-[11px] text-stone-500">Zero-Defect Code Runs</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>MCQ Accuracy</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300">
            {quizScores.length > 0 ? `${avgMcqAccuracy}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-stone-500">{quizScores.length} assessments</div>
        </div>
      </div>

      {/* 4 Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigate('sql_playground')}
          className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] hover:border-sky-500/50 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-stone-100 group-hover:text-sky-300 transition-colors">
              SQL Analytical Sandbox
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              Query 12 live tables: Kimball Star Schema fact_sales, orders, employees.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-sky-400 font-semibold mt-3">
            <span>Launch SQL Engine</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('interview_bank')}
          className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
              Interview Question Bank
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              Hundreds of DE questions across Spark, Kafka, SQL, and System Design.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-3">
            <span>Practice Placement Qs</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('capstone')}
          className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-stone-100 group-hover:text-emerald-300 transition-colors">
              E-Commerce Capstone
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              20 actionable milestones: Kafka streaming, PySpark, Airflow & Tableau.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-3">
            <span>Open Capstone Guide</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('revision')}
          className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-stone-100 group-hover:text-purple-300 transition-colors">
              Spaced Repetition
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              Smart automated revision queues to retain concepts for placement day.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-purple-400 font-semibold mt-3">
            <span>Revise Weak Areas</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Roadmap Progress & Weak Topics Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 12 Modules Progress Summary (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
            <span className="font-semibold text-sm text-stone-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Curriculum Progression</span>
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {completedCount} / 100 Days Complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {MODULES.map(m => {
              let done = 0;
              const total = m.endDay - m.startDay + 1;
              for (let d = m.startDay; d <= m.endDay; d++) {
                if (completedDays.includes(d)) done++;
              }
              const pct = Math.round((done / total) * 100);

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectDay(m.startDay);
                    onNavigate('lesson');
                  }}
                  className="p-2.5 rounded-lg bg-[#161b22] border border-stone-800/80 hover:border-sky-500/40 transition-all cursor-pointer flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold truncate">{m.icon} {m.title.split(' ')[0]}</span>
                    <span className="font-mono text-sky-400 text-[11px]">{pct}%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">{m.dayRange} • {done}/{total} Days</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Upcoming Next Topic & Weak Areas (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Next Lesson Preview */}
          <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-sky-400" />
              <span>Next Up on Roadmap:</span>
            </span>
            <div className="font-semibold text-sm text-stone-200">
              Day {nextLesson.dayNumber}: {nextLesson.title}
            </div>
            <p className="text-xs text-stone-400 font-sans line-clamp-2">
              {nextLesson.description}
            </p>
            <button
              onClick={() => {
                onSelectDay(nextLesson.dayNumber);
                onNavigate('lesson');
              }}
              className="self-start text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-1 font-semibold cursor-pointer"
            >
              <span>Preview Day {nextLesson.dayNumber}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Revision Queue */}
          <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                <span>Revision Queue</span>
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                {weakTopics.length} Weak Topics
              </span>
            </div>

            {weakTopics.length === 0 ? (
              <div className="py-4 text-center text-stone-500 text-xs">
                No weak topics flagged! As you take quizzes and solve coding labs, tricky concepts will appear here automatically.
              </div>
            ) : (
              <div className="space-y-1.5">
                {weakTopics.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#161b22] border border-stone-800 flex items-center justify-between text-xs">
                    <span className="truncate max-w-[180px]">{item.topic}</span>
                    <button
                      onClick={() => {
                        onSelectDay(item.dayNumber);
                        onNavigate('lesson');
                      }}
                      className="text-[10px] text-purple-400 hover:underline"
                    >
                      Revise Day {item.dayNumber}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
