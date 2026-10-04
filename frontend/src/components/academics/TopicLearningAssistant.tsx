import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Lightbulb } from 'lucide-react';
import type { DayLesson } from '../../types/academics';

interface TopicLearningAssistantProps {
  lesson: DayLesson;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface Message {
  sender: 'assistant' | 'user';
  text: string;
}

export const TopicLearningAssistant: React.FC<TopicLearningAssistantProps> = ({
  lesson,
  isOpen,
  onClose,
  isDark
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hi Akku! 👋 I'm your dedicated AI Academic Tutor for **Day ${lesson.dayNumber}: ${lesson.title}**.\n\nAsk me anything about today's concepts, real-life analogies, syntax, or interview questions!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Contextual Socratic tutor response
    setTimeout(() => {
      let reply = '';
      const q = userText.toLowerCase();

      if (q.includes('analogy') || q.includes('real life') || q.includes('simple')) {
        reply = lesson.realLifeAnalogy?.analogy || `Think of this like an organized library: instead of searching through every single book one by one on the floor, we use a catalog system that points you directly to the exact shelf!`;
      } else if (q.includes('why') || q.includes('need') || q.includes('use')) {
        reply = `We need this in production data systems because:\n1. It avoids expensive full-table scans and keeps queries fast.\n2. It prevents data corruption and memory leaks at scale.\n3. It is a standard design pattern expected by interviewers!`;
      } else if (q.includes('mistake') || q.includes('trap') || q.includes('wrong')) {
        reply = `The most common mistake here is:\n- Forgetting to handle edge cases like empty inputs, null values, or duplicate keys.\n- Modifying objects in-place instead of creating clean copies in data pipelines.`;
      } else if (q.includes('interview') || q.includes('placement') || q.includes('company')) {
        reply = lesson.whyItMattersInPlacements || `In interviews, companies like Amazon, Google, and Microsoft test this to see if you can write clean, scalable code that handles boundary conditions properly.`;
      } else {
        reply = `Regarding **${lesson.title}**: ${lesson.description}\n\nKey takeaway: Break the problem down into small steps. Validate your input, apply the core transformation, and return the clean output. Would you like me to walk through a small code example?`;
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  const samplePrompts = [
    'Can you explain this with a simple analogy?',
    'Why is this important in production?',
    'What common mistakes should I avoid in interviews?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl border flex flex-col h-[560px] overflow-hidden ${
        isDark ? 'bg-[#0e121a] border-stone-700 text-stone-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'bg-[#151c28] border-stone-800' : 'bg-sky-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-sky-500 text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs sm:text-sm">Academic Learning Assistant</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono font-semibold">
                  Day {lesson.dayNumber}
                </span>
              </div>
              <p className="text-[11px] opacity-75 truncate max-w-[280px]">
                {lesson.title}
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

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <span className={`p-1.5 rounded-lg shrink-0 ${
                m.sender === 'assistant'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {m.sender === 'assistant' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </span>

              <div className={`p-3 rounded-xl max-w-[85%] whitespace-pre-wrap ${
                m.sender === 'assistant'
                  ? isDark
                    ? 'bg-[#161f30] border border-stone-800 text-stone-200'
                    : 'bg-slate-100 border border-slate-200 text-slate-800'
                  : isDark
                  ? 'bg-sky-600 text-white font-medium'
                  : 'bg-sky-600 text-white font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-stone-400 text-xs italic pl-9">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Thinking with Day {lesson.dayNumber} context...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className={`px-4 py-2 border-t flex flex-wrap gap-1.5 text-[11px] ${
          isDark ? 'bg-[#121722] border-stone-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setInput(p)}
              className={`px-2 py-1 rounded-md text-left transition-colors cursor-pointer border flex items-center gap-1 ${
                isDark
                  ? 'bg-[#172033] border-sky-900/40 text-sky-300 hover:bg-[#1e2a44]'
                  : 'bg-white border-slate-300 text-sky-700 hover:bg-slate-100'
              }`}
            >
              <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-[200px]">{p}</span>
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className={`p-3 border-t flex items-center gap-2 ${
          isDark ? 'bg-[#0f141f] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={`Ask about ${lesson.title.slice(0, 30)}...`}
            className={`flex-1 text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
              isDark
                ? 'bg-[#161d2b] border-stone-700 text-stone-100 placeholder-stone-500'
                : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
