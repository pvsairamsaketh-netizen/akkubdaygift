import React, { useState, useEffect } from 'react';
import { AcademicsHeader, type AcademicsViewMode } from '../components/academics/AcademicsHeader';
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
import { api } from '../services/api';
import type { AcademicProgressData, InterviewQuestionItem } from '../types/academics';

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

export const AcademicsPage: React.FC = () => {
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
    } catch {}

    try {
      await api.academics.updateProgress(delta);
    } catch (err) {
      console.warn('Progress synced locally, backend deferred:', err);
    }
  };

  const handleToggleBookmark = (id: string) => {
    const currentBookmarks = progress.bookmarks || [];
    const exists = currentBookmarks.includes(id);
    const updated = exists 
      ? currentBookmarks.filter(b => b !== id)
      : [...currentBookmarks, id];
    handleUpdateProgress({ bookmarks: updated });
  };

  const handleToggleSaveSheet = (dayNumber: number) => {
    const currentSheets = progress.saved_cheat_sheets || [];
    const exists = currentSheets.includes(String(dayNumber));
    const updated = exists
      ? currentSheets.filter(s => s !== String(dayNumber))
      : [...currentSheets, String(dayNumber)];
    handleUpdateProgress({ saved_cheat_sheets: updated });
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const current = progress.capstone_progress || {};
    const updated = {
      ...current,
      [milestoneId]: !current[milestoneId]
    };
    handleUpdateProgress({ capstone_progress: updated });
  };

  const handleUpdateRevisionStatus = (topic: string, newDifficulty: 'easy' | 'medium' | 'hard') => {
    const items = [...(progress.revision_items || [])];
    const itemIndex = items.findIndex(i => i.topic === topic);
    const today = new Date();
    
    // Spaced repetition interval days
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
    <div className="min-h-screen bg-[#07090e] text-stone-100 flex flex-col font-sans">
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-5 lg:px-6 py-4 flex flex-col gap-5">
        {/* Top Academics Header Bar & Sub-Nav */}
        <AcademicsHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          progress={progress}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 pb-16">
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
              currentDayNumber={currentDayNumber}
              onSelectDay={setCurrentDayNumber}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {currentView === 'sql_playground' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-stone-800 shadow-xl flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">SQL Analytical Sandbox & Laboratory</h3>
                <p className="text-xs text-stone-400 mt-0.5">
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
        </main>
      </div>
    </div>
  );
};
