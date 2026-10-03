import React, { useState, useMemo, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Building2,
  Code2,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Filter,
  Award
} from 'lucide-react';
import { FAANG_INTERVIEW_QUESTIONS } from '../../data/academics/interviewQuestionsBank';

interface InterviewBankProps {
  onSaveToNotes?: (question: any) => void;
  savedBookmarkIds?: string[];
  onToggleBookmark?: (questionId: string) => void;
}

const ITEMS_PER_PAGE = 20;

export const InterviewBank: React.FC<InterviewBankProps> = ({
  onSaveToNotes,
  savedBookmarkIds = [],
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'coding' | 'mcq' | 'bookmarked' | 'solved'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revealedHintIds, setRevealedHintIds] = useState<Record<string, boolean>>({});
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Solved state persisted locally
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('akku_solved_interview_questions');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const handleToggleSolved = (id: string) => {
    setSolvedIds(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('akku_solved_interview_questions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleHint = (id: string) => {
    setRevealedHintIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedMcqAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Distinct Filter Values
  const companies = useMemo(() => {
    const set = new Set<string>();
    FAANG_INTERVIEW_QUESTIONS.forEach(q => { if (q.company) set.add(q.company); });
    return Array.from(set).sort();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    FAANG_INTERVIEW_QUESTIONS.forEach(q => { if (q.category) set.add(q.category); });
    return Array.from(set).sort();
  }, []);

  // Filtered List
  const filteredQuestions = useMemo(() => {
    return FAANG_INTERVIEW_QUESTIONS.filter(q => {
      // Type Tab
      if (selectedType === 'coding' && q.type !== 'coding') return false;
      if (selectedType === 'mcq' && q.type !== 'mcq') return false;
      if (selectedType === 'bookmarked' && !savedBookmarkIds.includes(q.id)) return false;
      if (selectedType === 'solved' && !solvedIds.includes(q.id)) return false;

      // Dropdown filters
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      if (selectedCompany !== 'All' && q.company !== selectedCompany) return false;
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchQuestion = q.question.toLowerCase().includes(query);
        const matchSolution = q.solution.toLowerCase().includes(query);
        const matchCompany = q.company.toLowerCase().includes(query);
        const matchCategory = q.category.toLowerCase().includes(query);
        const matchTopic = q.topic.toLowerCase().includes(query);
        const matchTags = q.tags.some(t => t.toLowerCase().includes(query));

        if (!matchTitle && !matchQuestion && !matchSolution && !matchCompany && !matchCategory && !matchTopic && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedType, selectedDifficulty, selectedCompany, selectedCategory, savedBookmarkIds, solvedIds]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedDifficulty, selectedCompany, selectedCategory]);

  // Total pages
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, currentPage]);

  const codingCount = useMemo(() => FAANG_INTERVIEW_QUESTIONS.filter(q => q.type === 'coding').length, []);
  const mcqCount = useMemo(() => FAANG_INTERVIEW_QUESTIONS.filter(q => q.type === 'mcq').length, []);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Moderate':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Hard':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-stone-500/20 text-stone-300 border-stone-500/30';
    }
  };

  const getCompanyColor = (company: string) => {
    switch (company) {
      case 'Google': return 'text-red-400 bg-red-950/40 border-red-800/40';
      case 'Amazon': return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'Meta': return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
      case 'Netflix': return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      case 'Microsoft': return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      case 'Apple': return 'text-stone-300 bg-stone-800 border-stone-700';
      case 'Snowflake': return 'text-sky-300 bg-sky-950/40 border-sky-800/40';
      case 'Databricks': return 'text-orange-400 bg-orange-950/40 border-orange-800/40';
      case 'Uber': return 'text-emerald-300 bg-emerald-950/40 border-emerald-800/40';
      default: return 'text-indigo-300 bg-indigo-950/40 border-indigo-800/40';
    }
  };

  return (
    <div className="flex flex-col gap-4 text-stone-200">
      {/* 1. TOP STATS HERO BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d131f] via-[#121929] to-[#0d131f] border border-sky-900/40 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  1,000+ FAANG & Top MNC Placement Question Bank
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  FAANG Curated
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Every problem includes progressive hints, line-by-line model solutions, time/space complexity analysis, and common interviewer traps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#161d2b] border border-stone-800 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-stone-400">Solved:</span>
              <span className="font-bold text-emerald-400 font-mono">{solvedIds.length}</span>
              <span className="text-stone-500">/ {FAANG_INTERVIEW_QUESTIONS.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-stone-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400">Total Questions</span>
            <span className="font-bold text-sky-300 font-mono text-sm">{FAANG_INTERVIEW_QUESTIONS.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Coding Queries
            </span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{codingCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-purple-400" /> Technical MCQs
            </span>
            <span className="font-bold text-purple-400 font-mono text-sm">{mcqCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141a24]/80 border border-stone-800/80 flex items-center justify-between">
            <span className="text-stone-400 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" /> Bookmarks
            </span>
            <span className="font-bold text-amber-400 font-mono text-sm">{savedBookmarkIds.length}</span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH AND MULTI-FILTER BAR */}
      <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-3">
        {/* Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-800 pb-2.5">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            All Questions ({FAANG_INTERVIEW_QUESTIONS.length})
          </button>
          <button
            onClick={() => setSelectedType('coding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'coding'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Coding Problems ({codingCount})</span>
          </button>
          <button
            onClick={() => setSelectedType('mcq')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'mcq'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>MCQs & Quizzes ({mcqCount})</span>
          </button>
          <button
            onClick={() => setSelectedType('bookmarked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'bookmarked'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedBookmarkIds.length})</span>
          </button>
          <button
            onClick={() => setSelectedType('solved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'solved'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#161b22]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Solved ({solvedIds.length})</span>
          </button>
        </div>

        {/* Inputs & Dropdowns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          {/* Search bar (5 cols) */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1,000+ problems, SQL, Spark, Kafka, Google..."
              className="w-full pl-9 pr-3 py-2 bg-[#161b22] border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Company filter */}
          <div className="md:col-span-3">
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

          {/* Category filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer truncate"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. RESULTS STATUS & PAGINATION SUMMARY */}
      <div className="flex flex-wrap items-center justify-between px-1 text-xs text-stone-400 gap-2">
        <span>
          Showing {paginatedQuestions.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuestions.length)} of {filteredQuestions.length} matched questions
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

      {/* 4. QUESTIONS LIST */}
      <div className="flex flex-col gap-3">
        {paginatedQuestions.length === 0 ? (
          <div className="p-12 text-center text-stone-500 bg-[#0d1117] rounded-xl border border-stone-800 flex flex-col items-center gap-2">
            <Filter className="w-6 h-6 text-stone-600" />
            <span>No interview questions matched your current filter criteria.</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedDifficulty('All');
                setSelectedCompany('All');
                setSelectedCategory('All');
              }}
              className="mt-2 text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isHintRevealed = revealedHintIds[q.id] === true;
            const isBookmarked = savedBookmarkIds.includes(q.id);
            const isSolved = solvedIds.includes(q.id);
            const userChoice = selectedMcqAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all shadow-md overflow-hidden ${
                  isSolved 
                    ? 'border-emerald-900/40 bg-[#0d1316]' 
                    : 'border-stone-800 bg-[#0d1117] hover:border-stone-700'
                }`}
              >
                {/* Header Card */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Solved check toggle */}
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
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        {/* Company Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${getCompanyColor(q.company)}`}>
                          <Building2 className="w-2.5 h-2.5" />
                          <span>{q.company}</span>
                        </span>

                        {/* Type Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                          q.type === 'coding' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        }`}>
                          {q.type === 'coding' ? 'CODING QUERY' : 'MCQ'}
                        </span>

                        {/* Difficulty Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyBadge(q.difficulty)}`}>
                          {q.difficulty}
                        </span>

                        {/* Topic & Category */}
                        <span className="text-[11px] text-sky-400 font-mono">
                          {q.category} • {q.topic}
                        </span>
                      </div>

                      {/* Title & Question text */}
                      <h4 className="font-semibold text-sm sm:text-base text-stone-100 font-sans leading-snug">
                        {q.title}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed whitespace-pre-wrap">
                        {q.question}
                      </p>

                      {/* Tags */}
                      {q.tags && q.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {q.tags.slice(0, 5).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#161b22] text-stone-400 border border-stone-800">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Bookmark & Expand */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {onToggleBookmark && (
                      <button
                        onClick={() => onToggleBookmark(q.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isBookmarked ? 'text-amber-400 bg-amber-500/20' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark this question'}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Solution'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Progressive Hint Button in Collapsed Card */}
                {!isExpanded && (
                  <div className="px-4 pb-3 flex items-center justify-between border-t border-stone-800/40 pt-2 text-xs">
                    {!isHintRevealed ? (
                      <button
                        onClick={() => toggleHint(q.id)}
                        className="flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>💡 Need a hint before solving?</span>
                      </button>
                    ) : (
                      <div className="w-full p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-amber-200 text-xs flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-amber-300 font-semibold mr-1">Progressive Hint:</strong>
                          <span>{q.hint}</span>
                        </div>
                        <button
                          onClick={() => toggleHint(q.id)}
                          className="text-[10px] text-stone-400 hover:text-stone-200 underline shrink-0 cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded Drawer: Interactive MCQ or Coding Solution */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-stone-800 bg-[#141924]/60 flex flex-col gap-3.5 text-xs">
                    {/* 1. Progressive Hint in Drawer */}
                    {q.hint && (
                      <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-700/40 text-amber-200">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span>Interviewer Placement Clue & Hint</span>
                        </div>
                        <p className="leading-relaxed pl-5">{q.hint}</p>
                      </div>
                    )}

                    {/* 2. Interactive MCQ Choices */}
                    {q.type === 'mcq' && q.options && (
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-xs text-stone-300 uppercase tracking-wider">
                          Select Your Answer:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userChoice === optIdx;
                            const isCorrect = q.correctIndex === optIdx;
                            const hasAnswered = userChoice !== undefined;

                            let optionStyle = 'bg-[#161c28] border-stone-800 hover:border-sky-600/60 text-stone-200';
                            if (hasAnswered) {
                              if (isCorrect) {
                                optionStyle = 'bg-emerald-950/40 border-emerald-600 text-emerald-200 font-semibold shadow-sm';
                              } else if (isSelected && !isCorrect) {
                                optionStyle = 'bg-rose-950/40 border-rose-600 text-rose-200';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(q.id, optIdx)}
                                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 font-bold border ${
                                  hasAnswered && isCorrect 
                                    ? 'bg-emerald-600 text-white border-emerald-500' 
                                    : hasAnswered && isSelected && !isCorrect
                                    ? 'bg-rose-600 text-white border-rose-500'
                                    : 'bg-[#10141d] text-stone-400 border-stone-700'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1 leading-snug">{opt}</span>
                                {hasAnswered && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3. Model Solution & Explanation */}
                    <div className="bg-[#0b0e14] p-4 rounded-xl border border-stone-800">
                      <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>FAANG Senior DE Model Solution & Reasoning:</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(q.id, q.solution)}
                            className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 px-2 py-1 rounded bg-[#161c28] border border-stone-800 transition-colors cursor-pointer"
                          >
                            {copiedId === q.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>

                          {onSaveToNotes && (
                            <button
                              onClick={() => onSaveToNotes(q)}
                              className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 px-2.5 py-1 rounded bg-sky-950/40 border border-sky-800/40 transition-colors cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Save to Revision Notes</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Code / Solution block */}
                      <pre className="p-3 rounded-lg bg-[#07090e] border border-stone-800/80 font-mono text-emerald-300 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">
                        {q.solution}
                      </pre>

                      {/* Detailed Explanation */}
                      <div className="mt-3 pt-3 border-t border-stone-800/60 text-xs text-stone-300 leading-relaxed">
                        <strong className="text-stone-100 block mb-1 font-semibold">
                          Why This Works & Key Takeaways:
                        </strong>
                        <p>{q.explanation}</p>
                      </div>

                      {/* Complexity & Common Traps */}
                      {(q.timeComplexity || q.commonTraps) && (
                        <div className="mt-3 pt-3 border-t border-stone-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {q.timeComplexity && (
                            <div className="p-2.5 rounded-lg bg-[#141a24] border border-stone-800">
                              <span className="font-semibold text-stone-400 text-[10px] uppercase block mb-1">
                                Algorithmic Complexity
                              </span>
                              <div className="font-mono text-sky-300 text-[11px]">
                                • Time: {q.timeComplexity}
                              </div>
                              <div className="font-mono text-sky-300 text-[11px]">
                                • Space: {q.spaceComplexity || 'O(1)'}
                              </div>
                            </div>
                          )}

                          {q.commonTraps && (
                            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/30">
                              <span className="font-semibold text-rose-400 text-[10px] uppercase block mb-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                                <span>Interviewer Trap Alert</span>
                              </span>
                              <p className="text-stone-300 text-[11px] leading-snug">
                                {q.commonTraps}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. BOTTOM PAGINATION CONTROLS */}
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
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {/* Quick Page Jumper */}
            <div className="flex items-center gap-1 px-1">
              {[currentPage - 1, currentPage, currentPage + 1]
                .filter(p => p >= 1 && p <= totalPages)
                .map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      p === currentPage
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-[#161b22] text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 text-stone-300 cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
