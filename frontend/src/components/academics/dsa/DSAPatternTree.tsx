import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';

interface DecisionNode {
  question: string;
  yes?: { node?: string; result?: string; pattern: string; reason: string; example: string };
  no?: { node?: string; result?: string; pattern: string; reason: string; example: string };
}

const DECISION_TREE: Record<string, DecisionNode> = {
  start: {
    question: 'Is the problem about contiguous elements, subarrays, or substrings?',
    yes: {
      node: 'contiguous_type',
      pattern: '',
      reason: '',
      example: ''
    },
    no: {
      node: 'sorted_or_monotonic',
      pattern: '',
      reason: '',
      example: ''
    }
  },
  contiguous_type: {
    question: 'Does the window size change dynamically based on conditions, or are you doing range sum lookups?',
    yes: {
      result: 'Sliding Window',
      pattern: 'Sliding Window (Fixed or Variable)',
      reason: 'Use when looking for longest/shortest contiguous subarray/substring satisfying a constraint.',
      example: 'Longest Substring Without Repeating Characters, Minimum Window Substring.'
    },
    no: {
      result: 'Prefix Sum / Difference Array',
      pattern: 'Prefix Sum & 2D Prefix Sum',
      reason: 'Precomputes cumulative sums allowing O(1) range sum queries: sum(i, j) = P[j] - P[i-1].',
      example: 'Subarray Sum Equals K, Range Sum Query 2D.'
    }
  },
  sorted_or_monotonic: {
    question: 'Is the input sorted, or can the answer space be framed as a monotonic condition (True -> False)?',
    yes: {
      result: 'Binary Search',
      pattern: 'Binary Search on Answer / Values',
      reason: 'Eliminates half the search space at every step in O(log N) time.',
      example: 'Koko Eating Bananas, Capacity To Ship Packages Within D Days, Search in Rotated Sorted Array.'
    },
    no: {
      node: 'top_k_or_extreme',
      pattern: '',
      reason: '',
      example: ''
    }
  },
  top_k_or_extreme: {
    question: 'Do you need the "Top K", "Kth largest/smallest", or dynamic median from a continuous stream?',
    yes: {
      result: 'Heap / Priority Queue',
      pattern: 'Min-Heap / Max-Heap',
      reason: 'Maintains K extreme elements with O(log K) insertions and O(1) peek.',
      example: 'Top K Frequent Elements, Find Median from Data Stream, Merge K Sorted Lists.'
    },
    no: {
      node: 'next_greater_smaller',
      pattern: '',
      reason: '',
      example: ''
    }
  },
  next_greater_smaller: {
    question: 'Are you looking for the "Next Greater Element", "Nearest Smaller", or "Largest Rectangle"?',
    yes: {
      result: 'Monotonic Stack',
      pattern: 'Monotonic Stack (Decreasing / Increasing)',
      reason: 'Maintains elements in monotonic order, resolving closest boundary conditions in O(N) linear time.',
      example: 'Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water.'
    },
    no: {
      node: 'graph_or_tree',
      pattern: '',
      reason: '',
      example: ''
    }
  },
  graph_or_tree: {
    question: 'Does the problem involve nodes, edges, connected components, or shortest paths?',
    yes: {
      result: 'BFS / DFS / Dijkstra',
      pattern: 'Graph Traversal & Shortest Path',
      reason: 'BFS for unweighted shortest paths; Dijkstra for weighted graphs; DFS for topological sort & connected components.',
      example: 'Number of Islands, Course Schedule, Word Ladder.'
    },
    no: {
      node: 'optimization_dp',
      pattern: '',
      reason: '',
      example: ''
    }
  },
  optimization_dp: {
    question: 'Are you asked for maximum profit, minimum cost, or total number of ways with overlapping choices?',
    yes: {
      result: 'Dynamic Programming',
      pattern: 'Dynamic Programming (1D, 2D, Knapsack)',
      reason: 'Breaks problem into overlapping subproblems, memoizing optimal states instead of exponential brute force.',
      example: 'Coin Change, Longest Common Subsequence, House Robber.'
    },
    no: {
      result: 'Backtracking / Recursion',
      pattern: 'Backtracking & Pruning',
      reason: 'Generates all valid permutations, subsets, or combinations by traversing decision trees.',
      example: 'N-Queens, Sudoku Solver, Subsets II, Word Search.'
    }
  }
};

export const DSAPatternTree: React.FC = () => {
  const [currentNodeKey, setCurrentNodeKey] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);

  const handleChoice = (isYes: boolean) => {
    const node = DECISION_TREE[currentNodeKey];
    const branch = isYes ? node.yes : node.no;

    if (!branch) return;

    if (branch.result) {
      setFinalResult(branch);
    } else if (branch.node) {
      setHistory(h => [...h, currentNodeKey]);
      setCurrentNodeKey(branch.node);
    }
  };

  const handleReset = () => {
    setCurrentNodeKey('start');
    setHistory([]);
    setFinalResult(null);
  };

  const currentNode = DECISION_TREE[currentNodeKey];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d141e] via-[#101b2a] to-[#0d141e] border border-sky-800/40 shadow-xl flex flex-col gap-4 text-stone-200 font-sans max-w-3xl mx-auto my-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <GitFork className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">
              "Which Pattern Should I Use?" (Interactive Decision Tree)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Answer 2–3 questions about your problem constraints to instantly identify the optimal DSA pattern.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Decision Node or Result */}
      {!finalResult ? (
        <div className="p-5 rounded-xl bg-[#090d14] border border-stone-800 flex flex-col gap-4 text-center items-center">
          <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
            Diagnostic Step {history.length + 1}
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white max-w-xl leading-snug">
            {currentNode.question}
          </h4>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleChoice(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>YES</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm border border-stone-700 transition-all cursor-pointer"
            >
              NO / NOT SURE
            </button>
          </div>
        </div>
      ) : (
        /* Final Recommended Pattern */
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#0d1a16] via-[#10221c] to-[#0d1a16] border border-emerald-600/50 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Optimal Placement Pattern Detected
            </span>
            <span className="text-xs text-stone-400">FAANG Recommended</span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-emerald-400">
            {finalResult.pattern}
          </h4>

          <div className="text-xs text-stone-200 leading-relaxed bg-[#08120d] p-3.5 rounded-xl border border-emerald-900/60 space-y-2">
            <div>
              <strong className="text-emerald-300 block mb-0.5">Why This Pattern?</strong>
              <p>{finalResult.reason}</p>
            </div>
            <div>
              <strong className="text-amber-300 block mb-0.5">Classic LeetCode Problems:</strong>
              <p className="font-mono text-stone-300">{finalResult.example}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleReset}
              className="text-xs text-sky-400 hover:underline cursor-pointer"
            >
              ← Try another problem scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
