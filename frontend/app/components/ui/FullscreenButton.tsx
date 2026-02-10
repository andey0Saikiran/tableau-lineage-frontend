'use client';

import { useState, useEffect } from 'react';

interface FullscreenButtonProps {
  onToggle?: (isFullscreen: boolean) => void;
}

export function FullscreenButton({ onToggle }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreen = !!document.fullscreenElement;
      setIsFullscreen(fullscreen);
      onToggle?.(fullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onToggle]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Fullscreen error:', err);
      }
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      className="group relative h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] border-0 hover:shadow-[0_8px_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all duration-300"
    >
      {isFullscreen ? (
        <svg className="w-5 h-5 text-white transition-all duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-white transition-all duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      )}

      <span className="absolute -bottom-11 right-0 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:-top-1 after:right-3 after:w-2 after:h-2 after:bg-[#0f172a] after:rotate-45">
        {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      </span>
    </button>
  );
}