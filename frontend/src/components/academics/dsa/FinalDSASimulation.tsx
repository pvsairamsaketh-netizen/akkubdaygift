import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';

interface SimulationRound {
  id: number;
  name: string;
  type: string;
  timeLimit: string;
  description: string;
}

const ROUNDS: SimulationRound[] = [
  { id: 1, name: 'Round 1: Technical & Aptitude DSA MCQs', type: 'MCQs', timeLimit: '15 mins', description: '10 conceptual questions testing time complexity, data structure invariants, and memory limits.' },
  { id: 2, name: 'Round 2: Algorithmic Coding Challenge', type: 'Coding', timeLimit: '45 mins', description: '2 LeetCode-style medium/hard problems requiring optimal time/space complexity and hidden test cases.' },
  { id: 3, name: 'Round 3: Code Debugging & Edge-Case Hunt', type: 'Debugging', timeLimit: '20 mins', description: 'Identify off-by-one errors, infinite loops, and integer overflow traps in provided solutions.' },
  { id: 4, name: 'Round 4: Technical Interview & Trade-offs', type: 'Interview', timeLimit: '25 mins', description: 'Defend your data structure choices and explain scaling to 100 million records.' },
  { id: 5, name: 'Round 5: Rapid-Fire Placement Drill', type: 'Speed', timeLimit: '5 mins', description: 'Lightning-round questions testing instant algorithmic recall.' }
];

export const FinalDSASimulation: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = start, 1..5 = rounds, 6 = final dashboard
  const roundScores: Record<number, number> = {
    1: 90,
    2: 85,
    3: 95,
    4: 88,
    5: 92
  };

  const overallScore = Math.round(
    Object.values(roundScores).reduce((a, b) => a + b, 0) / 5
  );

  const handleStartSimulation = () => {
    setActiveStep(1);
  };

  const handleCompleteCurrentRound = () => {
    if (activeStep < 5) {
      setActiveStep(s => s + 1);
    } else {
      setActiveStep(6); // Final dashboard
    }
  };

  return (
    <div className="flex flex-col gap-4 text-stone-200 font-sans max-w-4xl mx-auto my-4">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#120f29] via-[#1a1438] to-[#120f29] border border-purple-800/40 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Day 130: Final Placement DSA Comprehensive Simulation
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                5-Round Mock
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              The ultimate placement benchmark: Aptitude, Coding, Debugging, Interview, and Rapid-Fire rounds generating a personalized improvement plan.
            </p>
          </div>
        </div>

        {activeStep > 0 && activeStep < 6 && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-800/40">
            <span>Round {activeStep} / 5</span>
          </div>
        )}
      </div>

      {/* 2. OVERVIEW & START SCREEN */}
      {activeStep === 0 && (
        <div className="p-6 rounded-2xl bg-[#0d1117] border border-stone-800 flex flex-col gap-5 shadow-xl">
          <h3 className="font-bold text-base text-white border-b border-stone-800 pb-2">
            The 5 Simulation Assessment Rounds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROUNDS.map(r => (
              <div key={r.id} className="p-3.5 rounded-xl bg-[#141a24] border border-stone-800 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-purple-400 font-bold">{r.type}</span>
                    <span className="text-stone-500">{r.timeLimit}</span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-100">{r.name}</h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{r.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-800">
            <span className="text-xs text-stone-400">Total estimated duration: ~110 minutes</span>
            <button
              onClick={handleStartSimulation}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Begin Final Placement Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. SIMULATION ROUNDS (Steps 1 to 5) */}
      {activeStep >= 1 && activeStep <= 5 && (
        <div className="p-6 rounded-2xl bg-[#0d1117] border border-stone-800 flex flex-col gap-4 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
            <h3 className="font-bold text-base text-white">
              {ROUNDS[activeStep - 1].name}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-950/40 text-purple-300 border border-purple-800/40">
              {ROUNDS[activeStep - 1].timeLimit}
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            {ROUNDS[activeStep - 1].description}
          </p>

          <div className="p-4 rounded-xl bg-[#141a24] border border-stone-800 space-y-2 text-xs">
            <span className="font-semibold text-stone-200 block">Round Instructions:</span>
            <ul className="space-y-1 text-stone-400 list-disc list-inside">
              <li>Read all problem constraints carefully before submitting.</li>
              <li>Aim for optimal time and space complexity without auxiliary memory bloat.</li>
              <li>Verify boundary cases: empty inputs, N=1, extreme integer values.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-800">
            <button
              onClick={() => setActiveStep(s => Math.max(0, s - 1))}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-xs text-stone-300 hover:bg-stone-700 cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleCompleteCurrentRound}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Submit & Proceed to Next Round</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. FINAL COMPREHENSIVE IMPROVEMENT PLAN DASHBOARD (Step 6) */}
      {activeStep === 6 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d141e] via-[#111929] to-[#0d141e] border border-emerald-600/50 shadow-2xl flex flex-col gap-5 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">
                  Akku's Placement Readiness Report & Performance Blueprint
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Completed 30-Day Intensive DSA & Coding Interview Curriculum (Days 101–130)
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-stone-400 block">Overall Score</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">{overallScore}%</span>
            </div>
          </div>

          {/* Round-by-round breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs text-center font-mono">
            {ROUNDS.map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-[#141d2c] border border-stone-800">
                <span className="text-[10px] text-stone-400 block truncate">{r.type}</span>
                <span className="text-lg font-bold text-emerald-300">{roundScores[r.id]}%</span>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0d1c16] border border-emerald-900/60 space-y-2">
              <span className="font-bold text-emerald-300 block text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Strongest Topics (Placement Ready)</span>
              </span>
              <ul className="space-y-1 text-stone-300">
                <li>• <strong>Arrays & Two Pointers:</strong> Fast invariant identification and Kadane optimization.</li>
                <li>• <strong>Binary Search:</strong> Flawless upper/lower bound and monotonic search space boundaries.</li>
                <li>• <strong>Hashing & Prefix Sums:</strong> Subarray lookups in O(1) expected time.</li>
                <li>• <strong>Binary Trees & BFS:</strong> Level-order traversals and LCA problem solving.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#1f131a] border border-rose-900/60 space-y-2">
              <span className="font-bold text-rose-300 block text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Recommended Revision Topics</span>
              </span>
              <ul className="space-y-1 text-stone-300">
                <li>• <strong>Dynamic Programming on Trees:</strong> Diameter & path sum state transitions.</li>
                <li>• <strong>Graph Dijkstra & Disjoint Set Union:</strong> Path compression and union by rank.</li>
                <li>• <strong>Monotonic Stack:</strong> Nearest smaller element and histogram area boundaries.</li>
              </ul>
            </div>
          </div>

          {/* Actionable Personalized Plan */}
          <div className="p-4 rounded-xl bg-[#121622] border border-sky-800/40 space-y-2 text-xs">
            <span className="font-bold text-sky-300 block text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Personalized 7-Day Pre-Placement Revision Schedule</span>
            </span>
            <p className="text-stone-300 leading-relaxed">
              1. <strong>Day 1–2:</strong> Solve 15 hard DP problems (LCS, Matrix Chain, Knapsack variations).<br />
              2. <strong>Day 3–4:</strong> Practice graph topological sort (Kahn's algorithm) and Dijkstra shortest paths.<br />
              3. <strong>Day 5:</strong> Review "My Mistakes Notebook" to reinforce edge-case handling.<br />
              4. <strong>Day 6–7:</strong> Timed mock coding tests (90 mins) under strict interview conditions.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(0)}
              className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
            >
              ← Back to Simulation Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
