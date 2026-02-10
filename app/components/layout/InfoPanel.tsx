'use client';

import { useEffect } from 'react';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoPanel({ isOpen, onClose }: InfoPanelProps) {
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
          {/* Header */}
          <div className="px-6 py-5 border-b border-black/10 flex justify-between items-center bg-gradient-to-r from-[#0ea5e9]/5 to-[#22c55e]/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold tracking-tight">
                About this tool
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close info panel"
              className="w-9 h-9 flex items-center justify-center rounded-full
                         hover:bg-black/5 active:bg-black/10 active:scale-95
                         transition-all duration-200 text-[#64748b] hover:text-[#0f172a]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto text-sm text-[#334155] space-y-6 flex-1">
            <InfoSection
              icon="💡"
              title="What is Tableau Lineage Visualizer?"
              content="A web-based tool that analyzes and visualizes the metadata and field dependencies within your Tableau workbooks (.twbx files). It creates an interactive graph showing relationships between data sources, calculated fields, raw fields, parameters, and LOD calculations—helping you understand complex workbook structures without opening Tableau Desktop."
            />

            <InfoSection
              icon="⚙️"
              title="How it works"
              items={[
                "Upload your Tableau workbook (.twbx file)",
                "The tool extracts and parses XML metadata from the workbook",
                "Field dependencies and calculations are analyzed",
                "An interactive network graph is generated showing all relationships",
                "You can search, filter, cluster, and export the visualization",
                "All processing happens in-memory—nothing is stored"
              ]}
            />

            <InfoSection
              icon="🎯"
              title="Key Features"
              items={[
                "Interactive graph with zoom, pan, and search capabilities",
                "Color-coded nodes by type (data sources, calculated fields, parameters, etc.)",
                "Physics-based layout for optimal visualization",
                "Export functionality to save your lineage diagram",
                "Real-time statistics on workbook complexity",
                "No installation or Tableau Desktop required"
              ]}
            />

            <InfoSection
              icon="🚀"
              title="Use Cases"
              items={[
                "Understand complex workbook dependencies before making changes",
                "Document and audit Tableau workbook structures",
                "Identify calculation chains and potential circular dependencies",
                "Onboard new team members to existing workbooks",
                "Plan refactoring and optimization strategies"
              ]}
            />

            <InfoSection
              icon="💻"
              title="Technical Details"
              content="Built with Next.js 16, React 19, FastAPI, and vis-network. The application uses a client-server architecture where files are processed server-side and visualizations are rendered client-side. File processing is stateless—files are never persisted to disk or database."
            />

            <InfoSection
              icon="📄"
              title="Browser Compatibility"
              content="Works best in modern browsers (Chrome, Firefox, Safari, Edge). JavaScript must be enabled for the interactive visualization to function."
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-black/10 bg-[#f8fafc]">
            <button
              onClick={onClose}
              className="w-full rounded-xl px-6 py-3
                         bg-gradient-to-r from-[#0ea5e9] to-[#22c55e]
                         text-black text-sm font-bold
                         hover:from-[#0284c7] hover:to-[#16a34a]
                         active:scale-95
                         transition-all duration-200
                         shadow-[0_8px_20px_rgba(14,165,233,0.3)]
                         hover:shadow-[0_12px_30px_rgba(14,165,233,0.4)]"
            >
              Got it!
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function InfoSection({ icon, title, content, items }: {
  icon: string;
  title: string;
  content?: string;
  items?: string[];
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-semibold text-[#0f172a] text-base">
          {title}
        </h4>
      </div>
      {content && (
        <p className="leading-relaxed text-[#475569]">
          {content}
        </p>
      )}
      {items && (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <svg className="w-5 h-5 text-[#0ea5e9] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[#475569]">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}