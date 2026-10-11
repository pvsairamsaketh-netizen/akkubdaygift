import React, { useState } from 'react';
import { 
  GitFork, 
  Search, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export const TreeGraphVisualizer: React.FC<{ initialMode?: 'bst' | 'graph' }> = ({
  initialMode = 'bst'
}) => {
  const { isDark } = useAcademicsTheme();
  const [mode, setMode] = useState<'bst' | 'graph'>(initialMode);

  // BST state
  const [bstSearchTarget, setBstSearchTarget] = useState<string>('40');
  const [bstHighlightedPath, setBstHighlightedPath] = useState<number[]>([]);
  const [bstMessage, setBstMessage] = useState<string>(
    'BST Invariant: Left child < Node < Right child. Search takes O(log N) on balanced trees.'
  );

  // Graph Traversal State
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [graphMessage, setGraphMessage] = useState<string>(
    'BFS uses a FIFO Queue to visit neighbors level-by-level (Shortest Path). DFS uses a LIFO Stack to explore branches deeply.'
  );

  // Static BST Nodes for visualization: root 50, left 30, right 70, 20, 40, 60, 80
  const handleBstSearch = () => {
    const target = Number(bstSearchTarget.trim());
    if (isNaN(target)) return;

    // Trace path in static tree:
    const path: number[] = [50];

    if (target === 50) {
      setBstHighlightedPath([50]);
      setBstMessage(`Found ${target} at root (1 step, O(1) best case)!`);
      return;
    }

    if (target < 50) {
      path.push(30);
      if (target === 30) {
        setBstHighlightedPath(path);
        setBstMessage(`Found ${target} in 2 steps (Left branch).`);
        return;
      }
      if (target < 30) {
        path.push(20);
        setBstMessage(target === 20 ? `Found ${target} at leaf node (3 steps).` : `${target} is not in BST.`);
      } else {
        path.push(40);
        setBstMessage(target === 40 ? `Found ${target} at leaf node (3 steps).` : `${target} is not in BST.`);
      }
    } else {
      path.push(70);
      if (target === 70) {
        setBstHighlightedPath(path);
        setBstMessage(`Found ${target} in 2 steps (Right branch).`);
        return;
      }
      if (target < 70) {
        path.push(60);
        setBstMessage(target === 60 ? `Found ${target} at leaf node (3 steps).` : `${target} is not in BST.`);
      } else {
        path.push(80);
        setBstMessage(target === 80 ? `Found ${target} at leaf node (3 steps).` : `${target} is not in BST.`);
      }
    }

    setBstHighlightedPath(path);
  };

  const handleInorderTraversal = () => {
    setBstHighlightedPath([20, 30, 40, 50, 60, 70, 80]);
    setBstMessage('Inorder Traversal (Left, Node, Right): [20, 30, 40, 50, 60, 70, 80]. Inorder on a BST always visits keys in strictly SORTED ascending order!');
  };

  // Graph BFS Simulation
  const handleRunBFS = () => {
    setVisitedNodes([1, 2, 3, 4, 5]);
    setGraphMessage('BFS (Breadth-First Search): Visited Level 0 (Node 1) → Level 1 (Nodes 2, 3) → Level 2 (Nodes 4, 5). Queue order ensures shortest unweighted path!');
  };

  // Graph DFS Simulation
  const handleRunDFS = () => {
    setVisitedNodes([1, 2, 4, 3, 5]);
    setGraphMessage('DFS (Depth-First Search): Visited Branch 1 → 2 → 4, backtracked, then visited 3 → 5. Recursion call stack / explicit stack drives deep traversal.');
  };

  const handleResetGraph = () => {
    setVisitedNodes([]);
    setGraphMessage('Reset graph state. Choose BFS or DFS to simulate traversal.');
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <GitFork className="w-4 h-4 text-sky-400" />
            <span>Interactive Tree & Graph Algorithmic Visualizer</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Trace Binary Search Tree pointer traversals, Inorder sorting properties, and Breadth/Depth-First Search exploration paths.
          </p>
        </div>

        {/* Mode Selector */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-[#121622] border-stone-800' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            onClick={() => setMode('bst')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'bst'
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Binary Search Tree (BST)
          </button>
          <button
            onClick={() => setMode('graph')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'graph'
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Graph Traversal (BFS & DFS)
          </button>
        </div>
      </div>

      {/* MODE 1: BST */}
      {mode === 'bst' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-stone-800/80 bg-stone-900/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono opacity-80">Search Value:</span>
              <input
                type="number"
                value={bstSearchTarget}
                onChange={(e) => setBstSearchTarget(e.target.value)}
                className={`w-20 px-2.5 py-1 rounded-lg text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                  isDark ? 'bg-[#121622] border-stone-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={handleBstSearch}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
              <button
                onClick={handleInorderTraversal}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inorder Sort Traversal</span>
              </button>
            </div>

            <button
              onClick={() => {
                setBstHighlightedPath([]);
                setBstMessage('BST reset. Search for any node value (e.g. 40, 70, 99).');
              }}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                isDark ? 'bg-[#161f30] text-stone-400 border-stone-700' : 'bg-white text-slate-600 border-slate-300'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Explanation Alert */}
          <div className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
            isDark ? 'bg-[#121826] border-sky-800/50 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-950 font-medium'
          }`}>
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>{bstMessage}</span>
          </div>

          {/* Visual Tree Rendering */}
          <div className={`p-6 rounded-xl border flex flex-col items-center justify-center min-h-[260px] ${
            isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-100 border-slate-300'
          }`}>
            {/* Level 0: Root 50 */}
            <div className="flex justify-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-lg border-2 transition-all ${
                bstHighlightedPath.includes(50)
                  ? 'bg-sky-600 text-white border-sky-300 scale-110 ring-4 ring-sky-500/30'
                  : isDark ? 'bg-[#141b2b] text-stone-200 border-stone-700' : 'bg-white text-slate-800 border-slate-400'
              }`}>
                50
              </div>
            </div>

            {/* Level 1: 30 and 70 */}
            <div className="flex justify-center gap-24 sm:gap-32 mb-4">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold font-mono text-xs shadow-md border-2 transition-all ${
                bstHighlightedPath.includes(30)
                  ? 'bg-sky-600 text-white border-sky-300 scale-110 ring-4 ring-sky-500/30'
                  : isDark ? 'bg-[#141b2b] text-stone-200 border-stone-700' : 'bg-white text-slate-800 border-slate-400'
              }`}>
                30
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold font-mono text-xs shadow-md border-2 transition-all ${
                bstHighlightedPath.includes(70)
                  ? 'bg-sky-600 text-white border-sky-300 scale-110 ring-4 ring-sky-500/30'
                  : isDark ? 'bg-[#141b2b] text-stone-200 border-stone-700' : 'bg-white text-slate-800 border-slate-400'
              }`}>
                70
              </div>
            </div>

            {/* Level 2: Leaves (20, 40, 60, 80) */}
            <div className="flex justify-center gap-6 sm:gap-10">
              {[20, 40, 60, 80].map(val => (
                <div
                  key={val}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-xs shadow-sm border-2 transition-all ${
                    bstHighlightedPath.includes(val)
                      ? 'bg-emerald-600 text-white border-emerald-300 scale-110 ring-4 ring-emerald-500/30'
                      : isDark ? 'bg-[#141b2b] text-stone-200 border-stone-700' : 'bg-white text-slate-800 border-slate-400'
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: GRAPH TRAVERSAL */}
      {mode === 'graph' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-stone-800/80 bg-stone-900/20">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunBFS}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Run BFS (Level-by-Level)
              </button>
              <button
                onClick={handleRunDFS}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Run DFS (Depth Exploration)
              </button>
            </div>

            <button
              onClick={handleResetGraph}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                isDark ? 'bg-[#161f30] text-stone-400 border-stone-700' : 'bg-white text-slate-600 border-slate-300'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
            isDark ? 'bg-[#121826] border-purple-800/50 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-950 font-medium'
          }`}>
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>{graphMessage}</span>
          </div>

          {/* Graph Nodes Visual */}
          <div className={`p-6 rounded-xl border flex flex-col items-center justify-center min-h-[220px] ${
            isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {[1, 2, 3, 4, 5].map((nodeId) => {
                const isVisited = visitedNodes.includes(nodeId);
                const visitOrder = visitedNodes.indexOf(nodeId) + 1;
                return (
                  <div key={nodeId} className="flex flex-col items-center gap-1.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold font-mono text-sm shadow-md border-2 transition-all ${
                      isVisited
                        ? 'bg-purple-600 text-white border-purple-300 scale-105 ring-4 ring-purple-500/30'
                        : isDark ? 'bg-[#141b2b] text-stone-300 border-stone-700' : 'bg-white text-slate-800 border-slate-400'
                    }`}>
                      Node {nodeId}
                    </div>
                    {isVisited && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
                        Visit #{visitOrder}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-[11px] font-mono text-stone-500">
              Graph Topology: Node 1 connects to [2, 3] • Node 2 connects to [4] • Node 3 connects to [5]
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
