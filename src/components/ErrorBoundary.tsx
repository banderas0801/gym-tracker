'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GymTracker Error]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {this.props.fallbackTitle || 'Đã xảy ra lỗi'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Phần này gặp sự cố. Dữ liệu tập luyện của bạn vẫn an toàn.
              Hãy thử tải lại hoặc liên hệ hỗ trợ nếu lỗi lặp lại.
            </p>
            {this.state.error && (
              <p className="text-[10px] text-zinc-600 mt-2 font-mono truncate max-w-xs mx-auto">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center space-x-2 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử Lại</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
