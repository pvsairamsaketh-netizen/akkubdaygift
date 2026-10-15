import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export type PlaybackState = 'idle' | 'playing_first' | 'playing_second' | 'paused' | 'finished' | 'error';

export interface RomanticTrack {
  id: string;
  title: string;
  artist: string;
  sources: string[];
  order: 1 | 2;
  label: string;
}

export const ROMANTIC_PLAYLIST: RomanticTrack[] = [
  {
    id: 'track-1',
    title: 'Tere Liye Mandir Jaaun',
    artist: 'Khat | Navjot Ahuja',
    sources: [
      '/audio/tere-liye-mandir-jaaun.mp3',
      '/audio/tere-liye-mandir-jaaun.m4a',
      '/audio/tere-liye-mandir-jaaun.m4r'
    ],
    order: 1,
    label: 'Song 1 of 2'
  },
  {
    id: 'track-2',
    title: 'Alaakaa Loova',
    artist: 'Our Romantic Melody ❤️',
    sources: [
      '/audio/Alaakaa-loova.mp3',
      '/audio/Alaakaa-loova.m4a',
      '/audio/alaakaa-loova.mp3',
      '/audio/alaakaa-loova.m4a'
    ],
    order: 2,
    label: 'Song 2 of 2'
  }
];

export interface RomanticMusicContextType {
  playbackState: PlaybackState;
  currentTrack: RomanticTrack | null;
  currentTrackIndex: 1 | 2 | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  errorMessage: string | null;
  currentTime: number;
  duration: number;
  progressPercent: number;
  startRomanticSequence: (forceRestart?: boolean) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  skipToNext: () => Promise<void>;
  stop: () => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  retry: () => Promise<void>;
}

const RomanticMusicContext = createContext<RomanticMusicContextType | null>(null);

