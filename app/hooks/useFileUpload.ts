import { useState, useCallback, useRef } from 'react';
import { uploadWorkbook, UploadError } from '@/lib/api';
import { Stats } from '@/lib/types';

export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const upload = useCallback(async () => {
    if (!file) return;

    // Create new AbortController for this upload
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setProgress(0);

    // Simulate progress for better UX (less frequent updates for better performance)
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 15, 90));
    }, 500);  // Reduced frequency: 6 updates instead of 9

    try {
      const result = await uploadWorkbook(file, abortControllerRef.current.signal);
      setProgress(100);
      setHtml(result.html);
      setStats(result.stats);

      // Reset progress after showing completion
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      // Don't show error if the request was cancelled
      if (err instanceof Error && err.name === 'AbortError') {
        setProgress(0);
        return;
      }

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
      abortControllerRef.current = null;
    }
  }, [file]);

  const retry = useCallback(() => {
    setError(null);
    upload();
  }, [upload]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setHtml(null);
    setStats(null);
    setFile(null);
    setError(null);
    setProgress(0);
  }, [cancel]);

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
    cancel,
  };
}