// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App';
import './index.css';
import { I18nProvider } from './i18n';
import { BalanceProvider } from './contexts/BalanceContext';
import { TestnetProvider } from './contexts/TestnetContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://smart-ex.cc/tonconnect-manifest.json"
      actionsConfiguration={{
        returnStrategy: 'back',
        twaReturnUrl: "https://t.me/escrowontonbot/smartex"
      }}
      
    >
      <I18nProvider>
        <BalanceProvider>
          <TestnetProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </TestnetProvider>
        </BalanceProvider>
      </I18nProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
