import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  FileText, 
  GraduationCap, 
  BookOpen,
  Bot,
  Sparkles,
  ChevronRight, 
  ChevronLeft, 
  Zap,
  Cpu
} from 'lucide-react';
import type { DayLesson } from '../../types/academics';
import { getEnrichedLesson } from '../../data/academics/academicPedagogy';
import { TopicLearningAssistant } from './TopicLearningAssistant';
import { useAcademicsTheme } from '../../context/AcademicsThemeContext';
import { InteractiveLessonAcademy } from './InteractiveLessonAcademy';

interface TutorialViewerProps {
  lesson: DayLesson;
  onNavigateToPractice?: () => void;
  onNavigateToMCQ?: () => void;
  onNavigateToInterview?: () => void;
  onSaveNote?: (title: string, content: string) => void;
  onSelectDay?: (day: number) => void;
}

export const TutorialViewer: React.FC<TutorialViewerProps> = ({
  lesson: rawLesson,
  onNavigateToPractice,
  onNavigateToMCQ,
  onNavigateToInterview,
  onSaveNote,
  onSelectDay
}) => {
  const { isDark } = useAcademicsTheme();

  // Enrich lesson with analogies, external resources, videos, and quick checks
  const lesson = useMemo(() => getEnrichedLesson(rawLesson), [rawLesson]);

  // Mode: standard, beginner (explain like I'm a beginner), or deep_dive
  const [learningMode, setLearningMode] = useState<'standard' | 'beginner' | 'deep_dive'>('standard');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});

  const handleToggleObjective = (index: number) => {
    setCheckedObjectives(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const progressPercent = useMemo(() => {
    const total = lesson.learningObjectives.length || 1;
    const completed = Object.values(checkedObjectives).filter(Boolean).length;
    return Math.min(100, Math.round((completed / total) * 100));
  }, [checkedObjectives, lesson.learningObjectives]);

  const handleQuickSaveNote = () => {
    if (onSaveNote) {
      onSaveNote(
        `Day ${lesson.dayNumber} Key Takeaways: ${lesson.title}`,
        `### ${lesson.title}\n\n**Objectives:**\n${lesson.learningObjectives.map(o => `- ${o}`).join("\n")}\n\n**Analogy:**\n${lesson.realLifeAnalogy?.analogy || ""}`
      );
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2500);
    }
  };

  return (
    <div className={`flex flex-col gap-5 font-sans ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
      {/* 1. TOP HERO BAR: Objective & Mode Selector */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xl flex flex-col gap-4 ${
        isDark 
          ? 'bg-gradient-to-r from-[#0d131f] via-[#111726] to-[#0d131f] border-sky-800/40' 
          : 'bg-gradient-to-r from-sky-50 via-white to-sky-50 border-sky-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500 text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider block">
                  Day {lesson.dayNumber} • Module {lesson.subject.toUpperCase()}
                </span>
                {lesson.mrcetUnit && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60 font-semibold">
                    {lesson.mrcetUnit}
                  </span>
                )}
              </div>
              <h3 className={`text-base sm:text-xl font-extrabold leading-tight mt-0.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {lesson.title}
              </h3>
            </div>
          </div>

          {/* Mode Switcher: Standard vs Beginner vs Deep Dive */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-[#090d14] border-stone-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setLearningMode('standard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                learningMode === 'standard'
                  ? 'bg-sky-600 text-white shadow-sm font-bold'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-700 hover:text-slate-950 font-medium'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>

            <button
              onClick={() => setLearningMode('beginner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                learningMode === 'beginner'
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-700 hover:text-slate-950 font-medium'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>❤️ Beginner Mode</span>
            </button>

            <button
              onClick={() => setLearningMode('deep_dive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                learningMode === 'deep_dive'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-700 hover:text-slate-950 font-medium'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>🔬 Deep Dive</span>
            </button>
          </div>
        </div>

        {/* Lesson Progress Indicator */}
        <div className="space-y-1.5 pt-2 border-t border-stone-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold flex items-center gap-1.5">
              <span>🎯 Lesson Objectives & Progress:</span>
              <strong className="text-sky-400 font-mono">{progressPercent}%</strong>
            </span>
            <span className="text-[11px] opacity-75 font-mono">
              {Object.values(checkedObjectives).filter(Boolean).length} of {lesson.learningObjectives.length} completed
            </span>
          </div>
          <div className="w-full bg-stone-800/40 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Learning Objectives Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {lesson.learningObjectives.map((obj, i) => {
            const isChecked = !!checkedObjectives[i];
            return (
              <button
                key={i}
                onClick={() => handleToggleObjective(i)}
                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  isChecked
                    ? isDark ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : isDark ? 'bg-[#161d2b]/60 border-sky-900/30 text-sky-200/90 hover:bg-[#1c2538]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isChecked ? 'text-emerald-400' : 'text-stone-500'}`} />
                <span className="leading-snug">{obj}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/60 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>🤖 Ask About This Topic</span>
            </button>

            <button
              onClick={handleQuickSaveNote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'bg-[#161f30] hover:bg-[#1f2d47] text-sky-300 border-sky-800/50' : 'bg-white hover:bg-slate-100 text-sky-700 border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{noteSavedFeedback ? 'Saved to Notes! ✓' : 'Save to Revision Notes'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToPractice && (
              <button
                onClick={onNavigateToPractice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Open Practice Lab</span>
              </button>
            )}
            {onNavigateToMCQ && (
              <button
                onClick={onNavigateToMCQ}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border-purple-800/50' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                }`}
              >
                <span>MCQs</span>
              </button>
            )}
            {onNavigateToInterview && (
              <button
                onClick={onNavigateToInterview}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-800/50' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                <span>Interview Qs</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MASTER INTERACTIVE ACADEMY CURRICULUM (SECTIONS A THROUGH H) */}
      <InteractiveLessonAcademy
        lesson={lesson}
        onNavigateToPractice={onNavigateToPractice}
        onNavigateToMCQ={onNavigateToMCQ}
        onNavigateToInterview={onNavigateToInterview}
        onSaveNote={onSaveNote}
      />

      {/* 10. ⚡ 60-SECOND REVISION SUMMARY */}
      {lesson.oneMinuteRevision && lesson.oneMinuteRevision.length > 0 && (
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-md flex flex-col gap-2.5 ${
          isDark ? 'bg-[#10141e] border-sky-900/50 text-stone-200' : 'bg-sky-50 border-sky-200 text-sky-950'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-sky-900/40">
            <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5 text-sky-400">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>⚡ 60-Second Revision Summary</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
              Quick Recall
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {lesson.oneMinuteRevision.map((rev, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{rev}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. BOTTOM CTA & NAVIGATION CONTROLS */}
      <div className={`flex flex-wrap items-center justify-between p-4 rounded-xl border gap-3 ${
        isDark ? 'bg-gradient-to-r from-emerald-950/30 to-sky-950/30 border-emerald-800/40' : 'bg-gradient-to-r from-emerald-50 to-sky-50 border-emerald-200'
      }`}>
        <div className="flex items-center gap-2">
          {onSelectDay && (
            <>
              <button
                onClick={() => onSelectDay(Math.max(1, lesson.dayNumber - 1))}
                disabled={lesson.dayNumber <= 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-30 cursor-pointer transition-colors ${
                  isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Day</span>
              </button>

              <button
                onClick={() => onSelectDay(Math.min(130, lesson.dayNumber + 1))}
                disabled={lesson.dayNumber >= 130}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-30 cursor-pointer transition-colors ${
                  isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <span>Next Day</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {onNavigateToPractice && (
          <button
            onClick={onNavigateToPractice}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Proceed to Practice Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* In-Lesson AI Learning Assistant Modal */}
      <TopicLearningAssistant
        lesson={lesson}
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        isDark={isDark}
      />
    </div>
  );
};
