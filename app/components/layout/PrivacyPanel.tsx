'use client';

import { useEffect } from 'react';

interface PrivacyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPanel({ isOpen, onClose }: PrivacyPanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fadeIn"
      />

      <aside className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-50 shadow-[-20px_0_60px_rgba(0,0,0,0.25)] animate-slideInRight overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b border-black/10 flex justify-between items-center bg-gradient-to-r from-[#0ea5e9]/5 to-[#22c55e]/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold tracking-tight">
                Privacy & Security
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close privacy panel"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 active:scale-95 transition-all duration-200 text-[#64748b] hover:text-[#0f172a]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-6 overflow-y-auto text-sm text-[#334155] space-y-6 flex-1">
            <div className="bg-gradient-to-r from-[#0ea5e9]/10 to-[#22c55e]/10 border border-[#0ea5e9]/20 rounded-xl p-5">
              <p className="leading-relaxed text-[#475569]">
                <strong className="text-[#0f172a]">Privacy First: Your data is never stored, logged, or shared.</strong> All file processing happens in-memory and files are immediately discarded after processing.
              </p>
            </div>

            <section className="space-y-3">
              <h4 className="font-semibold text-[#0f172a] text-base">Data Collection & Usage</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">📤</span>
                  <div>
                    <div className="font-semibold text-[#0f172a]">File Processing</div>
                    <div className="text-[#64748b] text-sm">Uploaded .twbx files are processed entirely in-memory on our servers. Files are parsed to extract metadata, then immediately discarded. No data is written to disk or database.</div>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">🚫</span>
                  <div>
                    <div className="font-semibold text-[#0f172a]">No Data Retention</div>
                    <div className="text-[#64748b] text-sm">We do not store, cache, or retain your workbook files, metadata, or visualization outputs at any time.</div>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">🔐</span>
                  <div>
                    <div className="font-semibold text-[#0f172a]">No Content Logging</div>
                    <div className="text-[#64748b] text-sm">We do not log file contents, field names, calculation formulas, or any workbook-specific information.</div>
                  </div>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="font-semibold text-[#0f172a] text-base">Security & Encryption</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">🔒</span>
                  <div>
                    <div className="font-semibold text-[#0f172a]">HTTPS Encryption</div>
                    <div className="text-[#64748b] text-sm">All data transfers between your browser and our servers are encrypted using industry-standard TLS/SSL protocols.</div>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <div className="font-semibold text-[#0f172a]">Ephemeral Processing</div>
                    <div className="text-[#64748b] text-sm">Each upload session is isolated and stateless. Once your browser session ends, all associated data is gone.</div>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <div className="font-semibold text-[#0f172a]">Sandbox Environment</div>
                    <div className="text-[#64748b] text-sm">Visualizations render in sandboxed iframes with restricted permissions for additional security.</div>
                  </div>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="font-semibold text-[#0f172a] text-base">Analytics & Tracking</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">📊</span>
                  <div>
                    <div className="font-semibold text-[#0f172a]">Anonymous Usage Metrics</div>
                    <div className="text-[#64748b] text-sm">We collect anonymous usage statistics (e.g., page views, button clicks) to improve the tool. No personally identifiable information or file content is tracked.</div>
                  </div>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="font-semibold text-[#0f172a] text-base">Your Rights</h4>
              <div className="text-[#475569] leading-relaxed">
                Since we don&apos;t collect or store your data, there&apos;s nothing to access, modify, or delete. Your workbook data exists only during the brief processing period and is immediately discarded.
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="font-semibold text-[#0f172a] text-base">Third-Party Services</h4>
              <div className="text-[#475569] leading-relaxed">
                This application is hosted on Vercel (frontend) and Render (backend). These services may collect standard server logs (IP addresses, request timestamps) as part of their infrastructure operations. We do not control their data practices.
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="font-semibold text-[#0f172a] text-base">Contact & Updates</h4>
              <div className="text-[#475569] leading-relaxed">
                This privacy policy may be updated from time to time. Continued use of the service constitutes acceptance of any changes. For questions or concerns, please contact us through the repository.
              </div>
            </section>
          </div>

          <div className="px-6 py-4 border-t border-black/10 bg-[#f8fafc]">
            <button
              onClick={onClose}
              className="w-full rounded-xl px-6 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#22c55e] text-black text-sm font-bold hover:from-[#0284c7] hover:to-[#16a34a] active:scale-95 transition-all duration-200 shadow-[0_8px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_30px_rgba(14,165,233,0.4)]"
            >
              Got it!
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}