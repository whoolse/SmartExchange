// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { JettonsList } from './components/JettonsList';
import { DealCreate } from './components/DealCreate';
import { JettonsBalances } from '@ton-api/client';
import { DealsPage } from './components/DealsPage';

const AppPage: React.FC = () => {
  const [userJettons, setUserJettons] = useState<string[]>([]);
  const [jettonBalances, setJettonBalances] = useState<JettonsBalances['balances']>([]);
  const [openDealId, setOpenDealId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dealId = params.get('dealId');
    if (dealId) {
      setOpenDealId(dealId);
    }
  }, [location.search]);

  return (
    <div className="container">
      <Header title="Smart Exchange" />

      <DealCreate
        userJettons={userJettons}
        jettonBalances={jettonBalances}
      />

      <JettonsList
        onJettons={setUserJettons}
        onJettonBalances={setJettonBalances}
      />
    </div>
  );
};

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<AppPage />} />
    {/* <Route path="/deal/:id" element={<AppPage />} /> */}
    <Route path="/deals" element={<DealsPage />} />
  </Routes>
);

export default App;
