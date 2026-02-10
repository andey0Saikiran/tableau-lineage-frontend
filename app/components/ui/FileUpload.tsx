import { useRef, DragEvent } from 'react';
import { Button } from './Button';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  onRetry: () => void;
  loading: boolean;
  error: string | null;
  progress: number;
  onErrorDismiss: () => void;
  dragging: boolean;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
  translations?: {
    uploadTitle: string;
    uploadDescription: string;
    chooseFile: string;
    analyzeWorkbook: string;
    analyzing: string;
    tryAgain: string;
  };
}

const getErrorInfo = (error: string) => {
  if (error.toLowerCase().includes('size') || error.toLowerCase().includes('large'))
    return { icon: '📦', title: 'File Too Large', message: 'Maximum file size is 100MB' };
  if (error.toLowerCase().includes('format') || error.toLowerCase().includes('twbx'))
    return { icon: '⚠️', title: 'Invalid Format', message: 'Only .twbx files are supported' };
  if (error.toLowerCase().includes('network') || error.toLowerCase().includes('connection'))
    return { icon: '🔌', title: 'Connection Error', message: 'Check your internet connection' };
  if (error.toLowerCase().includes('process') || error.toLowerCase().includes('parse'))
    return { icon: '💥', title: 'Processing Error', message: 'Unable to process workbook' };
  return { icon: '❌', title: 'Upload Failed', message: error };
};

export function FileUpload({
  file, onFileChange, onUpload, onRetry, loading, error, progress,
  onErrorDismiss, dragging, onDragOver, onDragLeave, onDrop, translations
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const errorInfo = error ? getErrorInfo(error) : null;

  const t = translations || {
    uploadTitle: 'Upload Tableau Workbook',
    uploadDescription: 'Drag & drop a .twbx file or choose one from your system',
    chooseFile: 'Choose file',
    analyzeWorkbook: 'Analyze Workbook',
    analyzing: 'Analyzing…',
    tryAgain: 'Try Again',
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative rounded-[30px] border-2 border-dashed transition-all duration-300 ${
        dragging ? 'border-[#0ea5e9] bg-[#e0f2fe]/80 scale-[1.02]' : 'border-[#94a3b8]/40 bg-white/85'
      } backdrop-blur-xl shadow-[0_45px_90px_rgba(0,0,0,0.12)] hover:shadow-[0_50px_100px_rgba(0,0,0,0.15)]`}
    >
      <div className="absolute inset-0 rounded-[30px] bg-gradient-to-tr from-[#0ea5e9]/10 via-transparent to-[#22c55e]/10 pointer-events-none" />

      <div className="relative p-14 text-center">
        <div className={`text-6xl mb-5 transition-all duration-300 ${dragging ? 'scale-110 animate-bounce' : ''}`}>📂</div>

        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#0ea5e9] to-[#22c55e] bg-clip-text text-transparent">
          {t.uploadTitle}
        </h2>

        <p className="text-sm text-[#475569] mb-7 max-w-md mx-auto">
          {t.uploadDescription.split('.twbx')[0]}
          <strong className="text-[#0f172a]">.twbx</strong>
          {t.uploadDescription.split('.twbx')[1]}
        </p>

        <input ref={inputRef} type="file" accept=".twbx" hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChange(f); }} />

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>{t.chooseFile}</Button>
          <Button variant="primary" onClick={onUpload} disabled={!file || loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.analyzing}
              </span>
            ) : t.analyzeWorkbook}
          </Button>
        </div>

        {loading && progress > 0 && (
          <div className="mb-4">
            <div className="h-1 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#22c55e] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-[#64748b] mt-1">{progress}%</p>
          </div>
        )}

        {file && !loading && (
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-[#0ea5e9]/10 to-[#22c55e]/10 border border-[#0ea5e9]/30 rounded-xl shadow-sm">
            <svg className="w-5 h-5 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-[#0f172a]">{file.name}</span>
            <button onClick={(e) => { e.stopPropagation(); onFileChange(null); onErrorDismiss(); }}
              className="ml-1 p-1 text-[#64748b] hover:text-[#0f172a] hover:bg-black/5 rounded-full transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {error && errorInfo && (
          <div className="inline-flex flex-col gap-3 px-6 py-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg mt-4 max-w-md animate-shake">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{errorInfo.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-bold text-red-900 mb-1">{errorInfo.title}</div>
                <div className="text-sm text-red-700">{errorInfo.message}</div>
              </div>
              <button onClick={onErrorDismiss} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button onClick={onRetry} className="w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">
              {t.tryAgain}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}