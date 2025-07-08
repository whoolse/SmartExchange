// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/Header';
import { JettonsList } from './components/JettonsList';
import { DealCreate } from './components/DealCreate';
import { DealControl } from './components/DealControl';
import { type JettonsBalances } from '@ton-api/client';

const App: React.FC = () => {
  const [userJettons, setUserJettons] = useState<string[]>([]);
  const [jettonBalances, setJettonBalances] = useState<JettonsBalances['balances']>([]);
  const [dealData, setDealData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Header title="Smart Exchange" />

      <JettonsList
        onJettons={setUserJettons}
        onJettonBalances={setJettonBalances}
      />

      <DealCreate
        userJettons={userJettons}
        jettonBalances={jettonBalances}
      />

    </div>
  );
};

export default App;
