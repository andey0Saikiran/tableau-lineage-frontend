'use client';

import { useEffect, useRef, useState } from 'react';

interface VisualizerFrameProps {
  html: string;
}

export function VisualizerFrame({ html }: VisualizerFrameProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!iframeRef.current || !shouldRender) return;

    // Reset loading state when html changes using requestAnimationFrame
    const animationFrame = requestAnimationFrame(() => {
      setIsLoading(true);
    });

    const iframe = iframeRef.current;

    const handleLoad = () => {
      setIsLoading(false);

      // Hide the loading spinner in the iframe if it exists
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const loadingEl = iframeDoc.getElementById('loading');
          if (loadingEl) {
            loadingEl.style.opacity = '0';
            setTimeout(() => loadingEl.remove(), 400);
          }
        }
      } catch {
        // Cross-origin restrictions, ignore
        console.log('Cannot access iframe content');
      }
    };

    // Set timeout to stop showing loading after 5 seconds regardless
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    iframe.addEventListener('load', handleLoad);

    return () => {
      cancelAnimationFrame(animationFrame);
      iframe.removeEventListener('load', handleLoad);
      clearTimeout(timeout);
    };
  }, [shouldRender, html]);

  return (
    <section className="max-w-[96rem] mx-auto px-6 pb-20 relative z-10">
      <div className="rounded-[30px] overflow-hidden bg-white border border-black/5 shadow-[0_55px_110px_rgba(0,0,0,0.18)] relative">
        {shouldRender ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm text-[#64748b]">Loading visualization...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="w-full h-[85vh]"
              title="Tableau Lineage Visualization"
              sandbox="allow-scripts allow-same-origin allow-downloads allow-forms"
              loading="eager"
            />
          </>
        ) : (
          <div className="w-full h-[85vh] flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-[#64748b]">Preparing...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}