import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<any>;
}

interface State {
  hasError: boolean;
}

const DefaultErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
    <h1 className="text-4xl font-bold text-red-500">Something went wrong.</h1>
    <p className="mt-4 text-lg">We're sorry for the inconvenience. Please try refreshing the page.</p>
  </div>
);

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
