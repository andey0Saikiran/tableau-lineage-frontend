import { useState, useCallback } from 'react';
import { uploadWorkbook, UploadError } from '@/lib/api';
import { Stats } from '@/lib/types';

export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const result = await uploadWorkbook(file);
      setProgress(100);
      setHtml(result.html);
      setStats(result.stats);

      // Reset progress after showing completion
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      const errorMessage = err instanceof UploadError
        ? err.message
        : 'Upload failed. Please try another file.';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('Upload error:', err);
      }
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  }, [file]);

  const retry = useCallback(() => {
    setError(null);
    upload();
  }, [upload]);

  const reset = useCallback(() => {
    setHtml(null);
    setStats(null);
    setFile(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
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
  };
}