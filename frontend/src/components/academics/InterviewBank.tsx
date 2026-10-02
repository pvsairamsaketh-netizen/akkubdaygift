import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Cpu, 
  BookOpen
} from 'lucide-react';
import type { InterviewQuestionItem } from '../../types/academics';
import { CURRICULUM_DAYS } from '../../data/academics/curriculum';

interface InterviewBankProps {
  onSaveToNotes?: (question: InterviewQuestionItem) => void;
  savedBookmarkIds?: string[];
  onToggleBookmark?: (questionId: string) => void;
}

export const InterviewBank: React.FC<InterviewBankProps> = ({
  onSaveToNotes,
  savedBookmarkIds = [],
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revealedHintIds, setRevealedHintIds] = useState<Record<string, boolean>>({});

  // Flatten all interview questions from the 100 days curriculum
  const allQuestions: InterviewQuestionItem[] = useMemo(() => {
    const list: InterviewQuestionItem[] = [];
    CURRICULUM_DAYS.forEach(day => {
      if (day.interviewQuestions && day.interviewQuestions.length > 0) {
        day.interviewQuestions.forEach(q => {
          list.push({
            ...q,
            topic: q.topic || day.title
          });
        });
      }
    });
    return list;
  }, []);

  const uniqueTopics = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach(q => {
      if (q.topic) set.add(q.topic);
    });
    return Array.from(set);
  }, [allQuestions]);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchSearch = searchQuery === '' || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;

      return matchSearch && matchDifficulty && matchTopic;
    });
  }, [allQuestions, searchQuery, selectedDifficulty, selectedTopic]);

  const toggleHint = (id: string) => {
    setRevealedHintIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Advanced':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Interview Challenge':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-stone-500/20 text-stone-300 border-stone-500/30';
    }
  };

  return (
    <div className="flex flex-col gap-4 text-stone-200">
      {/* Search and Filters Bar */}
      <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search DE placement questions, tags, Spark, SQL, Kafka..."
            className="w-full pl-9 pr-3 py-2 bg-[#161b22] border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Interview Challenge">Interview Challenge</option>
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-sky-500 cursor-pointer max-w-[180px] truncate"
          >
            <option value="All">All Topics ({uniqueTopics.length})</option>
            {uniqueTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Count Summary */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-400">
        <span>Showing {filteredQuestions.length} of {allQuestions.length} technical interview questions</span>
        <span className="text-[11px] text-stone-500">M.Tech Data Engineering Placement Curriculum</span>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-stone-500 bg-[#0d1117] rounded-xl border border-stone-800">
            No questions matched your search criteria. Try clearing the filter.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isHintRevealed = revealedHintIds[q.id] === true;
            const isBookmarked = savedBookmarkIds.includes(q.id);

            return (
              <div
                key={q.id}
                className="rounded-xl border border-stone-800 bg-[#0d1117] overflow-hidden transition-all hover:border-stone-700 shadow-md"
              >
                {/* Question Header Card */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyBadge(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[11px] text-sky-400 font-mono">
                        {q.topic}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm sm:text-base text-stone-100 font-sans leading-snug">
                      {q.question}
                    </h4>

                    {q.tags && q.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {q.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#161b22] text-stone-400 border border-stone-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
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
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold transition-colors cursor-pointer ml-1"
                    >
                      <span>{isExpanded ? 'Hide Answer' : 'View Answer'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer & Explanation Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-stone-800/80 bg-[#161b22]/50 flex flex-col gap-3 text-xs">
                    {/* Progressive Hint */}
                    {q.hint && (
                      <div>
                        {!isHintRevealed ? (
                          <button
                            onClick={() => toggleHint(q.id)}
                            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Need a hint before checking the solution?</span>
                          </button>
                        ) : (
                          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200">
                            <span className="font-semibold mr-1">Interview Hint:</span>
                            {q.hint}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Model Placement Solution */}
                    <div className="bg-[#0d1117] p-3.5 rounded-xl border border-stone-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Placement Model Solution:
                        </span>
                        {onSaveToNotes && (
                          <button
                            onClick={() => onSaveToNotes(q)}
                            className="text-[11px] text-sky-400 hover:text-sky-300 underline flex items-center gap-1"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Save to Notes Workspace</span>
                          </button>
                        )}
                      </div>
                      <div className="font-mono text-stone-200 leading-relaxed whitespace-pre-wrap text-xs">
                        {q.solution}
                      </div>
                    </div>

                    {/* Complexity Metrics */}
                    {(q.timeComplexity || q.spaceComplexity) && (
                      <div className="flex items-center gap-4 text-stone-400 font-mono text-[11px]">
                        {q.timeComplexity && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            <span>Time: {q.timeComplexity}</span>
                          </div>
                        )}
                        {q.spaceComplexity && (
                          <div className="flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-purple-400" />
                            <span>Space: {q.spaceComplexity}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {q.commonMistakes && q.commonMistakes.length > 0 && (
                      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/30 text-rose-300">
                        <div className="font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1 text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Candidate Pitfalls to Avoid in Interviews:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-rose-200/90 font-sans">
                          {q.commonMistakes.map((m, i) => (
                            <li key={i}>{m}</li>
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
    </div>
  );
};
