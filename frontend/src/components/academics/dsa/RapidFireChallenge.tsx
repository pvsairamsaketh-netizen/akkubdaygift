import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';

interface RapidQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

const RAPID_QUESTIONS: RapidQuestion[] = [
  {
    id: 'rf_1',
    question: 'What is the average and worst-case time complexity of Binary Search on a sorted array of size N?',
    options: ['O(log N) for both', 'O(N) worst case', 'O(1) average case', 'O(N log N)'],
    correctIndex: 0,
    explanation: 'Binary Search halves the search space at each iteration: N, N/2, N/4 ... yielding O(log N) worst and average case.',
    topic: 'Searching'
  },
  {
    id: 'rf_2',
    question: 'When would you prefer a HashMap over an Array?',
    options: [
      'When you need O(1) average key-value lookup for arbitrary non-integer or sparse keys',
      'When you need guaranteed sorted order of elements',
      'When memory overhead must be strictly zero',
      'Only for small datasets under 10 elements'
    ],
    correctIndex: 0,
    explanation: 'HashMaps provide O(1) expected time lookup using hashing, ideal for sparse keys or non-integer identifiers.',
    topic: 'Hashing'
  },
  {
    id: 'rf_3',
    question: 'What is the fundamental difference between BFS and DFS in graph traversal?',
    options: [
      'BFS uses a Queue and explores level-by-level; DFS uses a Stack/recursion and explores deep into branches first',
      'BFS works only on trees, while DFS works only on cyclic graphs',
      'BFS has O(N^2) complexity, while DFS is O(N)',
      'There is no difference in traversal order'
    ],
    correctIndex: 0,
    explanation: 'BFS explores neighbor vertices level-by-level using FIFO (Queue). DFS plunges deep along branches using LIFO (Stack).',
    topic: 'Graphs'
  },
  {
    id: 'rf_4',
    question: 'What is Memoization in Dynamic Programming?',
    options: [
      'Top-down caching of recursive subproblem solutions to prevent recomputation',
      'Bottom-up iteration filling a table array',
      'Sorting an array before binary search',
      'Deleting unused memory in garbage collection'
    ],
    correctIndex: 0,
    explanation: 'Memoization is top-down DP: caching return values of expensive recursive calls indexed by input state.',
    topic: 'Dynamic Programming'
  },
  {
    id: 'rf_5',
    question: 'Which of the following sorting algorithms is STABLE by default?',
    options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Selection Sort'],
    correctIndex: 0,
    explanation: 'Merge Sort preserves the relative input order of identical keys, making it a stable sort.',
    topic: 'Sorting'
  },
  {
    id: 'rf_6',
    question: 'What is a Min-Heap data structure invariant?',
    options: [
      'The parent node key is always less than or equal to its children keys',
      'The left child is smaller than parent, right child is greater',
      'All leaves must store NULL',
      'It allows O(1) arbitrary element deletion'
    ],
    correctIndex: 0,
    explanation: 'In a Min-Heap, the root is always the minimum element, and every parent is <= its children.',
    topic: 'Heap'
  },
  {
    id: 'rf_7',
    question: 'What is a Trie (Prefix Tree) primarily optimized for?',
    options: [
      'Fast prefix retrieval and autocomplete on strings in O(L) time where L is word length',
      'Sorting integers in constant memory',
      'Finding shortest paths in weighted graphs',
      'Matrix multiplication'
    ],
    correctIndex: 0,
    explanation: 'Tries store characters in path edges, allowing word and prefix lookups proportional only to the word length L, independent of total dictionary size.',
    topic: 'Tries'
  },
  {
    id: 'rf_8',
    question: 'What is the space complexity of an in-order recursive traversal of a balanced binary tree of N nodes?',
    options: ['O(log N) call stack frames', 'O(N) auxiliary space', 'O(1) always', 'O(N^2)'],
    correctIndex: 0,
    explanation: 'In a balanced binary tree, the tree height is log2(N). The recursion call stack depth equals tree height: O(log N).',
    topic: 'Trees'
  }
];

export const RapidFireChallenge: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isFinished]);

  const handleTimeout = () => {
    setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
    setWeakTopics(w => [...w, RAPID_QUESTIONS[currentIndex].topic]);
    handleNext();
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const isCorrect = idx === RAPID_QUESTIONS[currentIndex].correctIndex;
    if (isCorrect) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
      setWeakTopics(w => [...w, RAPID_QUESTIONS[currentIndex].topic]);
    }

    setTimeout(() => {
      handleNext();
    }, 1200);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setSecondsLeft(30);
    if (currentIndex < RAPID_QUESTIONS.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  const currentQ = RAPID_QUESTIONS[currentIndex];

  return (
    <div className="flex flex-col gap-4 text-stone-200 font-sans max-w-3xl mx-auto">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c120c] via-[#24170d] to-[#1c120c] border border-amber-600/40 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Zap className="w-5 h-5 fill-current" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                ⚡ 30-Second DSA Rapid Fire
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Speed Test
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              30 seconds per question. Sharpens instant recall for placement interview rounds.
            </p>
          </div>
        </div>

        {/* Timer Ring */}
        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono font-bold text-sm ${
          secondsLeft <= 5 
            ? 'border-rose-500 text-rose-300 animate-ping' 
            : 'border-amber-500 text-amber-300'
        }`}>
          {secondsLeft}s
        </div>
      </div>

      {/* 2. GAME BODY OR RESULTS */}
      {!isFinished ? (
        <div className="p-5 rounded-2xl bg-[#0d1117] border border-stone-800 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-xs">
            <span className="text-stone-400 font-mono">
              Question {currentIndex + 1} of {RAPID_QUESTIONS.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#161c28] text-amber-300 font-mono font-bold border border-stone-700">
              {currentQ.topic}
            </span>
          </div>

          <h3 className="font-bold text-base sm:text-lg text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = currentQ.correctIndex === idx;

              let style = 'bg-[#151c28] border-stone-800 hover:border-amber-500/60 text-stone-200';
              if (selectedOption !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${style}`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 font-bold bg-[#10141d] text-stone-400 border border-stone-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="p-6 rounded-2xl bg-[#0d1117] border border-amber-600/40 shadow-2xl flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
            <Flame className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Rapid-Fire Round Complete!</h3>
            <p className="text-xs text-stone-300 mt-1">
              Your placement quick-recall results are ready.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-xs font-mono">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800 text-emerald-300">
              <span className="block text-[10px] uppercase text-stone-400">Correct</span>
              <span className="text-2xl font-bold">{score.correct}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800 text-rose-300">
              <span className="block text-[10px] uppercase text-stone-400">Incorrect / Missed</span>
              <span className="text-2xl font-bold">{score.incorrect}</span>
            </div>
          </div>

          {weakTopics.length > 0 && (
            <div className="p-3 rounded-xl bg-[#141a24] border border-stone-800 text-xs w-full text-left">
              <span className="font-bold text-amber-400 block mb-1">Recommended Quick Revision:</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(weakTopics)).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore({ correct: 0, incorrect: 0 });
              setIsFinished(false);
              setWeakTopics([]);
              setSecondsLeft(30);
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
