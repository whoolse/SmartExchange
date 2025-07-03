// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { SandboxProvider } from './context/SandboxProvider';
import App from './App';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://smart-ex.cc/tonconnect-manifest.json">
      {/* <SandboxProvider> */}
        <App />
      {/* </SandboxProvider> */}
    </TonConnectUIProvider>
  </React.StrictMode>
);
