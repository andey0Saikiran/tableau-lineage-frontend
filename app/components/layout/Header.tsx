'use client';

import { LanguageSelector, Language } from '../ui/LanguageSelector';

interface HeaderProps {
  onInfoClick: () => void;
  onPrivacyClick: () => void;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function Header({ onInfoClick, onPrivacyClick, currentLanguage = 'en', onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="animate-slideInLeft">
          <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] flex items-center justify-center shadow-lg font-bold text-white text-sm">
              TL
            </div>
            Tableau Lineage Visualizer
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Metadata • Dependencies • Calculations • Secure
          </p>
        </div>

        <div className="flex items-center gap-2 animate-slideInRight">
          {/* Language Selector */}
          {onLanguageChange && (
            <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
          )}

          {/* Privacy Button */}
          <button
            onClick={onPrivacyClick}
            aria-label="Privacy and Security"
            className="group relative h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] border-0 hover:shadow-[0_8px_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all duration-300"
          >
            <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>

            <span className="absolute -bottom-11 right-0 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:-top-1 after:right-3 after:w-2 after:h-2 after:bg-[#0f172a] after:rotate-45">
              Privacy & Security
            </span>
          </button>

          {/* Info Button */}
          <button
            onClick={onInfoClick}
            aria-label="About this tool"
            className="group relative h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] border-0 hover:shadow-[0_8px_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all duration-300"
          >
            <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <span className="absolute -bottom-11 right-0 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:-top-1 after:right-3 after:w-2 after:h-2 after:bg-[#0f172a] after:rotate-45">
              About this tool
            </span>
          </button>

          {/* LinkedIn Dropdown */}
          <div className="relative group">
            <button
              aria-label="Connect with creators"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] border-0 hover:shadow-[0_8px_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all duration-300"
            >
              <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>

            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2 space-y-1">
                <a href="https://www.linkedin.com/in/andeysaikiran/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#0ea5e9]/10 hover:to-[#22c55e]/10 transition-all duration-200 group/item">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">SK</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#0f172a] group-hover/item:text-[#0ea5e9] transition-colors truncate">Sai Kiran Andey</div>
                    <div className="text-xs text-[#64748b]">Creator</div>
                  </div>
                  <svg className="w-4 h-4 text-[#64748b] group-hover/item:text-[#0ea5e9] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <a href="https://www.linkedin.com/in/sujan-narahari/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#0ea5e9]/10 hover:to-[#22c55e]/10 transition-all duration-200 group/item">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">SN</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#0f172a] group-hover/item:text-[#0ea5e9] transition-colors truncate">Sujan Narahari</div>
                    <div className="text-xs text-[#64748b]">Contributor</div>
                  </div>
                  <svg className="w-4 h-4 text-[#64748b] group-hover/item:text-[#0ea5e9] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#0ea5e9]/10 hover:to-[#22c55e]/10 transition-all duration-200 group/item">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">MKT</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#0f172a] group-hover/item:text-[#0ea5e9] transition-colors truncate">Mourya Tankala</div>
                    <div className="text-xs text-[#64748b]">Contributor</div>
                  </div>
                  <svg className="w-4 h-4 text-[#64748b] group-hover/item:text-[#0ea5e9] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="border-t border-black/5 p-2">
                <div className="text-xs text-center text-[#64748b] py-2">Want to network? Let&apos;s catchup! ☕</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}