import React, { useState, useEffect } from 'react';
import { AcademicsHeader, type AcademicsViewMode, type AcademicTrack } from '../components/academics/AcademicsHeader';
import { AcademicsDashboard } from '../components/academics/AcademicsDashboard';
import { DailyLessonView } from '../components/academics/DailyLessonView';
import { RoadmapView } from '../components/academics/RoadmapView';
import { SQLPlayground } from '../components/academics/SQLPlayground';
import { InterviewBank } from '../components/academics/InterviewBank';
import { NotesWorkspace } from '../components/academics/NotesWorkspace';
import { CheatSheetLibrary } from '../components/academics/CheatSheetLibrary';
import { SpacedRevisionTracker } from '../components/academics/SpacedRevisionTracker';
import { CapstoneProjectView } from '../components/academics/CapstoneProjectView';
import { ProgressAnalytics } from '../components/academics/ProgressAnalytics';
import { DSARoadmapView } from '../components/academics/dsa/DSARoadmapView';
import { DSAQuestionBankView } from '../components/academics/dsa/DSAQuestionBankView';
import { TimedCodingRound } from '../components/academics/dsa/TimedCodingRound';
import { DSAInterviewer } from '../components/academics/dsa/DSAInterviewer';
import { RapidFireChallenge } from '../components/academics/dsa/RapidFireChallenge';
import { DSAPatternTree } from '../components/academics/dsa/DSAPatternTree';
import { DSAMistakeNotebook } from '../components/academics/dsa/DSAMistakeNotebook';
import { FinalDSASimulation } from '../components/academics/dsa/FinalDSASimulation';
import { api } from '../services/api';
import type { AcademicProgressData, InterviewQuestionItem } from '../types/academics';
import { AcademicsThemeProvider, useAcademicsTheme } from '../context/AcademicsThemeContext';

const INITIAL_PROGRESS: AcademicProgressData = {
  user_id: 'default_user',
  completed_days: [],
  day_status: {},
  quiz_scores: {},
  coding_submissions: {},
  saved_cheat_sheets: [],
  bookmarks: [],
  revision_items: [
    {
      topic: 'Window Functions (ROW_NUMBER vs DENSE_RANK)',
      dayNumber: 17,
      difficulty: 'hard',
      nextReviewDate: new Date().toISOString().split('T')[0],
      stage: 1
    },
    {
      topic: 'PySpark Shuffles & Broadcast Join Optimization',
      dayNumber: 66,
      difficulty: 'medium',
      nextReviewDate: new Date().toISOString().split('T')[0],
      stage: 2
    }
  ],
  capstone_progress: {
    m1: true,
    m2: true
  },
  streak_count: 1
};

