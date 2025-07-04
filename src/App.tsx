// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SendBlock } from './components/SendBlock';
import { ReceiveBlock } from './components/ReceiveBlock';
import { DealControl } from './components/DealControl';
import { JettonsList } from './components/JettonsList';
import { type JettonsBalances } from '@ton-api/client';

const DEFAULT_SEND_ASSET = 'TON';
const DEFAULT_RECEIVE_ASSET = 'USDT';

const App: React.FC = () => {
  const [dealData, setDealData] = useState<any>(null);
  const [sendAsset, setSendAsset] = useState<string>(DEFAULT_SEND_ASSET);
  const [receiveAsset, setReceiveAsset] = useState<string>(DEFAULT_RECEIVE_ASSET);
  const [isReceiveValid, setIsReceiveValid] = useState<boolean>(true);
  const [userJettons, setUserJettons] = useState<string[]>([]);
  const [jettonBalances, setJettonBalances] = useState<JettonsBalances['balances']>([]);

  // Инициализация выбранных активов при первой загрузке jettons
  useEffect(() => {
    if (userJettons.length === 0) return;
    if (!userJettons.includes(sendAsset)) {
      setSendAsset(userJettons[0]);
    }
    if (!userJettons.includes(receiveAsset) || receiveAsset === sendAsset) {
      const alt = userJettons.find(a => a !== sendAsset) || userJettons[0];
      setReceiveAsset(alt);
    }
  }, [userJettons]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Header title="Smart Exchange" />

      <JettonsList
        onJettons={setUserJettons}
        onJettonBalances={setJettonBalances}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SendBlock
          asset={sendAsset}
          onAssetChange={val => {
            if (val === receiveAsset) {
              const alt = userJettons.find(a => a !== val) || DEFAULT_RECEIVE_ASSET;
              setReceiveAsset(alt);
            }
            setSendAsset(val);
          }}
          disableCreate={!isReceiveValid}
          userJettons={userJettons}
          jettonBalances={jettonBalances}
        />

        <ReceiveBlock
          asset={receiveAsset}
          onAssetChange={val => {
            if (val === sendAsset) {
              const alt = userJettons.find(a => a !== val) || DEFAULT_SEND_ASSET;
              setSendAsset(alt);
            }
            setReceiveAsset(val);
          }}
          onValidate={setIsReceiveValid}
        />
      </div>

      <DealControl apiUrl="https://api.example.com/deals" onDealData={setDealData} />
    </div>
  );
};

export default App;
