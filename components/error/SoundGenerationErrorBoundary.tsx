import React from 'react';

interface SoundGenerationErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: Error) => void;
}

interface SoundGenerationErrorBoundaryState {
  hasError: boolean;
}

class SoundGenerationErrorBoundary extends React.Component<
  SoundGenerationErrorBoundaryProps,
  SoundGenerationErrorBoundaryState
> {
  constructor(props: SoundGenerationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Sound generation error boundary caught an error:', error, errorInfo);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h3>Something went wrong with sound generation</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SoundGenerationErrorBoundary;
