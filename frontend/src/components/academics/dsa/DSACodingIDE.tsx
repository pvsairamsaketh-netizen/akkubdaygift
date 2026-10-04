import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Send,
  BrainCircuit,
  Eye,
  EyeOff,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Terminal,
  Lightbulb,
  BookOpen,
  ExternalLink,
  X,
  Zap,
  Trophy,
  History,
  Code2,
} from 'lucide-react';
import { type DSAQuestion } from '../../../data/academics/dsaQuestionBank';
import { api } from '../../../services/api';

/* ─── Starter Code Generators ────────────────────────────────── */
function generatePythonStarter(q: DSAQuestion): string {
  const fnName = q.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 30) || 'solve';
  return `# ${q.title}
# Topic: ${q.topic} | Pattern: ${q.pattern}
# Time Limit: ${q.expectedTime} | Expected: ${q.timeComplexity} time, ${q.spaceComplexity} space
#
# Problem:
# ${q.description.split('\n').slice(0, 3).join('\n# ')}
#
# Write your solution below:

def ${fnName}(data):
    # TODO: implement your solution here
    pass


# Test your solution (uncomment to run)
# print(${fnName}([1, 2, 3]))
`;
}

function generateCppStarter(q: DSAQuestion): string {
  return `// ${q.title}
// Topic: ${q.topic} | Pattern: ${q.pattern}
// Time Limit: ${q.expectedTime} | Expected: ${q.timeComplexity} time, ${q.spaceComplexity} space
//
// Write your solution below:

#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // TODO: define your function signature and implement
    // Example: vector<int> solve(vector<int>& nums) { ... }

};

int main() {
    Solution sol;
    // Test your solution here
    return 0;
}
`;
}

function generateJavaStarter(q: DSAQuestion): string {
  return `// ${q.title}
// Topic: ${q.topic} | Pattern: ${q.pattern}
// Time Limit: ${q.expectedTime} | Expected: ${q.timeComplexity} time, ${q.spaceComplexity} space
//
// Write your solution below:

import java.util.*;

public class Solution {
    // TODO: implement your method
    // Example: public int[] solve(int[] nums) { ... }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println("Testing...");
    }
}
`;
}

/* ─── Types ───────────────────────────────────────────────────── */
interface AttemptRecord {
  id: string;
  timestamp: number;
  language: 'python' | 'cpp' | 'java';
  status: 'accepted' | 'error';
  output: string;
  executionTimeMs?: number;
}

interface RunResult {
  stdout?: string;
  stderr?: string;
  error?: string;
  exit_code?: number;
  execution_time_ms?: number;
}

interface Props {
  question: DSAQuestion;
  onMarkSolved: (id: string) => void;
  isSolved: boolean;
  onAddMistake: (id: string) => void;
}

const LANG_LABELS: Record<'python' | 'cpp' | 'java', string> = {
  python: 'Python 3',
  cpp: 'C++ (STL)',
  java: 'Java 17',
};

const MONACO_LANG: Record<'python' | 'cpp' | 'java', string> = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
};

