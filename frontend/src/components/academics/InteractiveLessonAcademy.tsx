import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import type { DayLesson } from '../../types/academics';
import { useAcademicsTheme } from '../../context/AcademicsThemeContext';
import { BinarySearchVisualizer } from './visualizers/BinarySearchVisualizer';
import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { DataStructuresVisualizer } from './visualizers/DataStructuresVisualizer';
import { ETLPipelineVisualizer } from './visualizers/ETLPipelineVisualizer';
import { SparkPartitionVisualizer } from './visualizers/SparkPartitionVisualizer';
import { KafkaStreamingVisualizer } from './visualizers/KafkaStreamingVisualizer';
import { PipelineDAGVisualizer } from './visualizers/PipelineDAGVisualizer';
import { InteractiveCodeRunner } from './visualizers/InteractiveCodeRunner';
import { SQLPlayground } from './SQLPlayground';

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

  // Knowledge check state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [noteSaved, setNoteSaved] = useState(false);

  // Determine which visualizer to render based on dayNumber / topic
  const renderVisualizer = () => {
    const day = lesson.dayNumber;
    const title = (lesson.title + ' ' + lesson.subject).toLowerCase();

    // 1. Binary Search (Day 104 or any search/binary lesson)
    if (day === 104 || (day >= 101 && title.includes('search') && !title.includes('sort'))) {
      return <BinarySearchVisualizer />;
    }

    // 2. Sorting Algorithms (Day 105 or sorting title)
    if (day === 105 || title.includes('sort')) {
      return <SortingVisualizer />;
    }

    // 3. Stacks & Queues (Day 107, 108)
    if (day === 107 || title.includes('stack')) {
      return <DataStructuresVisualizer initialType="stack" />;
    }
    if (day === 108 || title.includes('queue')) {
      return <DataStructuresVisualizer initialType="queue" />;
    }

    // 4. Linked Lists (Day 106)
    if (day === 106 || title.includes('linked list')) {
      return <DataStructuresVisualizer initialType="linked_list" />;
    }

    // 5. Two Pointers (Day 121)
    if (day === 121 || title.includes('two pointer')) {
      return <DataStructuresVisualizer initialType="two_pointers" />;
    }

    // 6. Data Engineering: ETL / ELT Pipelines (Days 21-35)
    if ((day >= 20 && day <= 35) || title.includes('etl') || title.includes('pipeline')) {
      return <ETLPipelineVisualizer />;
    }

    // 7. Apache Spark Partitions & Shuffles (Days 60-70)
    if ((day >= 60 && day <= 70) || title.includes('spark') || title.includes('shuffle')) {
      return <SparkPartitionVisualizer />;
    }

    // 8. Apache Kafka & Streaming (Days 71-80)
    if ((day >= 71 && day <= 80) || title.includes('kafka') || title.includes('stream')) {
      return <KafkaStreamingVisualizer />;
    }

    // 9. Airflow & Orchestration DAGs (Days 81-90)
    if ((day >= 81 && day <= 90) || title.includes('airflow') || title.includes('dag') || title.includes('orchestrat')) {
      return <PipelineDAGVisualizer />;
    }

    // 10. SQL & Databases (Days 11-19)
    if ((day >= 11 && day <= 19) || title.includes('sql') || title.includes('table') || title.includes('join')) {
      return (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0b0f17] border-stone-800' : 'bg-white border-slate-200'}`}>
          <div className="mb-3">
            <h4 className="font-bold text-sm text-sky-400">Interactive SQL Analytical Sandbox</h4>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
              Run analytical queries against sample e-commerce tables (orders, customers, fact_sales).
            </p>
          </div>
          <SQLPlayground height="320px" />
        </div>
      );
    }

    // Fallback: Default to Binary Search for DSA or ETL for DE
    if (day >= 101) {
      return <BinarySearchVisualizer />;
    }
    return <ETLPipelineVisualizer />;
  };

  // Section A: The idea in 30 seconds
  const ideaIn30Sec = lesson.beginnerExplanation || lesson.description || (
    `${lesson.title} is a core computer science and engineering concept designed to solve critical efficiency, scalability, and correctness challenges in modern applications.`
  );

  // Section B: Real-Life Analogy
  const analogyObj = lesson.realLifeAnalogy || {
    title: 'Real-World Concept Analogy',
    analogy: 'Imagine a physical library where books are organized systematically. Rather than checking every shelf from front to back, structured indexes let you jump straight to the exact section in seconds.',
    realWorldExample: 'Enterprise systems apply this technique to process millions of requests per second with predictable latency and minimal resource overhead.'
  };

  // Section D: Code Walkthrough
  const primaryExample = lesson.examples?.[0] || {
    title: `${lesson.title} Standard Implementation`,
    explanation: 'Idiomatic production implementation with clean complexity guarantees.',
    code: `# Standard Implementation for ${lesson.title}\ndef solve():\n    pass`
  };

  // Section E: Interactive Code Runner starter code
  const exercise = lesson.practiceExercise || {
    id: `ex_${lesson.dayNumber}`,
    title: `${lesson.title} Hands-On Coding`,
    language: 'python',
    starterCode: primaryExample.code || 'def solution():\n    return True\n\nprint(solution())',
    solutionCode: primaryExample.code || 'def solution():\n    return True',
    hints: [
      'Focus on optimal asymptotic time and space bounds.',
      'Check boundary edge cases: empty collections, single elements, and out-of-range keys.'
    ],
    testCases: [
      { input: 'Standard Test Case', expected_output: 'Passed' }
    ]
  };

  const mappedTestCases = (exercise.testCases || []).map(tc => ({
    input: tc.input,
    expectedOutput: (tc as any).expectedOutput || (tc as any).expected_output || ''
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
        `### Concept: ${lesson.title}\n\n**The 30-Second Idea:**\n${ideaIn30Sec}\n\n**Analogy:**\n${analogyObj.analogy}\n\n**Production Scenario:**\n${analogyObj.realWorldExample}\n\n**Optimal Complexity:**\n- Time: O(log N) / O(N)\n- Space: O(1)`
      );
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    }
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
        <div className="flex items-center justify-between border-b pb-3 mb-3 border-stone-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
                isDark ? 'text-sky-400' : 'text-sky-600'
              }`}>
                Core Learning Foundation
              </span>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                The Idea in 30 Seconds
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveTakeaways}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-sky-300 border-sky-800/50' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{noteSaved ? 'Saved to Notes! ✓' : 'Save Takeaways'}</span>
            </button>
          </div>
        </div>

        <div className={`text-sm sm:text-base leading-relaxed ${
          isDark ? 'text-stone-200' : 'text-slate-800'
        }`}>
          {ideaIn30Sec}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B — REAL-LIFE ANALOGY                                             */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all shadow-md ${
        isDark ? 'bg-gradient-to-r from-[#17130b] via-[#14121a] to-[#0e1420] border-amber-500/30' : 'bg-amber-50/80 border-amber-200'
      }`}>
        <div className="flex items-center gap-2.5 border-b pb-3 mb-3 border-amber-800/40">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            B
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-amber-400' : 'text-amber-700'
            }`}>
              First-Principles Intuition
            </span>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-amber-100' : 'text-amber-950'}`}>
              Real-Life Analogy: {analogyObj.title}
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
          <p className={`font-medium ${isDark ? 'text-amber-200' : 'text-amber-950'}`}>
            💡 <strong>The Everyday Metaphor:</strong> {analogyObj.analogy}
          </p>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#080b12] border-amber-900/40 text-stone-300' : 'bg-white border-amber-200 text-slate-800'
          }`}>
            <strong className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
              isDark ? 'text-amber-400' : 'text-amber-700'
            }`}>
              🏭 Where it connects to Real Engineering & Interviews:
            </strong>
            <span>{analogyObj.realWorldExample}</span>
          </div>

          <div className={`p-2.5 rounded-lg border text-xs font-mono ${
            isDark ? 'bg-black/30 border-stone-800 text-stone-400' : 'bg-amber-100/60 border-amber-300/80 text-amber-900'
          }`}>
            <strong>Where the analogy stops matching:</strong> Physical objects have physical boundaries and friction, whereas in software, variables and pointers are pure memory address references on heap/stack with zero travel friction.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION C — INTERACTIVE DEMONSTRATION                                    */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-md bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
            C
          </span>
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? 'text-sky-400' : 'text-sky-700'
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
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              D
            </div>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                Syntax & Implementation
              </span>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Code Walkthrough: {primaryExample.title}
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono opacity-75">Python 3.11</span>
        </div>

        <p className={`text-xs mb-3 ${isDark ? 'text-stone-300' : 'text-slate-700'}`}>
          {primaryExample.explanation}
        </p>

        <div className={`rounded-xl border overflow-hidden font-mono text-xs ${
          isDark ? 'bg-[#06090f] border-stone-800' : 'bg-slate-900 border-slate-800 text-emerald-300'
        }`}>
          <div className="px-4 py-2 bg-[#121622] border-b border-stone-800 flex items-center justify-between text-stone-400 text-[11px]">
            <span>solution.py</span>
            <span>Production Grade</span>
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
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-md bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
            E
          </span>
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? 'text-emerald-400' : 'text-emerald-700'
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
              className="text-xs text-sky-400 hover:underline font-semibold cursor-pointer"
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
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            F
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              Engineering Optimization
            </span>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Complexity & Architectural Trade-Offs
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#121826] border-stone-700 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <span className="font-bold text-sky-400 text-sm block mb-1">⏱ Time Complexity</span>
            <ul className="space-y-1 opacity-90">
              <li>• Best Case: <strong>O(1)</strong> (Instant lookup or boundary hit)</li>
              <li>• Average Case: <strong>O(log N)</strong> or <strong>O(N)</strong></li>
              <li>• Worst Case: Controlled logarithmic / linear bounds with zero runaway loops</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#121826] border-stone-700 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <span className="font-bold text-purple-400 text-sm block mb-1">🧠 Auxiliary Space Complexity</span>
            <ul className="space-y-1 opacity-90">
              <li>• Auxiliary Space: <strong>O(1)</strong> in-place pointers or bounded buffering</li>
              <li>• Heap Allocation: Controlled object lifetime with zero memory leaks</li>
              <li>• Garbage Collection: Generational GC sweeps unreachable objects cleanly</li>
            </ul>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-xl border text-xs ${
          isDark ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
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
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            G
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-rose-400' : 'text-rose-600'
            }`}>
              Placement & Real-World Impact
            </span>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Interview & Industry Applications
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#121826] border-stone-700 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <strong className="block text-sky-400 mb-1 text-xs uppercase font-mono">
              Top Interview Question:
            </strong>
            <p className="leading-relaxed">
              "How would you optimize this algorithm when input data exceeds physical RAM (e.g. 100 GB on an 8 GB machine)?"
            </p>
            <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
              <strong>Model Answer:</strong> Use external merge sort, chunked stream processing, or disk-backed B-Tree indexing. Partition data into bounded chunks that fit comfortably into worker memory.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs opacity-75 font-mono">
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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            H
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              Verify Understanding
            </span>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                        ? 'bg-[#161f30] hover:bg-[#202c42] text-stone-300 border-stone-700' 
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300';
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
                className="text-xs text-purple-400 hover:underline font-semibold cursor-pointer"
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
