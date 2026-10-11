import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText,
  Copy, 
  Check
} from 'lucide-react';
import type { DayLesson } from '../../types/academics';
import { useAcademicsTheme } from '../../context/AcademicsThemeContext';
import { BinarySearchVisualizer } from './visualizers/BinarySearchVisualizer';
import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { DataStructuresVisualizer } from './visualizers/DataStructuresVisualizer';
import { ComplexityVisualizer } from './visualizers/ComplexityVisualizer';
import { TreeGraphVisualizer } from './visualizers/TreeGraphVisualizer';
import { DataModelingVisualizer } from './visualizers/DataModelingVisualizer';
import { ETLPipelineVisualizer } from './visualizers/ETLPipelineVisualizer';
import { SparkPartitionVisualizer } from './visualizers/SparkPartitionVisualizer';
import { KafkaStreamingVisualizer } from './visualizers/KafkaStreamingVisualizer';
import { PipelineDAGVisualizer } from './visualizers/PipelineDAGVisualizer';
import { InteractiveCodeRunner } from './visualizers/InteractiveCodeRunner';
import { SQLPlayground } from './SQLPlayground';
import { getTopicKey, TOPIC_ANALOGIES } from '../../data/academics/academicPedagogy';

interface InteractiveLessonAcademyProps {
  lesson: DayLesson;
  onNavigateToPractice?: () => void;
  onNavigateToMCQ?: () => void;
  onNavigateToInterview?: () => void;
  onSaveNote?: (title: string, content: string) => void;
}

