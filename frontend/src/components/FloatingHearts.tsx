import React, { useMemo } from 'react';

interface FloatingHeartsProps {
  count?: number;
  enabled?: boolean;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ count = 18, enabled = true }) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count) + Math.random() * 5).toFixed(1)}%`,
      size: Math.floor(Math.random() * 16) + 14,
      duration: `${(Math.random() * 6 + 9).toFixed(1)}s`,
      delay: `${(Math.random() * 8).toFixed(1)}s`,
      opacity: (Math.random() * 0.35 + 0.25).toFixed(2),
      symbol: ['❤️', '💖', '✨', '🌸', '💕'][Math.floor(Math.random() * 5)]
    }));
  }, [count]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart-particle select-none"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            animationDuration: h.duration,
            animationDelay: h.delay,
            opacity: Number(h.opacity)
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
};
