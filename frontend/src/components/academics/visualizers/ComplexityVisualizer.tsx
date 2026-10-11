import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export interface CallStackFrame {
  name: string;
  arg: number;
  returnedValue?: number;
  state: 'calling' | 'waiting' | 'returning';
}

export const ComplexityVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [activeTab, setActiveTab] = useState<'big_o' | 'call_stack'>('big_o');

  // Big-O Interactive Growth Model
  const [inputSize, setInputSize] = useState<number>(100);

  const calculateOps = (n: number) => {
    return {
      constant: 1,
      logarithmic: Math.round(Math.log2(Math.max(1, n))),
      linear: n,
      linearithmic: Math.round(n * Math.log2(Math.max(1, n))),
      quadratic: n <= 5000 ? n * n : Infinity,
      exponential: n <= 30 ? Math.pow(2, n) : Infinity
    };
  };

  const ops = calculateOps(inputSize);

  // Recursion Call Stack State for Factorial
  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [recStep, setRecStep] = useState<number>(0);
  const [recExplanation, setRecExplanation] = useState<string>('Click Play or Next Step to trace the call stack pushing and popping frames.');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Pre-generate deterministic steps for factorial(4)
  const factorialSteps = [
    { stack: [{ name: 'fact', arg: 4, state: 'calling' as const }], exp: 'Call fact(4). Push fact(4) onto call stack. It needs fact(3) before it can multiply.' },
    { stack: [{ name: 'fact', arg: 4, state: 'waiting' as const }, { name: 'fact', arg: 3, state: 'calling' as const }], exp: 'Call fact(3). Push fact(3) onto call stack. It needs fact(2).' },
    { stack: [{ name: 'fact', arg: 4, state: 'waiting' as const }, { name: 'fact', arg: 3, state: 'waiting' as const }, { name: 'fact', arg: 2, state: 'calling' as const }], exp: 'Call fact(2). Push fact(2) onto call stack. It needs fact(1).' },
    { stack: [{ name: 'fact', arg: 4, state: 'waiting' as const }, { name: 'fact', arg: 3, state: 'waiting' as const }, { name: 'fact', arg: 2, state: 'waiting' as const }, { name: 'fact', arg: 1, state: 'calling' as const }], exp: 'Base case reached! fact(1) returns 1 immediately without any further recursive calls.' },
    { stack: [{ name: 'fact', arg: 4, state: 'waiting' as const }, { name: 'fact', arg: 3, state: 'waiting' as const }, { name: 'fact', arg: 2, returnedValue: 2, state: 'returning' as const }], exp: 'Pop fact(1). fact(2) receives 1 and computes: 2 * 1 = 2. Now returning 2.' },
    { stack: [{ name: 'fact', arg: 4, state: 'waiting' as const }, { name: 'fact', arg: 3, returnedValue: 6, state: 'returning' as const }], exp: 'Pop fact(2). fact(3) receives 2 and computes: 3 * 2 = 6. Now returning 6.' },
    { stack: [{ name: 'fact', arg: 4, returnedValue: 24, state: 'returning' as const }], exp: 'Pop fact(3). fact(4) receives 6 and computes: 4 * 6 = 24. Final result returned to caller!' },
    { stack: [], exp: 'Call stack completely unwound! Memory deallocated cleanly. Output = 24. Auxiliary space was O(N) due to call stack depth.' }
  ];

  const handleNextStep = () => {
    if (recStep < factorialSteps.length - 1) {
      const next = recStep + 1;
      setRecStep(next);
      setCallStack(factorialSteps[next].stack);
      setRecExplanation(factorialSteps[next].exp);
    } else {
      setIsAutoPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (recStep > 0) {
      const prev = recStep - 1;
      setRecStep(prev);
      setCallStack(factorialSteps[prev].stack);
      setRecExplanation(factorialSteps[prev].exp);
    }
  };

  const handleResetRec = () => {
    setRecStep(0);
    setCallStack(factorialSteps[0].stack);
    setRecExplanation(factorialSteps[0].exp);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    setCallStack(factorialSteps[0].stack);
    setRecExplanation(factorialSteps[0].exp);
  }, []);

  useEffect(() => {
    let timer: any;
    if (isAutoPlaying) {
      timer = setTimeout(() => {
        if (recStep < factorialSteps.length - 1) {
          handleNextStep();
        } else {
          setIsAutoPlaying(false);
        }
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, recStep]);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Interactive Complexity & Recursion Execution Engine</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Explore Big-O growth curves across input sizes and trace how the physical CPython call stack pushes and pops memory frames.
          </p>
        </div>

        {/* Mode Selector */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-[#121622] border-stone-800' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            onClick={() => setActiveTab('big_o')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'big_o'
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Big-O Growth Model
          </button>
          <button
            onClick={() => setActiveTab('call_stack')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'call_stack'
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recursion Call Stack
          </button>
        </div>
      </div>

      {/* TAB 1: BIG-O GROWTH MODEL */}
      {activeTab === 'big_o' && (
        <div className="space-y-5">
          {/* Input Size Slider */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#121622] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isDark ? 'text-stone-300' : 'text-slate-800'
              }`}>
                Input Size (N): <strong className="text-emerald-500 text-sm">{inputSize.toLocaleString()}</strong>
              </span>
              <div className="flex gap-1.5 text-xs">
                {[10, 100, 1000, 10000, 100000].map(val => (
                  <button
                    key={val}
                    onClick={() => setInputSize(val)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                      inputSize === val
                        ? 'bg-sky-600 text-white border-sky-500 font-bold'
                        : isDark ? 'bg-[#182030] text-stone-400 border-stone-700' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    N={val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min={10}
              max={100000}
              step={10}
              value={inputSize}
              onChange={(e) => setInputSize(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Complexity Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* O(1) */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0f1420] border-emerald-900/40' : 'bg-emerald-50/60 border-emerald-200'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-500">O(1) Constant</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                    Fastest
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-500">{ops.constant} op</div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
                  Hash map lookup, array indexing by index, push/pop stack.
                </p>
              </div>
              <div className="text-[10px] font-mono opacity-75 mt-2 pt-2 border-t border-emerald-500/20">
                Runtime: ~1 nanosecond
              </div>
            </div>

            {/* O(log N) */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0f1420] border-sky-900/40' : 'bg-sky-50/60 border-sky-200'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-sky-500">O(log N) Logarithmic</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold">
                    Super Fast
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-sky-500">{ops.logarithmic} ops</div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
                  Binary search, BST lookup, B-Tree database disk indexing.
                </p>
              </div>
              <div className="text-[10px] font-mono opacity-75 mt-2 pt-2 border-t border-sky-500/20">
                Runtime: ~20 nanoseconds
              </div>
            </div>

            {/* O(N) */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0f1420] border-amber-900/40' : 'bg-amber-50/60 border-amber-200'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-500">O(N) Linear</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                    Proportional
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-amber-500">{ops.linear.toLocaleString()} ops</div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
                  Single for-loop, linear search, stream filtering, linked list traversal.
                </p>
              </div>
              <div className="text-[10px] font-mono opacity-75 mt-2 pt-2 border-t border-amber-500/20">
                Runtime: ~1 millisecond
              </div>
            </div>

            {/* O(N log N) */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0f1420] border-purple-900/40' : 'bg-purple-50/60 border-purple-200'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-purple-500">O(N log N) Linearithmic</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
                    Standard Sort
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-purple-500">{ops.linearithmic.toLocaleString()} ops</div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
                  Merge Sort, Quick Sort, Timsort (Python sorted()), Heap Sort.
                </p>
              </div>
              <div className="text-[10px] font-mono opacity-75 mt-2 pt-2 border-t border-purple-500/20">
                Runtime: ~15 milliseconds
              </div>
            </div>

            {/* O(N^2) */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0f1420] border-rose-900/40' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-rose-500">O(N²) Quadratic</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold">
                    Slow / Danger
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-rose-500">
                  {ops.quadratic === Infinity ? 'Over 1 Trillion (TLE!)' : `${ops.quadratic.toLocaleString()} ops`}
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
                  Nested loops, Bubble Sort, pairwise cartesian comparisons.
                </p>
              </div>
              <div className="text-[10px] font-mono opacity-75 mt-2 pt-2 border-t border-rose-500/20">
                {inputSize >= 10000 ? '⚠️ Exceeds 1s limit on LeetCode' : 'Runtime: ~1 second'}
              </div>
            </div>

            {/* O(2^N) */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0f1420] border-red-900/60' : 'bg-red-50/70 border-red-200'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-red-500">O(2ᴺ) Exponential</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-300 font-bold">
                    Unscalable
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-red-500">
                  {inputSize > 30 ? 'Astronomical (Crash)' : `${ops.exponential.toLocaleString()} ops`}
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
                  Naive Fibonacci recursion, subsets without pruning.
                </p>
              </div>
              <div className="text-[10px] font-mono opacity-75 mt-2 pt-2 border-t border-red-500/20">
                Requires Dynamic Programming to reduce to O(N)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECURSION CALL STACK */}
      {activeTab === 'call_stack' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-stone-800/80 bg-stone-900/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                onClick={handlePrevStep}
                disabled={recStep <= 0}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer disabled:opacity-30 ${
                  isDark ? 'bg-[#161f30] text-stone-200 border-stone-700' : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextStep}
                disabled={recStep >= factorialSteps.length - 1}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer disabled:opacity-30 ${
                  isDark ? 'bg-[#161f30] text-stone-200 border-stone-700' : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetRec}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                  isDark ? 'bg-[#161f30] text-stone-400 border-stone-700' : 'bg-white text-slate-600 border-slate-300'
                }`}
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono">
              Step <strong className="text-emerald-500">{recStep + 1}</strong> of {factorialSteps.length}
            </div>
          </div>

          {/* Explanation Callout */}
          <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
            isDark ? 'bg-[#121826] border-sky-800/50 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-950 font-medium'
          }`}>
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>{recExplanation}</span>
          </div>

          {/* Visual Stack Chamber */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visual Call Stack */}
            <div className={`p-4 rounded-xl border flex flex-col items-center ${
              isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-100 border-slate-300'
            }`}>
              <div className="text-xs font-mono font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-stone-400">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>OS Thread Call Stack (LIFO)</span>
              </div>

              <div className="w-full max-w-xs flex flex-col-reverse gap-2 min-h-[220px] justify-start p-3 rounded-lg border-2 border-dashed border-stone-700/60 bg-black/20">
                {callStack.length === 0 ? (
                  <div className="m-auto text-xs font-mono text-stone-500 text-center">
                    (Call Stack Empty)
                  </div>
                ) : (
                  callStack.map((frame, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between shadow-md transition-all animate-in fade-in duration-200 ${
                        frame.state === 'calling'
                          ? 'bg-sky-600 text-white border-sky-400 scale-[1.02]'
                          : frame.state === 'waiting'
                          ? isDark ? 'bg-indigo-950/80 text-indigo-200 border-indigo-700' : 'bg-indigo-100 text-indigo-950 border-indigo-300'
                          : 'bg-emerald-600 text-white border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{frame.name}({frame.arg})</span>
                        <span className="text-[10px] opacity-80 uppercase px-1.5 py-0.2 rounded bg-black/30">
                          {frame.state}
                        </span>
                      </div>
                      {frame.returnedValue !== undefined && (
                        <span className="font-bold text-amber-300 text-xs">
                          return {frame.returnedValue}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
              <span className="text-[10px] font-mono text-stone-500 mt-2">
                Stack Depth: {callStack.length} frame(s) • Max Depth = 4
              </span>
            </div>

            {/* Python Code Tracing */}
            <div className={`p-4 rounded-xl border font-mono text-xs ${
              isDark ? 'bg-[#070a10] border-stone-800 text-stone-300' : 'bg-slate-900 border-slate-800 text-emerald-300'
            }`}>
              <div className="text-[11px] text-stone-400 mb-2 border-b border-stone-800 pb-1">
                def factorial(n):
              </div>
              <div className="space-y-1">
                <div className={`p-1 rounded ${recStep === 3 ? 'bg-emerald-900/60 font-bold text-white' : ''}`}>
                  &nbsp;&nbsp;if n &lt;= 1:
                </div>
                <div className={`p-1 rounded ${recStep === 3 ? 'bg-emerald-900/60 font-bold text-white' : ''}`}>
                  &nbsp;&nbsp;&nbsp;&nbsp;return 1 &nbsp;&nbsp;<span className="text-stone-500 text-[10px]"># Base Case</span>
                </div>
                <div className={`p-1 rounded ${recStep < 3 ? 'bg-sky-900/60 font-bold text-white' : ''}`}>
                  &nbsp;&nbsp;return n * factorial(n - 1) &nbsp;&nbsp;<span className="text-stone-500 text-[10px]"># Recursive Call</span>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
                <strong>Memory Invariant:</strong> Every call without a base case adds a stack frame of 8–16 KB. Without a base case, CPython raises <code className="text-rose-400">RecursionError: maximum recursion depth exceeded</code> (default limit: 1,000 frames).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
