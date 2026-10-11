import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  RotateCcw, 
  Network, 
  CheckCircle2, 
  Info, 
  Sparkles
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export const SparkPartitionVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [transformationType, setTransformationType] = useState<'narrow' | 'wide'>('narrow');
  const [isExecuted, setIsExecuted] = useState<boolean>(false);

  // 3 Partitions with sample key-value records
  const initialPartitions = [
    { id: 0, executor: 'Executor 1', records: [{ key: 'A', val: 10 }, { key: 'B', val: 20 }] },
    { id: 1, executor: 'Executor 2', records: [{ key: 'A', val: 15 }, { key: 'C', val: 30 }] },
    { id: 2, executor: 'Executor 3', records: [{ key: 'B', val: 25 }, { key: 'A', val: 5 }] }
  ];

  // Narrow transformation: map(val * 2) - strictly in-memory per partition, zero network traffic!
  const narrowTransformed = [
    { id: 0, executor: 'Executor 1', records: [{ key: 'A', val: 20 }, { key: 'B', val: 40 }] },
    { id: 1, executor: 'Executor 2', records: [{ key: 'A', val: 30 }, { key: 'C', val: 60 }] },
    { id: 2, executor: 'Executor 3', records: [{ key: 'B', val: 50 }, { key: 'A', val: 10 }] }
  ];

  // Wide transformation: reduceByKey(sum) - requires Shuffle Exchange across the cluster network!
  const wideTransformed = [
    { id: 0, executor: 'Executor 1', records: [{ key: 'A', val: 30 }] }, // Sum of A: 10 + 15 + 5 = 30
    { id: 1, executor: 'Executor 2', records: [{ key: 'B', val: 45 }] }, // Sum of B: 20 + 25 = 45
    { id: 2, executor: 'Executor 3', records: [{ key: 'C', val: 30 }] }  // Sum of C: 30 = 30
  ];

  const currentPartitions = isExecuted 
    ? (transformationType === 'narrow' ? narrowTransformed : wideTransformed)
    : initialPartitions;

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Apache Spark: Distributed Partitions & Shuffle Visualizer</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Understand distributed execution mechanics, Narrow vs Wide transformations, and the network cost of Shuffles.
          </p>
        </div>

        <button
          onClick={() => setIsExecuted(false)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer ${
            isDark ? 'bg-[#161f30] text-stone-300 border-stone-700' : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset DAG</span>
        </button>
      </div>

      {/* Control Strip */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 ${
        isDark ? 'bg-[#0f1422] border-stone-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Select Operation:</span>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => { setTransformationType('narrow'); setIsExecuted(false); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                transformationType === 'narrow'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : isDark ? 'bg-[#182030] text-stone-400 hover:text-stone-200' : 'bg-white text-slate-600 border border-slate-300'
              }`}
            >
              Narrow: df.map(val * 2)
            </button>
            <button
              onClick={() => { setTransformationType('wide'); setIsExecuted(false); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                transformationType === 'wide'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark ? 'bg-[#182030] text-stone-400 hover:text-stone-200' : 'bg-white text-slate-600 border border-slate-300'
              }`}
            >
              Wide: df.reduceByKey(sum) [Shuffle!]
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsExecuted(true)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
            isExecuted
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isExecuted ? 'Triggered Action: df.collect() ✓' : 'Trigger Action (Execute DAG)'}</span>
        </button>
      </div>

      {/* Execution Visualizer Container */}
      <div className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-6 ${
        isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {currentPartitions.map((part) => (
            <div
              key={part.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                isExecuted
                  ? transformationType === 'wide'
                    ? 'border-purple-500/80 bg-purple-950/20'
                    : 'border-sky-500/80 bg-sky-950/20'
                  : isDark ? 'bg-[#101624] border-stone-800' : 'bg-white border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-stone-800/60">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-xs font-bold text-sky-300">
                    Partition {part.id}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isDark ? 'bg-[#182030] text-stone-300' : 'bg-slate-100 text-slate-700'
                }`}>
                  {part.executor}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
                  RAM RDD/DataFrame Blocks:
                </span>
                {part.records.map((r, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg font-mono text-xs font-bold flex items-center justify-between border ${
                      isDark ? 'bg-[#151c2a] border-stone-700' : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    <span className="text-amber-400">Key: '{r.key}'</span>
                    <span className="text-emerald-400">Value: {r.val}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono opacity-60 text-right">
                Status: {isExecuted ? 'Executed' : 'Lazy Plan (Awaiting Action)'}
              </div>
            </div>
          ))}
        </div>

        {/* Shuffle Network Alert banner */}
        {isExecuted && transformationType === 'wide' && (
          <div className="w-full p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300 text-xs flex items-center gap-3">
            <Network className="w-5 h-5 text-purple-400 shrink-0 animate-pulse" />
            <div>
              <strong>Shuffle Exchange (Heavy Network I/O):</strong> Spark redistributed data across nodes so all records with Key='A' landed on Partition 0, Key='B' on Partition 1, and Key='C' on Partition 2. This network serialization & deserialization is why shuffles are the #1 bottleneck in big data!
            </div>
          </div>
        )}

        {isExecuted && transformationType === 'narrow' && (
          <div className="w-full p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/40 text-sky-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <strong>Narrow Transformation (Zero Network Shuffle):</strong> Each executor performed <code className="text-amber-300">map()</code> directly on its local in-memory partition without contacting other worker nodes. Optimal pipelined execution!
            </div>
          </div>
        )}

        <div className={`w-full p-3 rounded-lg border text-xs ${
          isDark ? 'bg-[#101624] border-stone-800 text-stone-300' : 'bg-white border-slate-300 text-slate-800'
        }`}>
          <Info className="w-4 h-4 text-sky-400 inline mr-1.5" />
          <strong>Spark Lazy Evaluation Rule:</strong> Defining transformations (<code className="text-sky-300">filter</code>, <code className="text-sky-300">map</code>, <code className="text-sky-300">groupBy</code>) simply builds a Logical Execution DAG. Spark does not compute anything until an <strong>Action</strong> (<code className="text-amber-300">count()</code>, <code className="text-amber-300">collect()</code>, <code className="text-amber-300">save()</code>) is called!
        </div>
      </div>
    </div>
  );
};
