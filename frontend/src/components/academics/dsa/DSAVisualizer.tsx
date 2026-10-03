import React, { useState } from 'react';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface DSAVisualizerProps {
  type?: 'binary_search' | 'stack' | 'queue' | 'linked_list' | 'two_pointers' | 'sliding_window' | 'tree' | 'dp';
  title?: string;
}

export const DSAVisualizer: React.FC<DSAVisualizerProps> = ({
  type = 'binary_search',
  title = 'Interactive Algorithm Visualization'
}) => {
  // Binary Search State
  const bsArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = 23;
  const [bsStep, setBsStep] = useState(0);
  const bsSteps = [
    { low: 0, high: 9, mid: 4, msg: 'Initial search space: low=0 (2), high=9 (91), mid=4 (16). 16 < 23 -> Search right.' },
    { low: 5, high: 9, mid: 7, msg: 'Updated search space: low=5 (23), high=9 (91), mid=7 (56). 56 > 23 -> Search left.' },
    { low: 5, high: 6, mid: 5, msg: 'Target found! array[5] == 23 at index 5 in O(log N) = 3 comparisons!' }
  ];

  // Two Pointers State
  const tpArray = [1, 2, 4, 7, 11, 15];
  const tpTarget = 15;
  const [tpStep, setTpStep] = useState(0);
  const tpSteps = [
    { left: 0, right: 5, sum: 16, msg: 'left=0 (1), right=5 (15). Sum = 16 > 15 -> Move right pointer inward (right--).' },
    { left: 0, right: 4, sum: 12, msg: 'left=0 (1), right=4 (11). Sum = 12 < 15 -> Move left pointer inward (left++).' },
    { left: 1, right: 4, sum: 13, msg: 'left=1 (2), right=4 (11). Sum = 13 < 15 -> Move left pointer inward (left++).' },
    { left: 2, right: 4, sum: 15, msg: 'Pair found! array[2] (4) + array[4] (11) = 15 in O(N) linear time!' }
  ];

  // Stack State
  const [stackItems, setStackItems] = useState<string[]>(['10', '25', '42']);
  const [stackMsg, setStackMsg] = useState('Stack maintains LIFO (Last-In-First-Out) order.');

  // Linked List State
  const [llActiveNode, setLlActiveNode] = useState(0);
  const llNodes = [
    { val: 10, next: 20 },
    { val: 20, next: 30 },
    { val: 30, next: 40 },
    { val: 40, next: null }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#090d14] via-[#0d131f] to-[#090d14] border border-sky-800/40 shadow-xl my-4">
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs sm:text-sm font-bold text-sky-300 font-mono uppercase tracking-wider">
            {title}
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
          Interactive Dry-Run Engine
        </span>
      </div>

      {/* 1. BINARY SEARCH VISUALIZATION */}
      {type === 'binary_search' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-stone-300 leading-relaxed">
            Target to search: <span className="font-bold text-amber-400 font-mono">{target}</span> in sorted array.
          </div>

          {/* Array visualization */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center py-2 overflow-x-auto">
            {bsArray.map((val, idx) => {
              const cur = bsSteps[bsStep];
              const isMid = idx === cur.mid;
              const isLow = idx === cur.low;
              const isHigh = idx === cur.high;
              const inRange = idx >= cur.low && idx <= cur.high;

              let bg = 'bg-[#141a24] border-stone-800 text-stone-400 opacity-40';
              if (inRange) bg = 'bg-[#182333] border-sky-800 text-stone-200';
              if (isMid) bg = 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-950';
              if (val === target && bsStep === bsSteps.length - 1 && isMid) {
                bg = 'bg-emerald-500/30 border-emerald-400 text-emerald-300 font-bold animate-pulse';
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center font-mono text-xs sm:text-sm transition-all ${bg}`}>
                    {val}
                  </div>
                  <span className="text-[9px] font-mono text-stone-500 mt-1">idx:{idx}</span>
                  <div className="h-3 flex gap-0.5 text-[8px] font-mono font-bold">
                    {isLow && <span className="text-sky-400">L</span>}
                    {isMid && <span className="text-amber-400">M</span>}
                    {isHigh && <span className="text-purple-400">H</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Message */}
          <div className="p-3 rounded-xl bg-[#101622] border border-sky-900/40 text-xs text-sky-200 font-mono flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>Step {bsStep + 1}/{bsSteps.length}: {bsSteps[bsStep].msg}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setBsStep(s => Math.max(0, s - 1))}
              disabled={bsStep === 0}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-xs disabled:opacity-30 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev Step
            </button>
            <button
              onClick={() => setBsStep(0)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-xs hover:bg-stone-700 text-stone-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button
              onClick={() => setBsStep(s => Math.min(bsSteps.length - 1, s + 1))}
              disabled={bsStep === bsSteps.length - 1}
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-xs disabled:opacity-30 hover:bg-sky-500 text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next Step <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. TWO POINTERS VISUALIZATION */}
      {type === 'two_pointers' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-stone-300 leading-relaxed">
            Finding pair summing to target: <span className="font-bold text-emerald-400 font-mono">{tpTarget}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center py-2">
            {tpArray.map((val, idx) => {
              const cur = tpSteps[tpStep];
              const isL = idx === cur.left;
              const isR = idx === cur.right;

              let style = 'bg-[#141a24] border-stone-800 text-stone-400';
              if (isL) style = 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold';
              if (isR) style = 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold';
              if ((isL || isR) && tpStep === tpSteps.length - 1) {
                style = 'bg-emerald-500/30 border-emerald-400 text-emerald-300 font-bold animate-pulse';
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm transition-all ${style}`}>
                    {val}
                  </div>
                  <div className="h-4 flex gap-1 text-[9px] font-mono font-bold mt-1">
                    {isL && <span className="text-sky-400">Left</span>}
                    {isR && <span className="text-rose-400">Right</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-[#101622] border border-sky-900/40 text-xs text-sky-200 font-mono">
            Step {tpStep + 1}/{tpSteps.length}: {tpSteps[tpStep].msg}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setTpStep(s => Math.max(0, s - 1))}
              disabled={tpStep === 0}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-xs disabled:opacity-30 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            >
              Prev
            </button>
            <button
              onClick={() => setTpStep(0)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-xs hover:bg-stone-700 text-stone-400 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={() => setTpStep(s => Math.min(tpSteps.length - 1, s + 1))}
              disabled={tpStep === tpSteps.length - 1}
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-xs disabled:opacity-30 hover:bg-sky-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 3. STACK VISUALIZATION */}
      {type === 'stack' && (
        <div className="flex flex-col gap-3 items-center">
          <div className="flex flex-col-reverse items-center gap-1 w-44 p-3 rounded-2xl bg-[#0c1017] border-2 border-dashed border-stone-800 min-h-[140px] justify-start">
            {stackItems.map((item, idx) => (
              <div 
                key={idx} 
                className={`w-full py-2 rounded-lg text-center font-mono text-xs font-bold border transition-all ${
                  idx === stackItems.length - 1 
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md' 
                    : 'bg-[#151b26] border-stone-700 text-stone-300'
                }`}
              >
                {item} {idx === stackItems.length - 1 && <span className="text-[10px] text-amber-400 font-sans ml-1">(TOP)</span>}
              </div>
            ))}
            {stackItems.length === 0 && (
              <span className="text-stone-500 text-xs my-auto">Stack is Empty</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextVal = String(Math.floor(Math.random() * 89 + 10));
                setStackItems(prev => [...prev, nextVal]);
                setStackMsg(`Pushed ${nextVal} onto stack. Top pointer points to ${nextVal}.`);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
            >
              + Push Element
            </button>
            <button
              onClick={() => {
                if (stackItems.length === 0) return;
                const popped = stackItems[stackItems.length - 1];
                setStackItems(prev => prev.slice(0, -1));
                setStackMsg(`Popped ${popped} from stack top in O(1) time.`);
              }}
              disabled={stackItems.length === 0}
              className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold disabled:opacity-30 cursor-pointer"
            >
              - Pop Element
            </button>
            <button
              onClick={() => {
                setStackItems(['10', '25', '42']);
                setStackMsg('Reset stack to initial state.');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="text-xs text-purple-300 font-mono bg-purple-950/20 border border-purple-800/40 p-2 rounded-lg w-full text-center">
            {stackMsg}
          </div>
        </div>
      )}

      {/* 4. LINKED LIST POINTER VISUALIZATION */}
      {type === 'linked_list' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 justify-center py-2 overflow-x-auto">
            {llNodes.map((node, idx) => {
              const isActive = idx === llActiveNode;
              return (
                <React.Fragment key={idx}>
                  <div 
                    onClick={() => setLlActiveNode(idx)}
                    className={`p-3 rounded-xl border flex flex-col items-center min-w-[70px] cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md scale-105' 
                        : 'bg-[#141a24] border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-[10px] text-stone-500 font-mono">Node</span>
                    <span className="font-mono text-sm font-bold text-white">{node.val}</span>
                    <span className="text-[9px] font-mono text-sky-400 mt-1">next: {node.next ? `${node.next}` : 'NULL'}</span>
                  </div>
                  {idx < llNodes.length - 1 ? (
                    <ArrowRight className="w-4 h-4 text-sky-500 shrink-0" />
                  ) : (
                    <span className="text-xs font-mono text-rose-400 font-bold px-2 py-1 bg-rose-950/40 rounded border border-rose-800/40">
                      NULL
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="p-2.5 rounded-xl bg-[#101622] border border-sky-900/40 text-xs text-sky-200 text-center font-mono">
            Active pointer: Node({llNodes[llActiveNode].val}) at index {llActiveNode}. Dereferencing <code className="text-amber-300">current.next</code> traverses to the next heap node.
          </div>
        </div>
      )}
    </div>
  );
};
