// src/components/DealCreate.tsx
import React, { useState, useEffect } from 'react';
import { fromNano } from '@ton/core';
import { currencies } from '../constants/constants';
import { SendBlock } from './SendBlock';
import { ReceiveBlock } from './ReceiveBlock';
import { DealControl } from './DealControl';
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
    const [sendAmountInit, setSendAmountInit] = useState<string>('1000');
    const [receiveAmountInit, setReceiveAmountInit] = useState<string>('10');
    const [isReceiveValid, setIsReceiveValid] = useState<boolean>(true);

    useEffect(() => {
        if (!userJettons.length) return;
        if (!userJettons.includes(sendAsset)) {
            setSendAsset(DEFAULT_SEND_ASSET);
        }
        if (!userJettons.includes(receiveAsset) || receiveAsset === sendAsset) {
            setReceiveAsset(DEFAULT_RECEIVE_ASSET);
        }
    }, [userJettons, sendAsset, receiveAsset]);

    const handleDealData = (dealInfo: any) => {
        const mapIdToAsset = (id: bigint) => {
            const entry = Object.entries(currencies).find(
                ([, cfg]) => BigInt(cfg.id) === id
            );
            return entry ? entry[0] : DEFAULT_SEND_ASSET;
        };

        const sendedId = dealInfo.sendedCurrencyId as bigint;
        const expectedId = dealInfo.expectedCurrencyId as bigint;
        const symbolReceive = mapIdToAsset(sendedId);
        const symbolSend = mapIdToAsset(expectedId);

        const initSend = fromNano(dealInfo.expectedAmount as bigint);
        const initReceive = fromNano(dealInfo.sendedAmount as bigint);

        setSendAsset(symbolSend);
        setReceiveAsset(symbolReceive);
        setSendAmountInit(initSend);
        setReceiveAmountInit(initReceive);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SendBlock
                asset={sendAsset}
                receiveAsset={receiveAsset}
                receiveAmount={receiveAmountInit}
                initialSendAmount={sendAmountInit}
                initialReceiveAmount={receiveAmountInit}
                onAssetChange={(val) => {
                    if (val === receiveAsset) setReceiveAsset(DEFAULT_RECEIVE_ASSET);
                    setSendAsset(val);
                }}
                disableCreate={!isReceiveValid}
                userJettons={userJettons}
                jettonBalances={jettonBalances}
            />

            <ReceiveBlock
                asset={receiveAsset}
                initialSendAmount={receiveAmountInit}
                initialReceiveAmount={receiveAmountInit}
                onAmountChange={setReceiveAmountInit}
                onAssetChange={(val) => {
                    if (val === sendAsset) setSendAsset(DEFAULT_SEND_ASSET);
                    setReceiveAsset(val);
                }}
                onValidate={setIsReceiveValid}
            />

            <DealControl apiUrl="" onDealData={handleDealData} />
        </div>
    );
};
