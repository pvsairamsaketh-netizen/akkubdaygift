import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Lightbulb, 
  Play, 
  ArrowRight, 
  FileText, 
  Cpu, 
  Workflow, 
  GraduationCap, 
  BookOpen,
  Database,
  Server,
  Bot,
  Sparkles,
  Clock,
  Video,
  ChevronRight,
  ChevronLeft,
  Zap
} from 'lucide-react';
import type { DayLesson } from '../../types/academics';
import { DSAVisualizer } from './dsa/DSAVisualizer';
import { getEnrichedLesson } from '../../data/academics/academicPedagogy';
import { TopicLearningAssistant } from './TopicLearningAssistant';
import { LessonQuickCheck } from './LessonQuickCheck';
import { useAcademicsTheme } from '../../context/AcademicsThemeContext';

interface TutorialViewerProps {
  lesson: DayLesson;
  onNavigateToPractice?: () => void;
  onNavigateToMCQ?: () => void;
  onNavigateToInterview?: () => void;
  onSaveNote?: (title: string, content: string) => void;
  onSelectDay?: (day: number) => void;
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

  // Days 11-20: SQL Relational & Analytical Engine Diagram
  if (dayNumber >= 11 && dayNumber <= 20) {
    return (
      <div className="p-4 rounded-xl bg-[#090d13] border border-emerald-900/40 my-3">
        <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider">
              Interactive Architectural Diagram: SQL Execution Engine & Row Filtering Pipeline
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60">
            Query Engine Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono text-center">
          <div className="p-2.5 rounded-lg bg-[#111620] border border-stone-800 flex flex-col items-center justify-center">
            <span className="text-sky-400 font-bold">1. FROM & JOIN</span>
            <span className="text-[10px] text-stone-400 mt-1">Stitches source tables into a virtual cartesian set</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#111620] border border-stone-800 flex flex-col items-center justify-center">
            <span className="text-amber-400 font-bold">2. WHERE Filter</span>
            <span className="text-[10px] text-stone-400 mt-1">Discards invalid rows before grouping</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#111620] border border-stone-800 flex flex-col items-center justify-center">
            <span className="text-purple-400 font-bold">3. GROUP BY & HAVING</span>
            <span className="text-[10px] text-stone-400 mt-1">Aggregates keys into analytical summaries</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#111620] border border-stone-800 flex flex-col items-center justify-center">
            <span className="text-emerald-400 font-bold">4. SELECT & WINDOW</span>
            <span className="text-[10px] text-stone-400 mt-1">Computes projections, rankings & moving averages</span>
          </div>
        </div>
      </div>
    );
  }

