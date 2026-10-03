import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CURRICULUM_DAYS } from '../../data/academics/curriculum';
import { SQLPlayground } from './SQLPlayground';
import { CodingLab } from './CodingLab';
import { MCQAssessment } from './MCQAssessment';
import { NotesWorkspace } from './NotesWorkspace';
import { TutorialViewer } from './TutorialViewer';
import { api } from '../../services/api';
import type { DayLesson, AcademicProgressData } from '../../types/academics';

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
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'practice' | 'mcqs' | 'interview' | 'cheatsheet' | 'notes'>('learn');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const lesson: DayLesson = CURRICULUM_DAYS.find(d => d.dayNumber === currentDayNumber) || CURRICULUM_DAYS[0];
  const isCompleted = progress.completed_days?.includes(lesson.dayNumber) || false;

  const handleToggleComplete = () => {
    const existing = progress.completed_days || [];
    let updated: number[];
    if (isCompleted) {
      updated = existing.filter(d => d !== lesson.dayNumber);
    } else {
      updated = [...existing, lesson.dayNumber];
      // Trigger confetti celebration
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

  const filteredSidebarDays = CURRICULUM_DAYS.filter(d => 
    sidebarSearch === '' || 
    d.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
    String(d.dayNumber).includes(sidebarSearch) ||
    d.subject.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-stone-200">
      {/* Left Sidebar: 100 Days Navigator (3 cols) */}
      <div className="lg:col-span-3 flex flex-col gap-2.5">
        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="font-semibold text-xs text-stone-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>100-Day Curriculum</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {progress.completed_days?.length || 0} / 100
            </span>
          </div>

          {/* Search Days */}
          <div className="relative">
            <Search className="w-3 h-3 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Find Day 1-100 or topic..."
              className="w-full pl-7 pr-2.5 py-1.5 bg-[#161b22] border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Scrollable Day List */}
          <div className="flex flex-col gap-1 max-h-[640px] overflow-y-auto scrollbar-thin pr-1">
            {filteredSidebarDays.map(d => {
              const active = d.dayNumber === currentDayNumber;
              const done = progress.completed_days?.includes(d.dayNumber);

              return (
                <button
                  key={d.dayNumber}
                  onClick={() => onSelectDay(d.dayNumber)}
                  className={`p-2 rounded-lg text-left transition-all flex items-center justify-between gap-2 cursor-pointer border text-xs ${
                    active
                      ? 'bg-sky-600 text-white font-semibold border-sky-500 shadow-sm'
                      : done
                      ? 'bg-emerald-950/20 text-emerald-200 border-emerald-900/40 hover:bg-emerald-900/30'
                      : 'bg-[#161b22] text-stone-400 border-stone-800/80 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] shrink-0">
                      Day {d.dayNumber}
                    </span>
                    <span className="truncate">{d.title}</span>
                  </div>

                  {done && (
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-400'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace (9 cols) */}
      <div className="lg:col-span-9 flex flex-col gap-3">
        {/* Lesson Top Bar */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold">
                Day {lesson.dayNumber} of 100
              </span>
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                {lesson.moduleTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Prev / Next Day navigation */}
              <button
                onClick={() => onSelectDay(Math.max(1, currentDayNumber - 1))}
                disabled={currentDayNumber === 1}
                className="p-1.5 rounded-lg bg-[#161b22] hover:bg-stone-800 text-stone-300 disabled:opacity-40 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectDay(Math.min(100, currentDayNumber + 1))}
                disabled={currentDayNumber === 100}
                className="p-1.5 rounded-lg bg-[#161b22] hover:bg-stone-800 text-stone-300 disabled:opacity-40 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Mark Complete Button */}
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
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
            <h2 className="text-lg sm:text-xl font-bold text-stone-100 font-sans">
              {lesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-sans mt-1 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 pt-1">
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
                <span className="truncate max-w-xs">Prereq: {lesson.prerequisites.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* 7 Lesson Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-stone-800 pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'learn' ? 'bg-sky-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Learn</span>
          </button>

          <button
            onClick={() => setActiveTab('examples')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'examples' ? 'bg-sky-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. Examples ({lesson.examples?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'practice' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>3. Practice Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('mcqs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'mcqs' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>4. MCQs ({lesson.mcqs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'interview' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>5. Interview Qs ({lesson.interviewQuestions?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'cheatsheet' ? 'bg-teal-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>6. Cheat Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>7. My Notes</span>
          </button>
        </div>

        {/* Tab 1: Learn - Rich Interactive Tutorial Engine */}
        {activeTab === 'learn' && (
          <TutorialViewer
            lesson={lesson}
            onNavigateToPractice={() => setActiveTab('practice')}
            onNavigateToMCQ={() => setActiveTab('mcqs')}
            onNavigateToInterview={() => setActiveTab('interview')}
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
                <div key={idx} className="rounded-xl border border-stone-800 bg-[#0d1117] overflow-hidden">
                  <div className="p-3.5 bg-[#161b22] border-b border-stone-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-stone-100 text-sm">{ex.title}</h4>
                      <p className="text-xs text-stone-400 mt-0.5">{ex.explanation}</p>
                    </div>

                    <button
                      onClick={() => handleCopyCode(snippetKey, ex.code)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
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

                  <pre className="p-3.5 font-mono text-xs text-emerald-300 bg-[#0d1117] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {ex.code}
                  </pre>

                  {ex.output && (
                    <div className="p-3 bg-[#161b22] border-t border-stone-800 text-xs">
                      <div className="text-[10px] uppercase font-semibold text-stone-400 mb-1">Expected Output:</div>
                      <div className="font-mono text-stone-300">{ex.output}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Practice Lab (SQL Playground or Python CodingLab) */}
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
              <div key={q.id || idx} className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sky-400 font-mono font-semibold">
                    Placement Question #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300">
                    {q.difficulty}
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-stone-100 font-sans">
                  {q.question}
                </h4>

                <div className="bg-[#161b22] p-3 rounded-lg border border-stone-800 text-xs font-mono text-stone-200 whitespace-pre-wrap leading-relaxed">
                  <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 font-sans">
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
          <div className="p-5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-bold text-base text-stone-100">5-Minute Revision Summary</h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">{lesson.cheatSheet.summary}</p>
            </div>

            {lesson.cheatSheet.definitions && lesson.cheatSheet.definitions.length > 0 && (
              <div className="space-y-1.5 bg-[#161b22] p-3 rounded-lg border border-stone-800">
                <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Definitions:</div>
                {lesson.cheatSheet.definitions.map((d, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-semibold text-sky-300 font-mono">{d.term}: </span>
                    <span className="text-stone-300">{d.explanation}</span>
                  </div>
                ))}
              </div>
            )}

            {lesson.cheatSheet.syntaxSnippets && lesson.cheatSheet.syntaxSnippets.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Syntax & Patterns:</div>
                {lesson.cheatSheet.syntaxSnippets.map((snp, i) => (
                  <pre key={i} className="p-2.5 rounded bg-[#161b22] border border-stone-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
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