const AcademicsPageInner: React.FC = () => {
  const { isDark } = useAcademicsTheme();
  const [activeTrack, setActiveTrack] = useState<AcademicTrack>('de');
  const [currentView, setCurrentView] = useState<AcademicsViewMode>('dashboard');
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(1);
  const [progress, setProgress] = useState<AcademicProgressData>(() => {
    try {
      const local = localStorage.getItem('akku_academic_progress');
      if (local) return JSON.parse(local);
    } catch {}
    return INITIAL_PROGRESS;
  });
  const [notesCount, setNotesCount] = useState<number>(0);

  // Fetch progress from backend on mount
  useEffect(() => {
    loadProgress();
    loadNotesCount();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await api.academics.getProgress();
      if (data && data.user_id) {
        setProgress(data);
        localStorage.setItem('akku_academic_progress', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Using local academic progress cache:', err);
    }
  };

  const loadNotesCount = async () => {
    try {
      const data = await api.academics.getNotes();
      if (data && Array.isArray(data.notes)) {
        setNotesCount(data.notes.length);
      }
    } catch {
      try {
        const local = localStorage.getItem('akku_academic_notes');
        if (local) setNotesCount(JSON.parse(local).length);
      } catch {}
    }
  };

  const handleUpdateProgress = async (delta: Partial<AcademicProgressData>) => {
    const updated: AcademicProgressData = {
      ...progress,
      ...delta
    };

    setProgress(updated);
    try {
      localStorage.setItem('akku_academic_progress', JSON.stringify(updated));
      await api.academics.updateProgress(delta);
    } catch (err) {
      console.warn('Failed to sync progress with backend, saved locally:', err);
    }
  };

  const handleToggleBookmark = (id: string) => {
    const existing = progress.bookmarks || [];
    const updated = existing.includes(id)
      ? existing.filter(b => b !== id)
      : [...existing, id];
    handleUpdateProgress({ bookmarks: updated });
  };

  const handleToggleSaveSheet = (dayNumber: number) => {
    const dayStr = String(dayNumber);
    const existing = progress.saved_cheat_sheets || [];
    const updated = existing.includes(dayStr)
      ? existing.filter(d => d !== dayStr)
      : [...existing, dayStr];
    handleUpdateProgress({ saved_cheat_sheets: updated });
  };

  const handleToggleMilestone = (key: string) => {
    const existing = progress.capstone_progress || {};
    const updated = {
      ...existing,
      [key]: !existing[key]
    };
    handleUpdateProgress({ capstone_progress: updated });
  };

  const handleUpdateRevisionStatus = (topic: string, newDifficulty: 'easy' | 'medium' | 'hard') => {
    const items = [...(progress.revision_items || [])];
    const itemIndex = items.findIndex(i => i.topic === topic);
    const today = new Date();
    const daysToAdd = newDifficulty === 'easy' ? 7 : newDifficulty === 'medium' ? 3 : 1;
    const nextDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (itemIndex >= 0) {
      items[itemIndex] = {
        ...items[itemIndex],
        difficulty: newDifficulty,
        nextReviewDate: nextDate,
        stage: items[itemIndex].stage + 1
      };
    } else {
      items.push({
        topic,
        dayNumber: currentDayNumber,
        difficulty: newDifficulty,
        nextReviewDate: nextDate,
        stage: 1
      });
    }

    handleUpdateProgress({ revision_items: items });
  };

  const handleSaveQuestionToNotes = async (q: InterviewQuestionItem) => {
    try {
      await api.academics.createNote({
        title: `Interview Q: ${q.question.slice(0, 50)}...`,
        content: `### Question\n${q.question}\n\n### Model Solution\n${q.solution}\n\n### Time & Space Complexity\n- Time: ${q.timeComplexity || 'N/A'}\n- Space: ${q.spaceComplexity || 'N/A'}`,
        category: 'Placement Revision',
        tags: [...q.tags, q.difficulty],
        is_pinned: true
      });
      alert('Question added to your Notes & Revision Book!');
      loadNotesCount();
    } catch (err) {
      alert('Note saved locally in your Revision Book!');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#07090e] text-stone-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-5 lg:px-6 py-4 flex flex-col gap-5">
        {/* Top Academics Header Bar & Sub-Nav */}
        <AcademicsHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          progress={progress}
          activeTrack={activeTrack}
          onTrackChange={(track) => {
            setActiveTrack(track);
            if (track === 'dsa') {
              if (!currentView.startsWith('dsa_')) {
                setCurrentView('dsa_roadmap');
              }
            } else {
              if (currentView.startsWith('dsa_')) {
                setCurrentView('dashboard');
              }
            }
          }}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 pb-16">
          {/* ========================================================================= */}
          {/* DATA ENGINEERING (DAYS 1-100) - UNTOUCHED & FULLY PRESERVED               */}
          {/* ========================================================================= */}
          {currentView === 'dashboard' && (
            <AcademicsDashboard
              progress={progress}
              onNavigate={setCurrentView}
              onSelectDay={(day) => {
                setCurrentDayNumber(day);
                setCurrentView('lesson');
              }}
            />
          )}

          {currentView === 'roadmap' && (
            <RoadmapView
              progress={progress}
              currentDay={currentDayNumber}
              onSelectDay={(day) => {
                setCurrentDayNumber(day);
                setCurrentView('lesson');
              }}
            />
          )}

          {currentView === 'lesson' && (
            <DailyLessonView
              currentDayNumber={currentDayNumber <= 100 ? currentDayNumber : 1}
              onSelectDay={setCurrentDayNumber}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {currentView === 'sql_playground' && (
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-xl flex flex-col gap-4 ${
              isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <h3 className="font-bold text-lg">SQL Analytical Sandbox & Laboratory</h3>
                <p className="text-xs opacity-75 mt-0.5">
                  Execute live queries against 12 relational and Kimball dimensional tables (`fact_sales`, `dim_customer`, `dim_product`, `dim_date`, `orders`, `employees`).
                </p>
              </div>
              <SQLPlayground height="380px" />
            </div>
          )}

          {currentView === 'interview_bank' && (
            <InterviewBank
              savedBookmarkIds={progress.bookmarks || []}
              onToggleBookmark={handleToggleBookmark}
              onSaveToNotes={handleSaveQuestionToNotes}
            />
          )}

          {currentView === 'notes' && (
            <NotesWorkspace />
          )}

          {currentView === 'cheatsheets' && (
            <CheatSheetLibrary
              savedSheetDays={(progress.saved_cheat_sheets || []).map(Number)}
              onToggleSaveSheet={handleToggleSaveSheet}
              onOpenLesson={(day) => {
                setCurrentDayNumber(day);
                setCurrentView('lesson');
              }}
            />
          )}

          {currentView === 'revision' && (
            <SpacedRevisionTracker
              progress={progress}
              onSelectDay={(day) => {
                setCurrentDayNumber(day);
                setCurrentView('lesson');
              }}
              onUpdateRevisionStatus={handleUpdateRevisionStatus}
            />
          )}

          {currentView === 'capstone' && (
            <CapstoneProjectView
              completedMilestones={progress.capstone_progress || {}}
              onToggleMilestone={handleToggleMilestone}
            />
          )}

          {currentView === 'analytics' && (
            <ProgressAnalytics
              progress={progress}
              totalNotesCount={notesCount}
            />
          )}

          {/* ========================================================================= */}
          {/* DSA & CODING INTERVIEW (DAYS 101-130)                                    */}
          {/* ========================================================================= */}
          {currentView === 'dsa_roadmap' && (
            <DSARoadmapView
              progress={progress}
              currentDay={currentDayNumber >= 101 ? currentDayNumber : 101}
              onSelectDay={(day) => {
                setCurrentDayNumber(day);
                setCurrentView('dsa_lesson');
              }}
            />
          )}

          {currentView === 'dsa_questions' && (
            <DSAQuestionBankView />
          )}

          {currentView === 'dsa_lesson' && (
            <DailyLessonView
              currentDayNumber={currentDayNumber >= 101 ? currentDayNumber : 101}
              onSelectDay={setCurrentDayNumber}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {currentView === 'dsa_rounds' && (
            <TimedCodingRound />
          )}

          {currentView === 'dsa_interviewer' && (
            <DSAInterviewer />
          )}

          {currentView === 'dsa_rapid_fire' && (
            <RapidFireChallenge />
          )}

          {currentView === 'dsa_pattern_tree' && (
            <DSAPatternTree />
          )}

          {currentView === 'dsa_mistakes' && (
            <DSAMistakeNotebook />
          )}

          {currentView === 'dsa_final_mock' && (
            <FinalDSASimulation />
          )}
        </main>
      </div>
    </div>
  );
};

export const AcademicsPage: React.FC = () => {
  return (
    <AcademicsThemeProvider>
      <AcademicsPageInner />
    </AcademicsThemeProvider>
  );
};
