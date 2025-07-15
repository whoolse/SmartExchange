// src/App.tsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { JettonsList } from './components/JettonsList';
import { DealCreate } from './components/DealCreate';
import { JettonsBalances } from '@ton-api/client';
import { DealsList } from './components/DealsList';

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

      <div style={{ marginTop: 32 }}>
        <h2 className="block-title">Существующие сделки</h2>
        <DealsList />
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<AppPage />} />
    <Route path="/deals/:id" element={<AppPage />} />
  </Routes>
);

export default App;
