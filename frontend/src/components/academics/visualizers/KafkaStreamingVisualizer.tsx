import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Radio, 
  Users, 
  Send, 
  Info,
  Sparkles
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

interface KafkaMessage {
  offset: number;
  key: string;
  payload: string;
  timestamp: string;
}

export const KafkaStreamingVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [partition0, setPartition0] = useState<KafkaMessage[]>([
    { offset: 0, key: 'ORD-101', payload: '$45.00', timestamp: '14:00:01' },
    { offset: 1, key: 'ORD-103', payload: '$120.00', timestamp: '14:00:03' }
  ]);
  const [partition1, setPartition1] = useState<KafkaMessage[]>([
    { offset: 0, key: 'ORD-102', payload: '$80.00', timestamp: '14:00:02' },
    { offset: 1, key: 'ORD-104', payload: '$15.50', timestamp: '14:00:04' }
  ]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Producer publish event
  const handlePublishEvent = () => {
    const isP0 = Math.random() > 0.5;
    const now = new Date().toTimeString().split(' ')[0];
    const amount = (Math.random() * 200 + 10).toFixed(2);
    const orderNum = Math.floor(Math.random() * 900 + 100);

    if (isP0) {
      const nextOffset = partition0.length;
      setPartition0(prev => [
        ...prev.slice(-4), // keep last 5
        { offset: nextOffset, key: `ORD-${orderNum}`, payload: `$${amount}`, timestamp: now }
      ]);
    } else {
      const nextOffset = partition1.length;
      setPartition1(prev => [
        ...prev.slice(-4),
        { offset: nextOffset, key: `ORD-${orderNum}`, payload: `$${amount}`, timestamp: now }
      ]);
    }
  };

  // Autoplay producer & consumer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        handlePublishEvent();
      }, 2000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, partition0.length, partition1.length]);

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Apache Kafka: Distributed Event Stream & Consumer Group Visualizer</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Topic: <code className="font-mono text-emerald-400 font-bold">orders.checkout.v1</code> • Partitions, Producer keys & Consumer Group offsets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRunning ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Stream' : 'Live Stream'}</span>
          </button>
          <button
            onClick={handlePublishEvent}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Emit 1 Event</span>
          </button>
        </div>
      </div>

      {/* 3-Tier Architecture Diagram: Producers -> Kafka Topic Partitions -> Consumer Group */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* TIER 1: PRODUCERS */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
          isDark ? 'bg-[#101624] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 border-b pb-2 mb-3 border-stone-800/60 font-bold text-xs">
              <Radio className="w-4 h-4 text-sky-400" />
              <span>Upstream Microservice Producers</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#151d2d] border border-sky-800/40">
                <div className="text-sky-300 font-bold">Checkout Web Service</div>
                <div className="text-[10px] text-stone-400">hash(order_id) % 2 ➔ target partition</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#151d2d] border border-sky-800/40">
                <div className="text-sky-300 font-bold">Mobile iOS/Android App</div>
                <div className="text-[10px] text-stone-400">Produces events with acks=all guarantee</div>
              </div>
            </div>
          </div>
          <span className="text-[10px] opacity-75 font-mono">Publish rate: ~100 events/sec</span>
        </div>

        {/* TIER 2: TOPIC PARTITIONS */}
        <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
          isDark ? 'bg-[#0d121c] border-emerald-900/40' : 'bg-emerald-50/50 border-emerald-300'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-stone-800/60 font-bold text-xs text-emerald-400">
            <span>Topic: orders.checkout.v1</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300">2 Partitions</span>
          </div>

          {/* Partition 0 Log */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-amber-400 block">Partition 0 (Log Stream):</span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {partition0.map((msg, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] shrink-0"
                >
                  <span className="font-bold">off:{msg.offset}</span> [{msg.payload}]
                </div>
              ))}
            </div>
          </div>

          {/* Partition 1 Log */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-purple-400 block">Partition 1 (Log Stream):</span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {partition1.map((msg, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] shrink-0"
                >
                  <span className="font-bold">off:{msg.offset}</span> [{msg.payload}]
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TIER 3: CONSUMER GROUP */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
          isDark ? 'bg-[#101624] border-stone-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-3 border-stone-800/60 font-bold text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Consumer Group: fraud_detector</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400">Scale = 2</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#1d152a] border border-purple-800/40">
                <div className="text-purple-300 font-bold">Consumer 1</div>
                <div className="text-[10px] text-stone-400">Assigned: Partition 0 • Current Offset: {partition0.length}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1d152a] border border-purple-800/40">
                <div className="text-purple-300 font-bold">Consumer 2</div>
                <div className="text-[10px] text-stone-400">Assigned: Partition 1 • Current Offset: {partition1.length}</div>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Lag: 0 msgs (Real-time synced)</span>
        </div>
      </div>

      <div className={`mt-4 p-3 rounded-lg border text-xs ${
        isDark ? 'bg-[#101624] border-stone-800 text-stone-300' : 'bg-white border-slate-300 text-slate-800'
      }`}>
        <Info className="w-4 h-4 text-emerald-400 inline mr-1.5" />
        <strong>Kafka Golden Rule:</strong> Kafka partitions guarantee strict sequential order <em>within a single partition</em>, but not across different partitions! Using a consistent message key (e.g., <code className="text-sky-300">order_id</code> or <code className="text-sky-300">user_id</code>) ensures that related events always hit the exact same partition in chronological order.
      </div>
    </div>
  );
};
