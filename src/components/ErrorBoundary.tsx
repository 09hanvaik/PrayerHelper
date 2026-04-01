import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Prayer app error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-cream-100">
          <h1 className="text-2xl font-serif text-ink-900 mb-4">Something went wrong</h1>
          <p className="text-sm font-sans text-ink-500 mb-8 max-w-sm leading-relaxed">
            We're sorry — an unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-cafod-navy text-white font-cafod font-bold text-sm rounded-br-2xl rounded-tl-lg hover:bg-cafod-navy-dark transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cafod-navy focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
