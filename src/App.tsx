// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/Header';
import { SendBlock } from './components/SendBlock';
import { ReceiveBlock } from './components/ReceiveBlock';
import { DealControl } from './components/DealControl';
import { JettonsList } from './components/JettonsList';

const DEFAULT_SEND_ASSET = 'TON';
const DEFAULT_RECEIVE_ASSET = 'USDT';

const App: React.FC = () => {
  const [dealData, setDealData] = useState<any>(null);
  const [sendAsset, setSendAsset] = useState<string>(DEFAULT_SEND_ASSET);
  const [receiveAsset, setReceiveAsset] = useState<string>(DEFAULT_RECEIVE_ASSET);
  const [isReceiveValid, setIsReceiveValid] = useState<boolean>(true);
  const [userJettons, setUserJettons] = useState<string[]>([]);

  // Сбрасываем выбранные активы, если у пользователя их больше нет
  React.useEffect(() => {
    if (userJettons.length > 0) {
      if (!userJettons.includes(sendAsset)) {
        setSendAsset(userJettons[0]);
      }
      if (!userJettons.includes(receiveAsset)) {
        // по умолчанию в receive ставим тот актив, который первый, но не совпадает с sendAsset
        const nextReceive = userJettons.find(a => a !== sendAsset) || userJettons[0];
        setReceiveAsset(nextReceive);
      }
    }
  }, [userJettons]); // eslint-disable-line

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Header title="Smart Exchange" />

      {/* JettonsList теперь не только отображает баланс, но и отдаёт список активов пользователя */}
      <JettonsList onJettons={setUserJettons} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SendBlock
          asset={sendAsset}
          onAssetChange={val => {
            // нельзя выбрать тот же актив, что в получении
            if (val === receiveAsset) {
              // если актив не TON, ставим второй TON, иначе ставим USDT (или любой другой, который есть)
              const nextReceive = userJettons.find(a => a !== val) || val;
              setReceiveAsset(nextReceive);
            }
            setSendAsset(val);
          }}
          disableCreate={!isReceiveValid}
          userJettons={userJettons}
        />
        <ReceiveBlock
          asset={receiveAsset}
          onAssetChange={val => {
            // нельзя выбрать тот же актив, что в отправке
            if (val === sendAsset) {
              const nextSend = userJettons.find(a => a !== val) || val;
              setSendAsset(nextSend);
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
