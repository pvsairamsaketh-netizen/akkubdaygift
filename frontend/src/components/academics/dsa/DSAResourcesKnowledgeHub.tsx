import React, { useState } from 'react';
import { 
  ExternalLink, 
  Search, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Copy, 
  BookOpen, 
  Flame, 
  Layers, 
  ShieldCheck, 
  Printer,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { 
  DSA_SOURCES, 
  DSA_COMPLEXITY_TABLE, 
  DSA_PATTERNS, 
  DSA_INTERVIEW_MASTER_QUESTIONS, 
  DSA_MASTER_CHEAT_SHEETS, 
  PATTERN_QUIZ_QUESTIONS,
  type DSAPatternDetail,
  type DSACheatSheetDetail
} from '../../../data/academics/dsaResourcesData';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

interface DSAResourcesKnowledgeHubProps {
  onSelectDay?: (dayNumber: number) => void;
}

type HubTab = 'sources' | 'complexity' | 'patterns' | 'interview' | 'cheatsheets' | 'rapid_prep';

export const DSAResourcesKnowledgeHub: React.FC<DSAResourcesKnowledgeHubProps> = ({ onSelectDay }) => {
  const { isDark } = useAcademicsTheme();
  const [activeTab, setActiveTab] = useState<HubTab>('sources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplexityCase, setSelectedComplexityCase] = useState<'avg' | 'worst'>('avg');

  // Pattern Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Selected Pattern for Detail View
  const [selectedPattern, setSelectedPattern] = useState<DSAPatternDetail | null>(DSA_PATTERNS[0]);

  // Selected Interview Question for Answer Modal/Expand
  const [expandedInterviewQ, setExpandedInterviewQ] = useState<string | null>(DSA_INTERVIEW_MASTER_QUESTIONS[0].id);
  const [activeAnswerMode, setActiveAnswerMode] = useState<Record<string, '30s' | '1min' | 'deep'>>({});

  // Cheat Sheet Active Topic
  const [activeCheatSheet, setActiveCheatSheet] = useState<DSACheatSheetDetail>(DSA_MASTER_CHEAT_SHEETS[0]);

  // Rapid Prep State
  const [prepMinutes, setPrepMinutes] = useState<10 | 20 | 30 | 60>(20);
  const [rapidMode, setRapidMode] = useState<'quick' | 'tomorrow' | 'restart'>('quick');

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code template copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`rounded-2xl border shadow-xl flex flex-col gap-6 p-4 sm:p-6 transition-colors ${
      isDark ? 'bg-[#0d1117] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Knowledge Hub Hero Header */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border-purple-800/30' 
          : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-purple-200'
      }`}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Master Knowledge Hub
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              10 Verified Master Sources
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            🧠 DSA Placement Knowledge Hub & Master Resources
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-3xl">
            Unified single study center consolidating <strong>Code & Debug</strong>, <strong>Zero To Mastery</strong>, <strong>Striver A2Z</strong>, <strong>Love Babbar 450</strong>, <strong>NeetCode</strong>, <strong>GFG</strong>, and <strong>Apna College</strong> with verified links, Big-O tables, interview pitch guides, and pattern diagnostics.
          </p>
        </div>

        {/* Global Hub Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search topic, pattern, complexity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition-all ${
              isDark 
                ? 'bg-stone-900 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-purple-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600'
            }`}
          />
        </div>
      </div>

      {/* Primary Sub-Navigation Bar inside Resources */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-800/40">
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'sources'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Master Sources & Sheets</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">10</span>
        </button>

        <button
          onClick={() => setActiveTab('complexity')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'complexity'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Big-O Complexity Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'patterns'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Pattern Recognition Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'interview'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Interview Answers & Pitch</span>
        </button>

        <button
          onClick={() => setActiveTab('cheatsheets')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'cheatsheets'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>20-Point Master Cheat Sheets</span>
        </button>

        <button
          onClick={() => setActiveTab('rapid_prep')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'rapid_prep'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span>Rapid Prep Modes</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MASTER SOURCES & SHEETS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'sources' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified External Source Mappings & Direct Sheets
            </h3>
            <span className="text-xs opacity-75">
              100% genuine attribution • No broken links
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DSA_SOURCES
              .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(source => (
                <div 
                  key={source.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all hover:scale-[1.01] ${
                    isDark ? 'bg-stone-900/70 border-stone-800 hover:border-purple-600/50' : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        source.category === 'Roadmap' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        source.category === 'Cheat Sheet' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        source.category === 'Video' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {source.category}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {source.coveragePercent}% Mapped
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base">{source.name}</h4>
                    <p className="text-xs opacity-75 leading-relaxed">{source.description}</p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {source.highlights.map((h, i) => (
                        <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isDark ? 'bg-stone-800 text-stone-300' : 'bg-white text-slate-700 border border-slate-200'
                        }`}>
                          • {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-800/40">
                    <span className="text-[11px] opacity-70 font-mono">
                      📅 {source.mappedDays}
                    </span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Sheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
          </div>

          {/* Quick Jump to Days 101–130 */}
          {onSelectDay && (
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm">Study Directly in Daily Lessons (Days 101–130)</h4>
                  <p className="text-xs opacity-75">All external topics are mapped day-by-day with interactive code editors, dry-runs, and quizzes.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectDay(101)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
                >
                  Start Day 101 (Foundations)
                </button>
                <button
                  onClick={() => onSelectDay(104)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
                >
                  Jump to Day 104 (Binary Search)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BIG-O COMPLEXITY MATRIX                                            */}
      {/* ========================================================================= */}
      {activeTab === 'complexity' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Interactive Data Structure Complexity Matrix
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                Compare Time (Access, Search, Insert, Delete) and Space complexities across standard interview structures.
              </p>
            </div>

            {/* Case Switcher */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${
              isDark ? 'bg-stone-900 border-stone-800' : 'bg-slate-100 border-slate-300'
            }`}>
              <button
                onClick={() => setSelectedComplexityCase('avg')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedComplexityCase === 'avg'
                    ? 'bg-purple-600 text-white'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Average Case
              </button>
              <button
                onClick={() => setSelectedComplexityCase('worst')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedComplexityCase === 'worst'
                    ? 'bg-rose-600 text-white'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Worst Case
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-800/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={isDark ? 'bg-stone-900/90 text-stone-300' : 'bg-slate-100 text-slate-800'}>
                  <th className="p-3 font-bold border-b border-stone-800">Data Structure</th>
                  <th className="p-3 font-bold border-b border-stone-800">Access</th>
                  <th className="p-3 font-bold border-b border-stone-800">Search</th>
                  <th className="p-3 font-bold border-b border-stone-800">Insert</th>
                  <th className="p-3 font-bold border-b border-stone-800">Delete</th>
                  <th className="p-3 font-bold border-b border-stone-800">Space</th>
                  <th className="p-3 font-bold border-b border-stone-800">Real-World Placement Application</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/40 font-mono">
                {DSA_COMPLEXITY_TABLE
                  .filter(c => c.structure.toLowerCase().includes(searchQuery.toLowerCase()) || c.notes.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, idx) => {
                    const access = selectedComplexityCase === 'avg' ? item.avgAccess : item.worstAccess;
                    const search = selectedComplexityCase === 'avg' ? item.avgSearch : item.worstSearch;
                    const insert = selectedComplexityCase === 'avg' ? item.avgInsert : item.worstInsert;
                    const del = selectedComplexityCase === 'avg' ? item.avgDelete : item.worstDelete;

                    const getBadge = (val: string) => {
                      if (val.includes('O(1)')) return 'text-emerald-400 font-bold';
                      if (val.includes('O(log n)')) return 'text-sky-400 font-bold';
                      if (val.includes('O(n)')) return 'text-amber-400';
                      if (val.includes('O(n²)') || val.includes('O(V²)')) return 'text-rose-400 font-bold';
                      return 'opacity-80';
                    };

                    return (
                      <tr 
                        key={idx}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-stone-900/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 font-sans font-semibold text-stone-100 whitespace-nowrap">
                          {item.structure}
                        </td>
                        <td className={`p-3 ${getBadge(access)}`}>{access}</td>
                        <td className={`p-3 ${getBadge(search)}`}>{search}</td>
                        <td className={`p-3 ${getBadge(insert)}`}>{insert}</td>
                        <td className={`p-3 ${getBadge(del)}`}>{del}</td>
                        <td className="p-3 text-purple-400 font-bold">{item.spaceComplexity}</td>
                        <td className="p-3 font-sans text-[11px] opacity-80 leading-relaxed min-w-[220px]">
                          {item.realWorldUse}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PATTERN RECOGNITION ENGINE                                         */}
      {/* ========================================================================= */}
      {activeTab === 'patterns' && (
        <div className="flex flex-col gap-6">
          {/* Interactive Pattern Quiz Box */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border-indigo-800/30' 
              : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-indigo-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Pattern Diagnostic Challenge
              </span>
              <span className="text-xs opacity-75 font-mono">
                Problem {quizIdx + 1} of {PATTERN_QUIZ_QUESTIONS.length}
              </span>
            </div>

            <h4 className="font-bold text-sm sm:text-base leading-snug">
              &quot;{PATTERN_QUIZ_QUESTIONS[quizIdx].problem}&quot;
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {PATTERN_QUIZ_QUESTIONS[quizIdx].options.map((opt) => (
                <button
                  key={opt}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    setSelectedOption(opt);
                    setIsAnswerSubmitted(true);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                    selectedOption === opt
                      ? opt === PATTERN_QUIZ_QUESTIONS[quizIdx].correct
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-rose-600 text-white border-rose-500'
                      : isDark ? 'bg-stone-900 border-stone-700 hover:border-indigo-500' : 'bg-white border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {isAnswerSubmitted && (
              <div className={`p-3 rounded-xl border text-xs leading-relaxed mt-2 ${
                selectedOption === PATTERN_QUIZ_QUESTIONS[quizIdx].correct
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}>
                <strong>
                  {selectedOption === PATTERN_QUIZ_QUESTIONS[quizIdx].correct ? '✓ Exactly Right!' : `✕ Correct Pattern: ${PATTERN_QUIZ_QUESTIONS[quizIdx].correct}`}
                </strong>
                <p className="mt-1 opacity-90">{PATTERN_QUIZ_QUESTIONS[quizIdx].explanation}</p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setQuizIdx((prev) => (prev + 1) % PATTERN_QUIZ_QUESTIONS.length);
                      setSelectedOption(null);
                      setIsAnswerSubmitted(false);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                  >
                    Next Problem ➔
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pattern Deep Dive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Pattern List Column */}
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400">
                Core Algorithmic Patterns (Code & Debug + NeetCode)
              </h4>
              {DSA_PATTERNS.map((pat) => (
                <button
                  key={pat.id}
                  onClick={() => setSelectedPattern(pat)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    selectedPattern?.id === pat.id
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : isDark ? 'bg-stone-900/60 border-stone-800 hover:border-purple-600/40 text-stone-200' : 'bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{pat.name}</span>
                    <span className="text-[10px] font-mono opacity-80">{pat.timeComplexity}</span>
                  </div>
                  <p className="text-[11px] opacity-80 line-clamp-1">{pat.oneLiner}</p>
                </button>
              ))}
            </div>

            {/* Pattern Deep Detail Card */}
            {selectedPattern && (
              <div className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col gap-4 ${
                isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                      {selectedPattern.category}
                    </span>
                    <h3 className="text-lg font-black">{selectedPattern.name}</h3>
                    <p className="text-xs opacity-80 mt-0.5">{selectedPattern.oneLiner}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400">Time: {selectedPattern.timeComplexity}</div>
                    <div className="text-xs font-mono opacity-70">Space: {selectedPattern.spaceComplexity}</div>
                  </div>
                </div>

                {/* Keywords & Recognition Clues */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-stone-950/60 border-stone-800' : 'bg-white border-slate-200'
                  }`}>
                    <h5 className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                      🔑 Question Keywords
                    </h5>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedPattern.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-stone-950/60 border-stone-800' : 'bg-white border-slate-200'
                  }`}>
                    <h5 className="font-bold text-xs text-sky-400 flex items-center gap-1.5">
                      🎯 Interview Clues
                    </h5>
                    <ul className="text-[11px] opacity-80 space-y-1 mt-2">
                      {selectedPattern.clues.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Brute Force vs Optimization Signals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-rose-950/20 border-rose-900/30 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <strong>❌ Brute Force Signal:</strong>
                    <p className="mt-1 text-[11px] opacity-90">{selectedPattern.bruteForceSignal}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <strong>⚡ Optimization Signal:</strong>
                    <p className="mt-1 text-[11px] opacity-90">{selectedPattern.optimizationSignal}</p>
                  </div>
                </div>

                {/* Python Template Code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-300">🐍 Master Code Template (Python)</span>
                    <button
                      onClick={() => handleCopyCode(selectedPattern.codeTemplatePython)}
                      className="px-2 py-1 rounded text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy Template
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 border border-stone-800 text-[11px] font-mono text-purple-300 overflow-x-auto">
                    {selectedPattern.codeTemplatePython}
                  </pre>
                </div>

                {/* Classic Interview Problems */}
                <div>
                  <h5 className="font-bold text-xs mb-2">🏆 Standard Placement Problems for this Pattern</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPattern.classicProblems.map((prob, i) => (
                      <div 
                        key={i}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                          isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            prob.difficulty === 'Easy' ? 'bg-emerald-400' : prob.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                          }`} />
                          <span className="font-medium line-clamp-1">{prob.title}</span>
                        </div>
                        {prob.url && (
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 p-1 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INTERVIEW ANSWERS & ELEVATOR PITCH                                 */}
      {/* ========================================================================= */}
      {activeTab === 'interview' && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              &quot;What Should I Say In An Interview?&quot; — Model Responses
            </h3>
            <p className="text-xs opacity-75 mt-0.5">
              Practice answering like a FAANG engineer with 30-second elevator pitches, 1-minute deep explanations, and interviewer expectations.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {DSA_INTERVIEW_MASTER_QUESTIONS.map((item) => {
              const isExpanded = expandedInterviewQ === item.id;
              const mode = activeAnswerMode[item.id] || '30s';

              return (
                <div 
                  key={item.id}
                  className={`rounded-2xl border transition-all ${
                    isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* Header / Question row */}
                  <div 
                    onClick={() => setExpandedInterviewQ(isExpanded ? null : item.id)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:opacity-95"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {item.topic}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-500/15' : 'text-amber-400 bg-amber-500/15'
                        }`}>
                          {item.difficulty}
                        </span>
                        <span className="text-[11px] opacity-60 font-mono">Source: {item.source}</span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base mt-0.5">{item.question}</h4>
                    </div>
                    <button className="p-1 rounded-lg text-stone-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-4 pb-4 flex flex-col gap-4 border-t border-stone-800/40 pt-4">
                      {/* Answer Duration Switcher */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-400">🗣 Answer Delivery Mode:</span>
                        <button
                          onClick={() => setActiveAnswerMode(prev => ({ ...prev, [item.id]: '30s' }))}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            mode === '30s' ? 'bg-amber-500 text-stone-950 font-bold' : isDark ? 'bg-stone-800 text-stone-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          ⚡ 30-Second Pitch
                        </button>
                        <button
                          onClick={() => setActiveAnswerMode(prev => ({ ...prev, [item.id]: '1min' }))}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            mode === '1min' ? 'bg-purple-600 text-white font-bold' : isDark ? 'bg-stone-800 text-stone-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          ⏱ 1-Minute Comprehensive
                        </button>
                        <button
                          onClick={() => setActiveAnswerMode(prev => ({ ...prev, [item.id]: 'deep' }))}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            mode === 'deep' ? 'bg-indigo-600 text-white font-bold' : isDark ? 'bg-stone-800 text-stone-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          🔬 Deep Systems Dive
                        </button>
                      </div>

                      {/* Displayed Pitch Text */}
                      <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                        mode === '30s' 
                          ? isDark ? 'bg-amber-950/20 border-amber-800/30 text-amber-100' : 'bg-amber-50 border-amber-200 text-amber-950'
                          : mode === '1min'
                          ? isDark ? 'bg-purple-950/20 border-purple-800/30 text-purple-100' : 'bg-purple-50 border-purple-200 text-purple-950'
                          : isDark ? 'bg-indigo-950/20 border-indigo-800/30 text-indigo-100' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                      }`}>
                        <strong>
                          {mode === '30s' ? '⚡ Say this in 30 seconds:' : mode === '1min' ? '⏱ Deliver this 1-minute structured answer:' : '🔬 Deep technical explanation for senior interviewers:'}
                        </strong>
                        <p className="mt-2 text-xs sm:text-sm opacity-95">
                          {mode === '30s' ? item.thirtySecAnswer : mode === '1min' ? item.oneMinAnswer : item.deepTechnicalAnswer}
                        </p>
                      </div>

                      {/* Concrete Example */}
                      <div className={`p-3 rounded-xl border text-xs ${
                        isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
                      }`}>
                        <strong>💡 Concrete Example to Mention:</strong>
                        <p className="font-mono text-[11px] opacity-80 mt-1">{item.example}</p>
                      </div>

                      {/* Expectations & Follow-ups */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className={`p-3 rounded-xl border ${
                          isDark ? 'bg-stone-950/30 border-stone-800' : 'bg-white border-slate-200'
                        }`}>
                          <strong className="text-emerald-400">🎯 What Interviewers Look For:</strong>
                          <p className="mt-1 text-[11px] opacity-80">{item.interviewerExpectation}</p>
                        </div>
                        <div className={`p-3 rounded-xl border ${
                          isDark ? 'bg-stone-950/30 border-stone-800' : 'bg-white border-slate-200'
                        }`}>
                          <strong className="text-rose-400">⚠️ Common Mistakes to Avoid:</strong>
                          <ul className="mt-1 text-[11px] opacity-80 space-y-0.5">
                            {item.commonMistakes.map((m, i) => (
                              <li key={i}>• {m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 20-POINT MASTER CHEAT SHEETS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'cheatsheets' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Comprehensive 20-Point DSA Cheat Sheets
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                Structured reference covering Definitions, Analogies, Complexities, Multilingual Syntax, and 60-Second Revisions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sheet</span>
              </button>
            </div>
          </div>

          {/* Topic Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {DSA_MASTER_CHEAT_SHEETS.map(sheet => (
              <button
                key={sheet.id}
                onClick={() => setActiveCheatSheet(sheet)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  activeCheatSheet.id === sheet.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isDark ? 'bg-stone-900 border border-stone-800 text-stone-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {sheet.topic}
              </button>
            ))}
          </div>

          {/* Active 20-Point Sheet Display */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-6 ${
            isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Header info */}
            <div className="flex flex-col gap-1 pb-4 border-b border-stone-800/40">
              <h3 className="text-xl font-black">{activeCheatSheet.topic}</h3>
              <p className="text-xs sm:text-sm text-emerald-400 font-semibold">{activeCheatSheet.oneLineDefinition}</p>
              <p className="text-xs opacity-80 mt-1 leading-relaxed">{activeCheatSheet.whatIsIt}</p>
            </div>

            {/* Analogy & Recognition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <h5 className="font-bold text-xs text-amber-400">🌎 Real-Life Intuitive Analogy</h5>
                <p className="text-xs opacity-90 mt-1.5 leading-relaxed">{activeCheatSheet.analogy}</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <h5 className="font-bold text-xs text-sky-400">🔍 How to Recognize in Interviews</h5>
                <p className="text-xs opacity-90 mt-1.5 leading-relaxed">{activeCheatSheet.interviewRecognition}</p>
              </div>
            </div>

            {/* Core Operations & Complexities */}
            <div>
              <h5 className="font-bold text-xs mb-2">⚡ Core Operations & Complexities</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCheatSheet.coreOperations.map((op, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-stone-950/30 border-stone-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{op.op}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{op.desc}</div>
                    </div>
                    <span className="font-mono font-bold text-purple-400 text-xs shrink-0">{op.complexity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multilingual Syntax (Python, C++, Java) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="text-[11px] font-bold text-stone-400 mb-1">🐍 Python Syntax</div>
                <pre className="p-3 rounded-xl bg-black/60 border border-stone-800 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                  {activeCheatSheet.pythonSyntax}
                </pre>
              </div>
              <div>
                <div className="text-[11px] font-bold text-stone-400 mb-1">⚙️ C++ Syntax</div>
                <pre className="p-3 rounded-xl bg-black/60 border border-stone-800 text-[10px] font-mono text-sky-300 overflow-x-auto">
                  {activeCheatSheet.cppSyntax}
                </pre>
              </div>
              <div>
                <div className="text-[11px] font-bold text-stone-400 mb-1">☕ Java Syntax</div>
                <pre className="p-3 rounded-xl bg-black/60 border border-stone-800 text-[10px] font-mono text-amber-300 overflow-x-auto">
                  {activeCheatSheet.javaSyntax}
                </pre>
              </div>
            </div>

            {/* 60-Second Revision Summary */}
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-100' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              <h5 className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                ⚡ 60-Second Placement Revision
              </h5>
              <p className="text-xs mt-1.5 leading-relaxed opacity-95">
                {activeCheatSheet.sixtySecRevision}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: RAPID PREPARATION MODES                                            */}
      {/* ========================================================================= */}
      {activeTab === 'rapid_prep' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Adaptive Rapid Placement Preparation
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                Tailored drills designed for high impact when time is limited.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRapidMode('quick')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  rapidMode === 'quick' ? 'bg-amber-600 text-white' : isDark ? 'bg-stone-900 text-stone-300' : 'bg-slate-200'
                }`}
              >
                ⏱ Quick Drill
              </button>
              <button
                onClick={() => setRapidMode('tomorrow')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  rapidMode === 'tomorrow' ? 'bg-rose-600 text-white' : isDark ? 'bg-stone-900 text-stone-300' : 'bg-slate-200'
                }`}
              >
                🚨 Interview Tomorrow
              </button>
              <button
                onClick={() => setRapidMode('restart')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  rapidMode === 'restart' ? 'bg-purple-600 text-white' : isDark ? 'bg-stone-900 text-stone-300' : 'bg-slate-200'
                }`}
              >
                🧠 I Forgot Everything
              </button>
            </div>
          </div>

          {rapidMode === 'quick' && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
              isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm">⏱ &quot;I Have Only {prepMinutes} Minutes&quot; Sprint Plan</h4>
                <div className="flex items-center gap-1">
                  {[10, 20, 30, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setPrepMinutes(mins as 10 | 20 | 30 | 60)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        prepMinutes === mins ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
                }`}>
                  <strong className="text-purple-400">1. Core Review ({Math.floor(prepMinutes * 0.3)} min)</strong>
                  <p className="mt-1 text-[11px] opacity-80">Review 1 Cheat Sheet (Arrays or Trees) + Big-O average vs worst case lookups.</p>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
                }`}>
                  <strong className="text-amber-400">2. Pattern Drill ({Math.floor(prepMinutes * 0.5)} min)</strong>
                  <p className="mt-1 text-[11px] opacity-80">Solve 2 Pattern Diagnostic questions (Sliding Window & Monotonic Stack).</p>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
                }`}>
                  <strong className="text-emerald-400">3. Pitch Practice ({Math.floor(prepMinutes * 0.2)} min)</strong>
                  <p className="mt-1 text-[11px] opacity-80">Deliver one 30-second explanation aloud (&quot;How does a HashMap work?&quot;).</p>
                </div>
              </div>
            </div>
          )}

          {rapidMode === 'tomorrow' && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
              isDark ? 'bg-rose-950/15 border-rose-900/30' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h4 className="font-bold text-sm text-rose-300">🚨 High-Yield &quot;Interview Tomorrow&quot; Checklist</h4>
              </div>
              <ul className="text-xs space-y-2 opacity-90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Big-O Traps:</strong> Remember Python `list.pop(0)` is O(n), use `collections.deque.popleft()` for O(1) Queue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sorting Stability:</strong> Quicksort is NOT stable by default, Mergesort IS stable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Graph Traversal:</strong> Unweighted shortest path = BFS. Weighted non-negative = Dijkstra. Negative cycles = Bellman-Ford.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Communication:</strong> Always state brute force time complexity first before jumping to optimal data structures.</span>
                </li>
              </ul>
            </div>
          )}

          {rapidMode === 'restart' && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
              isDark ? 'bg-purple-950/15 border-purple-900/30' : 'bg-purple-50 border-purple-200'
            }`}>
              <h4 className="font-bold text-sm text-purple-300">🧠 Systematic 5-Step Fundamentals Rebuilder</h4>
              <p className="text-xs opacity-80">If feeling overwhelmed, step back and rebuild confidence following this linear sequence:</p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-semibold">
                <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-center">
                  1. Big-O Basics
                </div>
                <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-center">
                  2. Arrays & Pointers
                </div>
                <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-center">
                  3. HashMaps & Sets
                </div>
                <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-center">
                  4. Stacks & Trees
                </div>
                <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-center">
                  5. DP & Graphs
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
