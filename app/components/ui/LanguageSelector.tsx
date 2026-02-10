'use client';

import { useState } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'te' | 'ta';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGES = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te' as Language, name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta' as Language, name: 'தமிழ்', flag: '🇮🇳' },
];

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        className="group relative h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] border-0 hover:shadow-[0_8px_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all duration-300"
      >
        <span className="text-lg transition-all duration-300 group-hover:scale-110">{current.flag}</span>

        <span className="absolute -bottom-11 right-0 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:-top-1 after:right-3 after:w-2 after:h-2 after:bg-[#0f172a] after:rotate-45">
          Language: {current.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 z-50 overflow-hidden animate-slideDown">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  currentLanguage === lang.code
                    ? 'bg-gradient-to-r from-[#0ea5e9]/10 to-[#22c55e]/10 text-[#0ea5e9]'
                    : 'hover:bg-gradient-to-r hover:from-[#0ea5e9]/5 hover:to-[#22c55e]/5 text-[#0f172a]'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium text-sm">{lang.name}</span>
                {currentLanguage === lang.code && (
                  <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}