/* ─── Main Component ──────────────────────────────────────────── */
export const DSACodingIDE: React.FC<Props> = ({
  question: q,
  onMarkSolved,
  isSolved,
  onAddMistake,
}) => {
  const storageKey = `akku_ide_code_${q.id}`;

  /* Persisted per-language code */
  const loadSavedCode = useCallback(
    (lang: 'python' | 'cpp' | 'java'): string => {
      try {
        const saved = localStorage.getItem(`${storageKey}_${lang}`);
        if (saved) return saved;
      } catch {}
      if (lang === 'python') return generatePythonStarter(q);
      if (lang === 'cpp') return generateCppStarter(q);
      return generateJavaStarter(q);
    },
    [q, storageKey]
  );

  const [lang, setLang] = useState<'python' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState<string>(() => loadSavedCode('python'));

  /* IDE state */
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'accepted' | 'error'>('idle');
  const [submitMsg, setSubmitMsg] = useState('');

  /* Hint state */
  const [hintStep, setHintStep] = useState(0);
  const [showHintPanel, setShowHintPanel] = useState(false);

  /* I'm Stuck state */
  const [stuckStep, setStuckStep] = useState(1);
  const [showStuck, setShowStuck] = useState(false);

  /* Reveal Solution modal */
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [revealLang, setRevealLang] = useState<'python' | 'cpp' | 'java'>('python');

  /* Approach panel */
  const [showApproach, setShowApproach] = useState(false);

  /* Attempt history */
  const [attempts, setAttempts] = useState<AttemptRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_attempts`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [showHistory, setShowHistory] = useState(false);

  /* Custom test input */
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  /* Save code on change */
  const handleCodeChange = useCallback(
    (val: string | undefined) => {
      const v = val ?? '';
      setCode(v);
      try { localStorage.setItem(`${storageKey}_${lang}`, v); } catch {}
    },
    [lang, storageKey]
  );

  /* Language switch — save current, load new */
  const handleLangSwitch = (newLang: 'python' | 'cpp' | 'java') => {
    try { localStorage.setItem(`${storageKey}_${lang}`, code); } catch {}
    setLang(newLang);
    setCode(loadSavedCode(newLang));
    setRunResult(null);
    setSubmitStatus('idle');
  };

  /* Reset to starter */
  const handleReset = () => {
    const starter = lang === 'python'
      ? generatePythonStarter(q)
      : lang === 'cpp'
      ? generateCppStarter(q)
      : generateJavaStarter(q);
    setCode(starter);
    try { localStorage.setItem(`${storageKey}_${lang}`, starter); } catch {}
    setRunResult(null);
    setSubmitStatus('idle');
  };

  /* Run code */
  const handleRun = async () => {
    if (lang !== 'python') {
      setRunResult({ error: 'Live execution is supported for Python 3 only. Copy your C++/Java code and test it on LeetCode or GFG.' });
      return;
    }
    setIsRunning(true);
    setRunResult(null);
    setSubmitStatus('idle');
    try {
      const res = await api.academics.runCode(code, customInput, undefined, 10.0);
      setRunResult(res);
    } catch (err: any) {
      setRunResult({ error: err.message || 'Execution failed. Check backend.' });
    } finally {
      setIsRunning(false);
    }
  };

  /* Submit / Evaluate */
  const handleSubmit = async () => {
    if (lang !== 'python') {
      setSubmitMsg('Submit is supported for Python 3 only. Use LeetCode or GFG for C++/Java.');
      setSubmitStatus('error');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMsg('');
    try {
      const res = await api.academics.runCode(code, '', undefined, 15.0);
      const isOk = res.exit_code === 0 && !res.error;
      setSubmitStatus(isOk ? 'accepted' : 'error');
      setSubmitMsg(
        isOk
          ? '\u2705 Code executed successfully! Review the output and mark as solved if correct.'
          : `\u274C Execution failed. ${res.stderr || res.error || 'Check your code logic.'}`
      );
      const attempt: AttemptRecord = {
        id: `${Date.now()}`,
        timestamp: Date.now(),
        language: lang,
        status: isOk ? 'accepted' : 'error',
        output: res.stdout || res.stderr || res.error || '',
        executionTimeMs: res.execution_time_ms,
      };
      const updated = [attempt, ...attempts].slice(0, 10);
      setAttempts(updated);
      try { localStorage.setItem(`${storageKey}_attempts`, JSON.stringify(updated)); } catch {}
      if (!isOk) onAddMistake(q.id);
      if (isOk) onMarkSolved(q.id);
    } catch (err: any) {
      setSubmitStatus('error');
      setSubmitMsg(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReveal = () => {
    setSolutionRevealed(true);
    setShowRevealModal(false);
  };

  const getSolutionText = () => {
    if (revealLang === 'python') return q.pythonSolution;
    if (revealLang === 'cpp') return q.cppSolution;
    return q.javaSolution;
  };

  const diffBadge = (d: string) =>
    d === 'Easy'
      ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
      : d === 'Medium'
      ? 'text-sky-300 bg-sky-500/15 border-sky-500/30'
      : 'text-rose-300 bg-rose-500/15 border-rose-500/30';

  return (
    <div className="flex flex-col rounded-2xl border border-sky-800/40 overflow-hidden bg-[#090d14] shadow-2xl text-stone-200">
      {/* ── IDE Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1321] border-b border-sky-900/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-sky-300 font-semibold">DSA IDE</span>
            <span className="text-stone-600">•</span>
            <span className="truncate max-w-[200px]">{q.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSolved && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              <Trophy className="w-3 h-3" /> Solved
            </span>
          )}
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold font-mono ${diffBadge(q.difficulty)}`}>
            {q.difficulty}
          </span>
          <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" /> {q.expectedTime}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ── Left: Problem Panel ── */}
        <div className="lg:w-[42%] flex flex-col border-b lg:border-b-0 lg:border-r border-stone-800/60 overflow-y-auto" style={{maxHeight: '600px'}}>
          {/* Problem description */}
          <div className="p-4 border-b border-stone-800/60 bg-[#0b101a]">
            <div className="flex flex-wrap gap-1.5 mb-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40">{q.topic}</span>
              <span className="px-2 py-0.5 rounded bg-sky-950/40 text-sky-300 border border-sky-800/40">{q.pattern}</span>
              <span className="px-2 py-0.5 rounded bg-[#161b22] text-stone-400 border border-stone-800">{q.timeComplexity} time</span>
              <span className="px-2 py-0.5 rounded bg-[#161b22] text-stone-400 border border-stone-800">{q.spaceComplexity} space</span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug mb-2">{q.title}</h3>
            <p className="text-xs text-stone-300 whitespace-pre-wrap leading-relaxed">{q.description}</p>
            <a href={q.platformUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[11px] text-sky-400 hover:text-sky-300 transition-colors">
              Open on {q.platform} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Approach Breakdown */}
          <div className="border-b border-stone-800/60">
            <button onClick={() => setShowApproach(!showApproach)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800/20 transition-colors cursor-pointer">
              <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-emerald-400" />Approach Breakdown</span>
              {showApproach ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showApproach && (
              <div className="px-4 pb-3 flex flex-col gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40">
                  <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">Brute Force</span>
                  <p className="text-stone-300 leading-snug">{q.bruteForce}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Better Approach</span>
                  <p className="text-stone-300 leading-snug">{q.betterApproach}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Optimal</span>
                  <p className="text-stone-300 leading-snug">{q.optimalApproach}</p>
                </div>
              </div>
            )}
          </div>

          {/* Progressive Hints */}
          <div className="border-b border-stone-800/60">
            <div className="flex items-center justify-between px-4 py-2.5">
              <button onClick={() => setShowHintPanel(!showHintPanel)}
                className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">
                <Lightbulb className="w-3.5 h-3.5" />Hints ({hintStep}/{q.hints.length})
              </button>
              {showHintPanel && hintStep < q.hints.length && (
                <button onClick={() => setHintStep(s => Math.min(q.hints.length, s + 1))}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-600/20 border border-amber-600/30 text-amber-300 hover:bg-amber-600/30 transition-colors cursor-pointer font-semibold">
                  Next Hint →
                </button>
              )}
            </div>
            {showHintPanel && (
              <div className="px-4 pb-3 flex flex-col gap-1.5">
                {hintStep === 0 ? (
                  <button onClick={() => setHintStep(1)}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-600/20 border border-amber-600/30 text-amber-300 hover:bg-amber-600/30 transition-colors cursor-pointer font-semibold w-fit">
                    Show First Hint 💡
                  </button>
                ) : (
                  q.hints.slice(0, hintStep).map((h, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-amber-200 text-xs flex items-start gap-2">
                      <span className="font-bold text-amber-400 shrink-0 font-mono text-[10px] mt-0.5">H{i + 1}</span>
                      <span>{h}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* I'm Stuck — Socratic Mode */}
          <div className="border-b border-stone-800/60">
            <button onClick={() => { setShowStuck(!showStuck); if (!showStuck) setStuckStep(1); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-900/10 transition-colors cursor-pointer">
              <BrainCircuit className="w-3.5 h-3.5" />
              I'm Stuck — Socratic Guide
              {showStuck ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
            </button>
            {showStuck && (
              <div className="px-4 pb-3 flex flex-col gap-2 text-xs">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map(step => (
                    <button key={step} onClick={() => setStuckStep(step)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${stuckStep === step ? 'bg-purple-600 text-white' : 'bg-[#161c28] text-stone-400 hover:text-stone-200'}`}>
                      Step {step}
                    </button>
                  ))}
                </div>
                {stuckStep === 1 && (
                  <div className="p-2.5 rounded-lg bg-purple-950/25 border border-purple-900/50 space-y-1.5">
                    <p className="font-semibold text-purple-300">Step 1: Brute Force Understanding</p>
                    <p className="text-stone-400 text-[11px]">Before writing efficient code, why is brute-force too slow for this problem?</p>
                    <div className="p-2 rounded bg-[#0c0917] border border-purple-900/40 font-mono text-purple-200 text-[11px]">{q.bruteForce}</div>
                  </div>
                )}
                {stuckStep === 2 && (
                  <div className="p-2.5 rounded-lg bg-purple-950/25 border border-purple-900/50 space-y-1.5">
                    <p className="font-semibold text-purple-300">Step 2: Pattern Recognition</p>
                    <p className="text-stone-400 text-[11px]">The pattern is <strong className="text-purple-300">{q.pattern}</strong>. Can you implement it?</p>
                    <div className="p-2 rounded bg-[#0c0917] border border-purple-900/40 font-mono text-purple-200 text-[11px]">{q.betterApproach}</div>
                  </div>
                )}
                {stuckStep === 3 && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/25 border border-emerald-900/50 space-y-1.5">
                    <p className="font-semibold text-emerald-300">Step 3: Optimal Approach</p>
                    <p className="text-stone-400 text-[11px]">Here is the senior engineer approach. Now implement it yourself:</p>
                    <div className="p-2 rounded bg-[#071009] border border-emerald-900/40 font-mono text-emerald-200 text-[11px]">{q.optimalApproach}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interview Follow-ups */}
          {q.interviewQuestions && q.interviewQuestions.length > 0 && (
            <div className="px-4 py-3">
              <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Interviewer Follow-ups
              </p>
              <ul className="space-y-1 text-[11px] text-stone-300">
                {q.interviewQuestions.map((iq, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-500 mt-0.5">›</span>
                    <span>{iq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Right: Code Editor ── */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#0d1321] border-b border-stone-800/60">
            <div className="flex items-center gap-1">
              {(['python', 'cpp', 'java'] as const).map(l => (
                <button key={l} onClick={() => handleLangSwitch(l)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    lang === l
                      ? l === 'python' ? 'bg-emerald-600 text-white shadow-sm' : l === 'cpp' ? 'bg-sky-600 text-white shadow-sm' : 'bg-purple-600 text-white shadow-sm'
                      : 'bg-[#161c28] text-stone-400 hover:text-stone-200'
                  }`}>
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={handleReset} title="Reset to starter template"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800/40 transition-colors cursor-pointer">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setShowHistory(!showHistory)} title="Attempt history"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800/40 transition-colors cursor-pointer">
                <History className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setShowCustomInput(!showCustomInput)} title="Custom test input"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800/40 transition-colors cursor-pointer">
                <Terminal className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleRun} disabled={isRunning}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-sm transition-all cursor-pointer">
                <Play className="w-3 h-3 fill-current" />
                {isRunning ? 'Running…' : 'Run'}
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-sm transition-all cursor-pointer">
                <Send className="w-3 h-3" />
                {isSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Custom Input */}
          {showCustomInput && (
            <div className="px-3 py-2 border-b border-stone-800/60 bg-[#0b1018]">
              <p className="text-[10px] text-stone-400 mb-1 font-mono">Custom stdin:</p>
              <textarea value={customInput} onChange={e => setCustomInput(e.target.value)} rows={2}
                placeholder="e.g.  5&#10;1 2 3 4 5"
                className="w-full bg-[#161b22] border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-200 placeholder-stone-600 focus:outline-none focus:border-sky-500 resize-none" />
            </div>
          )}

          {/* Attempt History */}
          {showHistory && (
            <div className="px-3 py-2 border-b border-stone-800/60 bg-[#0b1018] max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-stone-300 uppercase tracking-wide">Attempt History ({attempts.length})</p>
                <button onClick={() => setShowHistory(false)} className="text-stone-500 hover:text-stone-200 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              {attempts.length === 0 ? (
                <p className="text-[11px] text-stone-500">No attempts yet. Submit your code to start tracking.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {attempts.map(a => (
                    <div key={a.id} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] ${a.status === 'accepted' ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-rose-950/20 border-rose-900/40'}`}>
                      {a.status === 'accepted' ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : <XCircle className="w-3 h-3 text-rose-400 shrink-0" />}
                      <span className="text-stone-400 font-mono">{LANG_LABELS[a.language]}</span>
                      <span className={a.status === 'accepted' ? 'text-emerald-300' : 'text-rose-300'}>{a.status === 'accepted' ? 'Accepted' : 'Failed'}</span>
                      {a.executionTimeMs !== undefined && <span className="text-stone-500 font-mono ml-auto">{a.executionTimeMs}ms</span>}
                      <span className="text-stone-600">{new Date(a.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Monaco Editor */}
          <div style={{minHeight: '280px', flex: 1}}>
            <Editor
              height="320px"
              language={MONACO_LANG[lang]}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 4,
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                folding: true,
                padding: { top: 10, bottom: 10 },
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="border-t border-stone-800/60 min-h-[70px] max-h-[180px] overflow-y-auto">
            {submitStatus !== 'idle' && (
              <div className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b border-stone-800/60 ${submitStatus === 'accepted' ? 'bg-emerald-950/40 text-emerald-300' : 'bg-rose-950/40 text-rose-300'}`}>
                {submitStatus === 'accepted' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span>{submitMsg}</span>
                {submitStatus === 'accepted' && !isSolved && (
                  <button onClick={() => onMarkSolved(q.id)}
                    className="ml-auto px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs cursor-pointer font-semibold">
                    Mark Solved
                  </button>
                )}
              </div>
            )}
            {runResult && (
              <div className="p-3 font-mono text-xs bg-[#050709]">
                <div className="flex items-center justify-between text-stone-500 text-[10px] border-b border-stone-800/60 pb-1.5 mb-1.5">
                  <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-emerald-400" />Console Output</span>
                  {runResult.execution_time_ms !== undefined && <span className="text-emerald-400 font-semibold">{runResult.execution_time_ms}ms</span>}
                </div>
                {runResult.stdout && <pre className="text-stone-200 whitespace-pre-wrap text-[11px] leading-relaxed">{runResult.stdout}</pre>}
                {runResult.stderr && <pre className="text-amber-400 whitespace-pre-wrap text-[11px]">{runResult.stderr}</pre>}
                {runResult.error && <pre className="text-rose-400 whitespace-pre-wrap text-[11px]">{runResult.error}</pre>}
                {!runResult.stdout && !runResult.stderr && !runResult.error && <span className="text-stone-500 italic text-[11px]">No output produced.</span>}
              </div>
            )}
            {!runResult && submitStatus === 'idle' && (
              <div className="flex items-center justify-center h-16 text-stone-600 text-xs font-mono">
                Press Run to execute • Submit to evaluate
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-stone-800/60 bg-[#0b101a] text-xs">
            <div className="flex items-center gap-2">
              <button onClick={() => onMarkSolved(q.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSolved ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/30' : 'bg-stone-800/60 text-stone-400 hover:text-stone-200 border border-stone-700'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isSolved ? 'Solved ✓' : 'Mark Solved'}
              </button>
              {!solutionRevealed ? (
                <button onClick={() => setShowRevealModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/60 text-stone-400 hover:text-amber-300 hover:bg-amber-900/20 border border-stone-700 hover:border-amber-700/40 text-xs font-semibold transition-all cursor-pointer">
                  <Eye className="w-3.5 h-3.5" />Reveal Solution
                </button>
              ) : (
                <button onClick={() => setSolutionRevealed(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/20 text-amber-300 border border-amber-700/40 text-xs font-semibold transition-all cursor-pointer">
                  <EyeOff className="w-3.5 h-3.5" />Hide Solution
                </button>
              )}
            </div>
            <a href={q.platformUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors">
              {q.platform} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Revealed Solution Panel ── */}
      {solutionRevealed && (
        <div className="border-t border-amber-800/40 bg-[#0c0a00]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-amber-900/40">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Official Solution — Study, don't just copy!
            </div>
            <div className="flex items-center gap-1">
              {(['python', 'cpp', 'java'] as const).map(l => (
                <button key={l} onClick={() => setRevealLang(l)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold cursor-pointer transition-colors ${revealLang === l ? 'bg-amber-600 text-white' : 'bg-[#161c28] text-stone-400 hover:text-stone-200'}`}>
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          </div>
          <pre className="p-4 font-mono text-xs text-amber-100/80 overflow-x-auto whitespace-pre leading-relaxed max-h-64 overflow-y-auto">
            {getSolutionText()}
          </pre>
        </div>
      )}

      {/* ── Reveal Confirmation Modal ── */}
      {showRevealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1321] border border-amber-700/50 rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Reveal Solution?</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">This will show the complete solution. Try solving it yourself first!</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200">
              💡 <strong>Tip:</strong> Try the "I'm Stuck" Socratic guide first — real interviews won't give you the answer!
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowRevealModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#161b22] border border-stone-700 text-stone-300 hover:text-white text-sm font-semibold cursor-pointer transition-colors">
                Keep Trying
              </button>
              <button onClick={handleConfirmReveal}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold cursor-pointer transition-colors">
                Show Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
