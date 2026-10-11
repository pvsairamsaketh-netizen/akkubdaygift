import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  Plus, 
  Minus, 
  RotateCcw, 
  Info
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export const DataStructuresVisualizer: React.FC<{ initialType?: 'stack' | 'queue' | 'linked_list' | 'two_pointers' }> = ({
  initialType = 'stack'
}) => {
  const { isDark } = useAcademicsTheme();
  const [dsType, setDsType] = useState<'stack' | 'queue' | 'linked_list' | 'two_pointers'>(initialType);

  // Stack state
  const [stack, setStack] = useState<number[]>([10, 25, 42]);
  const [stackInput, setStackInput] = useState<string>('99');
  const [stackActionMsg, setStackActionMsg] = useState<string>('Stack initialized with 3 elements. LIFO: Last-In, First-Out.');

  // Queue state
  const [queue, setQueue] = useState<number[]>([101, 102, 103]);
  const [queueInput, setQueueInput] = useState<string>('104');
  const [queueActionMsg, setQueueActionMsg] = useState<string>('Queue initialized with 3 elements. FIFO: First-In, First-Out.');

  // Linked List state
  const [llNodes, setLlNodes] = useState<{ id: number; val: number }[]>([
    { id: 1, val: 12 },
    { id: 2, val: 45 },
    { id: 3, val: 78 }
  ]);
  const [llInput, setLlInput] = useState<string>('90');
  const [llActionMsg, setLlActionMsg] = useState<string>('Singly linked list with head pointer at index 0.');

  // Two Pointers state
  const [tpArr] = useState<number[]>([1, 2, 4, 7, 11, 15]);
  const [tpTarget] = useState<number>(15);
  const [tpLeft, setTpLeft] = useState<number>(0);
  const [tpRight, setTpRight] = useState<number>(5);
  const [tpMsg, setTpMsg] = useState<string>('Finding pair that sums to 15. Initial left=0 (1), right=5 (15).');

  // Stack handlers
  const handlePushStack = () => {
    const val = Number(stackInput.trim());
    if (isNaN(val)) return;
    if (stack.length >= 6) {
      setStackActionMsg('Stack Overflow! Maximum demonstration capacity reached (6 items).');
      return;
    }
    setStack(prev => [...prev, val]);
    setStackActionMsg(`PUSH: Pushed ${val} onto top of the stack. O(1) time complexity.`);
  };

  const handlePopStack = () => {
    if (stack.length === 0) {
      setStackActionMsg('Stack Underflow! Cannot pop from an empty stack.');
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(prev => prev.slice(0, prev.length - 1));
    setStackActionMsg(`POP: Removed top item ${popped} from the stack. O(1) time complexity.`);
  };

  // Queue handlers
  const handleEnqueue = () => {
    const val = Number(queueInput.trim());
    if (isNaN(val)) return;
    if (queue.length >= 6) {
      setQueueActionMsg('Queue Full! Maximum demonstration capacity reached (6 items).');
      return;
    }
    setQueue(prev => [...prev, val]);
    setQueueActionMsg(`ENQUEUE: Added customer/event #${val} to the REAR. O(1) amortized.`);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setQueueActionMsg('Queue Empty! Cannot dequeue.');
      return;
    }
    const dequeued = queue[0];
    setQueue(prev => prev.slice(1));
    setQueueActionMsg(`DEQUEUE: Served/removed customer/event #${dequeued} from the FRONT. O(1) with deque/circular array.`);
  };

  // Linked list handlers
  const handleAppendLL = () => {
    const val = Number(llInput.trim());
    if (isNaN(val)) return;
    if (llNodes.length >= 6) return;
    setLlNodes(prev => [...prev, { id: Date.now(), val }]);
    setLlActionMsg(`Created node with value ${val} on heap and updated tail.next pointer.`);
  };

  const handleRemoveHeadLL = () => {
    if (llNodes.length === 0) return;
    const removed = llNodes[0];
    setLlNodes(prev => prev.slice(1));
    setLlActionMsg(`Removed head node ${removed.val}. Head pointer updated to head.next.`);
  };

  // Two pointers stepping
  const handleStepTP = () => {
    const curSum = tpArr[tpLeft] + tpArr[tpRight];
    if (curSum === tpTarget) {
      setTpMsg(`FOUND MATCH! arr[${tpLeft}] (${tpArr[tpLeft]}) + arr[${tpRight}] (${tpArr[tpRight]}) = ${tpTarget}. O(N) convergence!`);
      return;
    }
    if (curSum > tpTarget) {
      if (tpRight > tpLeft + 1) {
        setTpRight(r => r - 1);
        setTpMsg(`Sum (${curSum}) > Target (${tpTarget}). Decrementing right pointer to decrease sum.`);
      }
    } else {
      if (tpLeft < tpRight - 1) {
        setTpLeft(l => l + 1);
        setTpMsg(`Sum (${curSum}) < Target (${tpTarget}). Incrementing left pointer to increase sum.`);
      }
    }
  };

  const handleResetTP = () => {
    setTpLeft(0);
    setTpRight(5);
    setTpMsg('Reset two pointers to bounds (left=0, right=5).');
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Core Data Structures Interactive Laboratory</span>
        </h4>

        <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-[#141b29] border-stone-800' : 'bg-slate-100 border-slate-300'
        }`}>
          {(['stack', 'queue', 'linked_list', 'two_pointers'] as const).map(type => (
            <button
              key={type}
              onClick={() => setDsType(type)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                dsType === type
                  ? 'bg-sky-600 text-white shadow-sm'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 1. STACK VISUALIZER */}
      {dsType === 'stack' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={stackInput}
                onChange={e => setStackInput(e.target.value)}
                className={`w-20 px-2.5 py-1.5 rounded-lg border font-mono ${
                  isDark ? 'bg-[#121722] border-stone-700 text-stone-200' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={handlePushStack}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Push (LIFO)</span>
              </button>
              <button
                onClick={handlePopStack}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Pop Top</span>
              </button>
            </div>
            <span className="font-mono opacity-75">Size: {stack.length}/6 items</span>
          </div>

          {/* Stack Container */}
          <div className={`p-6 rounded-xl border flex flex-col items-center justify-center min-h-[220px] ${
            isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-48 border-x-4 border-b-4 border-sky-600 rounded-b-2xl p-2 flex flex-col-reverse gap-2 bg-sky-950/20 min-h-[170px] justify-start">
              {stack.map((val, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between font-mono text-xs font-bold transition-all shadow-md ${
                      isTop 
                        ? 'bg-amber-500 text-black border-amber-400 ring-2 ring-amber-400/50' 
                        : 'bg-sky-600 text-white border-sky-500'
                    }`}
                  >
                    <span>[{val}]</span>
                    <span className="text-[10px] font-mono opacity-80">
                      {isTop ? 'TOP (Peek)' : `idx:${idx}`}
                    </span>
                  </div>
                );
              })}
              {stack.length === 0 && (
                <div className="text-center text-xs opacity-50 py-10 font-mono">
                  Stack is Empty
                </div>
              )}
            </div>
            <span className="text-[11px] font-mono text-sky-400 mt-2">
              Spring-loaded Plate Analogy: Items enter & exit only from the TOP
            </span>
          </div>

          <div className={`p-3 rounded-lg border text-xs ${
            isDark ? 'bg-[#101624] border-stone-800 text-stone-200' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            <Info className="w-4 h-4 text-sky-400 inline mr-1.5" />
            {stackActionMsg}
          </div>
        </div>
      )}

      {/* 2. QUEUE VISUALIZER */}
      {dsType === 'queue' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={queueInput}
                onChange={e => setQueueInput(e.target.value)}
                className={`w-20 px-2.5 py-1.5 rounded-lg border font-mono ${
                  isDark ? 'bg-[#121722] border-stone-700 text-stone-200' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={handleEnqueue}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enqueue (Rear)</span>
              </button>
              <button
                onClick={handleDequeue}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Dequeue (Front)</span>
              </button>
            </div>
            <span className="font-mono opacity-75">Size: {queue.length}/6 items</span>
          </div>

          {/* Queue Container */}
          <div className={`p-6 rounded-xl border flex flex-col items-center justify-center min-h-[180px] ${
            isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 overflow-x-auto p-3 w-full justify-center">
              <span className="text-[11px] font-mono text-rose-400 font-bold shrink-0">FRONT ➔</span>
              {queue.map((val, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-mono text-xs font-bold transition-all shadow-md shrink-0 ${
                      isFront
                        ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-400/50'
                        : isRear
                        ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/50'
                        : 'bg-indigo-600 text-white border-indigo-500'
                    }`}
                  >
                    <span>{val}</span>
                    <span className="text-[8px] opacity-80">{isFront ? 'FRONT' : isRear ? 'REAR' : `#${idx}`}</span>
                  </div>
                );
              })}
              {queue.length === 0 && (
                <div className="text-center text-xs opacity-50 py-4 font-mono">
                  Queue is Empty
                </div>
              )}
              <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">➔ REAR</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border text-xs ${
            isDark ? 'bg-[#101624] border-stone-800 text-stone-200' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            <Info className="w-4 h-4 text-indigo-400 inline mr-1.5" />
            {queueActionMsg}
          </div>
        </div>
      )}

      {/* 3. LINKED LIST VISUALIZER */}
      {dsType === 'linked_list' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={llInput}
                onChange={e => setLlInput(e.target.value)}
                className={`w-20 px-2.5 py-1.5 rounded-lg border font-mono ${
                  isDark ? 'bg-[#121722] border-stone-700 text-stone-200' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={handleAppendLL}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append Node</span>
              </button>
              <button
                onClick={handleRemoveHeadLL}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Delete Head</span>
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-xl border flex items-center justify-center overflow-x-auto min-h-[160px] ${
            isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded bg-amber-500 text-black font-mono text-xs font-bold">
                HEAD ➔
              </div>
              {llNodes.map((node, idx) => (
                <React.Fragment key={node.id}>
                  <div className="flex border-2 border-sky-500 rounded-xl overflow-hidden font-mono text-xs shadow-md">
                    <div className="px-3 py-2.5 bg-sky-600 text-white font-bold">
                      {node.val}
                    </div>
                    <div className="px-2.5 py-2.5 bg-sky-900 text-sky-300 border-l border-sky-500 text-[10px] flex items-center">
                      next
                    </div>
                  </div>
                  {idx < llNodes.length - 1 ? (
                    <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : (
                    <span className="font-mono text-xs text-rose-400 font-bold">➔ NULL</span>
                  )}
                </React.Fragment>
              ))}
              {llNodes.length === 0 && (
                <span className="font-mono text-xs text-stone-500">NULL (Empty List)</span>
              )}
            </div>
          </div>

          <div className={`p-3 rounded-lg border text-xs ${
            isDark ? 'bg-[#101624] border-stone-800 text-stone-200' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            <Info className="w-4 h-4 text-sky-400 inline mr-1.5" />
            {llActionMsg}
          </div>
        </div>
      )}

      {/* 4. TWO POINTERS VISUALIZER */}
      {dsType === 'two_pointers' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold">
              Array: <code className="font-mono text-sky-400">[1, 2, 4, 7, 11, 15]</code> • Target Sum = <strong className="text-emerald-400 font-mono">15</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetTP}
                className="px-2.5 py-1 rounded-lg border text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                Reset
              </button>
              <button
                onClick={handleStepTP}
                className="px-3 py-1 rounded-lg bg-sky-600 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Step Two Pointers ➔
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-4 ${
            isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-center gap-3">
              {tpArr.map((v, i) => {
                const isLeft = i === tpLeft;
                const isRight = i === tpRight;
                const isMatch = tpArr[tpLeft] + tpArr[tpRight] === tpTarget && (isLeft || isRight);

                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="h-5 flex items-center text-[10px] font-mono font-bold">
                      {isLeft && <span className="px-1.5 rounded bg-sky-500 text-white">LEFT</span>}
                      {isRight && <span className="px-1.5 rounded bg-purple-500 text-white">RIGHT</span>}
                    </div>

                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-sm font-bold transition-all ${
                      isMatch 
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/50 scale-110' 
                        : isLeft
                        ? 'bg-sky-600 text-white ring-2 ring-sky-400'
                        : isRight
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : isDark ? 'bg-[#121724] border-stone-800 text-stone-300' : 'bg-white border-slate-300 text-slate-800'
                    }`}>
                      {v}
                    </div>

                    <span className="text-[10px] font-mono opacity-60">idx:{i}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-xs font-mono font-semibold">
              Current Pair Sum: <span className="text-sky-400">{tpArr[tpLeft]}</span> + <span className="text-purple-400">{tpArr[tpRight]}</span> = <span className="text-amber-400 font-bold">{tpArr[tpLeft] + tpArr[tpRight]}</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border text-xs ${
            isDark ? 'bg-[#101624] border-stone-800 text-stone-200' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            <Info className="w-4 h-4 text-emerald-400 inline mr-1.5" />
            {tpMsg}
          </div>
        </div>
      )}
    </div>
  );
};
