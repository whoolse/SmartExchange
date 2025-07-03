// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { SandboxProvider } from './context/SandboxProvider';
import App from './App';
import './index.css';
import { I18nProvider } from './i18n';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://smart-ex.cc/tonconnect-manifest.json">
      <I18nProvider>
        <App />
      </I18nProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
