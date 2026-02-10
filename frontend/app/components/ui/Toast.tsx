'use client';

import { useEffect, useState, useCallback } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid cascading renders
    const animationFrame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timer);
    };
  }, [onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-rose-600',
    info: 'bg-gradient-to-r from-[#0ea5e9] to-[#22c55e]',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className={`${styles[type]} text-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] px-6 py-4 flex items-center gap-3 min-w-[320px]`}>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">{icons[type]}</div>
        <span className="font-medium text-sm flex-1">{message}</span>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="hover:opacity-70">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  const ToastComponent = toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null;

  return { showToast, ToastComponent };
}