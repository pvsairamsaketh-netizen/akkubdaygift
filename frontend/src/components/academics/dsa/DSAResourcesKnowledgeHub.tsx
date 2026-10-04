import React, { useState, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Zap,
  AlertTriangle,
  Play,
  Video,
  X,
  Shuffle,
  Building2,
  Tag
} from 'lucide-react';
import { 
  DSA_SOURCES, 
  DSA_COMPLEXITY_TABLE, 
  DSA_PATTERNS, 
  DSA_INTERVIEW_MASTER_QUESTIONS, 
  DSA_MASTER_CHEAT_SHEETS, 
  PATTERN_QUIZ_QUESTIONS,
  DSA_VIDEO_MASTERCLASSES,
  type DSAVideoMasterclass,
  type DSAPatternDetail,
  type DSACheatSheetDetail
} from '../../../data/academics/dsaResourcesData';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

interface DSAResourcesKnowledgeHubProps {
  onSelectDay?: (dayNumber: number) => void;
}

type HubTab = 'sources' | 'videos' | 'complexity' | 'patterns' | 'interview' | 'cheatsheets' | 'rapid_prep';

export const DSAResourcesKnowledgeHub: React.FC<DSAResourcesKnowledgeHubProps> = ({ onSelectDay }) => {
  const { isDark } = useAcademicsTheme();
  const [activeTab, setActiveTab] = useState<HubTab>('sources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplexityCase, setSelectedComplexityCase] = useState<'avg' | 'worst'>('avg');
  const [selectedSourceCategory, setSelectedSourceCategory] = useState<string>('All');
  const [embeddedVideo, setEmbeddedVideo] = useState<DSAVideoMasterclass | null>(null);

  // Pattern Quiz State (120+ MNC Questions)
  const [patternCompanyFilter, setPatternCompanyFilter] = useState<string>('All');
  const [patternTopicFilter, setPatternTopicFilter] = useState<string>('All');
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const filteredPatternQuestions = useMemo(() => {
    return PATTERN_QUIZ_QUESTIONS.filter((q) => {
      const matchComp = patternCompanyFilter === 'All' || q.companyTag === patternCompanyFilter;
      const matchTopic = patternTopicFilter === 'All' || q.topic.toLowerCase().includes(patternTopicFilter.toLowerCase());
      return matchComp && matchTopic;
    });
  }, [patternCompanyFilter, patternTopicFilter]);

  const safeQuizIdx = Math.min(quizIdx, Math.max(0, filteredPatternQuestions.length - 1));
  const activeQuizQ = filteredPatternQuestions[safeQuizIdx] || PATTERN_QUIZ_QUESTIONS[0];

  // Selected Pattern for Detail View
  const [selectedPattern, setSelectedPattern] = useState<DSAPatternDetail | null>(DSA_PATTERNS[0]);

  // Interview Answers & Pitch State (125+ FAANG Questions)
  const [interviewCompanyFilter, setInterviewCompanyFilter] = useState<string>('All');
  const [interviewTopicFilter, setInterviewTopicFilter] = useState<string>('All');
  const [interviewDifficultyFilter, setInterviewDifficultyFilter] = useState<string>('All');
  const [interviewSearchText, setInterviewSearchText] = useState<string>('');
  const [interviewPage, setInterviewPage] = useState<number>(1);
  const INTERVIEW_PAGE_SIZE = 10;

  const filteredInterviewQuestions = useMemo(() => {
    return DSA_INTERVIEW_MASTER_QUESTIONS.filter((item) => {
      const matchCompany = interviewCompanyFilter === 'All' || item.companyTag === interviewCompanyFilter;
      const matchTopic = interviewTopicFilter === 'All' || item.topic === interviewTopicFilter;
      const matchDiff = interviewDifficultyFilter === 'All' || item.difficulty === interviewDifficultyFilter;
      const qText = interviewSearchText.toLowerCase();
      const matchQuery = !interviewSearchText.trim() ||
        item.question.toLowerCase().includes(qText) ||
        item.topic.toLowerCase().includes(qText) ||
        item.tags.some(t => t.toLowerCase().includes(qText)) ||
        (item.companyTag && item.companyTag.toLowerCase().includes(qText));
      return matchCompany && matchTopic && matchDiff && matchQuery;
    });
  }, [interviewCompanyFilter, interviewTopicFilter, interviewDifficultyFilter, interviewSearchText]);

  const totalInterviewPages = Math.max(1, Math.ceil(filteredInterviewQuestions.length / INTERVIEW_PAGE_SIZE));
  const paginatedInterviewQuestions = useMemo(() => {
    const start = (interviewPage - 1) * INTERVIEW_PAGE_SIZE;
    return filteredInterviewQuestions.slice(start, start + INTERVIEW_PAGE_SIZE);
  }, [filteredInterviewQuestions, interviewPage]);

  // Selected Interview Question for Answer Modal/Expand
  const [expandedInterviewQ, setExpandedInterviewQ] = useState<string | null>(DSA_INTERVIEW_MASTER_QUESTIONS[0]?.id || null);
  const [activeAnswerMode, setActiveAnswerMode] = useState<Record<string, '30s' | '1min' | 'deep'>>({});

  // Cheat Sheet Active Topic (15 Complete Topics)
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
              14 Verified Master Sources & Video Masterclasses
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            🧠 DSA Placement Knowledge Hub & Master Resources
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-3xl">
            Unified single study center consolidating <strong>Code & Debug</strong>, <strong>CampusX</strong>, <strong>Striver A2Z</strong>, <strong>Love Babbar 450</strong>, <strong>NeetCode</strong>, <strong>Zero To Mastery</strong>, and <strong>Curated Video Playlists</strong> with verified links, Big-O tables, interview pitch guides, and pattern diagnostics.
          </p>
        </div>

        {/* Global Hub Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search topic, video, pattern..."
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
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">14</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Video Masterclasses & Playlists</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">5</span>
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
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-400/30 text-white font-bold">{PATTERN_QUIZ_QUESTIONS.length} Qs</span>
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
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/30 text-white font-bold">{DSA_INTERVIEW_MASTER_QUESTIONS.length} FAANG</span>
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
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400/30 text-white font-bold">{DSA_MASTER_CHEAT_SHEETS.length} Topics</span>
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
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified External Source Mappings & Direct Sheets
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                100% genuine attribution • Direct access to all sheets, roadmaps, and videos
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['All', 'Video', 'Roadmap', 'Cheat Sheet', 'Master Index', 'GitHub', 'Spreadsheet'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedSourceCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedSourceCategory === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : isDark ? 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat} {cat === 'All' ? `(${DSA_SOURCES.length})` : `(${DSA_SOURCES.filter(s => s.category === cat).length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DSA_SOURCES
              .filter(s => selectedSourceCategory === 'All' || s.category === selectedSourceCategory)
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
      {/* TAB: VIDEO MASTERCLASSES & PLAYLISTS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'videos' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
                Featured DSA Video Masterclasses & Placement Playlists
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                Top curated video playlists and comprehensive courses from CampusX, FreeCodeCamp, TUF (Striver), and placement mentors.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
              5 Masterclass Courses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DSA_VIDEO_MASTERCLASSES
              .filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.channel.toLowerCase().includes(searchQuery.toLowerCase()) || v.description.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(video => (
                <div
                  key={video.id}
                  className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-md transition-all hover:scale-[1.01] ${
                    isDark ? 'bg-stone-900/80 border-stone-800 hover:border-rose-600/40' : 'bg-white border-slate-200 hover:border-rose-300'
                  }`}
                >
                  {/* Thumbnail / Header with Play Overlay */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/80 group">
                    <img 
                      src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&q=80'} 
                      alt={video.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Duration badge */}
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white border border-white/10">
                        {video.duration}
                      </span>
                    )}

                    {/* Level badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600/90 text-white">
                      {video.level}
                    </span>

                    {/* Play button overlay */}
                    <button
                      onClick={() => setEmbeddedVideo(video)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Watch Preview"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>{video.channel}</span>
                      </div>
                      <h4 className="font-bold text-sm leading-snug line-clamp-2">{video.title}</h4>
                      <p className="text-xs opacity-75 line-clamp-3 leading-relaxed">{video.description}</p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <div className="flex flex-wrap gap-1">
                        {video.topics.map((t, i) => (
                          <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${
                            isDark ? 'bg-stone-800 text-stone-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-stone-800/40">
                        <button
                          onClick={() => setEmbeddedVideo(video)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Watch Here</span>
                        </button>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all flex items-center justify-center cursor-pointer"
                          title="Open on YouTube"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
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
          {/* Interactive Pattern Quiz Box (122 MNC Questions) */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border-indigo-800/30' 
              : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-indigo-200'
          }`}>
            {/* Top Filter & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-indigo-500/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> MNC Pattern Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {filteredPatternQuestions.length} Questions
                </span>
                {quizScore.total > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Score: {quizScore.correct}/{quizScore.total} ({Math.round((quizScore.correct / quizScore.total) * 100)}%)
                  </span>
                )}
              </div>

              {/* Stepper & Random Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setQuizIdx((prev) => (prev > 0 ? prev - 1 : filteredPatternQuestions.length - 1));
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className="px-2 py-1 rounded-lg text-xs font-medium bg-stone-800/80 hover:bg-stone-700 text-stone-200 flex items-center gap-1 cursor-pointer"
                  title="Previous Question"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <span className="text-xs opacity-75 font-mono px-1">
                  {safeQuizIdx + 1} / {filteredPatternQuestions.length}
                </span>
                <button
                  onClick={() => {
                    setQuizIdx((prev) => (prev + 1) % filteredPatternQuestions.length);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className="px-2 py-1 rounded-lg text-xs font-medium bg-stone-800/80 hover:bg-stone-700 text-stone-200 flex items-center gap-1 cursor-pointer"
                  title="Next Question"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const rnd = Math.floor(Math.random() * filteredPatternQuestions.length);
                    setQuizIdx(rnd);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 cursor-pointer ml-1"
                  title="Random Question"
                >
                  <Shuffle className="w-3 h-3" /> Random
                </button>
              </div>
            </div>

            {/* Filter Pills for Company & Topic Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 mr-1">
                  <Building2 className="w-3 h-3" /> Company:
                </span>
                {['All', 'Amazon', 'Google', 'Meta', 'Microsoft', 'Apple', 'Uber', 'Bloomberg'].map((comp) => (
                  <button
                    key={comp}
                    onClick={() => {
                      setPatternCompanyFilter(comp);
                      setQuizIdx(0);
                      setSelectedOption(null);
                      setIsAnswerSubmitted(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      patternCompanyFilter === comp
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark ? 'bg-stone-900/80 text-stone-400 hover:text-stone-200' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-400">Topic:</span>
                <select
                  value={patternTopicFilter}
                  onChange={(e) => {
                    setPatternTopicFilter(e.target.value);
                    setQuizIdx(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] border outline-none cursor-pointer ${
                    isDark ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="All">All Topics</option>
                  <option value="Two Pointers">Two Pointers</option>
                  <option value="Sliding Window">Sliding Window</option>
                  <option value="Stack">Monotonic Stack / Stack</option>
                  <option value="Tree">Trees & BST</option>
                  <option value="Graph">Graphs & BFS/DFS</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Heap">Heaps / Priority Queue</option>
                  <option value="Binary Search">Binary Search</option>
                  <option value="Bit Manipulation">Bit Manipulation</option>
                </select>
              </div>
            </div>

            {/* Problem Tags */}
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {activeQuizQ.companyTag || 'Top MNC'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/25 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {activeQuizQ.topic}
              </span>
            </div>

            {/* Question Title */}
            <h4 className="font-bold text-sm sm:text-base leading-snug mt-1">
              &quot;{activeQuizQ.problem}&quot;
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {activeQuizQ.options.map((opt) => (
                <button
                  key={opt}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    setSelectedOption(opt);
                    setIsAnswerSubmitted(true);
                    setQuizScore(prev => ({
                      correct: prev.correct + (opt === activeQuizQ.correct ? 1 : 0),
                      total: prev.total + 1
                    }));
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                    selectedOption === opt
                      ? opt === activeQuizQ.correct
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
                selectedOption === activeQuizQ.correct
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}>
                <strong>
                  {selectedOption === activeQuizQ.correct ? '✓ Exactly Right!' : `✕ Correct Pattern: ${activeQuizQ.correct}`}
                </strong>
                <p className="mt-1 opacity-90">{activeQuizQ.explanation}</p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setQuizIdx((prev) => (prev + 1) % filteredPatternQuestions.length);
                      setSelectedOption(null);
                      setIsAnswerSubmitted(false);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                  >
                    Next Question ➔
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
      {/* TAB 4: INTERVIEW ANSWERS & ELEVATOR PITCH (125+ FAANG QUESTIONS)          */}
      {/* ========================================================================= */}
      {activeTab === 'interview' && (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                &quot;What Should I Say In An Interview?&quot; — FAANG Model Responses
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                Practice answering like a senior FAANG engineer with 30-second elevator pitches, 1-minute comprehensive explanations, deep systems dives, and real follow-ups.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                {DSA_INTERVIEW_MASTER_QUESTIONS.length} Verified FAANG Questions
              </span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
            isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Search Input Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search 125+ interview questions by keyword, topic, or concept..."
                  value={interviewSearchText}
                  onChange={(e) => {
                    setInterviewSearchText(e.target.value);
                    setInterviewPage(1);
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                    isDark ? 'bg-stone-950/80 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-amber-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                  }`}
                />
                {interviewSearchText && (
                  <button
                    onClick={() => {
                      setInterviewSearchText('');
                      setInterviewPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Topic Select */}
              <div className="sm:w-56">
                <select
                  value={interviewTopicFilter}
                  onChange={(e) => {
                    setInterviewTopicFilter(e.target.value);
                    setInterviewPage(1);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer ${
                    isDark ? 'bg-stone-950 border-stone-800 text-stone-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="All">All Topics ({DSA_INTERVIEW_MASTER_QUESTIONS.length})</option>
                  <option value="Hashing & Tables">Hashing & Tables</option>
                  <option value="Arrays & Two Pointers">Arrays & Two Pointers</option>
                  <option value="Sliding Window">Sliding Window</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Sorting & Searching">Sorting & Searching</option>
                  <option value="Binary Trees & BST">Binary Trees & BST</option>
                  <option value="Heaps & Priority Queues">Heaps & Priority Queues</option>
                  <option value="Graphs & Shortest Path">Graphs & Shortest Path</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Recursion & Backtracking">Recursion & Backtracking</option>
                  <option value="Trie & Prefix Trees">Trie & Prefix Trees</option>
                  <option value="Bit Manipulation">Bit Manipulation</option>
                  <option value="Monotonic Stack & Queue">Monotonic Stack & Queue</option>
                  <option value="Greedy Algorithms">Greedy Algorithms</option>
                  <option value="Intervals & Range Queries">Intervals & Range Queries</option>
                </select>
              </div>
            </div>

            {/* Filter Pills (Company & Difficulty) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-800/40">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 mr-1">
                  <Building2 className="w-3 h-3" /> MNC Company:
                </span>
                {['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Uber'].map((comp) => (
                  <button
                    key={comp}
                    onClick={() => {
                      setInterviewCompanyFilter(comp);
                      setInterviewPage(1);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      interviewCompanyFilter === comp
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                        : isDark ? 'bg-stone-800/70 text-stone-400 hover:text-stone-200' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-400 mr-1">Level:</span>
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setInterviewDifficultyFilter(lvl);
                      setInterviewPage(1);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      interviewDifficultyFilter === lvl
                        ? 'bg-purple-600 text-white font-bold'
                        : isDark ? 'bg-stone-800/70 text-stone-400 hover:text-stone-200' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs opacity-75 px-1">
            <span>
              Showing {filteredInterviewQuestions.length === 0 ? 0 : (interviewPage - 1) * INTERVIEW_PAGE_SIZE + 1}–{Math.min(interviewPage * INTERVIEW_PAGE_SIZE, filteredInterviewQuestions.length)} of {filteredInterviewQuestions.length} Questions
            </span>
            <span>
              Page {interviewPage} of {totalInterviewPages}
            </span>
          </div>

          {/* Questions Accordion List */}
          <div className="flex flex-col gap-3.5">
            {paginatedInterviewQuestions.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center ${
                isDark ? 'bg-stone-900/40 border-stone-800 text-stone-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <p className="text-sm font-semibold">No questions match your filter criteria.</p>
                <button
                  onClick={() => {
                    setInterviewCompanyFilter('All');
                    setInterviewTopicFilter('All');
                    setInterviewDifficultyFilter('All');
                    setInterviewSearchText('');
                  }}
                  className="mt-3 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              paginatedInterviewQuestions.map((item) => {
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
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.companyTag && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Building2 className="w-2.5 h-2.5" /> {item.companyTag}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {item.topic}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-500/15' : item.difficulty === 'Intermediate' ? 'text-amber-400 bg-amber-500/15' : 'text-rose-400 bg-rose-500/15'
                          }`}>
                            {item.difficulty}
                          </span>
                          <span className="text-[11px] opacity-60 font-mono">Source: {item.source}</span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base">{item.question}</h4>
                      </div>
                      <button className="p-1 rounded-lg text-stone-400 shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expanded Body */}
                    {isExpanded && (
                      <div className="px-4 pb-4 flex flex-col gap-4 border-t border-stone-800/40 pt-4">
                        {/* Answer Duration Switcher */}
                        <div className="flex flex-wrap items-center gap-2">
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

                        {/* Expectations & Common Mistakes */}
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

                        {/* Follow-up Questions */}
                        {item.followUpQuestions && item.followUpQuestions.length > 0 && (
                          <div className={`p-3 rounded-xl border text-xs ${
                            isDark ? 'bg-purple-950/20 border-purple-900/30 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-950'
                          }`}>
                            <strong className="text-purple-400">🔄 Expected Senior Follow-up Questions:</strong>
                            <div className="flex flex-col gap-1 mt-1.5">
                              {item.followUpQuestions.map((fu, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[11px] opacity-90">
                                  <span className="font-bold text-purple-400">Q{idx + 1}:</span>
                                  <span>{fu}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalInterviewPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={interviewPage === 1}
                onClick={() => setInterviewPage(prev => Math.max(1, prev - 1))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                  interviewPage === 1 ? 'opacity-40 cursor-not-allowed' : 'bg-stone-800 hover:bg-stone-700 text-white'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous Page
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                {Array.from({ length: totalInterviewPages }, (_, i) => i + 1).map((pg) => {
                  if (
                    pg === 1 || 
                    pg === totalInterviewPages || 
                    Math.abs(pg - interviewPage) <= 1
                  ) {
                    return (
                      <button
                        key={pg}
                        onClick={() => setInterviewPage(pg)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          interviewPage === pg
                            ? 'bg-amber-500 text-stone-950'
                            : isDark ? 'bg-stone-900 text-stone-400 hover:text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  }
                  if (pg === 2 && interviewPage > 3) return <span key={pg} className="px-1 text-xs opacity-50">...</span>;
                  if (pg === totalInterviewPages - 1 && interviewPage < totalInterviewPages - 2) return <span key={pg} className="px-1 text-xs opacity-50">...</span>;
                  return null;
                })}
              </div>

              <button
                disabled={interviewPage === totalInterviewPages}
                onClick={() => setInterviewPage(prev => Math.min(totalInterviewPages, prev + 1))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                  interviewPage === totalInterviewPages ? 'opacity-40 cursor-not-allowed' : 'bg-stone-800 hover:bg-stone-700 text-white'
                }`}
              >
                Next Page <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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

          {/* Active 20-Point Sheet Display (All 20 Points in Full Detail) */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-6 ${
            isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Points 1 & 2: Topic Definition & In-Depth Architecture */}
            <div className="flex flex-col gap-2 pb-4 border-b border-stone-800/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Points 1 & 2: Definition & Architecture
                  </span>
                  <span className="text-xs font-mono opacity-60">Topic: {activeCheatSheet.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    ⏱ {activeCheatSheet.timeComplexity}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    💾 {activeCheatSheet.spaceComplexity}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-stone-100">{activeCheatSheet.topic}</h3>
              <p className="text-sm text-emerald-400 font-semibold">{activeCheatSheet.oneLineDefinition}</p>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed mt-1">{activeCheatSheet.whatIsIt}</p>
            </div>

            {/* Points 3, 4, 5: Analogy, When to Use & Interview Recognition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Point 3 • 🌎 Real-Life Analogy
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{activeCheatSheet.analogy}</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Point 4 • 🎯 When to Use
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{activeCheatSheet.whenToUse}</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                  Point 5 • 🔍 FAANG Interview Signals
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{activeCheatSheet.interviewRecognition}</p>
              </div>
            </div>

            {/* Points 6 & 7: Common Patterns & Core Operations Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Point 6: Common Algorithmic Patterns */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Point 6 • 🧩 High-Yield Patterns
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeCheatSheet.commonPatterns.map((pat, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25"
                    >
                      {pat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Point 7: Core Operations Breakdown & Complexities */}
              <div className={`lg:col-span-2 p-4 rounded-xl border flex flex-col gap-2.5 ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  Point 7 • ⚡ Core Operations Complexity
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {activeCheatSheet.coreOperations.map((op, i) => (
                    <div 
                      key={i}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                        isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-stone-200">{op.op}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{op.desc}</div>
                      </div>
                      <span className="font-mono font-bold text-purple-400 text-xs shrink-0 ml-2">{op.complexity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Points 8 & 9: Time & Space Complexity Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-purple-400">Point 8 • Time Complexity Invariants</div>
                  <div className="font-mono text-xs font-semibold text-stone-200 mt-0.5">{activeCheatSheet.timeComplexity}</div>
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <Layers className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-indigo-400">Point 9 • Memory & Space Complexity</div>
                  <div className="font-mono text-xs font-semibold text-stone-200 mt-0.5">{activeCheatSheet.spaceComplexity}</div>
                </div>
              </div>
            </div>

            {/* Points 10, 11, 12: Multilingual Syntax Cheatsheet */}
            <div>
              <div className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>Points 10, 11 & 12 • 💻 Multilingual Syntax Snippets</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-1">
                    <span>Point 10 • 🐍 Python Syntax</span>
                    <button 
                      onClick={() => handleCopyCode(activeCheatSheet.pythonSyntax)}
                      className="hover:text-stone-200 p-0.5 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 border border-stone-800 text-[10px] font-mono text-emerald-300 overflow-x-auto min-h-[100px]">
                    {activeCheatSheet.pythonSyntax}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-1">
                    <span>Point 11 • ⚙️ C++ STL Syntax</span>
                    <button 
                      onClick={() => handleCopyCode(activeCheatSheet.cppSyntax)}
                      className="hover:text-stone-200 p-0.5 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 border border-stone-800 text-[10px] font-mono text-sky-300 overflow-x-auto min-h-[100px]">
                    {activeCheatSheet.cppSyntax}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-1">
                    <span>Point 12 • ☕ Java Syntax</span>
                    <button 
                      onClick={() => handleCopyCode(activeCheatSheet.javaSyntax)}
                      className="hover:text-stone-200 p-0.5 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/60 border border-stone-800 text-[10px] font-mono text-amber-300 overflow-x-auto min-h-[100px]">
                    {activeCheatSheet.javaSyntax}
                  </pre>
                </div>
              </div>
            </div>

            {/* Points 13, 14, 15: Core Algorithms, High-Frequency Questions & Practice Problems */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Point 13: Core Canonical Algorithms */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Point 13 • ⚙️ Canonical Algorithms
                </div>
                <ul className="text-xs space-y-1 mt-1 text-stone-300">
                  {activeCheatSheet.commonAlgorithms.map((alg, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{alg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Point 14: Top High-Frequency Interview Questions */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Point 14 • 💬 High-Frequency Interview Qs
                </div>
                <ul className="text-xs space-y-1 mt-1 text-stone-300">
                  {activeCheatSheet.commonInterviewQs.map((q, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Point 15: Must-Solve LeetCode Practice Problems */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Point 15 • 🏆 Must-Solve Problems
                </div>
                <ul className="text-xs space-y-1 mt-1 text-stone-300">
                  {activeCheatSheet.commonProblems.map((prob, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{prob}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Points 16, 17, 18: Common Mistakes, Edge Cases & Follow-up Questions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Point 16: Common Traps & Mistakes */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                isDark ? 'bg-rose-950/20 border-rose-900/30 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Point 16 • Traps to Avoid
                </div>
                <ul className="text-xs space-y-1 mt-1 opacity-90">
                  {activeCheatSheet.commonMistakes.map((mis, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>✕</span>
                      <span>{mis}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Point 17: Critical Edge Cases */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                isDark ? 'bg-amber-950/20 border-amber-900/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Point 17 • Critical Edge Cases
                </div>
                <ul className="text-xs space-y-1 mt-1 opacity-90">
                  {activeCheatSheet.edgeCases.map((edge, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{edge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Point 18: Tricky Interview Follow-Ups */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                isDark ? 'bg-purple-950/20 border-purple-900/30 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Point 18 • Interview Follow-Ups
                </div>
                <ul className="text-xs space-y-1 mt-1 opacity-90">
                  {activeCheatSheet.interviewFollowUps.map((fu, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-purple-400">Q{i + 1}:</span>
                      <span>{fu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Points 19 & 20: 60-Second Revision Summary & Related Topics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Point 19: 60-Second Placement Revision */}
              <div className={`md:col-span-3 p-4 rounded-xl border ${
                isDark ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-100' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-3.5 h-3.5" /> Point 19 • 60-Second Placement Revision
                </div>
                <p className="text-xs leading-relaxed opacity-95 font-medium">
                  {activeCheatSheet.sixtySecRevision}
                </p>
              </div>

              {/* Point 20: Related Topics */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                isDark ? 'bg-stone-950/40 border-stone-800' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Point 20 • Related Topics
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCheatSheet.relatedTopics.map((rel, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-800 text-stone-300 border border-stone-700"
                      >
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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

      {/* Embedded Video Player Modal */}
      {embeddedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
            isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
          }`}>
            {/* Modal Header */}
            <div className="p-4 flex items-center justify-between border-b border-stone-800/40">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400">
                  <Play className="w-4 h-4 fill-current" />
                </span>
                <div>
                  <h4 className="font-bold text-sm line-clamp-1">{embeddedVideo.title}</h4>
                  <p className="text-[11px] opacity-75">{embeddedVideo.channel} • {embeddedVideo.duration}</p>
                </div>
              </div>
              <button
                onClick={() => setEmbeddedVideo(null)}
                className="p-1.5 rounded-lg hover:bg-stone-800/60 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Iframe Container (16:9) */}
            <div className="relative aspect-video w-full bg-black">
              {embeddedVideo.videoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${embeddedVideo.videoId}?autoplay=1`}
                  title={embeddedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : embeddedVideo.playlistId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${embeddedVideo.playlistId}`}
                  title={embeddedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center text-stone-300">
                  <p className="text-sm">This video playlist opens directly on YouTube.</p>
                  <a
                    href={embeddedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2"
                  >
                    <span>Open YouTube Playlist</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 px-4 flex items-center justify-between text-xs border-t border-stone-800/40">
              <span className="opacity-75 line-clamp-1">{embeddedVideo.description}</span>
              <a
                href={embeddedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 shrink-0 ml-3"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
