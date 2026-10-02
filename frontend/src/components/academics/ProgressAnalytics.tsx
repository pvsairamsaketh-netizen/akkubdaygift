import React from 'react';
import { 
  Trophy, 
  Flame, 
  Code2, 
  Target, 
  BookOpen, 
  FileText, 
  Download, 
  Award, 
  TrendingUp, 
  Layers
} from 'lucide-react';
import { MODULES } from '../../data/academics/curriculum';
import type { AcademicProgressData } from '../../types/academics';

interface ProgressAnalyticsProps {
  progress: AcademicProgressData;
  totalNotesCount?: number;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  progress,
  totalNotesCount = 0
}) => {
  const completedCount = progress.completed_days?.length || 0;
  const progressPct = Math.round((completedCount / 100) * 100);
  const codingSolvedCount = Object.values(progress.coding_submissions || {}).filter(c => c.passed).length;

  const quizScores = Object.values(progress.quiz_scores || {});
  const avgMcqAccuracy = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  const streak = progress.streak_count || 1;
  const savedSheetsCount = progress.saved_cheat_sheets?.length || 0;
  const weakCount = (progress.revision_items || []).filter(i => i.difficulty === 'hard').length;

  // Calculate module completion stats
  const moduleStats = MODULES.map(m => {
    let completedInModule = 0;
    const totalDaysInModule = m.endDay - m.startDay + 1;
    for (let d = m.startDay; d <= m.endDay; d++) {
      if (progress.completed_days?.includes(d)) {
        completedInModule++;
      }
    }
    const pct = Math.round((completedInModule / totalDaysInModule) * 100);
    return {
      ...m,
      completedInModule,
      totalDaysInModule,
      pct
    };
  });

  const handleExportReport = () => {
    const reportText = `=====================================================
AKKU'S DATA ENGINEERING PLACEMENT ACADEMY
100 Days to Placement Readiness — Readiness Report
Generated on: ${new Date().toLocaleDateString()}
=====================================================

1. EXECUTIVE SUMMARY
-------------------
• Overall Curriculum Progress: ${progressPct}% (${completedCount}/100 Days Completed)
• Active Learning Streak: ${streak} Days
• Coding & SQL Challenges Solved: ${codingSolvedCount}
• MCQ Assessment Accuracy: ${avgMcqAccuracy}%
• Study Notes Created: ${totalNotesCount}
• Saved Cheat Sheets: ${savedSheetsCount}
• Topics Queued for Spaced Revision: ${progress.revision_items?.length || 0} (Weak: ${weakCount})

2. DOMAIN-BY-DOMAIN MASTERY
--------------------------
${moduleStats.map(m => `• ${m.title} (${m.dayRange}): ${m.pct}% (${m.completedInModule}/${m.totalDaysInModule} Days)`).join('\n')}

3. PLACEMENT PREPARATION STATUS
------------------------------
${progressPct >= 80 ? 'Status: HIGHLY READY FOR TECH INTERVIEWS' : progressPct >= 40 ? 'Status: SOLID MOMENTUM — FOCUS ON SPARK & SQL' : 'Status: EARLY FOUNDATIONAL STAGE'}

=====================================================
Keep shining Akku! You're going to crack your dream DE offer! ❤️
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Akkus_DE_Placement_Readiness_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 text-stone-200">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-stone-900 to-indigo-950/50 border border-sky-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-stone-100">
              Placement Readiness Analytics
            </h3>
          </div>
          <p className="text-xs text-stone-400 max-w-xl">
            Live telemetry tracking Akku's 100-day journey. All numbers are computed from verified code submissions, SQL runs, and quizzes.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Placement Report</span>
        </button>
      </div>

      {/* 8 Primary Live KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Overall Roadmap</span>
            <Target className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-300">{progressPct}%</div>
          <div className="text-[11px] text-stone-500">{completedCount} of 100 Days</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{streak} Days</div>
          <div className="text-[11px] text-stone-500">Consistent Daily Prep</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Labs & Code Solved</span>
            <Code2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{codingSolvedCount}</div>
          <div className="text-[11px] text-stone-500">Zero-Defect Code Executions</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>MCQ Accuracy</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {quizScores.length > 0 ? `${avgMcqAccuracy}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-stone-500">{quizScores.length} assessments taken</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Study Notes</span>
            <FileText className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-100">{totalNotesCount}</div>
          <div className="text-[11px] text-stone-500">Personal Revision Notes</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Saved Cheat Sheets</span>
            <BookOpen className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-300">{savedSheetsCount}</div>
          <div className="text-[11px] text-stone-500">Curated Placement Summaries</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Needs Revision</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{weakCount}</div>
          <div className="text-[11px] text-stone-500">Marked for Targeted Practice</div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Placement Readiness</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-300 mt-1">
            {progressPct >= 70 ? 'Interview Ready' : progressPct >= 30 ? 'In Preparation' : 'Foundational'}
          </div>
          <div className="text-[11px] text-stone-500">Tier-1 Tech Companies</div>
        </div>
      </div>

      {/* Module-by-Module Progress Bars */}
      <div className="rounded-xl border border-stone-800 bg-[#0d1117] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h4 className="font-semibold text-sm text-stone-100">
              Module Mastery & Subject Breakdown
            </h4>
          </div>
          <span className="text-xs text-stone-400">12 Core Data Engineering Pillars</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleStats.map(m => (
            <div key={m.id} className="p-3 rounded-lg bg-[#161b22] border border-stone-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>{m.icon}</span>
                  <span className="font-semibold text-stone-200">{m.title}</span>
                </div>
                <span className="font-mono text-sky-300 font-semibold">{m.pct}%</span>
              </div>

              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(m.pct, 4)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <span>{m.dayRange}</span>
                <span>{m.completedInModule} / {m.totalDaysInModule} Days Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
