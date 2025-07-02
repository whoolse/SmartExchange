// src/App.tsx
import React, { useState } from 'react';
// import { TonWallet } from './components/TonWallet';
import { SendBlock } from './components/SendBlock';
import { ReceiveBlock } from './components/ReceiveBlock';
import { DealControl } from './components/DealControl';
import { Header } from './components/Header';
import { CreateDealButton } from './components/CreateDealButton';

const App: React.FC = () => {
  const [dealData, setDealData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Header title="Smart Exhange" />
      <div className="grid grid-cols-2 gap-6">
        <SendBlock />
        <ReceiveBlock />
      </div>
      <div className="mt-4">
        <CreateDealButton />
      </div>
      <DealControl
        apiUrl="https://api.example.com/deals"
        onDealData={setDealData}
      />
      {/* При необходимости можно отобразить dealData здесь */}
    </div>
  );
};

export default App;
