import React, { useEffect, useState } from 'react';

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  color: string;
  symbol: string;
  opacity: number;
}

const HEART_SYMBOLS = ['❤️', '💖', '✨', '🌸', '💕', '💫'];
const COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#fbbf24', '#e11d48'];

export const InteractiveHeartBurst: React.FC = () => {
  const [particles, setParticles] = useState<BurstParticle[]>([]);

  useEffect(() => {
    let idCounter = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Don't spawn on textarea, inputs, or interactive select dropdowns to avoid distraction
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const newParticles: BurstParticle[] = [];
      const count = 5 + Math.floor(Math.random() * 3); // 5 to 7 particles

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 3.5;
        idCounter++;

        newParticles.push({
          id: idCounter,
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5, // float slightly upward
          size: 11 + Math.random() * 10,
          rotation: (Math.random() - 0.5) * 45,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          symbol: HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)],
          opacity: 1,
        });
      }

      setParticles((prev) => [...prev.slice(-25), ...newParticles]);
    };

    window.addEventListener('click', handlePointerDown);

    return () => {
      window.removeEventListener('click', handlePointerDown);
    };
  }, []);

  // Update particles animation
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12, // subtle gravity
            opacity: p.opacity - 0.045,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 24);

    return () => clearInterval(interval);
  }, [particles.length]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            color: p.color,
            transition: 'opacity 0.05s linear',
            textShadow: '0 0 6px rgba(244, 63, 94, 0.4)',
            userSelect: 'none',
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};
