// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/Header';
import { SendBlock } from './components/SendBlock';
import { ReceiveBlock } from './components/ReceiveBlock';
import { DealControl } from './components/DealControl';

const App: React.FC = () => {
  const [dealData, setDealData] = useState<any>(null);
  const [sendAsset, setSendAsset] = useState<string>('TON');
  const [receiveAsset, setReceiveAsset] = useState<string>('USDT');
  const [isReceiveValid, setIsReceiveValid] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Header title="Smart Exchange" />

      <div className="grid grid-cols-2 gap-6">
        <SendBlock
          asset={sendAsset}
          onAssetChange={val => {
            if (val === receiveAsset) {
              if (val !== 'TON') setReceiveAsset('TON');
              else setReceiveAsset('USDT');
            }
            setSendAsset(val);
          }}
          disableCreate={!isReceiveValid}
        />
        <ReceiveBlock
          asset={receiveAsset}
          onAssetChange={val => {
            if (val === sendAsset) {
              if (val !== 'TON') setSendAsset('TON');
              else setSendAsset('USDT');
            }
            setReceiveAsset(val);
          }}
          onValidate={setIsReceiveValid}
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
