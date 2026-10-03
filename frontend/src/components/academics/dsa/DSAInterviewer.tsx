import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  RotateCcw, 
  BrainCircuit, 
  MessageSquare 
} from 'lucide-react';
import { DSA_QUESTION_BANK } from '../../../data/academics/dsaQuestionBank';

interface InterviewMessage {
  sender: 'interviewer' | 'candidate';
  text: string;
  time: string;
}

export const DSAInterviewer: React.FC = () => {
  const sampleQuestion = DSA_QUESTION_BANK.find(q => q.topic === 'Trees' && q.difficulty === 'Medium') || DSA_QUESTION_BANK[0];
  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      sender: 'interviewer',
      text: `Hello Akku! Welcome to your FAANG Technical DSA Interview. Today we'll solve: "${sampleQuestion.title}".\n\nProblem Statement:\n${sampleQuestion.description}\n\nBefore writing any code, could you walk me through your initial high-level intuition and data structure choice?`,
      time: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [interviewStage, setInterviewStage] = useState<number>(1);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [finalScoreCard, setFinalScoreCard] = useState<any>(null);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: InterviewMessage = {
      sender: 'candidate',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Socratic Interviewer Response Flow
    setIsEvaluating(true);
    setTimeout(() => {
      let reply = '';
      if (interviewStage === 1) {
        reply = `That is a solid intuition. Why did you choose this specific data structure instead of an array or linked list? Also, what would be the worst-case Time and Space complexity with that approach?`;
        setInterviewStage(2);
      } else if (interviewStage === 2) {
        reply = `Great analysis on complexity. Now, what edge cases should we watch out for? For example: What happens if the root is NULL, or if the tree is completely skewed (like a linked list with N nodes)? How would your algorithm behave?`;
        setInterviewStage(3);
      } else if (interviewStage === 3) {
        reply = `Excellent point on skewed trees and recursion stack overflow. Can you now provide your optimal solution implementation, and can we optimize the space from O(N) to O(1) using Morris Traversal or two pointers?`;
        setInterviewStage(4);
      } else {
        reply = `Impressive! You demonstrated strong problem decomposition, proactive complexity discussion, and comprehensive edge-case handling. I have generated your technical interview performance scorecard below.`;
        setFinalScoreCard({
          understanding: 95,
          approach: 90,
          communication: 92,
          complexityAnalysis: 95,
          coding: 88,
          edgeCases: 94,
          overall: 92,
          feedback: "Strong grasp of algorithmic invariants, clear communication of trade-offs, and excellent handling of recursion stack limits."
        });
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'interviewer',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsEvaluating(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4 text-stone-200 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#120f26] via-[#171233] to-[#120f26] border border-purple-800/40 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                AI DSA Technical Interviewer (Day 129 Bootcamp)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                FAANG Simulation
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Simulates a live placement interview with Socratic follow-ups on data structure choice, complexity, optimization, and edge cases.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInterviewStage(1);
              setFinalScoreCard(null);
              setMessages([{
                sender: 'interviewer',
                text: `Hello Akku! Welcome to your FAANG Technical DSA Interview. Today we'll solve: "${sampleQuestion.title}".\n\nProblem Statement:\n${sampleQuestion.description}\n\nBefore writing any code, could you walk me through your initial high-level intuition and data structure choice?`,
                time: '10:00 AM'
              }]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Interview</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CHAT & EVALUATION WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chat Stream (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-stone-800 bg-[#0d1117] overflow-hidden shadow-xl h-[560px]">
          {/* Stream header */}
          <div className="px-4 py-2.5 bg-[#141a24] border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1.5 font-bold text-stone-200">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Live Interview Session: Stage {interviewStage} of 4</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              ● Connected
            </span>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 items-start ${m.sender === 'candidate' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'interviewer' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {m.sender === 'interviewer' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'interviewer'
                    ? 'bg-[#151c28] border border-stone-800 text-stone-200'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                }`}>
                  {m.text}
                  <div className={`text-[9px] mt-1.5 opacity-60 text-right ${m.sender === 'candidate' ? 'text-emerald-100' : 'text-stone-400'}`}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            {isEvaluating && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                <span>Interviewer is evaluating your response...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#121620] border-t border-stone-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder="Explain your approach, time complexity, or code..."
              className="flex-1 bg-[#1a2130] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>
        </div>

        {/* Right: Rubric Evaluation & Question Details (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {finalScoreCard ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#101c16] to-[#0c1511] border border-emerald-500/50 shadow-xl flex flex-col gap-3 text-xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
                <span className="font-bold text-sm text-emerald-300">FAANG Evaluation Report</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{finalScoreCard.overall}%</span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Problem Understanding', score: finalScoreCard.understanding },
                  { label: 'Algorithmic Approach', score: finalScoreCard.approach },
                  { label: 'Complexity Analysis', score: finalScoreCard.complexityAnalysis },
                  { label: 'Technical Communication', score: finalScoreCard.communication },
                  { label: 'Edge-Case Resilience', score: finalScoreCard.edgeCases },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-stone-300">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold text-emerald-400">{item.score}%</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-[#08100c] border border-emerald-900/80 text-[11px] text-stone-300 leading-relaxed mt-1">
                <strong>Feedback:</strong> {finalScoreCard.feedback}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-stone-800 flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-300 border-b border-stone-800 pb-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>Interview Rubric (6 Evaluation Criteria)</span>
              </div>

              <ul className="space-y-2 text-stone-300 leading-relaxed">
                <li><strong>1. Problem Understanding:</strong> Clarifying constraints and input limits before rushing to code.</li>
                <li><strong>2. Approach & Trade-offs:</strong> Explaining why this data structure is superior to naive alternatives.</li>
                <li><strong>3. Complexity Discussion:</strong> Explicit Big-O notation for best, average, and worst-case scenarios.</li>
                <li><strong>4. Optimization Mindset:</strong> Transitioning from brute force to optimal pattern.</li>
                <li><strong>5. Edge-Case Coverage:</strong> Empty, single element, negative, and scale boundary testing.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
