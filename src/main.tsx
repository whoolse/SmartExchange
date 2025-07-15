// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App';
import './index.css';
import { I18nProvider } from './i18n';
import { BalanceProvider } from './contexts/BalanceContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://smart-ex.cc/tonconnect-manifest.json"
      actionsConfiguration={{
        returnStrategy: 'back',
      }}
    >
      <I18nProvider>
        <BalanceProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </BalanceProvider>
      </I18nProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
