import React, { useState } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Lightbulb, 
  Play, 
  ArrowRight, 
  FileText, 
  Cpu, 
  Workflow, 
  GraduationCap, 
  BookOpen,
  Eye,
  EyeOff,
  Database,
  Server
} from 'lucide-react';
import type { DayLesson } from '../../types/academics';
import { DSAVisualizer } from './dsa/DSAVisualizer';

interface TutorialViewerProps {
  lesson: DayLesson;
  onNavigateToPractice?: () => void;
  onNavigateToMCQ?: () => void;
  onNavigateToInterview?: () => void;
  onSaveNote?: (title: string, content: string) => void;
}

// Interactive Visual Diagram Components for DE Core Modules & DSA
const ConceptDiagram: React.FC<{ dayNumber: number; subject?: string }> = ({ dayNumber }) => {
  if (dayNumber >= 101 && dayNumber <= 130) {
    if (dayNumber === 104) {
      return <DSAVisualizer type="binary_search" title="Binary Search Divide-and-Conquer Engine" />;
    }
    if (dayNumber === 106) {
      return <DSAVisualizer type="linked_list" title="Singly Linked List Pointer Engine" />;
    }
    if (dayNumber === 107) {
      return <DSAVisualizer type="stack" title="Monotonic Stack LIFO Push & Pop Simulator" />;
    }
    if (dayNumber === 121) {
      return <DSAVisualizer type="two_pointers" title="Two-Pointer Convergence Simulator" />;
    }
    return <DSAVisualizer type="binary_search" title={`Day ${dayNumber}: Placement Visual Execution Engine`} />;
  }

  if (dayNumber >= 1 && dayNumber <= 10) {
    // Python Memory & Pointer Model Diagram
    return (
      <div className="p-4 rounded-xl bg-[#090d13] border border-sky-900/40 my-3">
        <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-sky-300 font-mono uppercase tracking-wider">
              Interactive Architectural Diagram: CPython Memory & Reference Model
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800/60">
            Stack vs Heap Pointers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stack Pointers */}
          <div className="p-3 rounded-lg bg-[#111620] border border-stone-800">
            <div className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Call Stack (Variable Names / Namespaces)</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 rounded bg-[#161f2e] border border-sky-800/40 flex items-center justify-between">
                <span className="text-amber-300 font-bold">variable: a</span>
                <span className="text-stone-400 text-[10px]">points to →</span>
                <span className="text-sky-300">0x7ffd1 (PyObject: 1001)</span>
              </div>
              <div className="p-2 rounded bg-[#161f2e] border border-sky-800/40 flex items-center justify-between">
                <span className="text-amber-300 font-bold">variable: b</span>
                <span className="text-stone-400 text-[10px]">points to →</span>
                <span className="text-emerald-300">0x7ffd0 (PyObject: 1000)</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2 leading-relaxed">
              Integers are immutable. Re-binding <code className="text-amber-300">a += 1</code> allocated a brand new PyObject on heap rather than modifying in-place.
            </p>
          </div>

          {/* Heap Memory */}
          <div className="p-3 rounded-lg bg-[#111620] border border-stone-800">
            <div className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>CPython Private Heap (Allocated Objects)</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 rounded bg-[#13221a] border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <span className="text-emerald-300 font-bold">PyLongObject [1000]</span>
                  <div className="text-[10px] text-stone-400">refcount: 1</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400">Immutable</span>
              </div>
              <div className="p-2 rounded bg-[#1b2230] border border-sky-800/40 flex items-center justify-between">
                <div>
                  <span className="text-sky-300 font-bold">PyLongObject [1001]</span>
                  <div className="text-[10px] text-stone-400">refcount: 1</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400">New Object</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2 leading-relaxed">
              In ETL loops, repeatedly concatenating strings or modifying lists in-place directly impacts Garbage Collection cycles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (dayNumber >= 11 && dayNumber <= 22) {
    // SQL Execution Order Diagram
    return (
      <div className="p-4 rounded-xl bg-[#090d13] border border-sky-900/40 my-3">
        <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-sky-300 font-mono uppercase tracking-wider">
              Logical SQL Execution Order (The #1 Data Engineering Interview Trap)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800/60">
            Engine Pipeline
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 justify-center py-2">
          {[
            { step: '1', name: 'FROM & JOIN', desc: 'Identify Cartesian product / joined datasets' },
            { step: '2', name: 'WHERE', desc: 'Filter individual rows before grouping' },
            { step: '3', name: 'GROUP BY', desc: 'Aggregate rows into distinct buckets' },
            { step: '4', name: 'HAVING', desc: 'Filter aggregated groups' },
            { step: '5', name: 'SELECT / WINDOW', desc: 'Compute columns & OVER(...) partitions' },
            { step: '6', name: 'DISTINCT', desc: 'Deduplicate remaining output tuples' },
            { step: '7', name: 'ORDER BY', desc: 'Sort result set (can use SELECT aliases)' },
            { step: '8', name: 'LIMIT / OFFSET', desc: 'Slice output window' }
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div className="p-2 rounded-lg bg-[#111722] border border-sky-800/50 flex flex-col items-center min-w-[100px] text-center hover:border-sky-400 transition-colors">
                <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded mb-1">Step {item.step}</span>
                <span className="font-mono text-xs font-bold text-stone-100">{item.name}</span>
                <span className="text-[9px] text-stone-400 mt-0.5 max-w-[90px]">{item.desc}</span>
              </div>
              {idx < arr.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-stone-600 shrink-0 hidden sm:inline" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-800/40 p-2 rounded-lg mt-3">
          💡 <strong>Interview Gold</strong>: This is why you <em>cannot</em> use a <code className="font-mono text-white">SELECT</code> alias in the <code className="font-mono text-white">WHERE</code> clause — the WHERE clause executes at Step 2 before SELECT columns even exist!
        </p>
      </div>
    );
  }

  if (dayNumber >= 45 && dayNumber <= 51) {
    // Kimball Star Schema vs Snowflake
    return (
      <div className="p-4 rounded-xl bg-[#090d13] border border-indigo-900/40 my-3">
        <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider">
              Kimball Dimensional Modeling: Star Schema Architecture
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/60">
            Warehouse Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Dimension 1 & 2 */}
          <div className="flex flex-col gap-2">
            <div className="p-2.5 rounded-lg bg-[#141824] border border-indigo-800/40 text-xs">
              <span className="font-bold text-indigo-300 block mb-1">dim_customer (SCD Type 2)</span>
              <span className="text-[10px] font-mono text-stone-400 block">• customer_key (Surrogate PK)</span>
              <span className="text-[10px] font-mono text-stone-400 block">• customer_id, name, tier</span>
              <span className="text-[10px] font-mono text-stone-400 block">• effective_date, end_date, is_current</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#141824] border border-indigo-800/40 text-xs">
              <span className="font-bold text-indigo-300 block mb-1">dim_product</span>
              <span className="text-[10px] font-mono text-stone-400 block">• product_key (PK), sku, category</span>
            </div>
          </div>

          {/* Central Fact Table */}
          <div className="p-3.5 rounded-xl bg-[#1c1836] border-2 border-indigo-500 text-center shadow-lg shadow-indigo-950/40">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              Central Grain: 1 Row Per Order Item
            </span>
            <h4 className="font-mono font-bold text-sm text-white mt-1">fact_sales</h4>
            <div className="text-[10px] font-mono text-indigo-200 mt-2 text-left space-y-0.5 bg-[#120f24] p-2 rounded border border-indigo-800/60">
              <div className="text-amber-300">🔑 customer_key (FK)</div>
              <div className="text-amber-300">🔑 product_key (FK)</div>
              <div className="text-amber-300">🔑 date_key (FK)</div>
              <div className="text-emerald-300 mt-1">📊 quantity (Additive Measure)</div>
              <div className="text-emerald-300">📊 total_amount (Additive Measure)</div>
              <div className="text-emerald-300">📊 discount_pct (Semi-additive)</div>
            </div>
          </div>

          {/* Dimension 3 & 4 */}
          <div className="flex flex-col gap-2">
            <div className="p-2.5 rounded-lg bg-[#141824] border border-indigo-800/40 text-xs">
              <span className="font-bold text-indigo-300 block mb-1">dim_date</span>
              <span className="text-[10px] font-mono text-stone-400 block">• date_key (YYYYMMDD PK)</span>
              <span className="text-[10px] font-mono text-stone-400 block">• day, month, quarter, fiscal_year</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#141824] border border-indigo-800/40 text-xs">
              <span className="font-bold text-indigo-300 block mb-1">dim_store / channel</span>
              <span className="text-[10px] font-mono text-stone-400 block">• store_key (PK), region, country</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dayNumber >= 57 && dayNumber <= 70) {
    // Apache Spark Architecture Diagram
    return (
      <div className="p-4 rounded-xl bg-[#090d13] border border-rose-900/40 my-3">
        <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-rose-300 font-mono uppercase tracking-wider">
              Apache Spark Cluster Architecture & Execution Flow
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800/60">
            Catalyst & Tungsten
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Driver Program */}
          <div className="p-3 rounded-lg bg-[#1a1215] border border-rose-800/50 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-rose-300 font-mono flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Driver Program
              </div>
              <p className="text-[10px] text-stone-300 leading-relaxed">
                Contains <code className="text-amber-300">SparkSession</code>, generates the Logical Plan, Catalyst Optimizer creates Physical Execution Plan, splits DAG into <strong>Stages</strong> at Wide Transformation boundaries.
              </p>
            </div>
            <div className="mt-2 text-[9px] font-mono bg-[#281318] p-1.5 rounded text-rose-200 border border-rose-900/50">
              DAGScheduler & TaskScheduler
            </div>
          </div>

          {/* Cluster Manager */}
          <div className="p-3 rounded-lg bg-[#14161f] border border-stone-800 flex flex-col justify-center items-center text-center">
            <Server className="w-6 h-6 text-sky-400 mb-1" />
            <span className="text-xs font-bold text-stone-100">Cluster Manager</span>
            <span className="text-[10px] text-stone-400 mt-1 font-mono">YARN / Kubernetes / Standalone</span>
            <p className="text-[10px] text-stone-400 mt-1">
              Allocates CPU cores & RAM for worker executor containers.
            </p>
          </div>

          {/* Worker Nodes & Executors */}
          <div className="p-3 rounded-lg bg-[#131b18] border border-emerald-800/50 flex flex-col gap-2">
            <div className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Executors (Workers)
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-stone-300">
              <div className="p-1.5 rounded bg-[#162720] border border-emerald-900/60 text-center">
                <span className="block text-emerald-400 font-bold">Executor 1</span>
                Task 1 | Task 2
                <span className="block text-[8px] text-stone-400">RAM Cache + Off-Heap</span>
              </div>
              <div className="p-1.5 rounded bg-[#162720] border border-emerald-900/60 text-center">
                <span className="block text-emerald-400 font-bold">Executor 2</span>
                Task 3 | Task 4
                <span className="block text-[8px] text-stone-400">RAM Cache + Off-Heap</span>
              </div>
            </div>
            <p className="text-[9px] text-stone-400">
              Wide transformations (e.g. <code className="text-amber-300">groupBy</code>, <code className="text-amber-300">join</code>) trigger network Shuffle across executors.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (dayNumber >= 78 && dayNumber <= 86) {
    // Apache Kafka Architecture Diagram
    return (
      <div className="p-4 rounded-xl bg-[#090d13] border border-purple-900/40 my-3">
        <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-300 font-mono uppercase tracking-wider">
              Apache Kafka Distributed Commit Log & Partitioning
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/60">
            Ordered Partitions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center">
          {/* Producers */}
          <div className="p-2.5 rounded-lg bg-[#181324] border border-purple-800/40 text-xs">
            <span className="font-bold text-purple-300 block mb-1">Producers</span>
            <p className="text-[10px] text-stone-300 leading-tight">
              Publish events with key & value. Key hash determines partition:
            </p>
            <code className="text-[9px] font-mono text-amber-300 block mt-1 bg-[#100d1a] p-1 rounded">
              hash(key) % num_partitions
            </code>
          </div>

          {/* Topic Partitions (Center 2 cols) */}
          <div className="md:col-span-2 p-3 rounded-xl bg-[#110e1f] border border-purple-700/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-200 mb-2 font-mono">
              <span>Topic: "customer_orders"</span>
              <span className="text-[10px] text-stone-400">Replication Factor: 3</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="p-1.5 rounded bg-[#1b1530] border border-purple-900 flex items-center justify-between">
                <span className="text-amber-400 font-bold text-[10px]">Partition 0</span>
                <div className="flex gap-1 text-[9px]">
                  <span className="px-1 bg-stone-800 rounded">offset 0</span>
                  <span className="px-1 bg-stone-800 rounded">1</span>
                  <span className="px-1 bg-stone-800 rounded">2</span>
                  <span className="px-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">3 (Head)</span>
                </div>
              </div>
              <div className="p-1.5 rounded bg-[#1b1530] border border-purple-900 flex items-center justify-between">
                <span className="text-amber-400 font-bold text-[10px]">Partition 1</span>
                <div className="flex gap-1 text-[9px]">
                  <span className="px-1 bg-stone-800 rounded">offset 0</span>
                  <span className="px-1 bg-stone-800 rounded">1</span>
                  <span className="px-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">2 (Head)</span>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-stone-400 mt-2">
              Strict ordering is guaranteed <strong>within a partition</strong>, NOT across multiple partitions.
            </p>
          </div>

          {/* Consumer Group */}
          <div className="p-2.5 rounded-lg bg-[#181324] border border-purple-800/40 text-xs">
            <span className="font-bold text-purple-300 block mb-1">Consumer Group</span>
            <p className="text-[10px] text-stone-300 leading-tight">
              Each partition is consumed by exactly one consumer within the group.
            </p>
            <div className="mt-1 text-[9px] font-mono text-emerald-300 bg-[#100d1a] p-1 rounded">
              Consumer A → Part 0<br/>Consumer B → Part 1
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default clean pipeline flow diagram for other days
  return (
    <div className="p-3.5 rounded-xl bg-[#090d13] border border-stone-800 my-3">
      <div className="flex items-center justify-between mb-2 border-b border-stone-800 pb-2">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-stone-200 font-mono uppercase tracking-wider">
            Production Pipeline Workflow Architecture
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400">Zero-Data-Loss Pipeline</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 py-1 text-center font-mono text-xs">
        <div className="p-2 rounded bg-[#131924] border border-sky-900/50 flex-1 min-w-[120px]">
          <span className="text-[10px] text-sky-400 block font-bold">1. Ingestion</span>
          <span className="text-stone-200 text-xs font-semibold">Source APIs / DB</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-stone-600 shrink-0 hidden sm:inline" />
        <div className="p-2 rounded bg-[#1a1429] border border-purple-900/50 flex-1 min-w-[120px]">
          <span className="text-[10px] text-purple-400 block font-bold">2. Transport</span>
          <span className="text-stone-200 text-xs font-semibold">Kafka / Stream</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-stone-600 shrink-0 hidden sm:inline" />
        <div className="p-2 rounded bg-[#1e1318] border border-rose-900/50 flex-1 min-w-[120px]">
          <span className="text-[10px] text-rose-400 block font-bold">3. Processing</span>
          <span className="text-stone-200 text-xs font-semibold">PySpark / Airflow</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-stone-600 shrink-0 hidden sm:inline" />
        <div className="p-2 rounded bg-[#111e18] border border-emerald-900/50 flex-1 min-w-[120px]">
          <span className="text-[10px] text-emerald-400 block font-bold">4. Serving</span>
          <span className="text-stone-200 text-xs font-semibold">Warehouse & Tableau</span>
        </div>
      </div>
    </div>
  );
};

// Helper to parse **bold** and `code` inline tokens
const parseInlineMarkdown = (text: string) => {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={idx} className="font-semibold text-sky-200">
          {boldText}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return (
        <code key={idx} className="px-1.5 py-0.5 mx-0.5 rounded bg-[#131b26] text-emerald-400 font-mono text-[11px] border border-emerald-900/40">
          {codeText}
        </code>
      );
    }
    return part;
  });
};

// Helper to render text with numbered/bullet lists into structured interactive cards
const renderFormattedText = (raw: string) => {
  const lines = raw.split('\n');
  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-200">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-0.5" />;

        const isNumbered = /^\d+\.\s+/.test(trimmed);
        const isBullet = /^[-*]\s+/.test(trimmed);

        const contentWithoutPrefix = trimmed.replace(/^(\d+\.\s+|[-*]\s+)/, '');
        const parts = parseInlineMarkdown(contentWithoutPrefix);

        if (isNumbered || isBullet) {
          return (
            <div 
              key={lIdx} 
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#141a24]/90 border border-stone-800/90 hover:border-sky-800/50 transition-colors shadow-sm"
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                isNumbered 
                  ? 'bg-sky-950 text-sky-400 border border-sky-800/60' 
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
              }`}>
                {isNumbered ? trimmed.match(/^\d+/)?.[0] || '•' : '▸'}
              </span>
              <div className="text-stone-200 leading-relaxed flex-1">
                {parts}
              </div>
            </div>
          );
        }

        return (
          <p key={lIdx} className="text-stone-300 leading-relaxed">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const TutorialViewer: React.FC<TutorialViewerProps> = ({
  lesson,
  onNavigateToPractice,
  onNavigateToMCQ,
  onNavigateToInterview,
  onSaveNote
}) => {
  const [learningMode, setLearningMode] = useState<'placement' | 'deep_dive'>('placement');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [revealedQuiz, setRevealedQuiz] = useState<boolean>(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuickSaveNote = () => {
    if (onSaveNote) {
      onSaveNote(
        `Day ${lesson.dayNumber} Key Takeaways: ${lesson.title}`,
        `### ${lesson.title}\n\n**Objectives:**\n${lesson.learningObjectives.map(o => `- ${o}`).join('\n')}\n\n**Key Concept Summary:**\n${lesson.learnContent.slice(0, 400)}...`
      );
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2500);
    }
  };

  // Helper to extract code blocks and markdown sections
  const parseLectureContent = (raw: string) => {
    const lines = raw.split('\n');
    const sections: Array<{
      type: 'heading' | 'text' | 'code' | 'warning' | 'list';
      title?: string;
      content: string;
      language?: string;
    }> = [];

    let currentCode: string[] = [];
    let inCode = false;
    let codeLang = 'python';

    let currentText: string[] = [];
    let currentHeading = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        if (!inCode) {
          // Flush pending text
          if (currentText.length > 0) {
            sections.push({
              type: 'text',
              title: currentHeading,
              content: currentText.join('\n').trim()
            });
            currentText = [];
            currentHeading = '';
          }
          inCode = true;
          codeLang = line.replace('```', '').trim() || 'python';
          currentCode = [];
        } else {
          // End of code block
          sections.push({
            type: 'code',
            language: codeLang,
            content: currentCode.join('\n')
          });
          inCode = false;
          currentCode = [];
        }
        continue;
      }

      if (inCode) {
        currentCode.push(line);
        continue;
      }

      // Check headings
      if (line.startsWith('### ') || line.startsWith('#### ')) {
        if (currentText.length > 0) {
          sections.push({
            type: currentHeading.toLowerCase().includes('pitfall') || currentHeading.toLowerCase().includes('trap') ? 'warning' : 'text',
            title: currentHeading,
            content: currentText.join('\n').trim()
          });
          currentText = [];
        }
        currentHeading = line.replace(/^#{3,4}\s+/, '').trim();
      } else {
        currentText.push(line);
      }
    }

    if (currentText.length > 0) {
      sections.push({
        type: currentHeading.toLowerCase().includes('pitfall') || currentHeading.toLowerCase().includes('trap') ? 'warning' : 'text',
        title: currentHeading,
        content: currentText.join('\n').trim()
      });
    }

    return sections;
  };

  const parsedSections = parseLectureContent(lesson.learnContent);

  return (
    <div className="flex flex-col gap-5 text-stone-200 font-sans">
      {/* 1. TOP HERO BAR: Objective & Mode Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d131f] via-[#111726] to-[#0d131f] border border-sky-800/40 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <GraduationCap className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider block">
                M.Tech Placement Curriculum • Module {lesson.subject.toUpperCase()}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {lesson.title}
              </h3>
              {lesson.mrcetUnit && (
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60 font-semibold flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{lesson.mrcetUnit}</span>
                  </span>
                  {lesson.academicLevel && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 font-semibold">
                      {lesson.academicLevel}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1.5 bg-[#090d14] p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setLearningMode('placement')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                learningMode === 'placement'
                  ? 'bg-sky-600 text-white font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Placement Core</span>
            </button>
            <button
              onClick={() => setLearningMode('deep_dive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                learningMode === 'deep_dive'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-300" />
              <span>M.Tech Deep Dive</span>
            </button>
          </div>
        </div>

        {/* Learning Objectives Structured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-800/80">
          {lesson.learningObjectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#161d2b]/60 border border-sky-900/30 text-xs text-sky-200/90">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{obj}</span>
            </div>
          ))}
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/60 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickSaveNote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161f30] hover:bg-[#1f2d47] text-sky-300 border border-sky-800/50 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{noteSavedFeedback ? 'Saved to My Notes! ✓' : 'Add to My Revision Book'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToPractice && (
              <button
                onClick={onNavigateToPractice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Open Practice Lab</span>
              </button>
            )}
            {onNavigateToMCQ && (
              <button
                onClick={onNavigateToMCQ}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 transition-colors"
              >
                <span>Take Quiz</span>
              </button>
            )}
            {onNavigateToInterview && (
              <button
                onClick={onNavigateToInterview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/40 text-amber-200 border border-amber-500/40 transition-colors"
              >
                <span>Interview Qs</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ARCHITECTURAL / WORKFLOW CONCEPT DIAGRAM */}
      <ConceptDiagram dayNumber={lesson.dayNumber} subject={lesson.subject} />

      {/* 3. PARSED & STRUCTURED LECTURE CONTENT SECTIONS */}
      <div className="flex flex-col gap-4">
        {parsedSections.map((sec, idx) => {
          if (sec.type === 'warning') {
            return (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/30 via-rose-950/20 to-amber-950/30 border border-amber-600/50 shadow-md"
              >
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2.5 border-b border-amber-900/40 pb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{sec.title || 'High-Frequency Placement Pitfall & Interview Trap'}</span>
                </div>
                <div className="pl-1">
                  {renderFormattedText(sec.content)}
                </div>
              </div>
            );
          }

          // Architectural Blueprint & Flowchart Block
          const isDiagram = sec.type === 'code' && (
            sec.language === 'text' || 
            sec.content.includes('+---') || 
            sec.content.includes('--->') ||
            sec.content.includes('|')
          );
          if (isDiagram) {
            return (
              <div key={idx} className="rounded-xl border border-sky-800/60 bg-[#070b12] overflow-hidden shadow-xl">
                <div className="px-4 py-2 bg-gradient-to-r from-[#0d1626] to-[#0a101c] border-b border-sky-900/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-sky-400" />
                    <span className="font-mono text-sky-300 font-bold text-xs uppercase tracking-wider">
                      📐 Architectural Blueprint & Flowchart
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800/60">
                    System Architecture
                  </span>
                </div>
                <div className="p-4 overflow-x-auto bg-[#04060a]">
                  <pre className="font-mono text-sky-300 text-xs sm:text-sm leading-relaxed whitespace-pre font-bold select-all">
                    {sec.content}
                  </pre>
                </div>
              </div>
            );
          }

          if (sec.type === 'code') {
            return (
              <div key={idx} className="rounded-xl border border-stone-800 bg-[#0a0d14] overflow-hidden shadow-lg">
                {/* IDE Window Title Bar */}
                <div className="px-4 py-2 bg-[#121620] border-b border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    </div>
                    <span className="font-mono text-stone-400 text-[11px] ml-2 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-sky-400" />
                      <span>{sec.language?.toUpperCase() || 'PYTHON'} EXECUTION EXAMPLE</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(sec.content, idx)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c2333] hover:bg-[#252f44] text-stone-300 text-xs transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    {onNavigateToPractice && (
                      <button
                        onClick={onNavigateToPractice}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 text-xs transition-colors"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Run in Lab</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Code Body with Line Numbers */}
                <div className="p-3.5 overflow-x-auto bg-[#070a0f] flex font-mono text-xs leading-relaxed">
                  <div className="select-none text-stone-600 pr-4 text-right border-r border-stone-800">
                    {sec.content.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <pre className="pl-4 text-emerald-300 whitespace-pre font-mono">
                    {sec.content}
                  </pre>
                </div>
              </div>
            );
          }

          // Real-Life Intuition & Analogy Card
          const isAnalogy = sec.title?.toLowerCase().includes('analogy') || sec.title?.toLowerCase().includes('intuition');
          if (isAnalogy) {
            return (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c140d] via-[#17121b] to-[#121620] border border-amber-500/40 shadow-lg"
              >
                <div className="flex items-center justify-between text-amber-300 font-bold text-sm sm:text-base mb-2.5 border-b border-amber-800/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{sec.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40">
                    💡 Real-Life Intuition
                  </span>
                </div>
                <div className="text-amber-100/90 text-sm leading-relaxed">
                  {renderFormattedText(sec.content)}
                </div>
              </div>
            );
          }

          // Regular Conceptual Section Card with custom badges
          const isWhat = sec.title?.toLowerCase().includes('what is') || sec.title?.toLowerCase().includes('what problem');
          const isWhy = sec.title?.toLowerCase().includes('why') || sec.title?.toLowerCase().includes('need it') || sec.title?.toLowerCase().includes('under the hood');
          const isKey = sec.title?.toLowerCase().includes('key') || sec.title?.toLowerCase().includes('concept') || sec.title?.toLowerCase().includes('gotchas') || sec.title?.toLowerCase().includes('placement');

          return (
            <div 
              key={idx}
              className={`p-4 sm:p-5 rounded-xl border transition-all shadow-sm ${
                isWhat 
                  ? 'bg-gradient-to-r from-[#0d141e] via-[#0d121c] to-[#0d141e] border-sky-800/40' 
                  : isWhy 
                  ? 'bg-gradient-to-r from-[#0d1715] via-[#0d131a] to-[#0d1715] border-emerald-800/40' 
                  : isKey
                  ? 'bg-gradient-to-r from-[#141024] via-[#0f0d1a] to-[#141024] border-purple-800/40'
                  : 'bg-[#0d1117] border-stone-800 hover:border-stone-700/80'
              }`}
            >
              {sec.title && (
                <div className="flex items-center justify-between text-stone-100 font-bold text-sm sm:text-base mb-3 border-b border-stone-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-4 rounded-full ${
                      isWhat ? 'bg-sky-400' : isWhy ? 'bg-emerald-400' : isKey ? 'bg-indigo-400' : 'bg-sky-500'
                    }`}></span>
                    <span>{sec.title}</span>
                  </div>

                  {isWhat && (
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
                      💡 Core Definition
                    </span>
                  )}
                  {isWhy && (
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      💼 Production Pipeline Need
                    </span>
                  )}
                  {isKey && (
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                      🔑 Placement Essentials
                    </span>
                  )}
                </div>
              )}
              <div>
                {renderFormattedText(sec.content)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. M.TECH DEEP DIVE ACCORDION (If enabled) */}
      {learningMode === 'deep_dive' && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#100e1c] border border-indigo-800/60 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>M.Tech Advanced Placement Nuances & Distributed Architecture Notes</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            In competitive placement rounds at FAANG/Tier-1 Data Platforms, interviewers probe beyond basic API usage:
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-indigo-200/90 list-disc list-inside">
            <li><strong>Garbage Collection & Memory Pools:</strong> CPython handles small integers (-5 to 256) through an interned memory pool, whereas larger numbers allocate distinct heap objects.</li>
            <li><strong>Idempotency in Data Pipelines:</strong> Pipeline retries must always be idempotent. In streaming or micro-batch ETL, stateful operators require checkpointing to object storage.</li>
            <li><strong>Shuffle Cost:</strong> Network I/O is the #1 bottleneck in distributed compute. Always prefer Map-side filtering over post-shuffle filtering.</li>
          </ul>
        </div>
      )}

      {/* 5. INTERACTIVE PLACEMENT CHECKPOINT */}
      <div className="p-4 rounded-xl bg-[#0d141e] border border-sky-800/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Placement Concept Checkpoint</span>
          </div>
          <button
            onClick={() => setRevealedQuiz(!revealedQuiz)}
            className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium cursor-pointer"
          >
            {revealedQuiz ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide Senior DE Explanation</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Placement Answer</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-200 font-medium">
          Q: If you pass a mutable object like a dictionary or list as a default parameter in a Python batch processing function, why does it corrupt subsequent pipeline invocations?
        </p>

        {revealedQuiz && (
          <div className="p-3 rounded-lg bg-[#142033] border border-sky-600/40 text-xs text-sky-100 leading-relaxed">
            <strong className="text-emerald-400">Answer:</strong> In Python, default arguments are evaluated <strong>once</strong> when the function definition is loaded into memory, NOT each time the function is called! Therefore, mutating the default argument mutates that single shared object across all invocations in the worker process. The enterprise standard is <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">param=None</code> and assigning <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">param = []</code> inside the function scope.
          </div>
        )}
      </div>

      {/* 6. DOCUMENTATION & NEXT STEPS */}
      {lesson.docLinks && lesson.docLinks.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Official Placement References:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {lesson.docLinks.map((doc, idx) => (
              <a
                key={idx}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline"
              >
                <span>{doc.title}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA to practice */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-sky-950/30 border border-emerald-800/40">
        <div>
          <h4 className="font-bold text-white text-xs sm:text-sm">Ready to put this concept into code?</h4>
          <p className="text-[11px] text-stone-400 mt-0.5">Solve today's hands-on exercise with live assertions in the Practice Lab.</p>
        </div>
        {onNavigateToPractice && (
          <button
            onClick={onNavigateToPractice}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Start Practice Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
