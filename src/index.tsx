
/**
 * @file The entry point for the React application.
 * This file handles the following responsibilities:
 * - Importing necessary libraries and components.
 * - Validating environment variables to ensure the application starts correctly.
 * - Locating the root DOM element where the React application will be mounted.
 * - Rendering the main `App` component within a `StrictMode` and an error boundary.
 *
 * It ensures that the application is bootstrapped correctly and that fundamental
 * dependencies and configurations are in place before the UI is rendered.
 * The `tone` import initializes the Tone.js audio context, making it ready for use.
 */
import 'tone';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import SoundGenerationErrorBoundary from '@/components/error/SoundGenerationErrorBoundary';
import { validateEnv } from '@/config/env';

// Validate environment on startup
validateEnv();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SoundGenerationErrorBoundary>
      <App />
    </SoundGenerationErrorBoundary>
  </React.StrictMode>
);
