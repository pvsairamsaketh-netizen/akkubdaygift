import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Disc3 } from 'lucide-react';
import { useMemoryPhotos } from '../context/MemoryPhotoContext';

interface RomanticAudioPlayerProps {
  autoPlay?: boolean;
}

export const RomanticAudioPlayer: React.FC<RomanticAudioPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const { triggerMemoryPhoto } = useMemoryPhotos();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    // Provide both mp3 and m4a source paths
    audio.src = '/audio/Alaakaa-loova.mp3';
    audio.loop = true;
    audio.volume = 0.75;
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleError = () => {
      // Fallback to m4a if mp3 fails
      if (audioRef.current && audioRef.current.src.endsWith('.mp3')) {
        audioRef.current.src = '/audio/Alaakaa-loova.m4a';
        audioRef.current.load();
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        triggerMemoryPhoto('melody');
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('[RomanticAudioPlayer] Autoplay prevented or playback error:', err);
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div 
      className="group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-rose-50/90 backdrop-blur-md border border-rose-200/80 shadow-xs text-xs text-rose-900 transition-all hover:bg-rose-100/80 hover:shadow-sm shrink-0 whitespace-nowrap"
      title="Alaakaa Loova — Our Romantic Song ❤️"
    >
      {/* Spinning vinyl disk icon when playing */}
      <div className="relative flex items-center justify-center shrink-0">
        <Disc3 className={`w-4 h-4 text-rose-600 transition-transform ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        )}
      </div>

      {/* Track info & mini sound wave equalizer */}
      <div className="flex flex-col shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-rose-950 tracking-tight hidden min-[1200px]:inline whitespace-nowrap">
            Alaakaa Loova
          </span>
          <span className="font-medium text-rose-800 min-[1200px]:hidden whitespace-nowrap text-xs">
            Song
          </span>
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3 ml-0.5 shrink-0">
              <span className="w-0.5 bg-rose-500 rounded-full animate-pulse" style={{ height: '60%' }} />
              <span className="w-0.5 bg-rose-600 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
              <span className="w-0.5 bg-pink-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
              <span className="w-0.5 bg-rose-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.1s' }} />
            </div>
          )}
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="p-1 rounded-full hover:bg-rose-200/70 text-rose-700 hover:text-rose-900 transition-all active:scale-90 cursor-pointer shrink-0"
        title={isPlaying ? "Pause 'Alaakaa Loova'" : "Play 'Alaakaa Loova'"}
        aria-label={isPlaying ? "Pause Alaakaa Loova" : "Play Alaakaa Loova"}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-1 rounded-full hover:bg-rose-200/70 text-rose-700 hover:text-rose-900 transition-all active:scale-90 cursor-pointer shrink-0"
        title={isMuted ? "Unmute song" : "Mute song"}
        aria-label={isMuted ? "Unmute song" : "Mute song"}
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
