import React, { useState, useEffect } from 'react';
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
  FileCode
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { api } from '../../services/api';
import type { CodingExercise } from '../../types/academics';

interface CodingLabProps {
  exercise: CodingExercise;
  onSuccess?: () => void;
  dayNumber?: number;
}

export const CodingLab: React.FC<CodingLabProps> = ({
  exercise,
  onSuccess
}) => {
  const [code, setCode] = useState(exercise.starterCode);
  const [customStdin, setCustomStdin] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runMode, setRunMode] = useState<'sample' | 'submit'>('sample');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'testcases' | 'output' | 'custom_input'>('testcases');

  useEffect(() => {
    setCode(exercise.starterCode);
    setExecutionResult(null);
    setRevealedHintIndex(-1);
    setShowSolution(false);
  }, [exercise.id]);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-stone-200">
      {/* Left Column: Problem Statement & Hints (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0d1117] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="font-semibold text-base text-stone-100 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>{exercise.title}</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {exercise.language.toUpperCase()}
            </span>
          </div>

          <div className="text-xs text-stone-300 leading-relaxed whitespace-pre-wrap font-sans">
            {exercise.problemStatement}
          </div>

          {exercise.inputFormat && (
            <div className="bg-[#161b22] p-2.5 rounded-lg border border-stone-800 text-xs">
              <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Input Format:
              </div>
              <div className="text-stone-300 font-mono text-[11px]">{exercise.inputFormat}</div>
            </div>
          )}

          {exercise.outputFormat && (
            <div className="bg-[#161b22] p-2.5 rounded-lg border border-stone-800 text-xs">
              <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Output Format:
              </div>
              <div className="text-stone-300 font-mono text-[11px]">{exercise.outputFormat}</div>
            </div>
          )}

          {exercise.constraints && exercise.constraints.length > 0 && (
            <div className="text-xs">
              <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Constraints & Complexity:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-stone-400 font-mono text-[11px]">
                {exercise.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
                {exercise.timeComplexity && <li>Expected Time: {exercise.timeComplexity}</li>}
                {exercise.spaceComplexity && <li>Expected Space: {exercise.spaceComplexity}</li>}
              </ul>
            </div>
          )}

          {/* Progressive Hints Section */}
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="mt-2 pt-2 border-t border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Hints ({exercise.hints.length})
                </span>
                {revealedHintIndex < exercise.hints.length - 1 && (
                  <button
                    onClick={() => setRevealedHintIndex(prev => prev + 1)}
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 underline cursor-pointer"
                  >
                    Unlock next hint ({revealedHintIndex + 2}/{exercise.hints.length})
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {exercise.hints.slice(0, revealedHintIndex + 1).map((h, i) => (
                  <div key={i} className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
                    <span className="font-semibold mr-1.5">Hint {i + 1}:</span>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reveal Solution Button */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (!showSolution && !window.confirm('Attempting the problem first yields the best placement learning! Are you sure you want to reveal the model solution?')) {
                  return;
                }
                setShowSolution(!showSolution);
              }}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            >
              {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSolution ? 'Hide Model Solution' : 'Reveal Model Solution'}</span>
            </button>
          </div>

          {showSolution && (
            <div className="mt-1 p-3 rounded-lg bg-[#161b22] border border-stone-700">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                Reference Placement Solution:
              </div>
              <pre className="text-xs font-mono text-emerald-200 overflow-x-auto whitespace-pre-wrap">
                {exercise.solutionCode}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Code Editor & Console Output (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        {/* Editor */}
        <CodeEditor
          value={code}
          onChange={setCode}
          language={exercise.language}
          onRun={() => handleRunCode('sample')}
          isRunning={isRunning && runMode === 'sample'}
          onReset={() => setCode(exercise.starterCode)}
          minHeight="300px"
          showRunButton={false}
          headerAction={
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleRunCode('sample')}
                disabled={isRunning}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                title="Run code against sample test cases"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run Sample</span>
              </button>

              <button
                onClick={() => handleRunCode('submit')}
                disabled={isRunning}
                className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                title="Submit solution against all test cases"
              >
                <Send className="w-3 h-3" />
                <span>Submit Solution</span>
              </button>
            </div>
          }
        />

        {/* Bottom Tab Bar (Test Cases / Output / Custom Input) */}
        <div className="rounded-xl border border-stone-800 bg-[#0d1117] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-stone-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveBottomTab('testcases')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeBottomTab === 'testcases' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Test Cases ({exercise.testCases?.length || 0})
              </button>

              <button
                onClick={() => setActiveBottomTab('output')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeBottomTab === 'output' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Execution Console</span>
                {executionResult && (
                  <span className={`w-2 h-2 rounded-full ${executionResult.all_passed || executionResult.success ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                )}
              </button>

              <button
                onClick={() => setActiveBottomTab('custom_input')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeBottomTab === 'custom_input' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
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

          {/* Bottom Panel Content */}
          <div className="p-3 max-h-56 overflow-y-auto text-xs font-mono">
            {activeBottomTab === 'testcases' && (
              <div className="space-y-2">
                {exercise.testCases && exercise.testCases.length > 0 ? (
                  exercise.testCases.map((tc, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#161b22] border border-stone-800 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-400 font-semibold">Test Case #{idx + 1} {tc.hidden && '(Hidden)'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase">Input:</div>
                          <div className="text-stone-200 bg-[#0d1117] p-1.5 rounded">{tc.input || '(empty)'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase">Expected Output:</div>
                          <div className="text-emerald-300 bg-[#0d1117] p-1.5 rounded">{tc.expected_output}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-stone-500 text-center py-4">No specific test cases required. Output will be verified directly.</div>
                )}
              </div>
            )}

            {activeBottomTab === 'output' && (
              <div>
                {isRunning ? (
                  <div className="py-6 text-center text-amber-400 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Executing code in isolated Python sandbox...</span>
                  </div>
                ) : executionResult ? (
                  <div className="space-y-2">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {executionResult.all_passed ? (
                          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
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
                            <span>Execution Error</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stdout Console */}
                    {executionResult.stdout && (
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Standard Output:</div>
                        <pre className="p-2.5 rounded bg-[#161b22] text-stone-200 whitespace-pre-wrap border border-stone-800">
                          {executionResult.stdout}
                        </pre>
                      </div>
                    )}

                    {/* Stderr / Error */}
                    {executionResult.stderr && (
                      <div>
                        <div className="text-[10px] text-rose-400 uppercase tracking-wider mb-1">Standard Error:</div>
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

                    {/* Test Case Evaluation Results */}
                    {executionResult.test_results && (
                      <div className="space-y-1.5 mt-2">
                        <div className="text-[10px] text-stone-400 uppercase tracking-wider">Test Suite Breakdown:</div>
                        {executionResult.test_results.map((tr: any, idx: number) => (
                          <div
                            key={tr.test_case_id || idx}
                            className={`p-2 rounded border flex items-center justify-between ${
                              tr.passed ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {tr.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                              <span>Case #{tr.test_case_id || (idx + 1)}</span>
                            </div>
                            <div className="text-[11px] font-mono">
                              Got: "{tr.actual_output}" {tr.passed ? '' : `(Expected: "${tr.expected_output}")`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-stone-500 text-center py-6">
                    Click "Run Sample" or "Submit Solution" to run your code.
                  </div>
                )}
              </div>
            )}

            {activeBottomTab === 'custom_input' && (
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] text-stone-400">Provide custom standard input for testing:</div>
                <textarea
                  value={customStdin}
                  onChange={(e) => setCustomStdin(e.target.value)}
                  placeholder="Enter custom input lines here..."
                  rows={4}
                  className="w-full p-2 bg-[#161b22] border border-stone-800 rounded text-stone-200 font-mono text-xs focus:outline-none focus:border-stone-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
