import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type AcademicsTheme = 'dark' | 'light' | 'system';
export type ReducedMotionMode = 'normal' | 'reduced' | 'off';

interface AcademicsThemeContextType {
  theme: AcademicsTheme;
  setTheme: (theme: AcademicsTheme) => void;
  isDark: boolean;
  reducedMotion: ReducedMotionMode;
  setReducedMotion: (mode: ReducedMotionMode) => void;
}

const AcademicsThemeContext = createContext<AcademicsThemeContextType | undefined>(undefined);

export const AcademicsThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AcademicsTheme>(() => {
    try {
      const saved = localStorage.getItem('akku_academics_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch {}
    return 'dark';
  });

  const [reducedMotion, setReducedMotionState] = useState<ReducedMotionMode>(() => {
    try {
      const saved = localStorage.getItem('akku_academics_reduced_motion');
      if (saved === 'normal' || saved === 'reduced' || saved === 'off') return saved;
    } catch {}
    return 'normal';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = useMemo(() => {
    if (theme === 'system') return systemIsDark;
    return theme === 'dark';
  }, [theme, systemIsDark]);

  const setTheme = (t: AcademicsTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem('akku_academics_theme', t);
    } catch {}
  };

  const setReducedMotion = (mode: ReducedMotionMode) => {
    setReducedMotionState(mode);
    try {
      localStorage.setItem('akku_academics_reduced_motion', mode);
    } catch {}
  };

  return (
    <AcademicsThemeContext.Provider value={{ theme, setTheme, isDark, reducedMotion, setReducedMotion }}>
      {children}
    </AcademicsThemeContext.Provider>
  );
};

export const useAcademicsTheme = (): AcademicsThemeContextType => {
  const context = useContext(AcademicsThemeContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      theme: 'dark',
      setTheme: () => {},
      isDark: true,
      reducedMotion: 'normal',
      setReducedMotion: () => {}
    };
  }
  return context;
};
