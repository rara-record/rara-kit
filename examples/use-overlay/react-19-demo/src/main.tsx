import { OverlayProvider } from '@rara-kit/use-overlay';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './components/error';
import { Demo } from './demo';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OverlayProvider>
      <ErrorBoundary>
        <Demo />
      </ErrorBoundary>
    </OverlayProvider>
  </React.StrictMode>
);
