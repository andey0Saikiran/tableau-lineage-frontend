'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-[#eef3f2] via-[#f6f8f7] to-[#e7eeec] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-red-200 rounded-2xl p-8 shadow-[0_20px_50px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-2xl">
                ⚠
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a]">Something went wrong</h2>
            </div>

            <p className="text-[#64748b] mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <summary className="cursor-pointer text-red-700 font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-red-800 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
