import React, { useState, useRef } from 'react';
import { Play, RotateCcw, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language?: 'python' | 'sql' | 'pyspark' | 'bash';
  onRun?: () => void;
  isRunning?: boolean;
  onReset?: () => void;
  readOnly?: boolean;
  minHeight?: string;
  showRunButton?: boolean;
  runButtonText?: string;
  headerAction?: React.ReactNode;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  onRun,
  isRunning = false,
  onReset,
  readOnly = false,
  minHeight = '280px',
  showRunButton = true,
  runButtonText = 'Run Code',
  headerAction
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun && !isRunning) {
        onRun();
      }
      return;
    }

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const indent = '    '; // 4 spaces
      const newValue = value.substring(0, start) + indent + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + indent.length;
        }
      }, 0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const getLanguageBadge = () => {
    switch (language) {
      case 'sql':
        return { label: 'SQL (SQLite Sandbox)', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'python':
        return { label: 'Python 3.11 Runtime', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'pyspark':
        return { label: 'PySpark (Simulation & Lab)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'bash':
        return { label: 'Bash / Shell', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { label: String(language).toUpperCase(), color: 'bg-stone-500/20 text-stone-300 border-stone-500/30' };
    }
  };

  const langBadge = getLanguageBadge();

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border border-stone-800 bg-[#0d1117] text-stone-200 shadow-2xl font-mono text-sm transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]' : ''
    }`}>
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-stone-800 text-xs select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${langBadge.color}`}>
            {langBadge.label}
          </span>
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {headerAction}

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors text-[11px]"
              title="Reset code to starter template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors text-[11px]"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {showRunButton && onRun && (
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-600/60 text-white cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
              title="Shortcut: Ctrl+Enter (or Cmd+Enter)"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running...' : runButtonText}</span>
              <kbd className="hidden md:inline-block ml-1 px-1 py-0.2 text-[9px] bg-black/30 rounded border border-white/20">
                ⌘↵
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Synchronized Line Numbers */}
      <div className="relative flex flex-1 overflow-hidden" style={{ minHeight }}>
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-11 py-3 bg-[#0d1117] border-r border-stone-800/80 text-stone-600 select-none text-right pr-2 text-xs font-mono overflow-hidden leading-relaxed shrink-0"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i + 1} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-stone-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-rose-500/30 overflow-auto whitespace-pre tab-4"
          placeholder={readOnly ? '' : `# Write your ${language.toUpperCase()} code here...`}
        />
      </div>
    </div>
  );
};
