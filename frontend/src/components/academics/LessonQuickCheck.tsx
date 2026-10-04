import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonQuickCheckProps {
  questions: QuizItem[];
  topicTitle: string;
  dayNumber: number;
  isDark: boolean;
  onRecommendedRevision?: (topic: string) => void;
}

export const LessonQuickCheck: React.FC<LessonQuickCheckProps> = ({
  questions,
  topicTitle,
  dayNumber,
  isDark,
  onRecommendedRevision
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleCheckAnswers = () => {
    setSubmitted(true);
    // If score is less than 60%, trigger revision suggestion
    const score = Object.entries(selectedAnswers).filter(([qIdx, oIdx]) => {
      return questions[Number(qIdx)]?.correctIndex === oIdx;
    }).length;

    if (score < questions.length * 0.7 && onRecommendedRevision) {
      onRecommendedRevision(`Day ${dayNumber}: ${topicTitle}`);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([qIdx, oIdx]) => {
    return questions[Number(qIdx)]?.correctIndex === oIdx;
  }).length;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg flex flex-col gap-4 font-sans ${
      isDark ? 'bg-[#0a0e17] border-purple-900/40 text-stone-200' : 'bg-white border-purple-200 text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-purple-900/30">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Award className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-bold text-xs sm:text-sm">🎯 Concept Knowledge Checkpoint</h4>
            <p className="text-[11px] opacity-75">
              Verify your comprehension of {topicTitle} before practice.
            </p>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
              correctCount === questions.length
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/60'
            }`}>
              Score: {correctCount} / {questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
            </span>
            <button
              onClick={handleReset}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'hover:bg-stone-800 border-stone-700 text-stone-400' : 'hover:bg-slate-200 border-slate-300 text-slate-600'
              }`}
              title="Retake Quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={qIdx}
              className={`p-3.5 rounded-xl border flex flex-col gap-2.5 transition-all ${
                isDark ? 'bg-[#111724] border-stone-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <span className="font-semibold text-xs leading-relaxed">
                  {q.question}
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-1.5 pl-7">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userChoice === oIdx;
                  let optStyle = isDark 
                    ? 'bg-[#161f30] border-stone-800 text-stone-300 hover:border-purple-500/50' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300';

                  if (submitted) {
                    if (oIdx === q.correctIndex) {
                      optStyle = 'bg-emerald-950/40 border-emerald-600/80 text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      optStyle = 'bg-rose-950/40 border-rose-600/80 text-rose-200 font-semibold';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-purple-600 text-white font-semibold shadow-sm border-purple-500';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={submitted}
                      className={`w-full p-2 rounded-lg text-left text-xs border transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && oIdx === q.correctIndex && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {submitted && isSelected && oIdx !== q.correctIndex && (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {submitted && (
                <div className={`mt-1 pl-7 text-[11px] leading-relaxed p-2.5 rounded-lg border ${
                  isCorrect 
                    ? isDark ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : isDark ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <strong className="block mb-0.5 font-bold">
                    {isCorrect ? '✓ Correct Explanation:' : '✕ Why this is incorrect:'}
                  </strong>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Action */}
      {!submitted && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] opacity-70">
            {totalAnswered} of {questions.length} answered
          </span>
          <button
            onClick={handleCheckAnswers}
            disabled={totalAnswered < questions.length}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Verify Answers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
