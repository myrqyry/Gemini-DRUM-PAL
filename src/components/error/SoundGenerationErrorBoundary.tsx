import React from 'react';

/**
 * @interface SoundGenerationErrorBoundaryProps
 * @description Defines the props for the SoundGenerationErrorBoundary component.
 * @property {React.ReactNode} children - The child components to render within the error boundary.
 * @property {(error: Error) => void} onError - Callback function to be invoked when an error is caught.
 */
interface SoundGenerationErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

/**
 * @interface SoundGenerationErrorBoundaryState
 * @description Defines the state for the SoundGenerationErrorBoundary component.
 * @property {boolean} hasError - A flag indicating whether an error has been caught.
 */
interface SoundGenerationErrorBoundaryState {
  hasError: boolean;
}

/**
 * @class SoundGenerationErrorBoundary
 * @extends React.Component
 * @description A React component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * Specifically tailored for handling errors related to sound generation.
 */
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
    if (typeof this.props.onError === 'function') {
      this.props.onError(error);
    }
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
