'use client';

import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  className?: string;
}

export default function AudioVisualizer({ isActive, className = '' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barCount = 32;
    const barWidth = width / barCount;

    let phase = 0;

    const drawVisualizer = () => {
      if (!isActive) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#a855f7'); // purple
      gradient.addColorStop(0.5, '#ec4899'); // pink
      gradient.addColorStop(1, '#06b6d4'); // cyan

      ctx.fillStyle = gradient;

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2 + phase;
        const barHeight = Math.abs(Math.sin(angle) * (height / 2)) + 20;
        
        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

      phase += 0.05;
      animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    if (isActive) {
      drawVisualizer();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={80}
        className="rounded-lg bg-black/20 border border-purple-500/30"
      />
    </div>
  );
}
