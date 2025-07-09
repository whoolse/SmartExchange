// src/App.tsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { JettonsList } from './components/JettonsList';
import { DealCreate } from './components/DealCreate';
import { type JettonsBalances } from '@ton-api/client';

const AppPage: React.FC = () => {
  const [userJettons, setUserJettons] = useState<string[]>([]);
  const [jettonBalances, setJettonBalances] = useState<JettonsBalances['balances']>([]);

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

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<AppPage />} />
    <Route path="/deals/:id" element={<AppPage />} />
  </Routes>
);

export default App;
