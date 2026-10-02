import React, { useEffect, useRef } from 'react';

interface RealisticRosePetalsProps {
  enabled?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  opacity: number;
  color: string;
}

export const RealisticRosePetals: React.FC<RealisticRosePetalsProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rose petal colors: blush, soft rose, champagne, deep petal pink
    const colors = [
      'rgba(251, 113, 133, 0.55)', // Rose 400
      'rgba(244, 63, 94, 0.45)',  // Rose 500
      'rgba(253, 164, 175, 0.65)', // Rose 300
      'rgba(254, 205, 211, 0.6)',  // Rose 200
      'rgba(244, 114, 182, 0.5)'   // Pink 400
    ];

    const petalCount = window.innerWidth < 768 ? 16 : 28;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 12 + 10,
        speedY: Math.random() * 0.9 + 0.6,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.02 - 0.01),
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        oscillationDistance: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let time = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(time * p.oscillationSpeed) * 0.5 + 0.8, 1);

      ctx.fillStyle = p.color;
      ctx.beginPath();
      // Draw organic curved rose petal shape
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(
        p.size * 0.8, -p.size * 0.8,
        p.size * 0.9, p.size * 0.4,
        0, p.size
      );
      ctx.bezierCurveTo(
        -p.size * 0.9, p.size * 0.4,
        -p.size * 0.8, -p.size * 0.8,
        0, -p.size
      );
      ctx.closePath();
      ctx.fill();

      // Delicate petal central vein highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.7);
      ctx.quadraticCurveTo(p.size * 0.1, 0, 0, p.size * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin(time * p.oscillationSpeed) * p.oscillationDistance + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x > width + 30) p.x = -20;
        if (p.x < -30) p.x = width + 20;

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