  // Days 40-55: PySpark Distributed Architecture
  if (dayNumber >= 40 && dayNumber <= 55) {
    return (
      <div className="p-4 rounded-xl bg-[#090d13] border border-sky-900/40 my-3">
        <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-sky-300 font-mono uppercase tracking-wider">
              Interactive Architectural Diagram: Spark Cluster Driver & Executor Topology
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800/60">
            Distributed Computing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#111724] border border-sky-900/40">
            <div className="font-bold text-sky-400 font-mono mb-1">Driver Program</div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Creates the SparkContext, builds the logical execution plan, translates transformations into Directed Acyclic Graphs (DAG), and coordinates tasks across workers.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#111724] border border-sky-900/40">
            <div className="font-bold text-emerald-400 font-mono mb-1">Cluster Manager (YARN/K8s)</div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Allocates CPU cores and physical memory containers across the cluster machines to run executor processes.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#111724] border border-sky-900/40">
            <div className="font-bold text-purple-400 font-mono mb-1">Worker Executors (1..N)</div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Runs parallel tasks across data partitions, caches DataFrames in memory, and writes intermediate shuffle output to local disk blocks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl bg-[#090d13] border border-stone-800 my-2 text-xs flex items-center justify-between">
      <div className="flex items-center gap-2 text-sky-300 font-mono">
        <Workflow className="w-4 h-4 text-sky-400" />
        <span>Day {dayNumber}: Placement Architectural Execution Model</span>
      </div>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
        Enterprise Standard
      </span>
    </div>
  );
};

// Formatted lecture text renderer
const renderFormattedText = (content: string) => {
  const lines = content.split('\n');

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#161f30] text-sky-300 font-mono text-xs border border-sky-900/40">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-2.5">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const isNumbered = /^\d+\.\s/.test(trimmed);

        if (isBullet || isNumbered) {
          const rawText = trimmed.replace(/^[-*]\s+|\d+\.\s+/, '');
          return (
            <div key={lIdx} className="flex items-start gap-2.5 pl-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                isNumbered ? 'bg-sky-950 text-sky-400 border border-sky-800/60' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
              }`}>
                {isNumbered ? trimmed.match(/^\d+/)?.[0] || '•' : '▸'}
              </span>
              <div className="leading-relaxed flex-1">
                {parseInlineMarkdown(rawText)}
              </div>
            </div>
          );
        }

        return (
          <p key={lIdx} className="leading-relaxed">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const TutorialViewer: React.FC<TutorialViewerProps> = ({
  lesson: rawLesson,
  onNavigateToPractice,
  onNavigateToMCQ,
  onNavigateToInterview,
  onSaveNote,
  onSelectDay
}) => {
  const { isDark } = useAcademicsTheme();

  // Enrich lesson with analogies, external resources, videos, and quick checks
  const lesson = useMemo(() => getEnrichedLesson(rawLesson), [rawLesson]);

  // Mode: standard, beginner (explain like I'm a beginner), or deep_dive
  const [learningMode, setLearningMode] = useState<'standard' | 'beginner' | 'deep_dive'>('standard');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});
  const [inlineExplains, setInlineExplains] = useState<Record<number, boolean>>({});

  const handleToggleObjective = (index: number) => {
    setCheckedObjectives(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const progressPercent = useMemo(() => {
    const total = lesson.learningObjectives.length || 1;
    const completed = Object.values(checkedObjectives).filter(Boolean).length;
    return Math.min(100, Math.round((completed / total) * 100));
  }, [checkedObjectives, lesson.learningObjectives]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuickSaveNote = () => {
    if (onSaveNote) {
      onSaveNote(
        `Day ${lesson.dayNumber} Key Takeaways: ${lesson.title}`,
        `### ${lesson.title}\n\n**Objectives:**\n${lesson.learningObjectives.map(o => `- ${o}`).join('\n')}\n\n**Analogy:**\n${lesson.realLifeAnalogy?.analogy || ''}\n\n**Key Concept Summary:**\n${lesson.learnContent.slice(0, 400)}...`
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
    <div className={`flex flex-col gap-5 font-sans ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
      {/* 1. TOP HERO BAR: Objective & Mode Selector */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xl flex flex-col gap-4 ${
        isDark 
          ? 'bg-gradient-to-r from-[#0d131f] via-[#111726] to-[#0d131f] border-sky-800/40' 
          : 'bg-gradient-to-r from-sky-50 via-white to-sky-50 border-sky-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500 text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider block">
                  Day {lesson.dayNumber} • Module {lesson.subject.toUpperCase()}
                </span>
                {lesson.mrcetUnit && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60 font-semibold">
                    {lesson.mrcetUnit}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-xl font-bold leading-tight mt-0.5">
                {lesson.title}
              </h3>
            </div>
          </div>

          {/* Mode Switcher: Standard vs Beginner vs Deep Dive */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-[#090d14] border-stone-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setLearningMode('standard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                learningMode === 'standard'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>

            <button
              onClick={() => setLearningMode('beginner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                learningMode === 'beginner'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>❤️ Beginner Mode</span>
            </button>

            <button
              onClick={() => setLearningMode('deep_dive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                learningMode === 'deep_dive'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>🔬 Deep Dive</span>
            </button>
          </div>
        </div>

        {/* Lesson Progress Indicator */}
        <div className="space-y-1.5 pt-2 border-t border-stone-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold flex items-center gap-1.5">
              <span>🎯 Lesson Objectives & Progress:</span>
              <strong className="text-sky-400 font-mono">{progressPercent}%</strong>
            </span>
            <span className="text-[11px] opacity-75 font-mono">
              {Object.values(checkedObjectives).filter(Boolean).length} of {lesson.learningObjectives.length} completed
            </span>
          </div>
          <div className="w-full bg-stone-800/40 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Learning Objectives Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {lesson.learningObjectives.map((obj, i) => {
            const isChecked = !!checkedObjectives[i];
            return (
              <button
                key={i}
                onClick={() => handleToggleObjective(i)}
                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  isChecked
                    ? isDark ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : isDark ? 'bg-[#161d2b]/60 border-sky-900/30 text-sky-200/90 hover:bg-[#1c2538]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isChecked ? 'text-emerald-400' : 'text-stone-500'}`} />
                <span className="leading-snug">{obj}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/60 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>🤖 Ask About This Topic</span>
            </button>

            <button
              onClick={handleQuickSaveNote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'bg-[#161f30] hover:bg-[#1f2d47] text-sky-300 border-sky-800/50' : 'bg-white hover:bg-slate-100 text-sky-700 border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{noteSavedFeedback ? 'Saved to Notes! ✓' : 'Save to Revision Notes'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToPractice && (
              <button
                onClick={onNavigateToPractice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Open Practice Lab</span>
              </button>
            )}
            {onNavigateToMCQ && (
              <button
                onClick={onNavigateToMCQ}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border-purple-800/50' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                }`}
              >
                <span>MCQs</span>
              </button>
            )}
            {onNavigateToInterview && (
              <button
                onClick={onNavigateToInterview}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-800/50' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                <span>Interview Qs</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. BEGINNER MODE HERO CARD (if enabled) */}
      {learningMode === 'beginner' && lesson.beginnerExplanation && (
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg leading-relaxed ${
          isDark ? 'bg-[#181119] border-rose-900/50 text-rose-100' : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center justify-between mb-3 border-b border-rose-900/40 pb-2">
            <span className="font-bold text-sm flex items-center gap-2 text-rose-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>❤️ Plain English & Beginner Explanation</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
              Zero Technical Jargon
            </span>
          </div>
          <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
            {lesson.beginnerExplanation}
          </div>
        </div>
      )}

      {/* 3. REAL-LIFE INTUITION & METAPHOR CARD */}
      {lesson.realLifeAnalogy && (
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-md ${
          isDark 
            ? 'bg-gradient-to-r from-[#1c140d] via-[#17121b] to-[#121620] border-amber-500/40 text-amber-100' 
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-center justify-between text-amber-400 font-bold text-sm sm:text-base mb-2.5 border-b border-amber-800/40 pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lesson.realLifeAnalogy.title}</span>
            </div>
            <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40">
              💡 Real-World Metaphor
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
            <p className="font-medium">
              {lesson.realLifeAnalogy.analogy}
            </p>
            <div className={`p-2.5 rounded-lg border text-xs ${
              isDark ? 'bg-black/30 border-amber-900/40 text-amber-200' : 'bg-white border-amber-200 text-amber-900'
            }`}>
              <strong className="block text-[11px] uppercase tracking-wider text-amber-400 mb-0.5">
                🏭 Real Data Engineering / Production Scenario:
              </strong>
              <span>{lesson.realLifeAnalogy.realWorldExample}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ARCHITECTURAL / WORKFLOW CONCEPT DIAGRAM */}
      <ConceptDiagram dayNumber={lesson.dayNumber} subject={lesson.subject} />

      {/* 5. PARSED & STRUCTURED LECTURE CONTENT SECTIONS */}
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
                <div className="pl-1 text-xs">
                  {renderFormattedText(sec.content)}
                </div>
              </div>
            );
          }

          if (sec.type === 'code') {
            return (
              <div key={idx} className="rounded-xl border border-stone-800 bg-[#0a0d14] overflow-hidden shadow-lg">
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
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c2333] hover:bg-[#252f44] text-stone-300 text-xs transition-colors cursor-pointer"
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
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 text-xs transition-colors cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Run in Lab</span>
                      </button>
                    )}
                  </div>
                </div>

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

          // Regular Concept Card with inline 'Explain This' button
          return (
            <div 
              key={idx}
              className={`p-4 sm:p-5 rounded-xl border transition-all shadow-sm ${
                isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
              }`}
            >
              {sec.title && (
                <div className="flex items-center justify-between text-stone-100 font-bold text-sm sm:text-base mb-3 border-b border-stone-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-sky-500"></span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{sec.title}</span>
                  </div>

                  <button
                    onClick={() => setInlineExplains(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                      inlineExplains[idx]
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : isDark ? 'bg-[#161f30] text-sky-300 border-sky-800/50 hover:bg-[#1e2a44]' : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{inlineExplains[idx] ? 'Close Explain' : '✨ Explain This'}</span>
                  </button>
                </div>
              )}

              {inlineExplains[idx] && (
                <div className={`mb-3 p-3 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-[#181320] border-purple-900/50 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-950'
                }`}>
                  <strong className="block text-purple-400 font-bold mb-1">
                    ✨ Simple Intuition for: {sec.title || 'This Concept'}
                  </strong>
                  <p>
                    Think of this concept like an assembly line checkpoint: before letting records travel down the pipeline, this step guarantees each record adheres to the required structure and invariants.
                  </p>
                </div>
              )}

              <div className="text-xs sm:text-sm">
                {renderFormattedText(sec.content)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. M.TECH DEEP DIVE NOTES */}
      {learningMode === 'deep_dive' && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#100e1c] border border-indigo-800/60 shadow-lg text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>M.Tech Advanced Placement Nuances & Distributed Architecture Notes</span>
          </div>
          <p className="text-stone-300">
            In competitive placement rounds at FAANG and Tier-1 Data Platforms, interviewers test deep system invariants:
          </p>
          <ul className="mt-2 space-y-1.5 text-indigo-200/90 list-disc list-inside">
            <li><strong>Memory Allocation:</strong> CPython small integer caching (-5 to 256) vs brand-new PyLongObject heap allocations.</li>
            <li><strong>Garbage Collection Overhead:</strong> Cyclical reference detection algorithms can trigger latency spikes in high-throughput streaming consumers.</li>
            <li><strong>Network Shuffle Sharding:</strong> In PySpark, improper partition keys cause severe data skew where 99% of tasks complete instantly while 1 worker hangs for hours.</li>
          </ul>
        </div>
      )}

      {/* 7. RECOMMENDED LEARNING RESOURCES (W3Schools, TutorialsPoint, Official Docs) */}
      {lesson.externalResources && lesson.externalResources.length > 0 && (
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg flex flex-col gap-3 ${
          isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b pb-2.5 border-stone-800/70">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">📚 Recommended Learning Resources</h4>
                <p className="text-[11px] opacity-75">
                  Curated tutorials, official references, and interactive documentation.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/50">
              Verified Links
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lesson.externalResources.map((res, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all hover:border-sky-500/60 ${
                  isDark ? 'bg-[#111724] border-stone-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-sky-400">{res.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                      {res.difficulty}
                    </span>
                  </div>
                  <h5 className="font-semibold text-xs mb-1">{res.topic}</h5>
                  <p className="text-[11px] opacity-80 leading-relaxed">{res.whyUseful}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/40 text-[11px]">
                  <span className="text-stone-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>{res.estimatedTime}</span>
                  </span>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold hover:underline cursor-pointer"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. WATCH BEFORE YOU PRACTICE (Video Resources) */}
      {lesson.videoResources && lesson.videoResources.length > 0 && (
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg flex flex-col gap-3 ${
          isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b pb-2.5 border-stone-800/70">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Video className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">🎥 Watch Before You Practice</h4>
                <p className="text-[11px] opacity-75">
                  Educational video lessons and visual coding demonstrations.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
              HD Tutorials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.videoResources.map((vid, i) => (
              <a
                key={i}
                href={vid.url}
                target="_blank"
                rel="noreferrer"
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                  isDark ? 'bg-[#13121d] border-stone-800 hover:border-rose-500/60' : 'bg-slate-50 border-slate-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-current" />
                  </span>
                  <div>
                    <h5 className="font-bold text-xs group-hover:text-rose-400 transition-colors">
                      {vid.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] opacity-75 mt-0.5">
                      <span>{vid.channel}</span>
                      <span>•</span>
                      <span className="font-mono">{vid.duration}</span>
                    </div>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-stone-500 group-hover:text-rose-400 shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 9. MINI QUIZ / QUICK CHECK */}
      {lesson.miniQuiz && lesson.miniQuiz.length > 0 && (
        <LessonQuickCheck
          questions={lesson.miniQuiz}
          topicTitle={lesson.title}
          dayNumber={lesson.dayNumber}
          isDark={isDark}
        />
      )}

      {/* 10. ⚡ 60-SECOND REVISION SUMMARY */}
      {lesson.oneMinuteRevision && lesson.oneMinuteRevision.length > 0 && (
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-md flex flex-col gap-2.5 ${
          isDark ? 'bg-[#10141e] border-sky-900/50 text-stone-200' : 'bg-sky-50 border-sky-200 text-sky-950'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-sky-900/40">
            <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5 text-sky-400">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>⚡ 60-Second Revision Summary</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
              Quick Recall
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {lesson.oneMinuteRevision.map((rev, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{rev}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. BOTTOM CTA & NAVIGATION CONTROLS */}
      <div className={`flex flex-wrap items-center justify-between p-4 rounded-xl border gap-3 ${
        isDark ? 'bg-gradient-to-r from-emerald-950/30 to-sky-950/30 border-emerald-800/40' : 'bg-gradient-to-r from-emerald-50 to-sky-50 border-emerald-200'
      }`}>
        <div className="flex items-center gap-2">
          {onSelectDay && (
            <>
              <button
                onClick={() => onSelectDay(Math.max(1, lesson.dayNumber - 1))}
                disabled={lesson.dayNumber <= 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-30 cursor-pointer transition-colors ${
                  isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Day</span>
              </button>

              <button
                onClick={() => onSelectDay(Math.min(130, lesson.dayNumber + 1))}
                disabled={lesson.dayNumber >= 130}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-30 cursor-pointer transition-colors ${
                  isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <span>Next Day</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {onNavigateToPractice && (
          <button
            onClick={onNavigateToPractice}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Proceed to Practice Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* In-Lesson AI Learning Assistant Modal */}
      <TopicLearningAssistant
        lesson={lesson}
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        isDark={isDark}
      />
    </div>
  );
};
