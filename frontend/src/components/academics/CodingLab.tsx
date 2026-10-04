import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Send, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  FileCode,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Layers,
  Code2
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { api } from '../../services/api';
import type { CodingExercise, DayLesson } from '../../types/academics';
import { getEnrichedExercise } from '../../data/academics/academicPedagogy';
import { InteractiveDryRunModal } from './InteractiveDryRunModal';
import { PracticeGuidanceModal, type GuidanceModalType } from './PracticeGuidanceModal';
import { useAcademicsTheme } from '../../context/AcademicsThemeContext';

interface CodingLabProps {
  exercise: CodingExercise;
  onSuccess?: () => void;
  dayNumber?: number;
  lesson?: DayLesson;
}

export const CodingLab: React.FC<CodingLabProps> = ({
  exercise: rawExercise,
  onSuccess,
  dayNumber = 1,
  lesson
}) => {
  const { isDark } = useAcademicsTheme();

  // Enrich exercise with complete pedagogical breakdowns
  const exercise = useMemo(() => {
    const mockLesson: DayLesson = lesson || {
      id: `day_${dayNumber}`,
      dayNumber,
      subject: 'Python & Data Engineering',
      moduleTitle: 'Placement Preparation',
      title: rawExercise.title,
      description: rawExercise.problemStatement,
      durationMinutes: 15,
      difficulty: 'Beginner',
      learningObjectives: [],
      prerequisites: [],
      learnContent: '',
      examples: [],
      practiceExercise: rawExercise,
      mcqs: [],
      interviewQuestions: [],
      cheatSheet: { summary: '', definitions: [], syntaxSnippets: [], commonMistakes: [], interviewTips: [] },
      docLinks: []
    };
    return getEnrichedExercise(rawExercise, mockLesson);
  }, [rawExercise, lesson, dayNumber]);

  const [code, setCode] = useState(exercise.starterCode);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp' | 'java'>('python');
  const [customStdin, setCustomStdin] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runMode, setRunMode] = useState<'sample' | 'submit'>('sample');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'testcases' | 'output' | 'custom_input' | 'approaches'>('testcases');
  const [selectedApproachTab, setSelectedApproachTab] = useState<'brute_force' | 'optimal'>('optimal');

  // Modals state
  const [guidanceModal, setGuidanceModal] = useState<{ open: boolean; type: GuidanceModalType }>({
    open: false,
    type: 'dont_understand'
  });
  const [dryRunOpen, setDryRunOpen] = useState(false);
  const [showPseudocode, setShowPseudocode] = useState(false);

  useEffect(() => {
    setCode(exercise.starterCode);
    setExecutionResult(null);
    setRevealedHintIndex(-1);
    setShowSolution(false);
    setShowPseudocode(false);
  }, [exercise.id]);

  const handleLanguageChange = (lang: 'python' | 'cpp' | 'java') => {
    setSelectedLanguage(lang);
    if (lang === 'cpp') {
      setCode(`// C++ Solution for: ${exercise.title}\n#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    // Implement optimal approach\n    cout << "Testing C++ execution" << endl;\n    return 0;\n}`);
    } else if (lang === 'java') {
      setCode(`// Java Solution for: ${exercise.title}\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Implement optimal approach\n        System.out.println("Testing Java execution");\n    }\n}`);
    } else {
      setCode(exercise.starterCode);
    }
  };

  const handleRunCode = async (mode: 'sample' | 'submit') => {
    setRunMode(mode);
    setIsRunning(true);
    setActiveBottomTab('output');

    const testCasesToSend = mode === 'submit' 
      ? exercise.testCases 
      : (exercise.testCases ? [exercise.testCases[0]] : undefined);

    try {
      const res = await api.academics.runCode(
        code,
        customStdin,
        testCasesToSend,
        5.0
      );

      setExecutionResult(res);

      if (mode === 'submit' && res.all_passed) {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setExecutionResult({
        success: false,
        error: err.message || 'Execution failed.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
      {/* Left Column: Problem Breakdown, Thinking Framework & Hints (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        {/* Main Problem Card */}
        <div className={`p-4 rounded-xl border flex flex-col gap-3 shadow-md ${
          isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          {/* Header Title & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 border-stone-800/80">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>{exercise.title}</span>
            </h3>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                🟢 Beginner Friendly
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30">
                ⏱ ~{exercise.estimatedMinutes || 15} mins
              </span>
            </div>
          </div>

          {/* Goal & Scenario Alert */}
          {exercise.goal && (
            <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
              isDark ? 'bg-[#121927] border-sky-900/50 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}>
              <strong className="text-sky-400 font-bold block mb-0.5">🎯 What are we trying to do?</strong>
              <span>{exercise.goal}</span>
            </div>
          )}

          {/* Problem Statement */}
          <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {exercise.problemStatement}
          </div>

          {/* Input & Output Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded-lg border ${
              isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                📥 Input Format:
              </div>
              <div className="font-mono text-[11px] opacity-90">
                {exercise.sampleInputExplanation || exercise.inputFormat || 'Dictionary or List'}
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                📤 Output Format:
              </div>
              <div className="font-mono text-[11px] opacity-90">
                {exercise.sampleOutputExplanation || exercise.outputFormat || 'Cleaned output'}
              </div>
            </div>
          </div>

          {/* Concrete Sample Example */}
          <div className={`p-2.5 rounded-lg border text-xs font-mono ${
            isDark ? 'bg-[#0a0d14] border-stone-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className="text-[10px] font-sans font-bold uppercase text-amber-400 block mb-1">
              🔍 Example Walkthrough:
            </span>
            <div className="space-y-1">
              <div><span className="text-stone-400">Input:  </span><span className="text-stone-200 font-semibold">{exercise.sampleExampleInput}</span></div>
              <div><span className="text-stone-400">Output: </span><span className="text-emerald-400 font-semibold">{exercise.sampleExampleOutput}</span></div>
            </div>
          </div>

          {/* Pedagogical Help Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setGuidanceModal({ open: true, type: 'dont_understand' })}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50' 
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>❓ I Don't Understand</span>
            </button>

            <button
              onClick={() => setGuidanceModal({ open: true, type: 'how_to_think' })}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:bg-purple-900/50' 
                  : 'bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>🧠 How Should I Think?</span>
            </button>

            <button
              onClick={() => setDryRunOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>▶ Dry Run</span>
            </button>

            <button
              onClick={() => setGuidanceModal({ open: true, type: 'another_example' })}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#161f30] border-sky-800/50 text-sky-300 hover:bg-[#1f2b42]'
                  : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>👀 Another Example</span>
            </button>
          </div>

          {/* Pseudocode Accordion */}
          <div className="pt-2 border-t border-stone-800/80">
            <button
              onClick={() => setShowPseudocode(!showPseudocode)}
              className="w-full flex items-center justify-between text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>📝 Algorithmic Pseudocode (Step-by-Step)</span>
              </span>
              {showPseudocode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showPseudocode && (
              <pre className={`mt-2 p-3 rounded-lg border font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed ${
                isDark ? 'bg-[#06080e] border-stone-800 text-sky-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                {exercise.pseudocode}
              </pre>
            )}
          </div>

          {/* Progressive 4-Tier Hints */}
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="pt-2 border-t border-stone-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Progressive Hints ({exercise.hints.length})</span>
                </span>
                {revealedHintIndex < exercise.hints.length - 1 && (
                  <button
                    onClick={() => setRevealedHintIndex(prev => prev + 1)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                  >
                    Unlock Hint {revealedHintIndex + 2} / {exercise.hints.length} →
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {exercise.hints.slice(0, revealedHintIndex + 1).map((h, i) => (
                  <div key={i} className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                    isDark ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <span className="font-bold mr-1.5 text-amber-400">
                      {i === 0 ? '💡 Hint 1 (Concept):' : i === 1 ? '💡 Hint 2 (Approach):' : i === 2 ? '💡 Hint 3 (Pseudocode):' : '💡 Hint 4 (Edge Cases):'}
                    </span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reveal Solution Button */}
          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                if (!showSolution && !window.confirm('Attempting the problem first provides the best placement interview retention! Are you sure you want to reveal the model solution?')) {
                  return;
                }
                setShowSolution(!showSolution);
              }}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer font-medium"
            >
              {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSolution ? 'Hide Model Solution' : 'Reveal Model Solution'}</span>
            </button>
          </div>

          {showSolution && (
            <div className={`mt-1 p-3 rounded-xl border ${
              isDark ? 'bg-[#080c14] border-emerald-900/60' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                Placement Model Solution:
              </div>
              <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {exercise.solutionCode}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Code Editor & Console Output (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        {/* Editor with Multi-Language Selector */}
        <div className="flex flex-col gap-2">
          {/* Language selector bar */}
          <div className={`p-2 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-stone-400 font-medium px-2">Language:</span>
              <button
                onClick={() => handleLanguageChange('python')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedLanguage === 'python'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => handleLanguageChange('cpp')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedLanguage === 'cpp'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                C++
              </button>
              <button
                onClick={() => handleLanguageChange('java')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedLanguage === 'java'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Java
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRunCode('sample')}
                disabled={isRunning}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer border border-stone-700"
              >
                <Play className="w-3 h-3 fill-current text-sky-400" />
                <span>Run Sample</span>
              </button>

              <button
                onClick={() => handleRunCode('submit')}
                disabled={isRunning}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Submit Code</span>
              </button>
            </div>
          </div>

          {/* Actual Code Editor */}
          <CodeEditor
            value={code}
            onChange={setCode}
            language={exercise.language}
            onRun={() => handleRunCode('sample')}
            isRunning={isRunning && runMode === 'sample'}
            onReset={() => setCode(exercise.starterCode)}
            minHeight="320px"
            showRunButton={false}
          />
        </div>

        {/* Bottom Panel (Test Cases / Output / Custom Input / Approaches) */}
        <div className={`rounded-xl border overflow-hidden flex flex-col ${
          isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex flex-wrap items-center justify-between px-3 py-2 border-b text-xs ${
            isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveBottomTab('testcases')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeBottomTab === 'testcases'
                    ? isDark ? 'bg-stone-800 text-white' : 'bg-white text-slate-800 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Test Cases ({exercise.testCases?.length || 0})
              </button>

              <button
                onClick={() => setActiveBottomTab('output')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeBottomTab === 'output'
                    ? isDark ? 'bg-stone-800 text-white' : 'bg-white text-slate-800 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Console Output</span>
                {executionResult && (
                  <span className={`w-2 h-2 rounded-full ${executionResult.all_passed || executionResult.success ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                )}
              </button>

              <button
                onClick={() => setActiveBottomTab('approaches')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeBottomTab === 'approaches'
                    ? isDark ? 'bg-stone-800 text-white' : 'bg-white text-slate-800 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Layers className="w-3 h-3 text-purple-400" />
                <span>Approaches & Big-O</span>
              </button>

              <button
                onClick={() => setActiveBottomTab('custom_input')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeBottomTab === 'custom_input'
                    ? isDark ? 'bg-stone-800 text-white' : 'bg-white text-slate-800 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Custom Stdin
              </button>
            </div>

            {executionResult && executionResult.execution_time_ms !== undefined && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                <Clock className="w-3 h-3 text-sky-400" />
                <span>{executionResult.execution_time_ms} ms</span>
              </div>
            )}
          </div>

          {/* Panel Content */}
          <div className="p-3 max-h-60 overflow-y-auto text-xs font-mono">
            {activeBottomTab === 'testcases' && (
              <div className="space-y-2">
                {exercise.testCases && exercise.testCases.length > 0 ? (
                  exercise.testCases.map((tc, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
                      isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-400 font-semibold">Test Case #{idx + 1} {tc.hidden && '(Hidden)'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase font-sans font-bold">Input:</div>
                          <div className="text-stone-200 bg-black/40 p-1.5 rounded">{tc.input || '(empty)'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase font-sans font-bold">Expected Output:</div>
                          <div className="text-emerald-300 bg-black/40 p-1.5 rounded">{tc.expected_output}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-stone-500 text-center py-4 font-sans">No specific test cases required. Output will be verified directly.</div>
                )}
              </div>
            )}

            {activeBottomTab === 'output' && (
              <div>
                {isRunning ? (
                  <div className="py-6 text-center text-amber-400 flex items-center justify-center gap-2 font-sans">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Executing code in isolated sandbox...</span>
                  </div>
                ) : executionResult ? (
                  <div className="space-y-2">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between font-sans">
                      <div className="flex items-center gap-1.5">
                        {executionResult.all_passed ? (
                          <div className="flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted — All Test Cases Passed! 🎉</span>
                          </div>
                        ) : executionResult.success ? (
                          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Execution Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-rose-400 font-semibold">
                            <XCircle className="w-4 h-4" />
                            <span>Execution Error / Assertion Mismatch</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stdout Console */}
                    {executionResult.stdout && (
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-1 font-sans font-bold">Standard Output:</div>
                        <pre className="p-2.5 rounded bg-black/40 text-stone-200 whitespace-pre-wrap border border-stone-800">
                          {executionResult.stdout}
                        </pre>
                      </div>
                    )}

                    {/* Stderr / Error */}
                    {executionResult.stderr && (
                      <div>
                        <div className="text-[10px] text-rose-400 uppercase tracking-wider mb-1 font-sans font-bold">Standard Error:</div>
                        <pre className="p-2.5 rounded bg-rose-950/40 text-rose-300 whitespace-pre-wrap border border-rose-800/40">
                          {executionResult.stderr}
                        </pre>
                      </div>
                    )}

                    {executionResult.error && (
                      <div className="p-2.5 rounded bg-rose-950/40 text-rose-300 whitespace-pre-wrap border border-rose-800/40">
                        {executionResult.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-stone-500 text-center py-6 font-sans text-xs">
                    Hit "Run Sample" or "Submit Solution" to inspect compiler output and assertions.
                  </div>
                )}
              </div>
            )}

            {activeBottomTab === 'approaches' && (
              <div className="space-y-3 font-sans">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <button
                    onClick={() => setSelectedApproachTab('optimal')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedApproachTab === 'optimal' ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Optimal Production Approach
                  </button>
                  <button
                    onClick={() => setSelectedApproachTab('brute_force')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedApproachTab === 'brute_force' ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Direct / Brute Force Approach
                  </button>
                </div>

                {selectedApproachTab === 'optimal' && exercise.optimalApproach && (
                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-emerald-400">{exercise.optimalApproach.title}</h5>
                    <p className="text-stone-300 leading-relaxed">{exercise.optimalApproach.explanation}</p>
                    <div className="flex gap-4 text-xs font-mono text-purple-300">
                      <span>Time: <strong>{exercise.optimalApproach.timeComplexity}</strong></span>
                      <span>Space: <strong>{exercise.optimalApproach.spaceComplexity}</strong></span>
                    </div>
                  </div>
                )}

                {selectedApproachTab === 'brute_force' && exercise.bruteForceApproach && (
                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-amber-400">{exercise.bruteForceApproach.title}</h5>
                    <p className="text-stone-300 leading-relaxed">{exercise.bruteForceApproach.explanation}</p>
                    <div className="flex gap-4 text-xs font-mono text-amber-300">
                      <span>Time: <strong>{exercise.bruteForceApproach.timeComplexity}</strong></span>
                      <span>Space: <strong>{exercise.bruteForceApproach.spaceComplexity}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeBottomTab === 'custom_input' && (
              <div>
                <textarea
                  value={customStdin}
                  onChange={(e) => setCustomStdin(e.target.value)}
                  placeholder="Enter custom stdin string to feed your solution..."
                  rows={4}
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-stone-800 text-stone-200 text-xs font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PracticeGuidanceModal
        isOpen={guidanceModal.open}
        onClose={() => setGuidanceModal({ open: false, type: 'dont_understand' })}
        type={guidanceModal.type}
        exercise={exercise}
        isDark={isDark}
      />

      <InteractiveDryRunModal
        isOpen={dryRunOpen}
        onClose={() => setDryRunOpen(false)}
        title={exercise.title}
        steps={exercise.dryRunSteps || []}
        isDark={isDark}
      />
    </div>
  );
};
