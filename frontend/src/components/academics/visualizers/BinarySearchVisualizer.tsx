import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Search, 
  AlertCircle, 
  GitCompare,
  Sparkles,
  Info
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export interface BinarySearchStep {
  low: number;
  high: number;
  mid: number;
  midValue: number;
  target: number;
  status: 'comparing' | 'found' | 'eliminate_left' | 'eliminate_right' | 'not_found';
  explanation: string;
  codeLine: number; // 1-indexed python line
}

export const BinarySearchVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  // Input state
  const [arrayInput, setArrayInput] = useState<string>('10, 20, 30, 40, 50');
  const [targetInput, setTargetInput] = useState<string>('50');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Active dataset
  const [arr, setArr] = useState<number[]>([10, 20, 30, 40, 50]);
  const [target, setTarget] = useState<number>(50);

  // Execution steps
  const [steps, setSteps] = useState<BinarySearchStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x

  // Comparison mode: 'binary' vs 'linear'
  const [searchMode, setSearchMode] = useState<'binary' | 'linear'>('binary');
  const [linearStepIndex, setLinearStepIndex] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute deterministic steps whenever array or target changes
  const computeSteps = (currentArr: number[], currentTarget: number) => {
    const generatedSteps: BinarySearchStep[] = [];
    let low = 0;
    let high = currentArr.length - 1;

    // Initial state step
    generatedSteps.push({
      low,
      high,
      mid: Math.floor((low + high) / 2),
      midValue: currentArr[Math.floor((low + high) / 2)],
      target: currentTarget,
      status: 'comparing',
      explanation: `Initial state: low = ${low}, high = ${high}, target = ${currentTarget}. Search range spans the entire array.`,
      codeLine: 2
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midVal = currentArr[mid];

      // Comparison step
      if (midVal === currentTarget) {
        generatedSteps.push({
          low,
          high,
          mid,
          midValue: midVal,
          target: currentTarget,
          status: 'found',
          explanation: `mid = (${low} + ${high}) // 2 = ${mid}. arr[${mid}] = ${midVal}. Found ${currentTarget} at index ${mid}! (Python uses 0-based indexing; index ${mid} is element #${mid + 1}).`,
          codeLine: 9
        });
        break;
      } else if (midVal < currentTarget) {
        generatedSteps.push({
          low,
          high,
          mid,
          midValue: midVal,
          target: currentTarget,
          status: 'eliminate_left',
          explanation: `mid = (${low} + ${high}) // 2 = ${mid}. arr[${mid}] = ${midVal}. Since ${midVal} < ${currentTarget}, target must be to the right. We eliminate indices ${low} through ${mid} because the array is sorted. Setting low = ${mid + 1}.`,
          codeLine: 11
        });
        low = mid + 1;
      } else {
        generatedSteps.push({
          low,
          high,
          mid,
          midValue: midVal,
          target: currentTarget,
          status: 'eliminate_right',
          explanation: `mid = (${low} + ${high}) // 2 = ${mid}. arr[${mid}] = ${midVal}. Since ${midVal} > ${currentTarget}, target must be to the left. We eliminate indices ${mid} through ${high}. Setting high = ${mid - 1}.`,
          codeLine: 13
        });
        high = mid - 1;
      }
    }

    if (low > high) {
      generatedSteps.push({
        low,
        high,
        mid: -1,
        midValue: -1,
        target: currentTarget,
        status: 'not_found',
        explanation: `Search space exhausted: low (${low}) > high (${high}). Target ${currentTarget} is not present in the array. Returning -1.`,
        codeLine: 15
      });
    }

    return generatedSteps;
  };

  // Re-run computation on arr / target change
  useEffect(() => {
    const s = computeSteps(arr, target);
    setSteps(s);
    setCurrentStepIndex(0);
    setLinearStepIndex(0);
    setIsPlaying(false);
  }, [arr, target]);

  // Autoplay handler
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.round(1500 / playbackSpeed);
      timerRef.current = setTimeout(() => {
        if (searchMode === 'binary') {
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        } else {
          // Linear search stepping
          if (linearStepIndex < arr.length - 1 && arr[linearStepIndex] !== target) {
            setLinearStepIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, linearStepIndex, steps.length, playbackSpeed, searchMode, arr, target]);

  // Handle user array / target submission
  const handleApplyInputs = () => {
    const parsedNums = arrayInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(Number);

    if (parsedNums.some(isNaN) || parsedNums.length === 0) {
      setValidationError('Please enter a valid comma-separated list of numbers (e.g. 10, 20, 30, 40, 50).');
      return;
    }

    // Check if sorted
    for (let i = 0; i < parsedNums.length - 1; i++) {
      if (parsedNums[i] > parsedNums[i + 1]) {
        setValidationError('Array must be sorted in ascending order for Binary Search! Click "Auto-Sort" to fix.');
        return;
      }
    }

    const t = Number(targetInput.trim());
    if (isNaN(t)) {
      setValidationError('Please enter a valid numeric target.');
      return;
    }

    setValidationError(null);
    setArr(parsedNums);
    setTarget(t);
  };

  const handleAutoSort = () => {
    const parsedNums = arrayInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(Number)
      .filter(n => !isNaN(n));

    parsedNums.sort((a, b) => a - b);
    setArrayInput(parsedNums.join(', '));
    setValidationError(null);
    setArr(parsedNums);
  };

  const currentStep = steps[currentStepIndex] || {
    low: 0,
    high: arr.length - 1,
    mid: 0,
    midValue: arr[0],
    target,
    status: 'comparing',
    explanation: 'Ready to search.',
    codeLine: 2
  };

  // Python Code lines for walkthrough
  const PYTHON_CODE_LINES = [
    { line: 1, text: 'def binary_search(arr, target):' },
    { line: 2, text: '    low, high = 0, len(arr) - 1' },
    { line: 3, text: '' },
    { line: 4, text: '    while low <= high:' },
    { line: 5, text: '        mid = (low + high) // 2' },
    { line: 6, text: '        mid_value = arr[mid]' },
    { line: 7, text: '' },
    { line: 8, text: '        if mid_value == target:' },
    { line: 9, text: '            return mid' },
    { line: 10, text: '        elif mid_value < target:' },
    { line: 11, text: '            low = mid + 1' },
    { line: 12, text: '        else:' },
    { line: 13, text: '            high = mid - 1' },
    { line: 14, text: '' },
    { line: 15, text: '    return -1' }
  ];

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header bar */}
      <div className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-[#111726]/80 border-stone-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-900/30">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg">
                Binary Search: Interactive Divide & Conquer Visualizer
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                O(log N)
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
              Watch pointers move in lockstep with the algorithm state machine and Python source code.
            </p>
          </div>
        </div>

        {/* Algorithm Comparison Switch */}
        <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-[#182030] border-stone-800' : 'bg-slate-200/80 border-slate-300'
        }`}>
          <button
            onClick={() => { setSearchMode('binary'); setIsPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              searchMode === 'binary'
                ? 'bg-sky-600 text-white shadow-sm'
                : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Binary Search (O(log n))</span>
          </button>
          <button
            onClick={() => { setSearchMode('linear'); setIsPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              searchMode === 'linear'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Linear Search (O(n))</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* Interactive Controls & Presets Strip */}
        <div className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
          isDark ? 'bg-[#131a29]/60 border-stone-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isDark ? 'text-stone-300' : 'text-slate-700'}`}>Array:</span>
              <input
                type="text"
                value={arrayInput}
                onChange={e => setArrayInput(e.target.value)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs border focus:outline-none focus:ring-2 focus:ring-sky-500 w-48 sm:w-56 ${
                  isDark ? 'bg-[#0a0e17] border-stone-700 text-sky-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
                placeholder="10, 20, 30, 40, 50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isDark ? 'text-stone-300' : 'text-slate-700'}`}>Target:</span>
              <input
                type="number"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs border focus:outline-none focus:ring-2 focus:ring-sky-500 w-20 ${
                  isDark ? 'bg-[#0a0e17] border-stone-700 text-amber-300' : 'bg-white border-slate-300 text-slate-800 font-bold'
                }`}
                placeholder="50"
              />
            </div>

            <button
              onClick={handleApplyInputs}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Apply Inputs
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className={`font-medium mr-1 ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>Presets:</span>
            <button
              onClick={() => {
                setArrayInput('10, 20, 30, 40, 50');
                setTargetInput('50');
                setArr([10, 20, 30, 40, 50]);
                setTarget(50);
                setValidationError(null);
              }}
              className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                isDark ? 'bg-[#182030] hover:bg-[#202b40] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              [10..50] Target 50
            </button>
            <button
              onClick={() => {
                setArrayInput('10, 20, 30, 40, 50');
                setTargetInput('30');
                setArr([10, 20, 30, 40, 50]);
                setTarget(30);
                setValidationError(null);
              }}
              className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                isDark ? 'bg-[#182030] hover:bg-[#202b40] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              Target 30 (Mid)
            </button>
            <button
              onClick={() => {
                setArrayInput('10, 20, 30, 40, 50');
                setTargetInput('25');
                setArr([10, 20, 30, 40, 50]);
                setTarget(25);
                setValidationError(null);
              }}
              className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                isDark ? 'bg-[#182030] hover:bg-[#202b40] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              Target 25 (Missing)
            </button>
            <button
              onClick={() => {
                setArrayInput('3, 7, 12, 19, 24, 31, 45, 62');
                setTargetInput('31');
                setArr([3, 7, 12, 19, 24, 31, 45, 62]);
                setTarget(31);
                setValidationError(null);
              }}
              className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                isDark ? 'bg-[#182030] hover:bg-[#202b40] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              Even Length (N=8)
            </button>
          </div>
        </div>

        {/* Validation Error banner if unsorted */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              onClick={handleAutoSort}
              className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer shrink-0"
            >
              Auto-Sort Array
            </button>
          </div>
        )}

        {/* MAIN VISUALIZATION AREA */}
        <div className={`p-5 sm:p-7 rounded-2xl border flex flex-col items-center justify-center gap-6 shadow-inner ${
          isDark ? 'bg-[#070b12] border-stone-800' : 'bg-slate-100/70 border-slate-200'
        }`}>
          {/* Active Pointers Status Bar */}
          {searchMode === 'binary' ? (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold">
                <span>low:</span>
                <span className="text-white bg-sky-600 px-1.5 py-0.2 rounded text-[11px]">{currentStep.low}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                <span>mid:</span>
                <span className="text-white bg-amber-600 px-1.5 py-0.2 rounded text-[11px]">
                  {currentStep.mid >= 0 ? currentStep.mid : 'N/A'}
                </span>
                {currentStep.mid >= 0 && (
                  <span className="opacity-80">({arr[currentStep.mid]})</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">
                <span>high:</span>
                <span className="text-white bg-purple-600 px-1.5 py-0.2 rounded text-[11px]">{currentStep.high}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                <span>target:</span>
                <span className="text-white bg-emerald-600 px-1.5 py-0.2 rounded text-[11px]">{target}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold">
                <span>Current Scanning Index:</span>
                <span className="text-white bg-indigo-600 px-2 py-0.5 rounded text-[11px]">{linearStepIndex}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                <span>target:</span>
                <span className="text-white bg-emerald-600 px-2 py-0.5 rounded text-[11px]">{target}</span>
              </div>
            </div>
          )}

          {/* VISUAL ARRAY CELLS */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4 max-w-full overflow-x-auto">
            {arr.map((val, idx) => {
              if (searchMode === 'binary') {
                const inRange = idx >= currentStep.low && idx <= currentStep.high;
                const isMid = idx === currentStep.mid;
                const isLow = idx === currentStep.low;
                const isHigh = idx === currentStep.high;
                const isFound = currentStep.status === 'found' && idx === currentStep.mid;
                const isEliminated = !inRange;

                let cellStyle = '';
                let cellLabel = '';

                if (isFound) {
                  cellStyle = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/40 scale-110 shadow-lg shadow-emerald-900/50';
                  cellLabel = 'FOUND!';
                } else if (isMid) {
                  cellStyle = 'bg-amber-500/30 text-amber-300 border-amber-400 ring-2 ring-amber-400/50 shadow-md font-extrabold';
                  cellLabel = 'MID';
                } else if (inRange) {
                  cellStyle = isDark 
                    ? 'bg-[#182338] text-sky-100 border-sky-700/80' 
                    : 'bg-white text-slate-800 border-sky-400 shadow-sm';
                  cellLabel = 'SEARCH RANGE';
                } else {
                  // Eliminated
                  cellStyle = isDark 
                    ? 'bg-[#0f141f]/40 text-stone-600 border-stone-800 opacity-35 line-through' 
                    : 'bg-slate-200/50 text-slate-400 border-slate-300 opacity-40 line-through';
                  cellLabel = 'ELIMINATED';
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    {/* Top Pointer Badge */}
                    <div className="h-5 flex items-center gap-1 text-[10px] font-mono font-bold">
                      {isLow && <span className="px-1.5 py-0.2 rounded bg-sky-500 text-white">L</span>}
                      {isMid && <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white">M</span>}
                      {isHigh && <span className="px-1.5 py-0.2 rounded bg-purple-500 text-white">H</span>}
                    </div>

                    {/* Main Cell */}
                    <div 
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center text-sm sm:text-lg font-mono font-bold transition-all duration-300 ${cellStyle}`}
                      title={`Index: ${idx}, Value: ${val}, State: ${cellLabel}`}
                    >
                      {val}
                    </div>

                    {/* Bottom Index */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-mono ${isDark ? 'text-stone-500' : 'text-slate-500'}`}>
                        idx:{idx}
                      </span>
                      <span className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${
                        isFound ? 'text-emerald-400 font-bold' : isMid ? 'text-amber-400' : isEliminated ? 'text-rose-400/70' : 'text-sky-400/80'
                      }`}>
                        {isFound ? 'Target' : isMid ? 'Midpoint' : isEliminated ? 'Pruned' : 'Active'}
                      </span>
                    </div>
                  </div>
                );
              } else {
                // Linear Search Cells
                const isCurrent = idx === linearStepIndex;
                const isFound = arr[idx] === target && idx <= linearStepIndex;
                const isPassed = idx < linearStepIndex && arr[idx] !== target;

                let cellStyle = '';
                if (isFound) {
                  cellStyle = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/40 scale-110';
                } else if (isCurrent) {
                  cellStyle = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/50 scale-105';
                } else if (isPassed) {
                  cellStyle = isDark ? 'bg-stone-900 text-stone-500 border-stone-800' : 'bg-slate-200 text-slate-500 border-slate-300';
                } else {
                  cellStyle = isDark ? 'bg-[#182338] text-stone-300 border-stone-700' : 'bg-white text-slate-800 border-slate-300';
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="h-5 flex items-center text-[10px] font-mono font-bold">
                      {isCurrent && <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white">CHECK</span>}
                    </div>

                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center text-sm sm:text-lg font-mono font-bold transition-all duration-200 ${cellStyle}`}>
                      {val}
                    </div>

                    <span className={`text-[10px] font-mono ${isDark ? 'text-stone-500' : 'text-slate-500'}`}>
                      idx:{idx}
                    </span>
                  </div>
                );
              }
            })}
          </div>

          {/* Explanation Box derived from algorithm state */}
          <div className={`w-full p-4 rounded-xl border flex items-start gap-3 transition-colors ${
            searchMode === 'binary'
              ? currentStep.status === 'found'
                ? isDark ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : currentStep.status === 'not_found'
                ? isDark ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' : 'bg-rose-50 border-rose-300 text-rose-900'
                : isDark ? 'bg-[#101726] border-sky-900/40 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-950'
              : arr[linearStepIndex] === target
              ? isDark ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : isDark ? 'bg-[#101726] border-indigo-900/40 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
          }`}>
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-sky-400" />
            <div className="flex-1 text-xs sm:text-sm leading-relaxed">
              {searchMode === 'binary' ? (
                <>
                  <div className="font-bold mb-1 flex items-center gap-2">
                    <span>Step {currentStepIndex + 1} of {steps.length}</span>
                    <span className="font-mono text-[11px] opacity-75">
                      ({currentStep.status.toUpperCase()})
                    </span>
                  </div>
                  <p>{currentStep.explanation}</p>
                </>
              ) : (
                <>
                  <div className="font-bold mb-1">
                    Linear Scan: Comparison {linearStepIndex + 1} of {arr.length}
                  </div>
                  <p>
                    Checking index {linearStepIndex} (value: {arr[linearStepIndex]}).{' '}
                    {arr[linearStepIndex] === target
                      ? `Found target ${target} after ${linearStepIndex + 1} sequential comparisons!`
                      : `Value ${arr[linearStepIndex]} != ${target}. Advancing to index ${linearStepIndex + 1}.`}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* PLAYBACK CONTROLS STRIP */}
          <div className="flex flex-wrap items-center justify-between w-full gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (searchMode === 'binary') {
                    setCurrentStepIndex(0);
                  } else {
                    setLinearStepIndex(0);
                  }
                  setIsPlaying(false);
                }}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="Reset to Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (searchMode === 'binary') {
                    setCurrentStepIndex(prev => Math.max(0, prev - 1));
                  } else {
                    setLinearStepIndex(prev => Math.max(0, prev - 1));
                  }
                  setIsPlaying(false);
                }}
                disabled={searchMode === 'binary' ? currentStepIndex === 0 : linearStepIndex === 0}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 ${
                  isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Step</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  isPlaying 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-sky-600 hover:bg-sky-500 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (searchMode === 'binary') {
                    setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
                  } else {
                    setLinearStepIndex(prev => Math.min(arr.length - 1, prev + 1));
                  }
                  setIsPlaying(false);
                }}
                disabled={
                  searchMode === 'binary' 
                    ? currentStepIndex === steps.length - 1 
                    : linearStepIndex === arr.length - 1 || arr[linearStepIndex] === target
                }
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 ${
                  isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className={`opacity-75 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>Speed:</span>
              {[0.5, 1, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-sky-600 text-white'
                      : isDark ? 'bg-[#161f30] text-stone-400 hover:text-stone-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CODE WALKTHROUGH & COMPLEXITY ANALYSIS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Synchronized Python Code Display */}
          <div className={`rounded-xl border overflow-hidden shadow-md ${
            isDark ? 'bg-[#0d121c] border-stone-800' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="px-4 py-2.5 bg-[#141a28] border-b border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span className="font-mono text-stone-300 text-xs font-bold ml-2">
                  binary_search.py (Live Execution Trace)
                </span>
              </div>
              <span className="text-[10px] font-mono bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800/60">
                Line {currentStep.codeLine} Active
              </span>
            </div>

            <div className="p-3 font-mono text-xs overflow-x-auto leading-relaxed">
              {PYTHON_CODE_LINES.map(({ line, text }) => {
                const isActive = searchMode === 'binary' && line === currentStep.codeLine;
                return (
                  <div
                    key={line}
                    className={`flex items-center px-2 py-0.5 rounded transition-colors ${
                      isActive 
                        ? 'bg-sky-500/30 text-sky-200 border-l-2 border-sky-400 font-bold' 
                        : 'text-stone-400 hover:bg-stone-800/20'
                    }`}
                  >
                    <span className="w-8 select-none text-stone-600 text-right pr-3 text-[11px]">
                      {line}
                    </span>
                    <span className={isActive ? 'text-white' : ''}>
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complexity & Comparison Card */}
          <div className={`p-5 rounded-xl border flex flex-col justify-between gap-4 shadow-sm ${
            isDark ? 'bg-[#101624] border-stone-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between border-b pb-2 mb-3 border-stone-800/60">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Time & Space Complexity Comparison</span>
                </h4>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isDark ? 'bg-[#182030] text-stone-300' : 'bg-slate-100 text-slate-700'
                }`}>
                  N = {arr.length} Elements
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className={`p-3 rounded-lg border ${
                  isDark ? 'bg-[#151c2c] border-sky-900/40 text-stone-300' : 'bg-sky-50/60 border-sky-200 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-sky-400">Binary Search:</span>
                    <span className="font-mono text-emerald-400">O(log N) Time • O(1) Space</span>
                  </div>
                  <p>
                    Every comparison eliminates exactly half the remaining elements.
                    For N = 1,000,000 items, binary search takes at most <strong>20 comparisons</strong>!
                  </p>
                </div>

                <div className={`p-3 rounded-lg border ${
                  isDark ? 'bg-[#151c2c] border-purple-900/40 text-stone-300' : 'bg-purple-50/60 border-purple-200 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-purple-400">Linear Search:</span>
                    <span className="font-mono text-rose-400">O(N) Time • O(1) Space</span>
                  </div>
                  <p>
                    Inspects elements one by one from left to right.
                    For N = 1,000,000 items, worst-case requires <strong>1,000,000 comparisons</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-xs ${
              isDark ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <strong className="block text-[11px] font-mono uppercase tracking-wider text-amber-400 mb-0.5">
                Critical Prerequisite:
              </strong>
              <span>
                Binary search <strong>strictly requires</strong> that the input collection is sorted. If unsorted, sorting first takes O(N log N), making a single search slower than linear search!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
