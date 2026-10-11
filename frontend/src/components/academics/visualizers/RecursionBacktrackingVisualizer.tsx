import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  GitBranch, 
  Crown
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export interface RecursionStep {
  id: number;
  type: 'choose' | 'explore' | 'backtrack' | 'base_case_found' | 'conflict';
  title: string;
  description: string;
  callStack: string[];
  activeState: any;
  resultCollection: any[];
}

export const RecursionBacktrackingVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [mode, setMode] = useState<'subsets' | 'permutations' | 'nqueens'>('subsets');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate deterministic steps for Subsets of [1, 2]
  const generateSubsetsSteps = (): RecursionStep[] => {
    return [
      {
        id: 0,
        type: 'explore',
        title: 'Initial State',
        description: 'Start at root with empty subset []. Next element to consider: 1.',
        callStack: ['backtrack(index=0, current=[])'],
        activeState: { index: 0, current: [] },
        resultCollection: [[]]
      },
      {
        id: 1,
        type: 'choose',
        title: 'Choose 1 (Include branch)',
        description: 'Include 1 into current subset -> current becomes [1].',
        callStack: ['backtrack(index=0, current=[])', 'backtrack(index=1, current=[1])'],
        activeState: { index: 1, current: [1] },
        resultCollection: [[], [1]]
      },
      {
        id: 2,
        type: 'choose',
        title: 'Choose 2 (Include branch)',
        description: 'Include 2 into current subset -> current becomes [1, 2]. Reached end of array!',
        callStack: ['backtrack(index=0, current=[])', 'backtrack(index=1, current=[1])', 'backtrack(index=2, current=[1, 2])'],
        activeState: { index: 2, current: [1, 2] },
        resultCollection: [[], [1], [1, 2]]
      },
      {
        id: 3,
        type: 'backtrack',
        title: 'Backtrack: Pop 2',
        description: 'Un-choose 2. Remove 2 from subset -> current returns to [1]. Explore skip branch.',
        callStack: ['backtrack(index=0, current=[])', 'backtrack(index=1, current=[1])'],
        activeState: { index: 1, current: [1] },
        resultCollection: [[], [1], [1, 2]]
      },
      {
        id: 4,
        type: 'backtrack',
        title: 'Backtrack: Pop 1',
        description: 'Un-choose 1. Remove 1 from subset -> current returns to []. Now explore skipping 1.',
        callStack: ['backtrack(index=0, current=[])'],
        activeState: { index: 0, current: [] },
        resultCollection: [[], [1], [1, 2]]
      },
      {
        id: 5,
        type: 'choose',
        title: 'Choose 2 (Skip 1 branch)',
        description: 'From root, skip 1 and include 2 -> current becomes [2].',
        callStack: ['backtrack(index=0, current=[])', 'backtrack(index=1, current=[2])'],
        activeState: { index: 1, current: [2] },
        resultCollection: [[], [1], [1, 2], [2]]
      },
      {
        id: 6,
        type: 'base_case_found',
        title: 'Subsets Complete (2^N generated!)',
        description: 'All decision branches explored. All 4 subsets generated: [], [1], [1, 2], [2]. Space-time complexity: O(2^N).',
        callStack: [],
        activeState: { index: 2, current: [] },
        resultCollection: [[], [1], [1, 2], [2]]
      }
    ];
  };

  // Generate deterministic steps for N-Queens (4x4)
  const generateNQueensSteps = (): RecursionStep[] => {
    return [
      {
        id: 0,
        type: 'explore',
        title: 'Empty 4x4 Chessboard',
        description: 'Place 4 non-attacking queens on a 4x4 board. Start at Row 0.',
        callStack: ['solveNQueens(row=0)'],
        activeState: { board: [null, null, null, null], row: 0, col: 0 },
        resultCollection: []
      },
      {
        id: 1,
        type: 'choose',
        title: 'Row 0: Place Queen at Col 0',
        description: 'Place Queen at (0, 0). Attacks column 0 and diagonals. Move to Row 1.',
        callStack: ['solveNQueens(row=0)', 'solveNQueens(row=1)'],
        activeState: { board: [0, null, null, null], row: 1, col: 0 },
        resultCollection: []
      },
      {
        id: 2,
        type: 'conflict',
        title: 'Row 1: Col 0 & Col 1 Conflict!',
        description: 'Col 0 attacked vertically; Col 1 attacked diagonally. Try Col 2.',
        callStack: ['solveNQueens(row=0)', 'solveNQueens(row=1)'],
        activeState: { board: [0, null, null, null], row: 1, col: 1 },
        resultCollection: []
      },
      {
        id: 3,
        type: 'choose',
        title: 'Row 1: Place Queen at Col 2',
        description: 'Position (1, 2) is safe! Place Queen and advance to Row 2.',
        callStack: ['solveNQueens(row=0)', 'solveNQueens(row=1)', 'solveNQueens(row=2)'],
        activeState: { board: [0, 2, null, null], row: 2, col: 0 },
        resultCollection: []
      },
      {
        id: 4,
        type: 'conflict',
        title: 'Row 2: Dead End / All Columns Under Attack!',
        description: 'Cols 0, 1, 2, 3 are all attacked! Cannot place queen in Row 2. BACKTRACK triggered!',
        callStack: ['solveNQueens(row=0)', 'solveNQueens(row=1)', 'solveNQueens(row=2)'],
        activeState: { board: [0, 2, null, null], row: 2, col: 3 },
        resultCollection: []
      },
      {
        id: 5,
        type: 'backtrack',
        title: 'Backtrack to Row 1',
        description: 'Remove Queen from (1, 2). Try Col 3 for Row 1 instead.',
        callStack: ['solveNQueens(row=0)', 'solveNQueens(row=1)'],
        activeState: { board: [0, 3, null, null], row: 1, col: 3 },
        resultCollection: []
      },
      {
        id: 6,
        type: 'choose',
        title: 'Row 2: Place Queen at Col 1',
        description: 'Position (2, 1) is safe! Place Queen and advance to Row 3.',
        callStack: ['solveNQueens(row=0)', 'solveNQueens(row=1)', 'solveNQueens(row=2)', 'solveNQueens(row=3)'],
        activeState: { board: [1, 3, 0, 2], row: 3, col: 2 },
        resultCollection: [[1, 3, 0, 2]]
      },
      {
        id: 7,
        type: 'base_case_found',
        title: 'Valid 4-Queens Solution Found! 🏆',
        description: 'Queens safely placed at: Q0 at Col 1, Q1 at Col 3, Q2 at Col 0, Q3 at Col 2. Zero attacks!',
        callStack: [],
        activeState: { board: [1, 3, 0, 2], row: 4, col: 0 },
        resultCollection: [[1, 3, 0, 2]]
      }
    ];
  };

  // Generate deterministic steps for Permutations of [1, 2, 3]
  const generatePermutationsSteps = (): RecursionStep[] => {
    return [
      {
        id: 0,
        type: 'explore',
        title: 'Initial State',
        description: 'Generating permutations of [1, 2, 3]. Start at position 0.',
        callStack: ['permute(nums=[1, 2, 3], start=0)'],
        activeState: { nums: [1, 2, 3], start: 0 },
        resultCollection: []
      },
      {
        id: 1,
        type: 'choose',
        title: 'Fix 1 at index 0',
        description: 'Swap index 0 with index 0. Advance to position 1.',
        callStack: ['permute(nums=[1, 2, 3], start=0)', 'permute(nums=[1, 2, 3], start=1)'],
        activeState: { nums: [1, 2, 3], start: 1 },
        resultCollection: []
      },
      {
        id: 2,
        type: 'base_case_found',
        title: 'Found Permutation: [1, 2, 3]',
        description: 'All 3 slots filled. Added [1, 2, 3] to result list.',
        callStack: ['permute(nums=[1, 2, 3], start=0)', 'permute(nums=[1, 2, 3], start=1)', 'permute(nums=[1, 2, 3], start=2)'],
        activeState: { nums: [1, 2, 3], start: 2 },
        resultCollection: [[1, 2, 3]]
      },
      {
        id: 3,
        type: 'choose',
        title: 'Swap 2 and 3 at index 1',
        description: 'Swap indices 1 & 2 -> array becomes [1, 3, 2]. Added [1, 3, 2] to result!',
        callStack: ['permute(nums=[1, 3, 2], start=1)'],
        activeState: { nums: [1, 3, 2], start: 1 },
        resultCollection: [[1, 2, 3], [1, 3, 2]]
      },
      {
        id: 4,
        type: 'backtrack',
        title: 'Backtrack: Restore Swap',
        description: 'Swap indices 1 & 2 back to restore original array order before exploring next branch.',
        callStack: ['permute(nums=[1, 2, 3], start=0)'],
        activeState: { nums: [1, 2, 3], start: 0 },
        resultCollection: [[1, 2, 3], [1, 3, 2]]
      },
      {
        id: 5,
        type: 'base_case_found',
        title: 'All N! = 6 Permutations Complete',
        description: 'Explored all state-space branches. Generates exactly N! = 6 permutations with O(N!) time complexity.',
        callStack: [],
        activeState: { nums: [1, 2, 3], start: 0 },
        resultCollection: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 2, 1], [3, 1, 2]]
      }
    ];
  };

  const steps = mode === 'subsets' 
    ? generateSubsetsSteps() 
    : mode === 'nqueens' 
    ? generateNQueensSteps() 
    : generatePermutationsSteps();

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [mode]);

  useEffect(() => {
    if (isPlaying) {
      const delay = Math.round(1800 / playbackSpeed);
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  const step = steps[currentStepIndex] || steps[0];

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0a0e17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-purple-500/20 text-purple-400 font-bold text-xs">Day 105</span>
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span>Recursion & Backtracking State Tree Visualizer</span>
            </h4>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Explore decision trees, call stack expansion, and state-restoration backtracking step-by-step.
          </p>
        </div>

        {/* Mode Selector */}
        <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-[#141b29] border-stone-800' : 'bg-slate-100 border-slate-300'
        }`}>
          {[
            { id: 'subsets', label: '1. Subsets (2^N)' },
            { id: 'permutations', label: '2. Permutations (N!)' },
            { id: 'nqueens', label: '3. N-Queens (4x4)' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id as any); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                mode === m.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Left Column: Visual Representation (Chessboard / Decision Tree) */}
        <div className={`lg:col-span-2 p-4 rounded-xl border flex flex-col items-center justify-center min-h-[260px] ${
          isDark ? 'bg-[#060910] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {mode === 'nqueens' ? (
            /* 4x4 Chessboard */
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                4x4 Chessboard State
              </span>
              <div className="grid grid-cols-4 gap-1 p-2 bg-stone-900 border border-stone-700 rounded-xl shadow-inner">
                {[0, 1, 2, 3].map(row => (
                  <React.Fragment key={row}>
                    {[0, 1, 2, 3].map(col => {
                      const isQueen = step.activeState.board && step.activeState.board[row] === col;
                      const isCurrentRow = step.activeState.row === row;
                      const isDarkSquare = (row + col) % 2 === 1;

                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                            isQueen
                              ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 shadow-md animate-bounce'
                              : isCurrentRow
                              ? 'bg-purple-900/60 border border-purple-500/50 text-purple-200'
                              : isDarkSquare
                              ? 'bg-stone-800 text-stone-600'
                              : 'bg-stone-700 text-stone-500'
                          }`}
                        >
                          {isQueen ? <Crown className="w-6 h-6 fill-current" /> : `${row},${col}`}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            /* State Tree Representation */
            <div className="flex flex-col items-center justify-center gap-3 w-full text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Decision Path State
              </span>
              <div className="p-4 rounded-xl border bg-black/40 border-stone-800 font-mono text-sm max-w-md w-full">
                <div className="text-stone-400 text-xs mb-1">Current Backtracking State:</div>
                <div className="text-emerald-400 font-bold text-base">
                  {mode === 'subsets' 
                    ? `Subset: [${(step.activeState.current || []).join(', ')}]` 
                    : `Array: [${(step.activeState.nums || []).join(', ')}]`}
                </div>
                <div className="text-stone-500 text-xs mt-2">
                  Action: <span className="text-purple-300 font-bold">{step.title}</span>
                </div>
              </div>
            </div>
          )}

          {/* Results Gathered So Far */}
          <div className="w-full mt-4 pt-3 border-t border-stone-800/60">
            <span className="text-[11px] font-bold text-stone-400 block mb-1">
              Accumulated Solutions ({step.resultCollection.length}):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {step.resultCollection.length === 0 ? (
                <span className="text-xs text-stone-500 italic">None yet, searching tree...</span>
              ) : (
                step.resultCollection.map((res: any, idx: number) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold"
                  >
                    [{Array.isArray(res) ? res.join(', ') : res}]
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Call Stack Inspection */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-[#0d121c] border-stone-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Active Call Stack (LIFO)</span>
            </div>
            <p className={`text-[11px] mb-3 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
              Stack depth = {step.callStack.length}. Each recursive call pushes a new activation record.
            </p>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {step.callStack.length === 0 ? (
                <div className="p-2.5 rounded-lg border border-dashed text-xs text-center text-stone-500">
                  Call stack empty (Base recursion complete)
                </div>
              ) : (
                step.callStack.map((frame, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg font-mono text-xs border transition-all ${
                      idx === step.callStack.length - 1
                        ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold shadow-sm'
                        : isDark ? 'bg-black/40 border-stone-800 text-stone-400' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mb-0.5">
                      <span>Frame #{step.callStack.length - idx}</span>
                      {idx === step.callStack.length - 1 && <span className="text-purple-400">ACTIVE</span>}
                    </div>
                    {frame}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-black/30 border border-stone-800/80 text-[11px] text-stone-400">
            <strong>Invariant:</strong> State changes made in child calls must be undone when unwinding!
          </div>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed mb-4 ${
        step.type === 'conflict' || step.type === 'backtrack'
          ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
          : isDark ? 'bg-[#101624] border-stone-800 text-stone-200' : 'bg-slate-100 border-slate-300 text-slate-800'
      }`}>
        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-purple-400 mr-1.5">
            Step {currentStepIndex + 1}/{steps.length}: {step.title}
          </strong>
          <span>{step.description}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-between w-full gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setCurrentStepIndex(s => Math.max(0, s - 1)); setIsPlaying(false); }}
            disabled={currentStepIndex === 0}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 ${
              isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => { setCurrentStepIndex(s => Math.min(steps.length - 1, s + 1)); setIsPlaying(false); }}
            disabled={currentStepIndex === steps.length - 1}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 ${
              isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className={`opacity-75 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>Speed:</span>
          {[0.5, 1, 2].map(speed => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                playbackSpeed === speed
                  ? 'bg-purple-600 text-white'
                  : isDark ? 'bg-[#161f30] text-stone-400' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
