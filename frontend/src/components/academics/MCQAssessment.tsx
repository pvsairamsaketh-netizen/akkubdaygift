import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import type { MCQQuestion } from '../../types/academics';

interface MCQAssessmentProps {
  questions: MCQQuestion[];
  onComplete?: (score: number, total: number) => void;
  dayNumber?: number;
}

export const MCQAssessment: React.FC<MCQAssessmentProps> = ({
  questions,
  onComplete,
  dayNumber
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400 bg-[#0d1117] rounded-xl border border-stone-800">
        No assessment questions available for this module yet.
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOpt = selectedAnswers[currentIndex];
  const isCurrentSubmitted = submittedAnswers[currentIndex] === true;

  const handleSelectOption = (optIndex: number) => {
    if (isCurrentSubmitted) return; // locked once checked
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleSubmitCurrent = () => {
    if (selectedOpt === undefined) return;
    setSubmittedAnswers(prev => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });
      setIsFinished(true);
      if (onComplete) {
        onComplete(correctCount, questions.length);
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  // Summary Score View
  if (isFinished) {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    const pct = Math.round((correctCount / questions.length) * 100);
    const passed = pct >= 70;

    return (
      <div className="p-6 rounded-2xl bg-[#0d1117] border border-stone-800 text-stone-200 flex flex-col items-center text-center gap-4 max-w-xl mx-auto my-4 shadow-2xl">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-stone-100">
            {passed ? 'Topic Assessment Passed! 🎉' : 'Assessment Completed — Keep Practicing! 💪'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {passed 
              ? 'Great job, Akku! Your understanding of this concept is placement-ready.' 
              : 'Review the explanations below and try again to reinforce your conceptual foundation.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full py-2">
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">Score</div>
            <div className="text-xl font-bold font-mono text-stone-100">{correctCount} / {questions.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">Accuracy</div>
            <div className={`text-xl font-bold font-mono ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>{pct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">Status</div>
            <div className={`text-sm font-bold mt-1 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {passed ? 'Mastered' : 'Needs Review'}
            </div>
          </div>
        </div>

        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Assessment</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-800 bg-[#0d1117] text-stone-200 p-5 flex flex-col gap-4 shadow-xl">
      {/* Progress & Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {dayNumber && (
            <span className="text-xs text-stone-400 hidden sm:inline">
              Day {dayNumber} Diagnostic Quiz
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => {
            const isAnswered = submittedAnswers[i] === true;
            const isCorrect = isAnswered && selectedAnswers[i] === questions[i].correctIndex;
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-6 h-6 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  currentIndex === i
                    ? 'border-2 border-sky-400 text-white bg-sky-600/30'
                    : isAnswered
                    ? isCorrect
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                    : 'bg-[#161b22] text-stone-400 border border-stone-800'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Text */}
      <div className="text-sm sm:text-base font-semibold text-stone-100 leading-relaxed font-sans">
        {currentQ.question}
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2.5">
        {currentQ.options.map((opt, optIdx) => {
          const isSelected = selectedOpt === optIdx;
          const isCorrect = optIdx === currentQ.correctIndex;
          
          let optStyle = 'border-stone-800 bg-[#161b22] hover:border-stone-700 text-stone-300';
          if (isSelected && !isCurrentSubmitted) {
            optStyle = 'border-sky-500 bg-sky-950/30 text-sky-200 shadow-sm';
          } else if (isCurrentSubmitted) {
            if (isCorrect) {
              optStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200';
            } else if (isSelected && !isCorrect) {
              optStyle = 'border-rose-500 bg-rose-950/30 text-rose-200';
            } else {
              optStyle = 'border-stone-800/60 bg-[#161b22]/50 text-stone-500';
            }
          }

          return (
            <button
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              disabled={isCurrentSubmitted}
              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-sans transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 border ${
                isSelected 
                  ? 'border-sky-400 bg-sky-500 text-white' 
                  : 'border-stone-600 bg-[#0d1117] text-stone-400'
              }`}>
                {String.fromCharCode(65 + optIdx)}
              </div>
              <div className="flex-1 leading-snug">{opt}</div>
              {isCurrentSubmitted && isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {isCurrentSubmitted && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation once submitted */}
      {isCurrentSubmitted && (
        <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
          selectedOpt === currentQ.correctIndex 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
        }`}>
          {selectedOpt === currentQ.correctIndex ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-semibold text-xs sm:text-sm">
              {selectedOpt === currentQ.correctIndex ? 'Correct Answer!' : 'Incorrect Answer'}
            </div>
            <div className="mt-1 text-stone-300 font-sans text-xs">
              <span className="font-semibold text-stone-200">Explanation: </span>
              {currentQ.explanation}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-800">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-400 hover:text-stone-200 disabled:opacity-40 transition-colors"
        >
          Previous
        </button>

        {!isCurrentSubmitted ? (
          <button
            onClick={handleSubmitCurrent}
            disabled={selectedOpt === undefined}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-stone-800 disabled:text-stone-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            <span>Check Answer</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            <span>{currentIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