export const InteractiveLessonAcademy: React.FC<InteractiveLessonAcademyProps> = ({
  lesson,
  onNavigateToPractice,
  onNavigateToMCQ,
  onNavigateToInterview,
  onSaveNote
}) => {
  const { isDark } = useAcademicsTheme();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [noteSaved, setNoteSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Retrieve accurate domain analogy info
  const topicKey = getTopicKey(lesson.subject, lesson.title, lesson.dayNumber);
  const topicInfo = TOPIC_ANALOGIES[topicKey] || TOPIC_ANALOGIES.dsa_complexity;

  // Determine which visualizer to render based on dayNumber / topic
  const renderVisualizer = () => {
    const day = lesson.dayNumber;
    const title = (lesson.title + ' ' + lesson.subject).toLowerCase();

    // 1. Complexity & Recursion (Days 101, 102, 103)
    if (day === 101 || day === 102 || day === 103 || title.includes('complexity') || title.includes('asymptotic') || title.includes('big-o')) {
      return <ComplexityVisualizer />;
    }

    // 2. Binary Search (Day 104 or search title)
    if (day === 104 || (day >= 101 && title.includes('search') && !title.includes('sort') && !title.includes('tree'))) {
      return <BinarySearchVisualizer />;
    }

    // 3. Sorting Algorithms (Day 105 or sorting title)
    if (day === 105 || title.includes('sort')) {
      return <SortingVisualizer />;
    }

    // 4. Linked Lists (Day 106)
    if (day === 106 || title.includes('linked list')) {
      return <DataStructuresVisualizer initialType="linked_list" />;
    }

    // 5. Stacks & Queues (Day 107, 108)
    if (day === 107 || title.includes('stack')) {
      return <DataStructuresVisualizer initialType="stack" />;
    }
    if (day === 108 || title.includes('queue')) {
      return <DataStructuresVisualizer initialType="queue" />;
    }

    // 6. Hash Tables (Day 109)
    if (day === 109 || title.includes('hash')) {
      return <DataStructuresVisualizer initialType="stack" />;
    }

    // 7. Trees & BST (Days 110, 111, 112)
    if (day === 110 || day === 111 || day === 112 || title.includes('tree') || title.includes('bst') || title.includes('heap')) {
      return <TreeGraphVisualizer initialMode="bst" />;
    }

    // 8. Graphs (Days 113, 114, 115)
    if ((day >= 113 && day <= 115) || title.includes('graph')) {
      return <TreeGraphVisualizer initialMode="graph" />;
    }

    // 9. Two Pointers & Sliding Window (Days 121, 122)
    if (day === 121 || day === 122 || title.includes('two pointer') || title.includes('sliding window')) {
      return <DataStructuresVisualizer initialType="two_pointers" />;
    }

    // 10. Data Engineering: SQL & Relational Sandbox (Days 11-20)
    if ((day >= 11 && day <= 20) || title.includes('sql') || title.includes('join') || title.includes('window')) {
      return (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0b0f17] border-stone-800' : 'bg-white border-slate-200'}`}>
          <div className="mb-3">
            <h4 className="font-bold text-sm text-sky-500">Interactive SQL Analytical Sandbox</h4>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
              Execute live analytical queries against relational and Kimball dimensional tables (`orders`, `customers`, `fact_sales`).
            </p>
          </div>
          <SQLPlayground height="320px" />
        </div>
      );
    }

    // 11. Data Engineering: ETL / ELT Pipelines (Days 21-35)
    if ((day >= 21 && day <= 35) || title.includes('etl') || title.includes('pipeline')) {
      return <ETLPipelineVisualizer />;
    }

    // 12. Data Engineering: Kimball Data Modeling & SCD (Days 36-50)
    if ((day >= 36 && day <= 50) || title.includes('model') || title.includes('warehouse') || title.includes('star') || title.includes('scd')) {
      return <DataModelingVisualizer />;
    }

    // 13. Data Engineering: Apache Spark (Days 51-70)
    if ((day >= 51 && day <= 70) || title.includes('spark') || title.includes('shuffle')) {
      return <SparkPartitionVisualizer />;
    }

    // 14. Data Engineering: Apache Kafka & Streaming (Days 71-80)
    if ((day >= 71 && day <= 80) || title.includes('kafka') || title.includes('stream')) {
      return <KafkaStreamingVisualizer />;
    }

    // 15. Data Engineering: Airflow & Orchestration DAGs (Days 81-90)
    if ((day >= 81 && day <= 90) || title.includes('airflow') || title.includes('dag') || title.includes('orchestrat')) {
      return <PipelineDAGVisualizer />;
    }

    // 16. Data Engineering: Cloud Lakehouse (Days 91-100)
    if (day >= 91 && day <= 100) {
      return <DataModelingVisualizer />;
    }

    // Fallbacks
    if (day >= 101) {
      return <BinarySearchVisualizer />;
    }
    return <ETLPipelineVisualizer />;
  };

  // Section D: Code Walkthrough
  const primaryExample = lesson.examples?.[0] || {
    title: `${lesson.title} Standard Implementation`,
    explanation: 'Idiomatic production implementation with clean complexity guarantees and edge-case resilience.',
    code: `# Standard Implementation for ${lesson.title}\ndef solve():\n    pass`
  };

  // Section E: Interactive Code Runner starter code
  const exercise = lesson.practiceExercise || {
    id: `ex_${lesson.dayNumber}`,
    title: `${lesson.title} Hands-On Coding Lab`,
    language: 'python',
    starterCode: primaryExample.code || 'def solution():\n    return True\n\nprint(solution())',
    solutionCode: primaryExample.code || 'def solution():\n    return True',
    hints: [
      'Focus on optimal asymptotic time and space bounds.',
      'Check boundary edge cases: empty collections, single elements, and out-of-range keys.'
    ],
    testCases: [
      { input: 'arr = [10, 20, 30, 40, 50], target = 50', expectedOutput: '4' }
    ]
  };

  const mappedTestCases = (exercise.testCases || []).map(tc => ({
    input: tc.input,
    expectedOutput: (tc as any).expectedOutput || (tc as any).expected_output || 'Passed'
  }));

  // Section H: Quick Knowledge Check Questions
  const quickChecks = lesson.mcqs && lesson.mcqs.length > 0 ? lesson.mcqs.slice(0, 2) : [
    {
      id: `qc_${lesson.dayNumber}_1`,
      question: `What is the primary architectural advantage of ${lesson.title}?`,
      options: [
        'Drastically reduces operational latency and asymptotic Big-O complexity',
        'Consumes unbounded memory to avoid all CPU cycles',
        'Eliminates the need for input validation entirely',
        'Guarantees execution without requiring an operating system'
      ],
      correctIndex: 0,
      explanation: `${lesson.title} is engineered to optimize time and space bounds while preserving strict correctness invariants.`
    }
  ];

  const handleSaveTakeaways = () => {
    if (onSaveNote) {
      onSaveNote(
        `${lesson.title} - Academy Key Takeaways`,
        `### Concept: ${lesson.title}\n\n**What Is It:**\n${topicInfo.whatIsIt}\n\n**Why We Need It:**\n${topicInfo.whyWeNeedIt}\n\n**How It Works:**\n${topicInfo.howItWorks}\n\n**Analogy:**\n${topicInfo.analogy}\n\n**Production Scenario:**\n${topicInfo.realWorld}`
      );
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(primaryExample.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={`flex flex-col gap-6 font-sans transition-colors duration-200 ${
      isDark ? 'text-stone-100' : 'text-slate-900'
    }`}>
      {/* ========================================================================= */}
      {/* SECTION A — THE IDEA IN 30 SECONDS                                        */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all shadow-md ${
        isDark ? 'bg-[#0d121c] border-sky-900/40' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 mb-4 border-stone-800/60">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-800 border border-sky-200'
            }`}>
              A
            </div>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
                isDark ? 'text-sky-400' : 'text-sky-700'
              }`}>
                Core Learning Foundation
              </span>
              <h3 className={`text-base sm:text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                The Idea in 30 Seconds
              </h3>
            </div>
          </div>

          <button
            onClick={handleSaveTakeaways}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#161f30] hover:bg-[#202b42] text-sky-300 border-sky-800/50' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-bold'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{noteSaved ? 'Saved to Notes! ✓' : 'Save Takeaways'}</span>
          </button>
        </div>

        {/* 3 Clear Pillars: What It Is, Why We Need It, How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-3">
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#111726] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
              isDark ? 'text-sky-400' : 'text-sky-700 font-extrabold'
            }`}>
              ⚡ What is it?
            </span>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-200' : 'text-slate-800 font-medium'}`}>
              {topicInfo.whatIsIt}
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#111726] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
              isDark ? 'text-emerald-400' : 'text-emerald-700 font-extrabold'
            }`}>
              🎯 Why do we need it?
            </span>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-200' : 'text-slate-800 font-medium'}`}>
              {topicInfo.whyWeNeedIt}
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#111726] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
              isDark ? 'text-purple-400' : 'text-purple-700 font-extrabold'
            }`}>
              ⚙️ How does it work?
            </span>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-200' : 'text-slate-800 font-medium'}`}>
              {topicInfo.howItWorks}
            </p>
          </div>
        </div>

        {/* Lesson Description Summary */}
        <div className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed ${
          isDark ? 'bg-[#090d14] border-stone-800 text-stone-300' : 'bg-sky-50/60 border-sky-200 text-slate-800 font-medium'
        }`}>
          <strong>Quick Summary:</strong> {lesson.description}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B — REAL-LIFE ANALOGY                                             */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all shadow-md ${
        isDark 
          ? 'bg-gradient-to-r from-[#17130b] via-[#14121a] to-[#0e1420] border-amber-500/30' 
          : 'bg-amber-50/80 border-amber-200'
      }`}>
        <div className="flex items-center gap-2.5 border-b pb-3 mb-3 border-amber-800/40">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-200 text-amber-900 border border-amber-300'
          }`}>
            B
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-amber-400' : 'text-amber-800 font-extrabold'
            }`}>
              First-Principles Intuition
            </span>
            <h3 className={`text-base sm:text-lg font-extrabold ${isDark ? 'text-amber-100' : 'text-amber-950'}`}>
              Real-Life Analogy
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
          <p className={`font-semibold ${isDark ? 'text-amber-200' : 'text-amber-950'}`}>
            💡 <strong>The Everyday Metaphor:</strong> {topicInfo.analogy}
          </p>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#080b12] border-amber-900/40 text-stone-300' : 'bg-white border-amber-200 text-slate-800 font-medium'
          }`}>
            <strong className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
              isDark ? 'text-amber-400' : 'text-amber-800 font-extrabold'
            }`}>
              🏭 Where it connects to Real Engineering & Interviews:
            </strong>
            <span>{topicInfo.realWorld}</span>
          </div>

          <div className={`p-2.5 rounded-lg border text-xs font-mono ${
            isDark ? 'bg-black/30 border-stone-800 text-stone-400' : 'bg-amber-100/60 border-amber-300 text-amber-950 font-medium'
          }`}>
            <strong>Where the analogy stops matching:</strong> Physical objects have physical boundaries and friction, whereas in software, variables and pointers are pure memory address references on heap/stack with zero travel friction.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION C — INTERACTIVE DEMONSTRATION                                    */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-6 h-6 rounded-md bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
            C
          </span>
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? 'text-sky-400' : 'text-sky-800 font-extrabold'
          }`}>
            Interactive Demonstration & Live Simulation
          </span>
        </div>
        {renderVisualizer()}
      </div>

      {/* ========================================================================= */}
      {/* SECTION D — CODE WALKTHROUGH                                              */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all shadow-md ${
        isDark ? 'bg-[#0d111a] border-stone-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 mb-3 border-stone-800/60">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
            }`}>
              D
            </div>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
                isDark ? 'text-indigo-400' : 'text-indigo-800 font-extrabold'
              }`}>
                Syntax & Implementation
              </span>
              <h3 className={`text-base sm:text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Code Walkthrough: {primaryExample.title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'bg-[#161f30] text-stone-300 border-stone-700' : 'bg-slate-100 text-slate-800 border-slate-300 font-bold'
            }`}
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <p className={`text-xs sm:text-sm mb-3 ${isDark ? 'text-stone-300' : 'text-slate-700 font-medium'}`}>
          {primaryExample.explanation}
        </p>

        <div className="rounded-xl border overflow-hidden font-mono text-xs bg-[#06090f] border-stone-800 text-emerald-300 shadow-inner">
          <div className="px-4 py-2 bg-[#121622] border-b border-stone-800 flex items-center justify-between text-stone-400 text-[11px]">
            <span>solution.py</span>
            <span className="text-sky-400 font-bold">Production Grade</span>
          </div>
          <pre className="p-4 text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
            {primaryExample.code}
          </pre>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION E — TRY IT YOURSELF (INTERACTIVE PLAYGROUND)                      */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-6 h-6 rounded-md bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
            E
          </span>
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? 'text-emerald-400' : 'text-emerald-800 font-extrabold'
          }`}>
            Try It Yourself: Hands-On Practice Lab
          </span>
        </div>
        <InteractiveCodeRunner
          title={exercise.title}
          language={exercise.language || 'python'}
          starterCode={exercise.starterCode}
          solutionCode={exercise.solutionCode}
          hints={exercise.hints}
          testCases={mappedTestCases}
        />
        {onNavigateToPractice && (
          <div className="flex justify-end pt-2">
            <button
              onClick={onNavigateToPractice}
              className="text-xs text-sky-500 hover:underline font-bold cursor-pointer"
            >
              Open in Full Multi-File Practice Lab ➔
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION F — COMPLEXITY & TRADE-OFFS                                       */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all shadow-md ${
        isDark ? 'bg-[#0d111a] border-stone-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 border-b pb-3 mb-3 border-stone-800/60">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-900 border border-purple-200'
          }`}>
            F
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-purple-400' : 'text-purple-800 font-extrabold'
            }`}>
              Engineering Optimization
            </span>
            <h3 className={`text-base sm:text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Complexity & Architectural Trade-Offs
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#121826] border-stone-700 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <span className="font-extrabold text-sky-500 text-sm block mb-1">⏱ Time Complexity</span>
            <ul className="space-y-1 font-medium">
              <li>• Best Case: <strong>O(1)</strong> (Immediate lookup or boundary condition hit)</li>
              <li>• Average Case: <strong>O(log N)</strong> / <strong>O(N)</strong></li>
              <li>• Worst Case: Controlled asymptotic bound with zero runaway loops</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#121826] border-stone-700 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <span className="font-extrabold text-purple-500 text-sm block mb-1">🧠 Auxiliary Space Complexity</span>
            <ul className="space-y-1 font-medium">
              <li>• Auxiliary Space: <strong>O(1)</strong> in-place pointers or bounded buffer</li>
              <li>• Heap Allocation: Controlled object lifetime with zero memory leaks</li>
              <li>• Garbage Collection: Generational GC sweeps unreachable objects cleanly</li>
            </ul>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-xl border text-xs ${
          isDark ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-950 font-medium'
        }`}>
          <strong>Common Engineering Trap:</strong> Premature optimization without profiling. Always start with the simplest correct implementation, benchmark with realistic production data loads, and optimize bottlenecks systematically.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION G — INTERVIEW & INDUSTRY APPLICATIONS                             */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all shadow-md ${
        isDark ? 'bg-[#0d111a] border-stone-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 border-b pb-3 mb-3 border-stone-800/60">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-900 border border-rose-200'
          }`}>
            G
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-rose-400' : 'text-rose-800 font-extrabold'
            }`}>
              Placement & Real-World Impact
            </span>
            <h3 className={`text-base sm:text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Interview & Industry Applications
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#121826] border-stone-700 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <strong className="block text-sky-500 mb-1 text-xs uppercase font-mono font-bold">
              Top Interview Question:
            </strong>
            <p className="leading-relaxed font-semibold">
              "How would you optimize this algorithm when input data exceeds physical RAM (e.g. 100 GB on an 8 GB machine)?"
            </p>
            <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-slate-700'}`}>
              <strong>Model Answer:</strong> Use external merge sort, chunked stream processing, or disk-backed B-Tree indexing. Partition data into bounded chunks that fit comfortably into worker memory.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className={`text-xs font-mono ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
              {lesson.interviewQuestions?.length || 1} Full Interview Questions Available
            </span>
            {onNavigateToInterview && (
              <button
                onClick={onNavigateToInterview}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Open Interview Question Bank ➔
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION H — QUICK KNOWLEDGE CHECK                                         */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all shadow-md ${
        isDark ? 'bg-[#0d111a] border-stone-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 border-b pb-3 mb-4 border-stone-800/60">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}>
            H
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-emerald-400' : 'text-emerald-800 font-extrabold'
            }`}>
              Verify Understanding
            </span>
            <h3 className={`text-base sm:text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Quick Knowledge Check
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {quickChecks.map((qc, qIdx) => {
            const selectedOpt = selectedAnswers[qIdx];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === qc.correctIndex;

            return (
              <div
                key={qc.id || qIdx}
                className={`p-4 rounded-xl border text-xs sm:text-sm ${
                  isDark ? 'bg-[#101624] border-stone-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {qIdx + 1}. {qc.question}
                </div>

                <div className="space-y-2">
                  {qc.options.map((opt, oIdx) => {
                    const isOptionSelected = selectedOpt === oIdx;
                    let optStyle = '';

                    if (!isAnswered) {
                      optStyle = isDark 
                        ? 'bg-[#161f30] hover:bg-[#202c42] text-stone-200 border-stone-700' 
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-medium';
                    } else if (oIdx === qc.correctIndex) {
                      optStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                    } else if (isOptionSelected && !isCorrect) {
                      optStyle = 'bg-rose-600 text-white border-rose-400';
                    } else {
                      optStyle = isDark ? 'opacity-40 bg-[#161f30] text-stone-500 border-stone-800' : 'opacity-40 bg-slate-100 text-slate-400 border-slate-200';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => {
                          setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                          setShowExplanations(prev => ({ ...prev, [qIdx]: true }));
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && oIdx === qc.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExplanations[qIdx] && (
                  <div className={`mt-3 p-3 rounded-lg border text-xs leading-relaxed ${
                    isCorrect 
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                  }`}>
                    <strong>{isCorrect ? 'Correct! ✓' : 'Incorrect.'}</strong> {qc.explanation}
                  </div>
                )}
              </div>
            );
          })}
          {onNavigateToMCQ && (
            <div className="flex justify-end pt-3">
              <button
                onClick={onNavigateToMCQ}
                className="text-xs text-purple-500 hover:underline font-bold cursor-pointer"
              >
                Take Full Quiz & Assess Progress ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
