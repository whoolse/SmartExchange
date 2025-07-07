// src/components/DealCreate.tsx
import React, { useState, useEffect } from 'react';
import { SendBlock } from './SendBlock';
import { ReceiveBlock } from './ReceiveBlock';
import { type JettonsBalances } from '@ton-api/client';

const DEFAULT_SEND_ASSET = 'TON';
const DEFAULT_RECEIVE_ASSET = 'USDT';

interface DealCreateProps {
    userJettons: string[];
    jettonBalances: JettonsBalances['balances'];
}

export const DealCreate: React.FC<DealCreateProps> = ({
    userJettons,
    jettonBalances,
}) => {
    const [sendAsset, setSendAsset] = useState<string>(DEFAULT_SEND_ASSET);
    const [receiveAsset, setReceiveAsset] = useState<string>(DEFAULT_RECEIVE_ASSET);
    const [isReceiveValid, setIsReceiveValid] = useState<boolean>(true);

    // При первом получении списка джеттонов и при его изменении
    useEffect(() => {
        if (userJettons.length === 0) return;

        // Если отправляемый актив стал недоступен и не TON — сбрасываем на TON
        if (sendAsset !== DEFAULT_SEND_ASSET && !userJettons.includes(sendAsset)) {
            setSendAsset(DEFAULT_SEND_ASSET);
        }
        // Если актив для получения недоступен или совпадает с отправляемым — сбрасываем
        if (!userJettons.includes(receiveAsset) || receiveAsset === sendAsset) {
            const alt = userJettons.find(a => a !== sendAsset) || DEFAULT_RECEIVE_ASSET;
            setReceiveAsset(alt);
        }
    }, [userJettons]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SendBlock
                asset={sendAsset}
                receiveAsset={receiveAsset}
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
    );
};
