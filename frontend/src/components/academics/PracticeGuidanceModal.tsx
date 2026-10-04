import React from 'react';
import { HelpCircle, Brain, Eye, X, Lightbulb, ArrowRight } from 'lucide-react';
import type { CodingExercise } from '../../types/academics';

export type GuidanceModalType = 'dont_understand' | 'how_to_think' | 'another_example';

interface PracticeGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: GuidanceModalType;
  exercise: CodingExercise;
  isDark: boolean;
}

export const PracticeGuidanceModal: React.FC<PracticeGuidanceModalProps> = ({
  isOpen,
  onClose,
  type,
  exercise,
  isDark
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[85vh] ${
        isDark ? 'bg-[#0c1018] border-stone-700 text-stone-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          type === 'dont_understand' 
            ? isDark ? 'bg-amber-950/40 border-amber-800/60' : 'bg-amber-50 border-amber-200'
            : type === 'how_to_think'
            ? isDark ? 'bg-purple-950/40 border-purple-800/60' : 'bg-purple-50 border-purple-200'
            : isDark ? 'bg-sky-950/40 border-sky-800/60' : 'bg-sky-50 border-sky-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`p-1.5 rounded-xl text-white shadow-sm ${
              type === 'dont_understand' ? 'bg-amber-600' : type === 'how_to_think' ? 'bg-purple-600' : 'bg-sky-600'
            }`}>
              {type === 'dont_understand' && <HelpCircle className="w-4 h-4" />}
              {type === 'how_to_think' && <Brain className="w-4 h-4" />}
              {type === 'another_example' && <Eye className="w-4 h-4" />}
            </span>

            <div>
              <h4 className="font-bold text-xs sm:text-sm">
                {type === 'dont_understand' && "❓ Let's Break Down What This Means"}
                {type === 'how_to_think' && "🧠 How Should You Think About This?"}
                {type === 'another_example' && "👀 Here is Another Concrete Example"}
              </h4>
              <p className="text-[11px] opacity-75 truncate max-w-xs sm:max-w-sm">
                {exercise.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs leading-relaxed font-sans">
          {type === 'dont_understand' && (
            <>
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-[#141b29] border-sky-900/40 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-900'
              }`}>
                <div className="font-bold text-xs mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Plain English Explanation</span>
                </div>
                <p>
                  {exercise.problemStatement}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-[#181520] border-purple-900/40 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}>
                <div className="font-bold text-xs mb-1">2. Real-World Metaphor</div>
                <p>
                  {exercise.realLifeScenario || 'Imagine you have an incoming stream of customer orders. Some orders have missing fields or string numbers like "42". Your job is to make sure every order has valid numbers before saving it to the database.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-lg border ${
                  isDark ? 'bg-[#111622] border-stone-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="font-bold text-emerald-400 block mb-1">📥 What comes in (Input):</span>
                  <span className="font-mono text-[11px] opacity-90">{exercise.sampleInputExplanation || exercise.inputFormat || 'Structured record or array'}</span>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  isDark ? 'bg-[#111622] border-stone-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="font-bold text-sky-400 block mb-1">📤 What goes out (Output):</span>
                  <span className="font-mono text-[11px] opacity-90">{exercise.sampleOutputExplanation || exercise.outputFormat || 'Cleaned result or boolean status'}</span>
                </div>
              </div>
            </>
          )}

          {type === 'how_to_think' && (
            <>
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-[#141224] border-purple-900/50 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}>
                <div className="font-bold text-xs mb-1.5 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>5-Step Problem Solving Framework</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {exercise.howToThinkSteps?.map((step, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-[#0f1816] border-emerald-900/40 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="font-bold text-xs mb-1">What to Observe & What to Ignore</div>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                  <li><strong>Observe:</strong> Data types, empty collection inputs, and whether order matters.</li>
                  <li><strong>Ignore:</strong> Premature micro-optimizations before getting a working clean pass.</li>
                  <li><strong>Target Complexity:</strong> {exercise.timeComplexity || 'O(N) time'}, {exercise.spaceComplexity || 'O(1) auxiliary space'}.</li>
                </ul>
              </div>
            </>
          )}

          {type === 'another_example' && (
            <>
              <div className={`p-3 rounded-xl border space-y-2 ${
                isDark ? 'bg-[#111726] border-sky-900/40 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="font-bold text-xs text-sky-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Alternative Scenario Trace</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2 rounded bg-black/40 border border-stone-800">
                    <span className="text-amber-400 font-bold block text-[10px] uppercase font-sans mb-0.5">Input:</span>
                    <span className="text-stone-300">{exercise.sampleExampleInput || '{"id": 999, "items": ["apple", "banana"], "total": "55.00"}'}</span>
                  </div>

                  <div className="p-2 rounded bg-black/40 border border-stone-800">
                    <span className="text-emerald-400 font-bold block text-[10px] uppercase font-sans mb-0.5">Expected Return:</span>
                    <span className="text-stone-300">{exercise.sampleExampleOutput || '{"id": 999, "items": ["apple", "banana"], "total": 55.0}'}</span>
                  </div>
                </div>

                <p className="text-[11px] opacity-75 mt-2">
                  Notice that strings with decimal points become real floating-point numbers, and collections maintain their elements cleanly.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`px-4 py-2.5 border-t flex items-center justify-between text-xs ${
          isDark ? 'bg-[#0f141f] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[11px] opacity-60">Ready to write code?</span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <span>Back to Code Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
