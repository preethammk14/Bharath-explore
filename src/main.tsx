import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress unhandled WebSocket errors specific to Cloud Run iframe preview environment
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    (String(event.reason).includes('WebSocket') ||
      (event.reason as any)?.message?.includes('WebSocket') ||
      String(event.reason).includes('closed without being opened'))
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
