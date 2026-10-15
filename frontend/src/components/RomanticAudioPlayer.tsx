import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Disc3, 
  SkipForward, 
  Square,
  AlertCircle
} from 'lucide-react';
import { useRomanticMusic } from '../context/RomanticMusicContext';

interface RomanticAudioPlayerProps {
  autoPlay?: boolean;
}

export const RomanticAudioPlayer: React.FC<RomanticAudioPlayerProps> = () => {
  const {
    playbackState,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isMuted,
    errorMessage,
    progressPercent,
    togglePlay,
    skipToNext,
    stop,
    toggleMute,
    retry,
    startRomanticSequence
  } = useRomanticMusic();

  const handleMainAction = () => {
    if (playbackState === 'idle' || playbackState === 'finished') {
      startRomanticSequence();
    } else {
      togglePlay();
    }
  };

  return (
    <div 
      className="group relative flex items-center gap-1.5 sm:gap-2 h-8 px-2 sm:px-2.5 rounded-full bg-gradient-to-r from-rose-50/95 via-pink-50/90 to-rose-50/95 backdrop-blur-md border border-rose-200/80 shadow-xs text-xs text-rose-900 transition-all hover:bg-rose-100/80 hover:shadow-sm shrink-0 whitespace-nowrap overflow-hidden"
      title={
        currentTrack 
          ? `${currentTrack.title} (${currentTrack.label}) • Click to control` 
          : "Romantic Love Songs • Click to play"
      }
    >
      {/* Subtle Progress Bar Underneath */}
      {isPlaying && (
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 transition-all duration-300 pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />
      )}

      {/* Spinning vinyl disk icon when playing */}
      <button
        onClick={handleMainAction}
        className="relative flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
        title={isPlaying ? 'Pause music' : 'Play romantic music sequence'}
        aria-label={isPlaying ? 'Pause music' : 'Play romantic music sequence'}
      >
        <Disc3 
          className={`w-4 h-4 text-rose-600 transition-transform ${isPlaying ? 'animate-spin' : ''}`} 
          style={{ animationDuration: '3.5s' }} 
        />
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
        )}
      </button>

      {/* Track Title, Sequence Badge & Equalizer */}
      <div className="flex items-center gap-1.5 shrink-0 max-w-[150px] sm:max-w-[210px] min-w-0">
        {errorMessage ? (
          <div className="flex items-center gap-1 text-rose-600 text-[11px] font-medium truncate">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Audio paused</span>
            <button
              onClick={retry}
              className="p-0.5 rounded hover:bg-rose-200 text-rose-700 underline shrink-0 cursor-pointer text-[10px]"
              title="Retry playback"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Song title with fallback */}
            <span className="font-semibold text-rose-950 tracking-tight truncate text-xs">
              {currentTrack ? currentTrack.title : 'Romantic Melody'}
            </span>

            {/* Sequence step indicator badge (1/2 or 2/2) */}
            {currentTrackIndex && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-200/70 text-rose-800 text-[9px] font-bold font-mono shrink-0">
                {currentTrackIndex}/2
              </span>
            )}

            {/* Mini soundwave equalizer when playing */}
            {isPlaying && (
              <div className="hidden sm:flex items-end gap-0.5 h-3 ml-0.5 shrink-0">
                <span className="w-0.5 bg-rose-500 rounded-full animate-pulse" style={{ height: '60%' }} />
                <span className="w-0.5 bg-rose-600 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                <span className="w-0.5 bg-pink-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
                <span className="w-0.5 bg-rose-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.1s' }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handleMainAction}
        className="p-1 rounded-full hover:bg-rose-200/70 text-rose-700 hover:text-rose-900 transition-all active:scale-90 cursor-pointer shrink-0"
        title={isPlaying ? 'Pause music' : 'Play music'}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      {/* Skip to Next Track Button (Active during Song 1 or when playing) */}
      {(playbackState === 'playing_first' || (playbackState === 'paused' && currentTrackIndex === 1)) && (
        <button
          onClick={skipToNext}
          className="p-1 rounded-full hover:bg-rose-200/70 text-rose-700 hover:text-rose-900 transition-all active:scale-90 cursor-pointer shrink-0"
          title="Skip to Song 2 (Alaakaa Loova)"
          aria-label="Skip to next song"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Stop Button (Stops and resets playback sequence) */}
      {(isPlaying || playbackState === 'paused') && (
        <button
          onClick={stop}
          className="p-1 rounded-full hover:bg-rose-200/70 text-stone-500 hover:text-rose-700 transition-all active:scale-90 cursor-pointer shrink-0"
          title="Stop romantic music"
          aria-label="Stop"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      )}

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-1 rounded-full hover:bg-rose-200/70 text-rose-700 hover:text-rose-900 transition-all active:scale-90 cursor-pointer shrink-0"
        title={isMuted ? 'Unmute music' : 'Mute music'}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-stone-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-rose-600" />
        )}
      </button>
    </div>
  );
};
