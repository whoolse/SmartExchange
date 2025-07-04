// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { SandboxProvider } from './context/SandboxProvider';
import App from './App';
import './index.css';
import { I18nProvider } from './i18n';
import { BalanceProvider } from './contexts/BalanceContext';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://smart-ex.cc/tonconnect-manifest.json">
      <I18nProvider>
        <BalanceProvider>
          <App />
        </BalanceProvider>
      </I18nProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
