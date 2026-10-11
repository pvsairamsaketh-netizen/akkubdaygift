import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Info
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export interface SortStep {
  array: number[];
  comparingIndices: [number, number];
  swapped: boolean;
  sortedIndices: number[];
  explanation: string;
}

export const SortingVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection' | 'insertion'>('bubble');
  const [initialArray] = useState<number[]>([5, 2, 8, 1, 3]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate real deterministic steps for Bubble Sort
  const generateBubbleSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    const sorted: number[] = [];

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Initial array: [${list.join(', ')}]. Bubble Sort will repeatedly step through the list, compare adjacent elements, and swap them if they are in the wrong order.`
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const needSwap = list[j] > list[j + 1];
        if (needSwap) {
          const temp = list[j];
          list[j] = list[j + 1];
          list[j + 1] = temp;
        }

        history.push({
          array: [...list],
          comparingIndices: [j, j + 1],
          swapped: needSwap,
          sortedIndices: [...sorted],
          explanation: needSwap
            ? `Comparing indices ${j} & ${j + 1} (${list[j + 1]} > ${list[j]}): SWAPPED ${list[j + 1]} and ${list[j]} to bubble the larger value rightward.`
            : `Comparing indices ${j} & ${j + 1} (${list[j]} <= ${list[j + 1]}): In correct order, no swap needed.`
        });
      }
      sorted.push(n - i - 1);
    }
    sorted.push(0);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [0, 1, 2, 3, 4],
      explanation: `Bubble Sort Complete! Array is now sorted: [${list.join(', ')}]. Worst-case comparisons: O(N²).`
    });

    return history;
  };

  // Generate real deterministic steps for Selection Sort
  const generateSelectionSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    const sorted: number[] = [];

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [],
      explanation: `Initial array: [${list.join(', ')}]. Selection Sort divides the array into a sorted and unsorted region, finding the minimum element in each pass.`
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        const isSmaller = list[j] < list[minIdx];
        if (isSmaller) minIdx = j;

        history.push({
          array: [...list],
          comparingIndices: [minIdx, j],
          swapped: false,
          sortedIndices: [...sorted],
          explanation: isSmaller 
            ? `Found new minimum value ${list[j]} at index ${j}.`
            : `Comparing index ${j} (${list[j]}) with current min index ${minIdx} (${list[minIdx]}).`
        });
      }

      if (minIdx !== i) {
        const temp = list[i];
        list[i] = list[minIdx];
        list[minIdx] = temp;

        history.push({
          array: [...list],
          comparingIndices: [i, minIdx],
          swapped: true,
          sortedIndices: [...sorted, i],
          explanation: `Swapped minimum element ${list[i]} into sorted position index ${i}.`
        });
      }
      sorted.push(i);
    }
    sorted.push(n - 1);

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [0, 1, 2, 3, 4],
      explanation: `Selection Sort Complete! Sorted array: [${list.join(', ')}]. Performs O(N) swaps and O(N²) comparisons.`
    });

    return history;
  };

  // Generate real deterministic steps for Insertion Sort
  const generateInsertionSortSteps = (orig: number[]): SortStep[] => {
    const list = [...orig];
    const n = list.length;
    const history: SortStep[] = [];
    const sorted: number[] = [0];

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [0],
      explanation: `Initial array: [${list.join(', ')}]. Element [${list[0]}] at index 0 is trivially sorted.`
    });

    for (let i = 1; i < n; i++) {
      const key = list[i];
      let j = i - 1;

      while (j >= 0 && list[j] > key) {
        list[j + 1] = list[j];
        history.push({
          array: [...list],
          comparingIndices: [j, j + 1],
          swapped: true,
          sortedIndices: [...sorted],
          explanation: `Shifted ${list[j + 1]} rightward because it is greater than insertion key ${key}.`
        });
        j--;
      }
      list[j + 1] = key;
      sorted.push(i);

      history.push({
        array: [...list],
        comparingIndices: [j + 1, j + 1],
        swapped: false,
        sortedIndices: [...sorted],
        explanation: `Inserted key ${key} into position ${j + 1}. Left subarray [0..${i}] is now sorted.`
      });
    }

    history.push({
      array: [...list],
      comparingIndices: [-1, -1],
      swapped: false,
      sortedIndices: [0, 1, 2, 3, 4],
      explanation: `Insertion Sort Complete! Sorted: [${list.join(', ')}]. Adaptive: O(N) best case on nearly sorted data!`
    });

    return history;
  };

  useEffect(() => {
    let s: SortStep[] = [];
    if (algorithm === 'bubble') s = generateBubbleSortSteps(initialArray);
    else if (algorithm === 'selection') s = generateSelectionSortSteps(initialArray);
    else s = generateInsertionSortSteps(initialArray);

    setSteps(s);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [algorithm, initialArray]);

  useEffect(() => {
    if (isPlaying) {
      const delay = Math.round(1400 / playbackSpeed);
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

  const step = steps[currentStepIndex] || {
    array: initialArray,
    comparingIndices: [-1, -1],
    swapped: false,
    sortedIndices: [],
    explanation: 'Ready.'
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Sorting Engine: Real Step-by-Step State Simulator</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Input array: <code className="font-mono font-bold text-amber-400">[5, 2, 8, 1, 3]</code>. Watch real comparisons and in-place swaps.
          </p>
        </div>

        {/* Algorithm tabs */}
        <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-[#141b29] border-stone-800' : 'bg-slate-100 border-slate-300'
        }`}>
          {(['bubble', 'selection', 'insertion'] as const).map(a => (
            <button
              key={a}
              onClick={() => { setAlgorithm(a); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                algorithm === a
                  ? 'bg-amber-600 text-white shadow-sm'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {a} Sort
            </button>
          ))}
        </div>
      </div>

      {/* Visual Bars Container */}
      <div className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-6 ${
        isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-end justify-center gap-4 sm:gap-6 h-48 w-full max-w-md pt-4">
          {step.array.map((val, idx) => {
            const isComparing = step.comparingIndices.includes(idx);
            const isSorted = step.sortedIndices.includes(idx);
            const heightPx = Math.round((val / 10) * 140) + 30;

            let barBg = '';
            if (isComparing) {
              barBg = step.swapped 
                ? 'bg-rose-500 border-rose-400 shadow-rose-900/50 animate-bounce' 
                : 'bg-amber-500 border-amber-300 shadow-amber-900/50';
            } else if (isSorted) {
              barBg = 'bg-emerald-600 border-emerald-400';
            } else {
              barBg = isDark ? 'bg-sky-700/70 border-sky-600' : 'bg-sky-500 border-sky-400';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[56px]">
                <span className="font-mono text-xs font-bold">{val}</span>
                <div 
                  style={{ height: `${heightPx}px` }}
                  className={`w-full rounded-t-xl border transition-all duration-300 flex items-center justify-center shadow-lg ${barBg}`}
                >
                  <span className="text-white text-xs font-extrabold">{val}</span>
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-stone-500' : 'text-slate-500'}`}>
                  idx:{idx}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500 inline-block"></span>
            <span>Unsorted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
            <span>Active Comparison</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
            <span>Sorted Position</span>
          </div>
        </div>

        {/* Step Explanation */}
        <div className={`w-full p-3.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed ${
          isDark ? 'bg-[#101624] border-stone-800 text-stone-200' : 'bg-white border-slate-300 text-slate-800'
        }`}>
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-400 mr-1.5">Step {currentStepIndex + 1}/{steps.length}:</strong>
            {step.explanation}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between w-full gap-3 pt-2">
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
              className="px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer shadow-md"
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
                    ? 'bg-amber-600 text-white'
                    : isDark ? 'bg-[#161f30] text-stone-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
