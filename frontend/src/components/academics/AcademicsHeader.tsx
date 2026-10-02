import React, { useState } from 'react';
import { 
  GraduationCap, 
  Flame, 
  Sparkles, 
  X, 
  Heart, 
  Layers, 
  Database, 
  BookOpen, 
  FileText, 
  FileCheck2, 
  BrainCircuit, 
  Rocket, 
  BarChart3,
  Calendar
} from 'lucide-react';
import type { AcademicProgressData } from '../../types/academics';

export type AcademicsViewMode = 
  | 'dashboard'
  | 'roadmap'
  | 'lesson'
  | 'sql_playground'
  | 'coding_lab'
  | 'interview_bank'
  | 'notes'
  | 'cheatsheets'
  | 'revision'
  | 'capstone'
  | 'analytics';

interface AcademicsHeaderProps {
  currentView: AcademicsViewMode;
  onViewChange: (view: AcademicsViewMode) => void;
  progress: AcademicProgressData;
}

export const AcademicsHeader: React.FC<AcademicsHeaderProps> = ({
  currentView,
  onViewChange,
  progress
}) => {
  const [showBirthdayBanner, setShowBirthdayBanner] = useState(() => {
    try {
      return localStorage.getItem('akku_hide_bday_academy_banner') !== 'true';
    } catch {
      return true;
    }
  });

  const completedCount = progress.completed_days?.length || 0;
  const progressPct = Math.round((completedCount / 100) * 100);
  const streak = progress.streak_count || 1;

  const handleDismissBanner = () => {
    setShowBirthdayBanner(false);
    try {
      localStorage.setItem('akku_hide_bday_academy_banner', 'true');
    } catch {}
  };

  const navItems: { id: AcademicsViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'roadmap', label: '100D Roadmap', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'lesson', label: 'Daily Lesson', icon: <BookOpen className="w-3.5 h-3.5" />, badge: `Day ${progress.completed_days?.[progress.completed_days.length - 1] ? Math.min(100, (progress.completed_days[progress.completed_days.length - 1] + 1)) : 1}` },
    { id: 'sql_playground', label: 'SQL Sandbox', icon: <Database className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'interview_bank', label: 'Interview Bank', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'notes', label: 'My Notes', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'cheatsheets', label: 'Cheat Sheets', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
    { id: 'revision', label: 'Revision Queue', icon: <BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'capstone', label: 'Capstone Project', icon: <Rocket className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Dismissible Birthday Greeting for Akku */}
      {showBirthdayBanner && (
        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0 animate-pulse" />
            <span>
              <strong>Happy Birthday Akku! ❤️</strong> Built with love by Saki to power your M.Tech Data Engineering placement journey.
            </span>
          </div>
          <button
            onClick={handleDismissBanner}
            className="p-1 rounded-md hover:bg-black/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Dismiss greeting"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Academy Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-stone-800 text-stone-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Academy Branding & Personalized Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-900/40 shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
                Akku's Data Engineering Academy
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30 font-mono">
                M.Tech DE
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5 font-sans">
              "100 Days to Data Engineering Placement Readiness"
            </p>
          </div>
        </div>

        {/* Right: Quick Stats & Metrics */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Day progress indicator */}
          <div className="px-3 py-1.5 rounded-xl bg-[#161b22] border border-stone-800 flex items-center gap-2 text-xs">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Progress</span>
              <span className="font-mono font-bold text-sky-400">{progressPct}% ({completedCount}/100)</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs font-mono">
              {completedCount}
            </div>
          </div>

          {/* Learning Streak */}
          <div className="px-3 py-1.5 rounded-xl bg-[#161b22] border border-stone-800 flex items-center gap-2 text-xs">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Streak</span>
              <span className="font-mono font-bold text-amber-400">{streak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-900/40 scale-100 font-bold'
                  : 'bg-[#0d1117] text-stone-400 border border-stone-800/80 hover:text-stone-200 hover:bg-[#161b22]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#161b22] text-sky-400 border border-stone-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
