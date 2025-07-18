// src/App.tsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { JettonsList } from './components/JettonsList';
import { DealCreate } from './components/DealCreate';
import { JettonsBalances } from '@ton-api/client';
import { DealsPage } from './components/DealsPage';

const AppPage: React.FC = () => {
  const [userJettons, setUserJettons] = useState<string[]>([]);
  const [jettonBalances, setJettonBalances] = useState<JettonsBalances['balances']>([]);

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
    <Route path="/deal/:id" element={<AppPage />} />
    <Route path="/deals" element={<DealsPage />} />
  </Routes>
);

export default App;
