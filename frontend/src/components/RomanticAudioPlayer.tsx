import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { useMemoryPhotos } from '../context/MemoryPhotoContext';

interface RomanticAudioPlayerProps {
  autoPlay?: boolean;
}

export const RomanticAudioPlayer: React.FC<RomanticAudioPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const { triggerMemoryPhoto } = useMemoryPhotos();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  // Soft romantic chord progression notes (Hz)
  // Cmaj7 -> Am9 -> Fmaj7 -> G6
  const chordNotes = [
    [261.63, 329.63, 392.00, 493.88], // C E G B
    [220.00, 261.63, 329.63, 440.00], // A C E A
    [174.61, 261.63, 329.63, 349.23], // F C E F
    [196.00, 246.94, 293.66, 392.00]  // G B D G
  ];

  const playChord = (chordIndex: number) => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const chord = chordNotes[chordIndex % chordNotes.length];
    chord.forEach((freq, noteIdx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = noteIdx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        const now = ctx.currentTime + noteIdx * 0.15; // gentle arpeggio
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 4.0);
      } catch (err) {
        // audio node error handling
      }
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
    } else {
      triggerMemoryPhoto('melody');
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      let chordIndex = 0;
      playChord(chordIndex);
      intervalRef.current = setInterval(() => {
        chordIndex++;
        playChord(chordIndex);
      }, 4200);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50/80 backdrop-blur border border-rose-200/60 shadow-sm text-xs text-rose-900 transition-all hover:bg-rose-100/70">
      <Music className={`w-3.5 h-3.5 text-rose-500 ${isPlaying ? 'animate-bounce' : ''}`} />
      <span className="font-medium hidden sm:inline">Melody</span>
      <button
        onClick={togglePlay}
        className="p-1 rounded-full hover:bg-rose-200/60 text-rose-700 transition-colors"
        title={isPlaying ? "Pause background melody" : "Play romantic melody"}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-1 rounded-full hover:bg-rose-200/60 text-rose-700 transition-colors"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
