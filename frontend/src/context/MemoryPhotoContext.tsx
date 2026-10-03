import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MEMORY_PHOTOS, preloadMemoryPhotos, type MemoryPhoto } from '../config/memoryPhotos';

export type MemoryEventType = 'chat' | 'surprise' | 'melody' | 'remember' | 'memory' | 'general';
export type AnimationStage = 'enter' | 'floating' | 'exit' | 'hidden';

interface MemoryPhotoContextType {
  currentPhoto: MemoryPhoto | null;
  animationStage: AnimationStage;
  eventType: MemoryEventType;
  triggerMemoryPhoto: (event?: MemoryEventType) => void;
  showPhoto: (photoId: string, event?: MemoryEventType) => void;
  dismissPhoto: () => void;
  history: string[];
}

const MemoryPhotoContext = createContext<MemoryPhotoContextType | null>(null);

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const MemoryPhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPhoto, setCurrentPhoto] = useState<MemoryPhoto | null>(null);
  const [animationStage, setAnimationStage] = useState<AnimationStage>('hidden');
  const [eventType, setEventType] = useState<MemoryEventType>('general');
  const [history, setHistory] = useState<string[]>([]);

  // Shuffled cycle queue
  const cycleQueueRef = useRef<MemoryPhoto[]>([]);
  const lastPhotoIdRef = useRef<string | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);
  const timerRef = useRef<any>(null);
  const exitTimerRef = useRef<any>(null);

  // Preload all photos upon provider mount
  useEffect(() => {
    preloadMemoryPhotos().then(() => {
      if (import.meta.env.DEV) {
        console.log('[MemoryPhoto] Preloaded all 6 memory photos successfully.');
      }
    });
  }, []);

  // Helper to get next photo from non-repeating shuffled cycle
  const getNextPhotoFromCycle = useCallback((): MemoryPhoto => {
    if (cycleQueueRef.current.length === 0) {
      let newCycle = shuffleArray(MEMORY_PHOTOS);
      // Guarantee that the first photo of the new cycle is not the same as the last shown
      if (lastPhotoIdRef.current && newCycle[0].id === lastPhotoIdRef.current && newCycle.length > 1) {
        // Swap with the last item of the cycle
        const temp = newCycle[0];
        newCycle[0] = newCycle[newCycle.length - 1];
        newCycle[newCycle.length - 1] = temp;
      }
      cycleQueueRef.current = newCycle;
    }

    const nextPhoto = cycleQueueRef.current.shift()!;
    lastPhotoIdRef.current = nextPhoto.id;
    return nextPhoto;
  }, []);

  const dismissPhoto = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    setAnimationStage('exit');
    exitTimerRef.current = setTimeout(() => {
      setAnimationStage('hidden');
      setCurrentPhoto(null);
    }, 450); // Matches exit CSS animation duration
  }, []);

  const revealPhoto = useCallback((photo: MemoryPhoto, evt: MemoryEventType = 'general') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    setCurrentPhoto(photo);
    setEventType(evt);
    setAnimationStage('enter');
    setHistory((prev) => [photo.id, ...prev.slice(0, 10)]);

    if (import.meta.env.DEV) {
      console.log(`[MemoryPhoto] event=${evt} photo=${photo.id} person=${photo.person} title="${photo.title}"`);
    }

    // Enter stage settles into gentle floating after 500ms
    const enterTimer = setTimeout(() => {
      setAnimationStage('floating');
    }, 550);

    // Duration depending on interaction type
    let displayDuration = 2700;
    if (evt === 'surprise') displayDuration = 3500;
    else if (evt === 'remember') displayDuration = 3000;
    else if (evt === 'melody') displayDuration = 2800;
    else if (evt === 'chat') displayDuration = 2500;
    else if (evt === 'memory') displayDuration = 2800;

    timerRef.current = setTimeout(() => {
      clearTimeout(enterTimer);
      setAnimationStage('exit');
      exitTimerRef.current = setTimeout(() => {
        setAnimationStage('hidden');
        setCurrentPhoto(null);
      }, 450);
    }, displayDuration);
  }, []);

  const triggerMemoryPhoto = useCallback((evt: MemoryEventType = 'general') => {
    const now = Date.now();
    // Throttle rapid repeated clicks (minimum 600ms)
    if (now - lastTriggerTimeRef.current < 600) {
      return;
    }
    lastTriggerTimeRef.current = now;

    const nextPhoto = getNextPhotoFromCycle();
    revealPhoto(nextPhoto, evt);
  }, [getNextPhotoFromCycle, revealPhoto]);

  const showPhoto = useCallback((photoId: string, evt: MemoryEventType = 'general') => {
    const found = MEMORY_PHOTOS.find((p) => p.id === photoId);
    if (found) {
      lastPhotoIdRef.current = found.id;
      revealPhoto(found, evt);
    }
  }, [revealPhoto]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  return (
    <MemoryPhotoContext.Provider
      value={{
        currentPhoto,
        animationStage,
        eventType,
        triggerMemoryPhoto,
        showPhoto,
        dismissPhoto,
        history,
      }}
    >
      {children}
    </MemoryPhotoContext.Provider>
  );
};

export const useMemoryPhotos = (): MemoryPhotoContextType => {
  const context = useContext(MemoryPhotoContext);
  if (!context) {
    throw new Error('useMemoryPhotos must be used within a MemoryPhotoProvider');
  }
  return context;
};
