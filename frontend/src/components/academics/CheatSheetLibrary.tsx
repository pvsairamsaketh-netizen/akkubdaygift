import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Code, 
  AlertOctagon, 
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { CURRICULUM_DAYS, MODULES } from '../../data/academics/curriculum';

interface CheatSheetLibraryProps {
  savedSheetDays?: number[];
  onToggleSaveSheet?: (dayNumber: number) => void;
  onOpenLesson?: (dayNumber: number) => void;
}

export const CheatSheetLibrary: React.FC<CheatSheetLibraryProps> = ({
  savedSheetDays = [],
  onToggleSaveSheet,
  onOpenLesson
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sheets = useMemo(() => {
    return CURRICULUM_DAYS.map(day => ({
      dayNumber: day.dayNumber,
      title: day.title,
      subject: day.subject,
      moduleTitle: day.moduleTitle,
      cheatSheet: day.cheatSheet,
      docLinks: day.docLinks
    }));
  }, []);

  const filteredSheets = useMemo(() => {
    return sheets.filter(s => {
      const matchModule = selectedModule === 'All' || s.subject === selectedModule;
      const matchSearch = searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cheatSheet.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cheatSheet.definitions.some(d => d.term.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.cheatSheet.syntaxSnippets.some(snp => snp.code.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchModule && matchSearch;
    });
  }, [sheets, selectedModule, searchQuery]);

  const handleCopy = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4 text-stone-200">
      {/* Top Filter Bar */}
      <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cheat sheets, syntax, commands, terms..."
            className="w-full pl-9 pr-3 py-2 bg-[#161b22] border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          <option value="All">All Modules (12)</option>
          {MODULES.map(m => (
            <option key={m.id} value={m.id}>{m.icon} {m.title}</option>
          ))}
        </select>
      </div>

      {/* Sheets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSheets.length === 0 ? (
          <div className="lg:col-span-2 p-12 text-center text-stone-500 bg-[#0d1117] rounded-xl border border-stone-800">
            No cheat sheets matched your query.
          </div>
        ) : (
          filteredSheets.map(s => {
            const isSaved = savedSheetDays.includes(s.dayNumber);
            return (
              <div
                key={s.dayNumber}
                className="rounded-xl border border-stone-800 bg-[#0d1117] p-4 flex flex-col gap-3 shadow-lg hover:border-stone-700 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Day {s.dayNumber}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono truncate max-w-[200px]">
                        {s.moduleTitle}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-stone-100">
                      {s.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    {onToggleSaveSheet && (
                      <button
                        onClick={() => onToggleSaveSheet(s.dayNumber)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved ? 'text-amber-400 bg-amber-500/20' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'
                        }`}
                        title={isSaved ? 'Saved in My Cheat Sheets' : 'Save to My Cheat Sheets'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    )}

                    {onOpenLesson && (
                      <button
                        onClick={() => onOpenLesson(s.dayNumber)}
                        className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/20 transition-colors"
                        title="Open full lesson workspace"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {s.cheatSheet.summary}
                </p>

                {/* Definitions */}
                {s.cheatSheet.definitions && s.cheatSheet.definitions.length > 0 && (
                  <div className="space-y-1.5 bg-[#161b22] p-2.5 rounded-lg border border-stone-800/80">
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      Core Definitions:
                    </div>
                    {s.cheatSheet.definitions.map((d, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-semibold text-sky-300 font-mono">{d.term}: </span>
                        <span className="text-stone-300">{d.explanation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Syntax Snippets */}
                {s.cheatSheet.syntaxSnippets && s.cheatSheet.syntaxSnippets.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                      <Code className="w-3 h-3 text-emerald-400" />
                      <span>Production Syntax & Snippets:</span>
                    </div>
                    {s.cheatSheet.syntaxSnippets.map((snp, i) => {
                      const snippetKey = `${s.dayNumber}_${i}`;
                      return (
                        <div key={i} className="rounded-lg bg-[#161b22] border border-stone-800 overflow-hidden">
                          <div className="flex items-center justify-between px-2.5 py-1 bg-stone-900 border-b border-stone-800 text-[11px] text-stone-400">
                            <span>{snp.label}</span>
                            <button
                              onClick={() => handleCopy(snippetKey, snp.code)}
                              className="flex items-center gap-1 text-[10px] hover:text-stone-200 transition-colors"
                            >
                              {copiedKey === snippetKey ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-2 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                            {snp.code}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Common Mistakes & Interview Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-auto pt-2 border-t border-stone-800 text-xs">
                  {s.cheatSheet.commonMistakes && s.cheatSheet.commonMistakes.length > 0 && (
                    <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30 text-rose-300 text-[11px]">
                      <div className="font-semibold flex items-center gap-1 mb-0.5 text-rose-400">
                        <AlertOctagon className="w-3 h-3" />
                        <span>Common Trap</span>
                      </div>
                      <div>{s.cheatSheet.commonMistakes[0]}</div>
                    </div>
                  )}

                  {s.cheatSheet.interviewTips && s.cheatSheet.interviewTips.length > 0 && (
                    <div className="p-2 rounded bg-amber-950/20 border border-amber-900/30 text-amber-300 text-[11px]">
                      <div className="font-semibold flex items-center gap-1 mb-0.5 text-amber-400">
                        <Lightbulb className="w-3 h-3" />
                        <span>Interview Tip</span>
                      </div>
                      <div>{s.cheatSheet.interviewTips[0]}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
