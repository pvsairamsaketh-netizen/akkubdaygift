import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Code, 
  HelpCircle, 
  Award, 
  FileText, 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Clock, 
  Layers, 
  Check,
  Bookmark,
  BookmarkCheck,
  Copy,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CURRICULUM_DAYS } from '../../data/academics/curriculum';
import { DSA_CURRICULUM_DAYS } from '../../data/academics/dsaCurriculum';
import { SQLPlayground } from './SQLPlayground';
import { CodingLab } from './CodingLab';
import { MCQAssessment } from './MCQAssessment';
import { NotesWorkspace } from './NotesWorkspace';
import { TutorialViewer } from './TutorialViewer';
import { api } from '../../services/api';
import type { DayLesson, AcademicProgressData } from '../../types/academics';
import { useAcademicsTheme } from '../../context/AcademicsThemeContext';

interface DailyLessonViewProps {
  currentDayNumber: number;
  onSelectDay: (day: number) => void;
  progress: AcademicProgressData;
  onUpdateProgress: (data: Partial<AcademicProgressData>) => void;
}

export const DailyLessonView: React.FC<DailyLessonViewProps> = ({
  currentDayNumber,
  onSelectDay,
  progress,
  onUpdateProgress
}) => {
  const { isDark } = useAcademicsTheme();
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'practice' | 'mcqs' | 'interview' | 'cheatsheet' | 'notes'>('learn');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [copiedSheet, setCopiedSheet] = useState(false);

  // Bookmarks persisted locally
  const [bookmarkedDays, setBookmarkedDays] = useState<number[]>(() => {
    try {
      const local = localStorage.getItem('akku_academic_bookmarked_days');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const handleToggleBookmark = (day: number) => {
    setBookmarkedDays(prev => {
      const updated = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
      try {
        localStorage.setItem('akku_academic_bookmarked_days', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const ALL_CURRICULUM_DAYS = useMemo(() => [...CURRICULUM_DAYS, ...DSA_CURRICULUM_DAYS], []);
  const lesson: DayLesson = ALL_CURRICULUM_DAYS.find(d => d.dayNumber === currentDayNumber) || CURRICULUM_DAYS[0];
  const isCompleted = progress.completed_days?.includes(lesson.dayNumber) || false;
  const isBookmarked = bookmarkedDays.includes(lesson.dayNumber);

  const handleToggleComplete = () => {
    const existing = progress.completed_days || [];
    let updated: number[];
    if (isCompleted) {
      updated = existing.filter(d => d !== lesson.dayNumber);
    } else {
      updated = [...existing, lesson.dayNumber];
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
    onUpdateProgress({ completed_days: updated });
  };

  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const handleCopyCheatSheet = () => {
    const text = `Day ${lesson.dayNumber} Cheat Sheet: ${lesson.title}\n\nSummary:\n${lesson.cheatSheet.summary}\n\nDefinitions:\n${lesson.cheatSheet.definitions?.map(d => `${d.term}: ${d.explanation}`).join('\n') || ''}\n\nSyntax Snippets:\n${lesson.cheatSheet.syntaxSnippets?.map(s => `${s.label}:\n${s.code}`).join('\n\n') || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedSheet(true);
    setTimeout(() => setCopiedSheet(false), 2000);
  };

  const isDSADay = currentDayNumber >= 101;
  const currentTrackDays = isDSADay ? DSA_CURRICULUM_DAYS : CURRICULUM_DAYS;
  const completedInTrack = isDSADay 
    ? (progress.completed_days || []).filter(d => d >= 101 && d <= 130).length
    : (progress.completed_days || []).filter(d => d <= 100).length;
  const trackTotal = isDSADay ? 130 : 100;
  const trackStart = isDSADay ? 101 : 1;

  const filteredSidebarDays = currentTrackDays.filter(d => 
    sidebarSearch === '' || 
    d.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
    String(d.dayNumber).includes(sidebarSearch) ||
    d.subject.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
      {/* Left Sidebar: Navigator (3 cols) */}
      <div className="lg:col-span-3 flex flex-col gap-2.5">
        <div className={`p-3.5 rounded-xl border flex flex-col gap-2.5 shadow-md ${
          isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-stone-800/80">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>{isDSADay ? 'DSA Track (101–130)' : 'DE Track (1–100)'}</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400">
              {completedInTrack} / {isDSADay ? 30 : 100}
            </span>
          </div>

          {/* Search Days */}
          <div className="relative">
            <Search className="w-3 h-3 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Find day, topic, or keyword..."
              className={`w-full pl-7 pr-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                isDark 
                  ? 'bg-[#161b22] border border-stone-800 text-stone-200 placeholder-stone-500' 
                  : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Scrollable Day List */}
          <div className="flex flex-col gap-1 max-h-[660px] overflow-y-auto scrollbar-thin pr-1">
            {filteredSidebarDays.map(d => {
              const active = d.dayNumber === currentDayNumber;
              const done = progress.completed_days?.includes(d.dayNumber);
              const quizScore = progress.quiz_scores?.[`day_${d.dayNumber}`];

              return (
                <button
                  key={d.dayNumber}
                  onClick={() => onSelectDay(d.dayNumber)}
                  className={`p-2 rounded-lg text-left transition-all flex items-center justify-between gap-2 cursor-pointer border text-xs ${
                    active
                      ? 'bg-sky-600 text-white font-semibold border-sky-500 shadow-sm'
                      : done
                      ? isDark 
                        ? 'bg-emerald-950/20 text-emerald-200 border-emerald-900/40 hover:bg-emerald-900/30' 
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                      : isDark
                      ? 'bg-[#161b22] text-stone-400 border-stone-800/80 hover:text-stone-200 hover:bg-stone-800/60'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] shrink-0 opacity-80">
                      Day {d.dayNumber}
                    </span>
                    <span className="truncate">{d.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {quizScore !== undefined && (
                      <span className="text-[10px] font-mono opacity-80">{quizScore}%</span>
                    )}
                    {done && (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-emerald-400'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace (9 cols) */}
      <div className="lg:col-span-9 flex flex-col gap-3">
        {/* Lesson Top Bar */}
        <div className={`p-4 rounded-xl border flex flex-col gap-3 shadow-md ${
          isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-stone-800/80">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold">
                Day {lesson.dayNumber} of {isDSADay ? '130' : '100'}
              </span>
              <span className="text-xs opacity-75 font-mono hidden sm:inline">
                {lesson.moduleTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Bookmark Button */}
              <button
                onClick={() => handleToggleBookmark(lesson.dayNumber)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : isDark ? 'bg-[#161b22] hover:bg-stone-800 text-stone-400 border-stone-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark this topic'}
              >
                {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              {/* Prev / Next Day navigation */}
              <button
                onClick={() => onSelectDay(Math.max(trackStart, currentDayNumber - 1))}
                disabled={currentDayNumber <= trackStart}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-30 ${
                  isDark ? 'bg-[#161b22] hover:bg-stone-800 text-stone-300 border-stone-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectDay(Math.min(trackTotal, currentDayNumber + 1))}
                disabled={currentDayNumber >= trackTotal}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-30 ${
                  isDark ? 'bg-[#161b22] hover:bg-stone-800 text-stone-300 border-stone-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Mark Complete Button */}
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>Mark Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold font-sans">
              {lesson.title}
            </h2>
            <p className="text-xs sm:text-sm opacity-80 font-sans mt-1 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs opacity-75 pt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Est. {lesson.durationMinutes} mins</span>
            </div>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              lesson.difficulty === 'Advanced' ? 'text-rose-300 bg-rose-950/40' : lesson.difficulty === 'Intermediate' ? 'text-amber-300 bg-amber-950/40' : 'text-emerald-300 bg-emerald-950/40'
            }`}>
              {lesson.difficulty}
            </span>
            {lesson.prerequisites && lesson.prerequisites.length > 0 && (
              <>
                <span>•</span>
                <span className="truncate max-w-xs">Prerequisites: {lesson.prerequisites.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* 7 Lesson Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b pb-1 scrollbar-none border-stone-800/80">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'learn' ? 'bg-sky-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-stone-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Learn</span>
          </button>

          <button
            onClick={() => setActiveTab('examples')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'examples' ? 'bg-sky-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-stone-800/40'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. Examples ({lesson.examples?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'practice' ? 'bg-emerald-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-stone-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>3. Practice Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('mcqs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'mcqs' ? 'bg-purple-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-stone-800/40'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>4. MCQs ({lesson.mcqs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'interview' ? 'bg-amber-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-stone-800/40'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>5. Interview Qs ({lesson.interviewQuestions?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'cheatsheet' ? 'bg-teal-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-stone-800/40'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>6. Cheat Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-stone-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>7. My Notes</span>
          </button>
        </div>

        {/* Tab 1: Learn */}
        {activeTab === 'learn' && (
          <TutorialViewer
            lesson={lesson}
            onNavigateToPractice={() => setActiveTab('practice')}
            onNavigateToMCQ={() => setActiveTab('mcqs')}
            onNavigateToInterview={() => setActiveTab('interview')}
            onSelectDay={onSelectDay}
            onSaveNote={async (title, content) => {
              try {
                await api.academics.createNote({
                  title,
                  content,
                  category: lesson.subject,
                  day_number: lesson.dayNumber,
                  tags: [lesson.subject, 'Tutorial Takeaway'],
                  is_pinned: true
                });
              } catch (e) {
                console.warn('Note save locally fallback:', e);
              }
            }}
          />
        )}

        {/* Tab 2: Examples */}
        {activeTab === 'examples' && (
          <div className="flex flex-col gap-4">
            {lesson.examples.map((ex, idx) => {
              const snippetKey = `ex_${idx}`;
              return (
                <div key={idx} className={`rounded-xl border overflow-hidden shadow-md ${
                  isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
                }`}>
                  <div className={`p-3.5 border-b flex items-center justify-between ${
                    isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div>
                      <h4 className="font-bold text-sm">{ex.title}</h4>
                      <p className="text-xs opacity-75 mt-0.5">{ex.explanation}</p>
                    </div>

                    <button
                      onClick={() => handleCopyCode(snippetKey, ex.code)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border ${
                        isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {copiedCodeKey === snippetKey ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <span>Copy Code</span>
                      )}
                    </button>
                  </div>

                  <pre className="p-3.5 font-mono text-xs text-emerald-300 bg-[#07090e] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {ex.code}
                  </pre>

                  {ex.output && (
                    <div className={`p-3 border-t text-xs ${
                      isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Expected Output:</div>
                      <div className="font-mono text-stone-300">{ex.output}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Practice Lab */}
        {activeTab === 'practice' && (
          <div>
            {lesson.practiceExercise.language === 'sql' ? (
              <SQLPlayground
                initialQuery={lesson.practiceExercise.starterCode}
                expectedSQL={lesson.practiceExercise.expectedSQL}
                exerciseTitle={lesson.practiceExercise.title}
                onSuccess={() => {
                  const existing = progress.coding_submissions || {};
                  onUpdateProgress({
                    coding_submissions: {
                      ...existing,
                      [lesson.practiceExercise.id]: {
                        code: lesson.practiceExercise.starterCode,
                        passed: true,
                        timestamp: new Date().toISOString()
                      }
                    }
                  });
                }}
              />
            ) : (
              <CodingLab
                exercise={lesson.practiceExercise}
                dayNumber={lesson.dayNumber}
                lesson={lesson}
                onSuccess={() => {
                  const existing = progress.coding_submissions || {};
                  onUpdateProgress({
                    coding_submissions: {
                      ...existing,
                      [lesson.practiceExercise.id]: {
                        code: lesson.practiceExercise.starterCode,
                        passed: true,
                        timestamp: new Date().toISOString()
                      }
                    }
                  });
                }}
              />
            )}
          </div>
        )}

        {/* Tab 4: MCQs */}
        {activeTab === 'mcqs' && (
          <MCQAssessment
            questions={lesson.mcqs}
            dayNumber={lesson.dayNumber}
            onComplete={(score, total) => {
              const pct = Math.round((score / total) * 100);
              const existing = progress.quiz_scores || {};
              onUpdateProgress({
                quiz_scores: {
                  ...existing,
                  [`day_${lesson.dayNumber}`]: pct
                }
              });
            }}
          />
        )}

        {/* Tab 5: Interview */}
        {activeTab === 'interview' && (
          <div className="flex flex-col gap-3">
            {lesson.interviewQuestions.map((q, idx) => (
              <div key={q.id || idx} className={`p-4 rounded-xl border flex flex-col gap-2.5 shadow-md ${
                isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sky-400 font-mono font-bold">
                    Placement Question #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    {q.difficulty}
                  </span>
                </div>

                <h4 className="font-bold text-sm font-sans">
                  {q.question}
                </h4>

                <div className="bg-[#07090e] p-3 rounded-lg border border-stone-800 text-xs font-mono text-stone-200 whitespace-pre-wrap leading-relaxed">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 font-sans">
                    Placement Model Answer:
                  </div>
                  {q.solution}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Cheat Sheet */}
        {activeTab === 'cheatsheet' && (
          <div className={`p-5 rounded-xl border flex flex-col gap-4 text-xs sm:text-sm shadow-md ${
            isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-stone-800/80">
              <div>
                <h3 className="font-bold text-base">⚡ 1-Minute Cheat Sheet & Quick Revision</h3>
                <p className="text-xs opacity-75 mt-0.5">{lesson.cheatSheet.summary}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyCheatSheet}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'bg-[#161b22] hover:bg-stone-800 text-stone-300 border-stone-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  {copiedSheet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSheet ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'bg-[#161b22] hover:bg-stone-800 text-stone-300 border-stone-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {lesson.cheatSheet.definitions && lesson.cheatSheet.definitions.length > 0 && (
              <div className={`space-y-1.5 p-3 rounded-lg border ${
                isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Definitions:</div>
                {lesson.cheatSheet.definitions.map((d, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-bold text-sky-400 font-mono">{d.term}: </span>
                    <span>{d.explanation}</span>
                  </div>
                ))}
              </div>
            )}

            {lesson.cheatSheet.syntaxSnippets && lesson.cheatSheet.syntaxSnippets.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Syntax & Patterns:</div>
                {lesson.cheatSheet.syntaxSnippets.map((snp, i) => (
                  <pre key={i} className="p-2.5 rounded bg-[#07090e] border border-stone-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                    {snp.code}
                  </pre>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: My Notes */}
        {activeTab === 'notes' && (
          <NotesWorkspace
            initialDay={lesson.dayNumber}
            initialTopic={lesson.title}
          />
        )}
      </div>
    </div>
  );
};
