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
  Calendar,
  Code2,
  GitFork,
  Zap,
  Award,
  AlertTriangle,
  Bot
} from 'lucide-react';
import type { AcademicProgressData } from '../../types/academics';

export type AcademicTrack = 'de' | 'dsa';

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
  | 'analytics'
  // DSA Views (Days 101-130)
  | 'dsa_roadmap'
  | 'dsa_questions'
  | 'dsa_lesson'
  | 'dsa_rounds'
  | 'dsa_interviewer'
  | 'dsa_rapid_fire'
  | 'dsa_pattern_tree'
  | 'dsa_mistakes'
  | 'dsa_final_mock';

interface AcademicsHeaderProps {
  currentView: AcademicsViewMode;
  onViewChange: (view: AcademicsViewMode) => void;
  progress: AcademicProgressData;
  activeTrack: AcademicTrack;
  onTrackChange: (track: AcademicTrack) => void;
}

export const AcademicsHeader: React.FC<AcademicsHeaderProps> = ({
  currentView,
  onViewChange,
  progress,
  activeTrack,
  onTrackChange
}) => {
  const [showBirthdayBanner, setShowBirthdayBanner] = useState(() => {
    try {
      return localStorage.getItem('akku_hide_bday_academy_banner') !== 'true';
    } catch {
      return true;
    }
  });

  const deCompleted = (progress.completed_days || []).filter(d => d <= 100).length;
  const dsaCompleted = (progress.completed_days || []).filter(d => d >= 101 && d <= 130).length;
  const streak = progress.streak_count || 1;

  const handleDismissBanner = () => {
    setShowBirthdayBanner(false);
    try {
      localStorage.setItem('akku_hide_bday_academy_banner', 'true');
    } catch {}
  };

  // 1. Data Engineering Track Subnav (Days 1-100)
  const deNavItems: { id: AcademicsViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'roadmap', label: '100D Roadmap', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'lesson', label: 'Daily Lesson', icon: <BookOpen className="w-3.5 h-3.5" />, badge: `Day ${progress.completed_days?.[progress.completed_days.length - 1] ? Math.min(100, (progress.completed_days[progress.completed_days.length - 1] + 1)) : 1}` },
    { id: 'sql_playground', label: 'SQL Sandbox', icon: <Database className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'interview_bank', label: '1,000+ DE Bank', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'notes', label: 'My Notes', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'cheatsheets', label: 'Cheat Sheets', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
    { id: 'revision', label: 'Revision Queue', icon: <BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'capstone', label: 'Capstone Project', icon: <Rocket className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> }
  ];

  // 2. DSA & Coding Interview Track Subnav (Days 101-130)
  const dsaNavItems: { id: AcademicsViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dsa_roadmap', label: 'DSA Roadmap (101–130)', icon: <Calendar className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'dsa_questions', label: '3,000+ DSA Bank', icon: <Code2 className="w-3.5 h-3.5 text-emerald-400" />, badge: '3,130 Qs' },
    { id: 'dsa_lesson', label: 'DSA Daily Lesson', icon: <BookOpen className="w-3.5 h-3.5 text-sky-400" />, badge: 'Days 101–130' },
    { id: 'dsa_rounds', label: 'Timed Coding Rounds', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'dsa_interviewer', label: 'AI DSA Interviewer', icon: <Bot className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'dsa_rapid_fire', label: '⚡ Rapid Fire', icon: <Zap className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'dsa_pattern_tree', label: 'Which Pattern To Use?', icon: <GitFork className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'dsa_mistakes', label: 'Mistakes Notebook', icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'dsa_final_mock', label: 'Day 130 Final Simulation', icon: <Award className="w-3.5 h-3.5 text-yellow-400" /> }
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Dismissible Birthday Greeting for Akku */}
      {showBirthdayBanner && (
        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0 animate-pulse" />
            <span>
              <strong>Happy Birthday Akku! ❤️</strong> Built with love by Saki to power your M.Tech Data Engineering & FAANG DSA placement journey.
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-900/40 shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
                Akku's Placement Academy
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30 font-mono">
                M.Tech Placement Prep
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5 font-sans">
              "Days 1–100: Data Engineering • Days 101–130: Complete DSA & Coding Interview"
            </p>
          </div>
        </div>

        {/* Right: Quick Stats & Metrics */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Day Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-stone-800 text-xs">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
            <span className="font-semibold text-stone-300 font-mono">{streak}</span>
            <span className="text-stone-500 hidden sm:inline">Day Streak</span>
          </div>

          {/* DE Completion Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-stone-400">DE:</span>
            <span className="font-bold text-sky-300 font-mono">{deCompleted}/100</span>
          </div>

          {/* DSA Completion Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-stone-400">DSA:</span>
            <span className="font-bold text-purple-300 font-mono">{dsaCompleted}/30</span>
          </div>
        </div>
      </div>

      {/* 2. DUAL-TRACK SELECTOR: DATA ENGINEERING vs DSA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-[#090d14] rounded-2xl border border-stone-800 shadow-inner">
        <button
          onClick={() => {
            onTrackChange('de');
            if (currentView.startsWith('dsa_')) {
              onViewChange('dashboard');
            }
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTrack === 'de'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-900/40 ring-1 ring-sky-400/50'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141b28]'
          }`}
        >
          <Database className="w-4 h-4 text-sky-300" />
          <span>DATA ENGINEERING (Days 1–100)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-200 border border-sky-700/50">
            {deCompleted}/100
          </span>
        </button>

        <button
          onClick={() => {
            onTrackChange('dsa');
            if (!currentView.startsWith('dsa_')) {
              onViewChange('dsa_roadmap');
            }
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTrack === 'dsa'
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400/50'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141b28]'
          }`}
        >
          <Code2 className="w-4 h-4 text-purple-300" />
          <span>DSA & CODING INTERVIEW (Days 101–130)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-400 text-black font-extrabold uppercase animate-pulse">
            NEW
          </span>
        </button>
      </div>

      {/* 3. TRACK-SPECIFIC SUB-NAVIGATION BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(activeTrack === 'de' ? deNavItems : dsaNavItems).map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? activeTrack === 'dsa'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400/50'
                    : 'bg-sky-600 text-white shadow-md shadow-sky-900/40 ring-1 ring-sky-400/50'
                  : 'bg-[#0d1117] text-stone-400 hover:text-stone-200 hover:bg-[#161b22] border border-stone-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-800 text-stone-300'
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
