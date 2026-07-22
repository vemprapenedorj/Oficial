import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root')!;
const legacyHashPath = window.location.hash.startsWith('#/')
  ? window.location.hash.slice(1)
  : null;

if (legacyHashPath) {
  window.history.replaceState(null, '', legacyHashPath);
}

const appContent = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// The static pages are browser snapshots produced by Puppeteer (`page.content`),
// not HTML emitted by ReactDOMServer. Such snapshots do not contain React's
// hydration boundary markers and therefore must not be passed to hydrateRoot.
// The pre-rendered document remains available to crawlers and is replaced by
// the same deterministic application tree when JavaScript starts.
createRoot(container).render(appContent);
