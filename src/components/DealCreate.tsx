// src/components/DealCreate.tsx
import React, { useState, useEffect } from 'react';
import { SendBlock } from './SendBlock';
import { ReceiveBlock } from './ReceiveBlock';
import { type JettonsBalances } from '@ton-api/client';

const DEFAULT_SEND_ASSET = 'TON';
const DEFAULT_RECEIVE_ASSET = 'SE2';

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
    const [receiveAmount, setReceiveAmount] = useState<string>('10');
    const [isReceiveValid, setIsReceiveValid] = useState<boolean>(true);

    useEffect(() => {
        if (userJettons.length === 0) return;
        if (!userJettons.includes(sendAsset)) {
            setSendAsset(DEFAULT_SEND_ASSET);
        }
        if (receiveAsset === sendAsset) {
            setReceiveAsset(DEFAULT_RECEIVE_ASSET);
        }
    }, [userJettons, sendAsset, receiveAsset]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SendBlock
                asset={sendAsset}
                receiveAsset={receiveAsset}
                /** сюда прокидываем актуальное «Будет получено мною» */
                receiveAmount={receiveAmount}
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
                onAmountChange={setReceiveAmount}
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
