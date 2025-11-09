
import 'tone';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import SoundGenerationErrorBoundary from '@/components/error/SoundGenerationErrorBoundary';

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
