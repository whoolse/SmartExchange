// src/components/DealCreate.tsx
import React, { useState, useMemo } from 'react';
import { fromNano } from '@ton/core';
import { assets, currencies } from '../constants/constants';
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
    const [receiveAmount, setReceiveAmount] = useState<string>('1000');
    const [isReceiveValid, setIsReceiveValid] = useState<boolean>(true);

    // Send-поля не должны совпадать с Receive-полями: если совпадение — переключаем Receive
    const handleSendAssetChange = (val: string) => {
        if (val === receiveAsset) {
            const filtered = assets.filter(a => userJettons.includes(a));
            const list = ['TON', ...filtered.filter(a => a !== 'TON')];
            const idx = list.indexOf(val);
            const next = list[(idx + 1) % list.length];
            setReceiveAsset(next);
        }
        setSendAsset(val);
    };

    // Receive-поля: аналогично переключаем Send, если совпадают
    const handleReceiveAssetChange = (val: string) => {
        if (val === sendAsset) {
            const filtered = assets.filter(a => userJettons.includes(a));
            const list = ['TON', ...filtered.filter(a => a !== 'TON')];
            const idx = list.indexOf(val);
            const next = list[(idx + 1) % list.length];
            setSendAsset(next);
        }
        setReceiveAsset(val);
    };

    // Коллбэк для DealControl — заполняет оба блока из ответа dealInfo
    const handleDealData = (dealInfo: any) => {
        const mapIdToAsset = (id: bigint) => {
            const entry = Object.entries(currencies).find(
                ([sym, cfg]) => BigInt(cfg.id) === id
            );
            return entry ? entry[0] : DEFAULT_SEND_ASSET;
        };

        const sId = dealInfo.sendedCurrencyId as bigint;
        const eId = dealInfo.expectedCurrencyId as bigint;
        const sSym = mapIdToAsset(sId);
        const eSym = mapIdToAsset(eId);

        const sAmt = fromNano(dealInfo.sendedAmount as bigint);

        setReceiveAsset(sSym);
        setReceiveAmount(sAmt);
        setSendAsset(eSym);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SendBlock
                asset={sendAsset}
                receiveAsset={receiveAsset}
                receiveAmount={receiveAmount}
                onAssetChange={handleSendAssetChange}
                disableCreate={!isReceiveValid}
                userJettons={userJettons}
                jettonBalances={jettonBalances}
            />

            <ReceiveBlock
                asset={receiveAsset}
                initialSendAmount={receiveAmount}
                onAmountChange={setReceiveAmount}
                onAssetChange={handleReceiveAssetChange}
                onValidate={setIsReceiveValid}
            />

            <DealControl apiUrl="" onDealData={handleDealData} />
        </div>
    );
};
