import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Filter, 
  Clock, 
  Building2, 
  Square, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  BrainCircuit,
  MessageSquareCode,
  Award,
  Terminal
} from 'lucide-react';
import { DSA_QUESTION_BANK, type DSAQuestion } from '../../../data/academics/dsaQuestionBank';
import { api } from '../../../services/api';

const ITEMS_PER_PAGE = 20;

export const DSAQuestionBankView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'unsolved' | 'solved' | 'bookmarked' | 'mistakes'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'python' | 'cpp' | 'java'>('python');
  const [revealedHintSteps, setRevealedHintSteps] = useState<Record<string, number>>({});
  const [stuckModeId, setStuckModeId] = useState<string | null>(null);
  const [stuckStep, setStuckStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Solved, Bookmarked, and Mistakes persisted locally
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('akku_dsa_solved_questions');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('akku_dsa_bookmarks');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const [mistakeIds, setMistakeIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('akku_dsa_mistakes');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  // Code runner state for expanded question
  const [userCode, setUserCode] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<any>(null);

  const handleToggleSolved = (id: string) => {
    setSolvedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('akku_dsa_solved_questions', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('akku_dsa_bookmarks', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunUserCode = async (q: DSAQuestion) => {
    setIsRunningCode(true);
    setRunResult(null);
    try {
      const res = await api.academics.runCode(
        userCode || q.pythonSolution,
        "",
        undefined,
        5.0
      );
      setRunResult(res);
      if (res.exit_code !== 0 && !mistakeIds.includes(q.id)) {
        // Track as mistake for "My Mistakes" notebook
        const updated = [...mistakeIds, q.id];
        setMistakeIds(updated);
        try { localStorage.setItem('akku_dsa_mistakes', JSON.stringify(updated)); } catch {}
      }
    } catch (err: any) {
      setRunResult({ error: err.message || 'Execution failed' });
    } finally {
      setIsRunningCode(false);
    }
  };

  // Extract unique filter dropdown values
  const topics = useMemo(() => {
    const s = new Set<string>();
    DSA_QUESTION_BANK.forEach(q => { if (q.topic) s.add(q.topic); });
    return Array.from(s).sort();
  }, []);

  const platforms = useMemo(() => {
    const s = new Set<string>();
    DSA_QUESTION_BANK.forEach(q => { if (q.platform) s.add(q.platform); });
    return Array.from(s).sort();
  }, []);

  const companies = useMemo(() => {
    const s = new Set<string>();
    DSA_QUESTION_BANK.forEach(q => { if (q.company) s.add(q.company); });
    return Array.from(s).sort();
  }, []);

  // Filtered Questions List
  const filteredQuestions = useMemo(() => {
    return DSA_QUESTION_BANK.filter(q => {
      // Tab filter
      if (filterType === 'solved' && !solvedIds.includes(q.id)) return false;
      if (filterType === 'unsolved' && solvedIds.includes(q.id)) return false;
      if (filterType === 'bookmarked' && !bookmarkedIds.includes(q.id)) return false;
      if (filterType === 'mistakes' && !mistakeIds.includes(q.id)) return false;

      // Dropdown filters
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      if (selectedPlatform !== 'All' && q.platform !== selectedPlatform) return false;
      if (selectedCompany !== 'All' && q.company !== selectedCompany) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const mTitle = q.title.toLowerCase().includes(query);
        const mDesc = q.description.toLowerCase().includes(query);
        const mTopic = q.topic.toLowerCase().includes(query);
        const mPattern = q.pattern?.toLowerCase().includes(query);
        const mCompany = q.company?.toLowerCase().includes(query);
        const mTags = q.tags?.some(t => t.toLowerCase().includes(query));

        if (!mTitle && !mDesc && !mTopic && !mPattern && !mCompany && !mTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedTopic, selectedDifficulty, selectedPlatform, selectedCompany, filterType, solvedIds, bookmarkedIds, mistakeIds]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopic, selectedDifficulty, selectedPlatform, selectedCompany, filterType]);

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, currentPage]);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Medium': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Hard': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-stone-500/20 text-stone-300 border-stone-500/30';
    }
  };

  const getPlatformBadge = (plat: string) => {
    switch (plat) {
      case 'LeetCode': return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'GeeksforGeeks': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'HackerRank': return 'text-green-400 bg-green-950/40 border-green-800/40';
      case 'Codeforces': return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
      case 'InterviewBit': return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      default: return 'text-purple-400 bg-purple-950/40 border-purple-800/40';
    }
  };

  return (
    <div className="flex flex-col gap-4 text-stone-200 font-sans">
      {/* 1. TOP STATS BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d141e] via-[#121929] to-[#0d141e] border border-sky-800/40 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  3,000+ Placement DSA Coding Question Bank
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  LeetCode & GFG Mapped
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Practice 100+ unique questions per major topic with multi-language code (Python, C++, Java), 4 progressive hints, and "I'm Stuck" interactive assistance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#161d2b] border border-stone-800 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-stone-400">Solved:</span>
              <span className="font-bold text-emerald-400 font-mono">{solvedIds.length}</span>
              <span className="text-stone-500">/ {DSA_QUESTION_BANK.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-stone-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400">Total Problems</span>
            <span className="font-bold text-sky-300 font-mono text-sm">{DSA_QUESTION_BANK.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400">Major Topics</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{topics.length} (100+/topic)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400">My Bookmarks</span>
            <span className="font-bold text-amber-400 font-mono text-sm">{bookmarkedIds.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400">Mistakes Notebook</span>
            <span className="font-bold text-rose-400 font-mono text-sm">{mistakeIds.length}</span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH AND FILTER CONTROLS */}
      <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-3">
        {/* Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-800 pb-2.5 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            All Questions ({DSA_QUESTION_BANK.length})
          </button>
          <button
            onClick={() => setFilterType('unsolved')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === 'unsolved'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            Unsolved ({DSA_QUESTION_BANK.length - solvedIds.length})
          </button>
          <button
            onClick={() => setFilterType('solved')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'solved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Solved ({solvedIds.length})</span>
          </button>
          <button
            onClick={() => setFilterType('bookmarked')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'bookmarked'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarks ({bookmarkedIds.length})</span>
          </button>
          <button
            onClick={() => setFilterType('mistakes')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'mistakes'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Mistakes Notebook ({mistakeIds.length})</span>
          </button>
        </div>

        {/* Inputs & Dropdowns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          <div className="md:col-span-3 relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 3,000+ DSA questions, two-pointer, Google..."
              className="w-full pl-9 pr-3 py-2 bg-[#161b22] border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">All Topics ({topics.length})</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">All Platforms ({platforms.length})</option>
              {platforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">All Companies ({companies.length})</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. PAGINATION & RESULTS STATUS */}
      <div className="flex flex-wrap items-center justify-between px-1 text-xs text-stone-400 gap-2">
        <span>
          Showing {paginatedQuestions.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuestions.length)} of {filteredQuestions.length} questions
        </span>
        <div className="flex items-center gap-2">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-[#161b22] border border-stone-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 text-stone-300 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded bg-[#161b22] border border-stone-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 text-stone-300 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUESTIONS CARDS */}
      <div className="flex flex-col gap-3">
        {paginatedQuestions.length === 0 ? (
          <div className="p-12 text-center text-stone-500 bg-[#0d1117] rounded-2xl border border-stone-800 flex flex-col items-center gap-2">
            <Filter className="w-6 h-6 text-stone-600" />
            <span>No DSA questions matched your current filter criteria.</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All');
                setSelectedDifficulty('All');
                setSelectedPlatform('All');
                setSelectedCompany('All');
                setFilterType('all');
              }}
              className="mt-2 text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isSolved = solvedIds.includes(q.id);
            const isBookmarked = bookmarkedIds.includes(q.id);
            const revealedStep = revealedHintSteps[q.id] || 0;
            const isStuckOpen = stuckModeId === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all shadow-md overflow-hidden ${
                  isSolved 
                    ? 'border-emerald-900/40 bg-[#0c1314]' 
                    : 'border-stone-800 bg-[#0d1117] hover:border-stone-700'
                }`}
              >
                {/* Header card */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleSolved(q.id)}
                      className="mt-0.5 text-stone-500 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                      title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1">
                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold border ${getDifficultyBadge(q.difficulty)}`}>
                          {q.difficulty}
                        </span>

                        <span className={`px-2 py-0.5 rounded font-bold border ${getPlatformBadge(q.platform)}`}>
                          {q.platform}
                        </span>

                        {q.company && (
                          <span className="px-2 py-0.5 rounded bg-sky-950/40 text-sky-300 border border-sky-800/40 font-bold flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5" />
                            <span>{q.company}</span>
                          </span>
                        )}

                        <span className="text-sky-400 font-sans">
                          {q.topic} • {q.subtopic}
                        </span>

                        <span className="text-stone-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {q.expectedTime}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-bold text-sm sm:text-base text-stone-100 font-sans leading-snug">
                        {q.title}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed whitespace-pre-wrap">
                        {q.description}
                      </p>

                      {/* Pattern Tag */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/30 text-purple-300 border border-purple-800/40 font-mono">
                          Pattern: {q.pattern}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#161b22] text-stone-400 border border-stone-800 font-mono">
                          Time: {q.timeComplexity}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#161b22] text-stone-400 border border-stone-800 font-mono">
                          Space: {q.spaceComplexity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isBookmarked ? 'text-amber-400 bg-amber-500/20' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark this question'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedId(null);
                        } else {
                          setExpandedId(q.id);
                          setUserCode(q.pythonSolution);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Code' : 'Solve & Solution'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsed Bar: Progressive Hints & "I'm Stuck" Mode */}
                {!isExpanded && (
                  <div className="px-4 pb-3.5 flex flex-wrap items-center justify-between border-t border-stone-800/40 pt-2 text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRevealedHintSteps(prev => ({
                            ...prev,
                            [q.id]: Math.min(q.hints.length, (prev[q.id] || 0) + 1)
                          }));
                        }}
                        className="flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>💡 Progressive Hint ({revealedStep}/{q.hints.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          setStuckModeId(isStuckOpen ? null : q.id);
                          setStuckStep(1);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300 text-[11px] font-semibold hover:bg-purple-900/40 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <BrainCircuit className="w-3 h-3" />
                        <span>I'M STUCK 🤔</span>
                      </button>
                    </div>

                    <a
                      href={q.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <span>Open on {q.platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Progressive Hints Drawer */}
                {revealedStep > 0 && !isExpanded && (
                  <div className="px-4 pb-3 flex flex-col gap-1.5">
                    {q.hints.slice(0, revealedStep).map((h, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-amber-950/25 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2">
                        <span className="font-bold text-amber-400 shrink-0 font-mono">Hint {i + 1}:</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive "I'M STUCK" Mode Card */}
                {isStuckOpen && !isExpanded && (
                  <div className="p-4 bg-gradient-to-r from-[#171124] to-[#120d1c] border-t border-purple-800/40 flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-purple-300 text-xs">
                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                        <span>Interactive Socratic Guide: Step {stuckStep} of 4</span>
                      </div>
                      <button
                        onClick={() => setStuckModeId(null)}
                        className="text-stone-400 hover:text-stone-200 text-[11px] underline cursor-pointer"
                      >
                        Exit Stuck Mode
                      </button>
                    </div>

                    {stuckStep === 1 && (
                      <div className="space-y-2">
                        <p className="text-stone-200">
                          <strong>Step 1: Problem Decomposition</strong> — Before writing any code, what is the brute-force way to solve this, and why would it time out?
                        </p>
                        <div className="p-2.5 rounded-lg bg-[#0e0917] border border-purple-900/60 font-mono text-[11px] text-purple-200">
                          {q.bruteForce}
                        </div>
                        <button
                          onClick={() => setStuckStep(2)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs cursor-pointer"
                        >
                          I understand the Brute Force, what next? →
                        </button>
                      </div>
                    )}

                    {stuckStep === 2 && (
                      <div className="space-y-2">
                        <p className="text-stone-200">
                          <strong>Step 2: Better Approach & Invariant</strong> — Can we eliminate repeated calculations by sorting, hashing, or keeping pointers?
                        </p>
                        <div className="p-2.5 rounded-lg bg-[#0e0917] border border-purple-900/60 font-mono text-[11px] text-purple-200">
                          {q.betterApproach}
                        </div>
                        <button
                          onClick={() => setStuckStep(3)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs cursor-pointer"
                        >
                          Give me the Optimal Pattern →
                        </button>
                      </div>
                    )}

                    {stuckStep === 3 && (
                      <div className="space-y-2">
                        <p className="text-stone-200">
                          <strong>Step 3: Optimal Placement Pattern</strong> — Here is how senior engineers approach this problem under interview conditions:
                        </p>
                        <div className="p-2.5 rounded-lg bg-[#0e0917] border border-purple-900/60 font-mono text-[11px] text-emerald-300">
                          {q.optimalApproach}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setExpandedId(q.id);
                              setStuckModeId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                          >
                            Open Full Code & Editor →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded Drawer: Multi-Language Code & Execution Lab */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-stone-800 bg-[#121722]/60 flex flex-col gap-3 text-xs">
                    {/* Approaches breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-[#141a24] border border-stone-800">
                        <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Brute Force</span>
                        <p className="text-stone-300 text-[11px] leading-snug">{q.bruteForce}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#141a24] border border-stone-800">
                        <span className="text-[10px] font-bold text-sky-400 uppercase block mb-1">Better Approach</span>
                        <p className="text-stone-300 text-[11px] leading-snug">{q.betterApproach}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#141a24] border border-emerald-900/50">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Optimal Solution</span>
                        <p className="text-stone-300 text-[11px] leading-snug">{q.optimalApproach}</p>
                      </div>
                    </div>

                    {/* Language Switcher Bar */}
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedLang('python')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                            selectedLang === 'python'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-[#161c28] text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          Python 3
                        </button>
                        <button
                          onClick={() => setSelectedLang('cpp')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                            selectedLang === 'cpp'
                              ? 'bg-sky-600 text-white shadow-sm'
                              : 'bg-[#161c28] text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          C++ (STL)
                        </button>
                        <button
                          onClick={() => setSelectedLang('java')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                            selectedLang === 'java'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-[#161c28] text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          Java
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const codeToCopy = selectedLang === 'python' 
                              ? q.pythonSolution 
                              : selectedLang === 'cpp' 
                              ? q.cppSolution 
                              : q.javaSolution;
                            handleCopy(q.id, codeToCopy);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#161c28] text-stone-300 hover:text-white border border-stone-800 text-xs transition-colors cursor-pointer"
                        >
                          {copiedId === q.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Solution</span>
                            </>
                          )}
                        </button>

                        {selectedLang === 'python' && (
                          <button
                            onClick={() => handleRunUserCode(q)}
                            disabled={isRunningCode}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{isRunningCode ? 'Executing...' : 'Run Python'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Code Display / Editor */}
                    <div className="rounded-xl border border-stone-800 overflow-hidden bg-[#07090e]">
                      <pre className="p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                        {selectedLang === 'python' 
                          ? q.pythonSolution 
                          : selectedLang === 'cpp' 
                          ? q.cppSolution 
                          : q.javaSolution}
                      </pre>
                    </div>

                    {/* Run output panel */}
                    {runResult && (
                      <div className="p-3 rounded-xl bg-[#090d14] border border-stone-800 font-mono text-xs flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-stone-400 border-b border-stone-800/80 pb-1 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Terminal className="w-3 h-3 text-emerald-400" /> Execution Console
                          </span>
                          <span className="text-emerald-400 font-bold">{runResult.execution_time_ms} ms</span>
                        </div>
                        {runResult.stdout && (
                          <div className="text-stone-200 whitespace-pre">{runResult.stdout}</div>
                        )}
                        {runResult.error && (
                          <div className="text-rose-400 whitespace-pre">{runResult.error}</div>
                        )}
                      </div>
                    )}

                    {/* Follow-up interview questions */}
                    {q.interviewQuestions && q.interviewQuestions.length > 0 && (
                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs">
                        <span className="font-semibold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                          <MessageSquareCode className="w-3.5 h-3.5 text-purple-400" />
                          <span>Senior Interviewer Follow-Up Questions:</span>
                        </span>
                        <ul className="space-y-1 text-stone-300 list-disc list-inside">
                          {q.interviewQuestions.map((iq, i) => (
                            <li key={i}>{iq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. BOTTOM PAGINATION */}
      {totalPages > 1 && (
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-stone-400">
            Page <span className="font-bold text-stone-200 font-mono">{currentPage}</span> of <span className="font-bold text-stone-200 font-mono">{totalPages}</span> ({filteredQuestions.length} total questions)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 text-stone-300 cursor-pointer"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 text-stone-300 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 text-stone-300 cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 text-stone-300 cursor-pointer"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
