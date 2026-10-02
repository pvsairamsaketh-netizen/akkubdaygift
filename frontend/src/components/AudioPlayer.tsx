import React from 'react';
import { Volume2, Pause, Play, Square, RotateCcw, X } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReplay: () => void;
  onClose?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onReplay,
  onClose
}) => {
  return (
    <div className="fixed bottom-24 right-6 z-30 flex items-center space-x-3 bg-white/95 border border-rose-300 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md animate-fade-in text-rose-800">
      <div className="flex items-center space-x-2">
        <Volume2 className={`w-4 h-4 text-rose-600 ${isPlaying ? 'animate-bounce' : ''}`} />
        <span className="text-xs font-medium">
          {isPlaying ? "Speaking..." : "Audio Ready"}
        </span>
      </div>

      <div className="flex items-center space-x-1 border-l border-rose-200 pl-2">
        {isPlaying ? (
          <button
            onClick={onPause}
            className="p-1.5 rounded-full hover:bg-rose-50 text-rose-700 transition-colors"
            title="Pause speech"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="p-1.5 rounded-full hover:bg-rose-50 text-rose-700 transition-colors"
            title="Play speech"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        )}

        <button
          onClick={onStop}
          className="p-1.5 rounded-full hover:bg-rose-50 text-rose-700 transition-colors"
          title="Stop speech"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          onClick={onReplay}
          className="p-1.5 rounded-full hover:bg-rose-50 text-rose-700 transition-colors"
          title="Replay from start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-rose-50 text-stone-400 hover:text-stone-700 transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
