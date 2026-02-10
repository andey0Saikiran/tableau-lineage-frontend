'use client';

import { useEffect, useState } from 'react';

export function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid cascading renders
    const animationFrame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const [particles] = useState(() =>
    Array.from({ length: 12 }).map(() => ({
      size: 4 + Math.random() * 6,
      duration: 15 + Math.random() * 15,
      delay: Math.random() * 8,
      startX: Math.random() * 100,
      endX: (Math.random() - 0.5) * 60,
    }))
  );

  const colors = [
    'rgba(14, 165, 233, 0.9)',
    'rgba(34, 197, 94, 0.9)',
    'rgba(99, 102, 241, 0.8)',
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Static gradient overlays */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)',
          top: '-10%',
          left: '-5%',
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)',
          bottom: '-5%',
          right: '-5%',
        }}
      />

      {/* Floating particles - only render after mount */}
      {mounted && (
        <>
          {particles.map((particle, i) => {
            const { size, duration, delay, startX, endX } = particle;

            return (
              <div
                key={i}
                className="absolute rounded-full will-change-transform"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${startX}%`,
                  bottom: '-10px',
                  background: `radial-gradient(circle, ${colors[i % 3]}, ${colors[i % 3].replace('0.9', '0.3').replace('0.8', '0.2')} 70%)`,
                  boxShadow: `0 0 ${size * 2}px ${colors[i % 3]}`,
                  filter: 'blur(0.5px)',
                  animation: `floatUp ${duration}s linear ${delay}s infinite`,
                  '--float-x': `${endX}px`,
                } as React.CSSProperties}
              />
            );
          })}
        </>
      )}
    </div>
  );
}