export const RomanticMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTrackIndex, setCurrentTrackIndex] = useState<1 | 2 | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.75);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Singleton HTMLAudioElement reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Internal tracking refs to prevent race conditions & closures over stale state
  const currentTrackIndexRef = useRef<1 | 2 | null>(null);
  const playbackStateRef = useRef<PlaybackState>('idle');
  const isTransitioningRef = useRef<boolean>(false);
  const playTrackByIndexRef = useRef<(targetIndex: 0 | 1) => Promise<void>>(async () => {});

  // Sync refs safely in useEffect
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    playbackStateRef.current = playbackState;
  }, [playbackState]);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;
    audio.muted = isMuted;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime || 0);
        if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
          setDuration(audioRef.current.duration);
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Update volume and mute on audio element
  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  // Helper to attempt loading source candidates sequentially
  const loadAndPlaySources = async (audio: HTMLAudioElement, sources: string[]): Promise<void> => {
    let lastError: any = null;
    for (const src of sources) {
      try {
        audio.src = src;
        audio.load();
        await audio.play();
        return; // Success!
      } catch (err) {
        lastError = err;
        console.warn(`[RomanticMusic] Candidate source failed (${src}):`, err);
      }
    }
    throw lastError || new Error('All audio candidate sources failed to play.');
  };

  // Play specific track by index (0 for Song 1, 1 for Song 2)
  const playTrackByIndex = useCallback(async (targetIndex: 0 | 1) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const track = ROMANTIC_PLAYLIST[targetIndex];
    const trackOrder = (targetIndex + 1) as 1 | 2;

    isTransitioningRef.current = true;
    setCurrentTrackIndex(trackOrder);
    setErrorMessage(null);

    // Set playback state
    const nextState: PlaybackState = targetIndex === 0 ? 'playing_first' : 'playing_second';
    setPlaybackState(nextState);

    // Clean up previous event listeners
    audio.onended = null;
    audio.onerror = null;

    // Attach ended handler for natural transition or sequence finish
    audio.onended = () => {
      if (targetIndex === 0) {
        // Song 1 ended naturally! Immediately start Song 2
        console.log('[RomanticMusic] Song 1 ended naturally. Automatically starting Song 2 (Alaakaa Loova)...');
        playTrackByIndexRef.current(1).catch(err => {
          console.error('[RomanticMusic] Auto-transition to Song 2 failed:', err);
          setErrorMessage('Could not load next song (Alaakaa Loova). Tap retry to play.');
          setPlaybackState('error');
        });
      } else {
        // Song 2 ended naturally! Sequence complete.
        console.log('[RomanticMusic] Song 2 ended naturally. Romantic music sequence complete.');
        setPlaybackState('finished');
        setCurrentTime(0);
        isTransitioningRef.current = false;
      }
    };

    // Attach error handler
    audio.onerror = (e) => {
      console.error('[RomanticMusic] Audio element error event:', e);
      setErrorMessage(`Failed to play "${track.title}". Please verify connection and retry.`);
      setPlaybackState('error');
      isTransitioningRef.current = false;
    };

    try {
      await loadAndPlaySources(audio, track.sources);
      isTransitioningRef.current = false;
    } catch (err: any) {
      console.error(`[RomanticMusic] Playback error for "${track.title}":`, err);
      const isAutoplay = err?.name === 'NotAllowedError';
      setErrorMessage(
        isAutoplay 
          ? 'Playback paused by browser autoplay policy. Tap play to listen.'
          : `Could not load "${track.title}". Please tap retry.`
      );
      setPlaybackState('error');
      isTransitioningRef.current = false;
    }
  }, []);

  useEffect(() => {
    playTrackByIndexRef.current = playTrackByIndex;
  }, [playTrackByIndex]);

  // Main requirement: start sequence (Song 1 -> Song 2)
  const startRomanticSequence = useCallback(async (forceRestart: boolean = false) => {
    const currentState = playbackStateRef.current;

    // Requirement: Prevent duplicate playback on repeated clicks
    if (!forceRestart && (currentState === 'playing_first' || currentState === 'playing_second')) {
      console.log('[RomanticMusic] Romantic music is already actively playing. Ignoring redundant trigger.');
      return;
    }

    // If paused, resume where left off
    if (!forceRestart && currentState === 'paused') {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setPlaybackState(currentTrackIndexRef.current === 2 ? 'playing_second' : 'playing_first');
          return;
        } catch (err) {
          console.warn('[RomanticMusic] Resume failed, restarting sequence:', err);
        }
      }
    }

    // Start fresh sequence with Song 1
    console.log('[RomanticMusic] Initiating romantic music sequence: Song 1 (Tere Liye Mandir Jaaun) -> Song 2 (Alaakaa Loova)');
    await playTrackByIndex(0);
  }, [playTrackByIndex]);

  // Pause playback
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState('paused');
    }
  }, []);

  // Resume playback
  const play = useCallback(async () => {
    const currentState = playbackStateRef.current;
    if (currentState === 'paused' && audioRef.current) {
      try {
        await audioRef.current.play();
        setPlaybackState(currentTrackIndexRef.current === 2 ? 'playing_second' : 'playing_first');
      } catch (err) {
        console.error('[RomanticMusic] Failed to resume audio:', err);
        setErrorMessage('Could not resume audio. Tap to try again.');
      }
    } else if (currentState === 'idle' || currentState === 'finished' || currentState === 'error') {
      await startRomanticSequence(true);
    }
  }, [startRomanticSequence]);

  const togglePlay = useCallback(async () => {
    const currentState = playbackStateRef.current;
    if (currentState === 'playing_first' || currentState === 'playing_second') {
      pause();
    } else {
      await play();
    }
  }, [pause, play]);

  // Skip to next song:
  // If on Song 1, skip to Song 2 immediately. If on Song 2, finish.
  const skipToNext = useCallback(async () => {
    if (currentTrackIndexRef.current === 1) {
      console.log('[RomanticMusic] Skipping Song 1, starting Song 2 (Alaakaa Loova)...');
      await playTrackByIndex(1);
    } else if (currentTrackIndexRef.current === 2) {
      console.log('[RomanticMusic] Skipping Song 2, finishing sequence.');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlaybackState('finished');
      setCurrentTime(0);
    }
  }, [playTrackByIndex]);

  // Stop playback completely and cancel sequence
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaybackState('idle');
    setCurrentTrackIndex(null);
    setCurrentTime(0);
    setErrorMessage(null);
    isTransitioningRef.current = false;
  }, []);

  // Retry if in error state
  const retry = useCallback(async () => {
    const targetIdx = currentTrackIndexRef.current === 2 ? 1 : 0;
    await playTrackByIndex(targetIdx);
  }, [playTrackByIndex]);

  const isPlaying = playbackState === 'playing_first' || playbackState === 'playing_second';
  const currentTrack = currentTrackIndex ? ROMANTIC_PLAYLIST[currentTrackIndex - 1] : null;
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <RomanticMusicContext.Provider
      value={{
        playbackState,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        isMuted,
        volume,
        errorMessage,
        currentTime,
        duration,
        progressPercent,
        startRomanticSequence,
        play,
        pause,
        togglePlay,
        skipToNext,
        stop,
        toggleMute,
        setVolume,
        retry,
      }}
    >
      {children}
    </RomanticMusicContext.Provider>
  );
};

export const useRomanticMusic = (): RomanticMusicContextType => {
  const context = useContext(RomanticMusicContext);
  if (!context) {
    throw new Error('useRomanticMusic must be used within a RomanticMusicProvider');
  }
  return context;
};
