'use client';

import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { InfoPanel } from './components/layout/InfoPanel';
import { PrivacyPanel } from './components/layout/PrivacyPanel';
import { FileUpload } from './components/ui/FileUpload';
import { MetricCard } from './components/ui/MetricCard';
import { Button } from './components/ui/Button';
import { VisualizerFrame } from './components/visualizer/VisualizerFrame';
import { BackgroundEffects } from './components/animations/BackgroundEffects';
import { useFileUpload } from './hooks/useFileUpload';
import { useToast } from './components/ui/Toast';
import { useTranslation, Language } from './lib/translations';
import { trackEvent } from './lib/analytics';
import { METRIC_CONFIGS } from './lib/constants';

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const { showToast, ToastComponent } = useToast();
  const t = useTranslation(language);

  const {
    file,
    setFile,
    html,
    stats,
    loading,
    error,
    progress,
    setError,
    upload,
    reset,
    retry,
    cancel,
  } = useFileUpload();

  // Show success toast when analysis completes
  useEffect(() => {
    if (stats && html) {
      showToast(t.workbookAnalyzed, 'success');
    }
  }, [stats, html, showToast, t.workbookAnalyzed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'd' || e.key === 'D' || e.key === 'Escape') && html && !showInfo && !showPrivacy) {
        e.preventDefault();
        trackEvent('keyboard_discard');
        reset();
        showToast(t.visualizationDiscarded, 'info');
      }
      if ((e.key === 'i' || e.key === 'I') && !showInfo && !showPrivacy) {
        e.preventDefault();
        trackEvent('keyboard_info_toggle');
        setShowInfo(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [html, showInfo, showPrivacy, reset, showToast, t.visualizationDiscarded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.name.endsWith('.twbx')) {
      setFile(droppedFile);
      showToast(`${droppedFile.name} ${t.fileSelected}`, 'info');
    } else {
      setError(t.invalidFile);
    }
  }, [setFile, setError, showToast, t.fileSelected, t.invalidFile]);

  const handleUpload = useCallback(() => {
    if (file) {
      trackEvent('file_uploaded', file.name);
      upload();
      showToast(t.analyzingWorkbook, 'info');
    }
  }, [file, upload, showToast, t.analyzingWorkbook]);

  const handleReset = useCallback(() => {
    trackEvent('visualization_discarded');
    reset();
    showToast(t.readyForNew, 'info');
  }, [reset, showToast, t.readyForNew]);

  const handleRetry = useCallback(() => {
    trackEvent('upload_retried');
    retry();
  }, [retry]);

  const handleCancel = useCallback(() => {
    trackEvent('upload_cancelled');
    cancel();
    showToast(t.uploadCancelled || 'Upload cancelled', 'info');
  }, [cancel, showToast, t.uploadCancelled]);

  const handleLanguageChange = useCallback((lang: Language) => {
    const languageNames: Record<Language, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      hi: 'हिन्दी',
      te: 'తెలుగు',
      ta: 'தமிழ்'
    };
    setLanguage(lang);
    trackEvent('language_changed', lang);
    showToast(`Language changed to ${languageNames[lang]}`, 'info');
  }, [showToast]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eef3f2] via-[#f6f8f7] to-[#e7eeec] text-[#0f172a] relative overflow-hidden">
      <BackgroundEffects />
      {ToastComponent}

      <Header
        onInfoClick={() => setShowInfo(true)}
        onPrivacyClick={() => setShowPrivacy(true)}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
      />

      <InfoPanel isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <PrivacyPanel isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <FileUpload
          file={file}
          onFileChange={setFile}
          onUpload={handleUpload}
          onRetry={handleRetry}
          onCancel={handleCancel}
          loading={loading}
          error={error}
          progress={progress}
          onErrorDismiss={() => setError(null)}
          dragging={dragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          translations={{
            uploadTitle: t.uploadTitle,
            uploadDescription: t.uploadDescription,
            chooseFile: t.chooseFile,
            analyzeWorkbook: t.analyzeWorkbook,
            analyzing: t.analyzing,
            tryAgain: t.tryAgain,
            cancel: t.cancel || 'Cancel',
          }}
        />
      </section>

      {stats && (
        <section className="max-w-5xl mx-auto px-6 mt-12 mb-8 relative z-10 animate-scaleIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {METRIC_CONFIGS.map((config, index) => (
              <MetricCard
                key={config.label}
                label={config.label}
                value={Object.values(stats)[index]}
                icon={config.icon}
                color={config.color}
              />
            ))}
          </div>
        </section>
      )}

      {html && (
        <div className="max-w-7xl mx-auto px-6 mb-6 flex justify-end relative z-10 animate-fadeIn">
          <Button variant="danger" onClick={handleReset}>
            <svg className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t.discardAnalysis}
          </Button>
        </div>
      )}

      {html && <VisualizerFrame html={html} />}
    </main>
  );
}