import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Cpu, 
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';

interface DryRunStep {
  line: number;
  code: string;
  variables: Record<string, string>;
  explanation: string;
}

interface InteractiveDryRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: DryRunStep[];
  isDark: boolean;
}

export const InteractiveDryRunModal: React.FC<InteractiveDryRunModalProps> = ({
  isOpen,
  onClose,
  title,
  steps,
  isDark
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  React.useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  if (!isOpen || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${
        isDark ? 'bg-[#0a0e17] border-stone-700 text-stone-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'bg-[#111724] border-stone-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-emerald-500 text-white shadow-sm">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm">Interactive Visual Dry Run</h4>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <p className="text-[11px] opacity-75 truncate max-w-sm sm:max-w-md">
                {title}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setIsPlaying(false); onClose(); }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col gap-4 text-xs font-sans">
          {/* Progress bar */}
          <div className="w-full bg-stone-800/40 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Code Execution Viewer with Line Highlight */}
          <div className="rounded-xl border overflow-hidden shadow-inner bg-[#07090e] border-stone-800">
            <div className="px-3 py-1.5 bg-[#121622] border-b border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Interpreter Call Stack & Line Pointer</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                Line {currentStep.line}
              </span>
            </div>

            <div className="p-3 font-mono text-xs space-y-1">
              {steps.map((s, idx) => {
                const isActive = idx === currentStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-2 py-1 rounded transition-all ${
                      isActive
                        ? 'bg-emerald-950/70 border-l-4 border-emerald-400 text-emerald-200 font-bold shadow'
                        : 'text-stone-500 opacity-60'
                    }`}
                  >
                    <span className="w-6 text-right select-none opacity-40">{s.line}</span>
                    <span className="flex-1 whitespace-pre">{s.code}</span>
                    {isActive && (
                      <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold animate-pulse">
                        executing →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Variable State Memory Inspector */}
          <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
            isDark ? 'bg-[#0f1420] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-stone-800/60 pb-1.5">
              <span className="font-bold text-[11px] flex items-center gap-1.5 text-sky-400 uppercase tracking-wider font-mono">
                <Layers className="w-3.5 h-3.5" />
                <span>Active Variable State Inspector (Heap & Local Namespace)</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {Object.keys(currentStep.variables).length} active keys
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
              {Object.entries(currentStep.variables).map(([name, val], i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    isDark ? 'bg-[#151c2c] border-sky-900/40 text-stone-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-amber-400 font-bold">{name}:</span>
                  <span className="text-emerald-400 font-semibold truncate max-w-[150px]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Explanation Callout */}
          <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-300">Execution Insight: </strong>
              <span>{currentStep.explanation}</span>
            </div>
          </div>
        </div>

        {/* Step Controls Footer */}
        <div className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-2 ${
          isDark ? 'bg-[#111724] border-stone-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'bg-[#172033] border-stone-700 text-stone-300 hover:bg-stone-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm cursor-pointer transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Auto'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(i => Math.max(0, i - 1))}
              disabled={currentStepIndex <= 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer ${
                isDark ? 'bg-[#172033] border-stone-700 text-stone-300 hover:bg-stone-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => setCurrentStepIndex(i => Math.min(steps.length - 1, i + 1))}
              disabled={currentStepIndex >= steps.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
