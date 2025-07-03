// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/Header';
import { TonWallet } from './components/TonWallet';
import { SendBlock } from './components/SendBlock';
import { ReceiveBlock } from './components/ReceiveBlock';
import { DealControl } from './components/DealControl';

const App: React.FC = () => {
  const [dealData, setDealData] = useState<any>(null);
  const [sendAsset, setSendAsset] = useState<string>('TON');
  const [receiveAsset, setReceiveAsset] = useState<string>('USDT');

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Header title="My Ton App" />

      {/* <TonWallet /> */}

      <div className="grid grid-cols-2 gap-6">
        <SendBlock
          asset={sendAsset}
          onAssetChange={val => {
            if (val === receiveAsset) {
              if (val !== 'TON') {
                setReceiveAsset('TON');
              } else {
                setReceiveAsset('USDT');
              }
            }
            setSendAsset(val);
          }}
        />
        <ReceiveBlock
          asset={receiveAsset}
          onAssetChange={val => {
            if (val === sendAsset) {
              if (val !== 'TON') {
                setSendAsset('TON');
              } else {
                setSendAsset('USDT');
              }
            }
            setReceiveAsset(val);
          }}
        />
      </div>

      <DealControl
        apiUrl="https://api.example.com/deals"
        onDealData={setDealData}
      />
    </div>
  );
};

export default App;
