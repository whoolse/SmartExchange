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

    // При изменении списка jettons:
    // 1) Если sendAsset больше недоступен — сбросить на TON
    // 2) Если receiveAsset совпадает с sendAsset — сбросить на USDT (вне зависимости от userJettons)
    useEffect(() => {
        if (userJettons.length === 0) return;

        if (!userJettons.includes(sendAsset)) {
            setSendAsset(DEFAULT_SEND_ASSET);
        }
        if (receiveAsset === sendAsset) {
            setReceiveAsset(DEFAULT_RECEIVE_ASSET);
        }
    }, [userJettons]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SendBlock
                asset={sendAsset}
                receiveAsset={receiveAsset}
                onAssetChange={val => {
                    if (val === receiveAsset) {
                        setReceiveAsset(DEFAULT_RECEIVE_ASSET);
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
                        setSendAsset(DEFAULT_SEND_ASSET);
                    }
                    setReceiveAsset(val);
                }}
                onValidate={setIsReceiveValid}
            />
        </div>
    );
};
