// src/components/DealCreate.tsx
import React, { useState, useMemo } from 'react';
import { fromNano } from '@ton/core';
import { assets, currencies } from '../constants/constants';
import { SendBlock } from './SendBlock';
import { ReceiveBlock } from './ReceiveBlock';
import { DealControl } from './DealControl';
import { type JettonsBalances } from '@ton-api/client';

const DEF_SEND = 'TON';
const DEF_RECEIVE = 'USDT';

export const DealCreate: React.FC<{
    userJettons: string[];
    jettonBalances: JettonsBalances['balances'];
}> = ({ userJettons, jettonBalances }) => {
    const [sendAsset, setSendAsset] = useState<string>(DEF_SEND);
    const [receiveAsset, setReceiveAsset] = useState<string>(DEF_RECEIVE);

    const [sendAmount, setSendAmount] = useState<string>('1000');
    const [partnerReceive, setPartnerReceive] = useState<string>('0');

    const [recSend, setRecSend] = useState<string>('10');
    const [recReceive, setRecReceive] = useState<string>('0');

    const [validRec, setValidRec] = useState<boolean>(true);

    // TON + те, что у пользователя
    const sendList = useMemo(() => {
        const f = assets.filter(a => userJettons.includes(a));
        const l = ['TON', ...f.filter(a => a !== 'TON')];
        if (!l.includes(sendAsset)) l.push(sendAsset);
        return l;
    }, [userJettons, sendAsset]);

    const onDealData = (info: any) => {
        setSendAmount("777");
        setRecSend("888");
        return

        const mapId = (id: bigint) =>
            Object.entries(currencies).find(([_, c]) => BigInt(c.id) === id)?.[0] || DEF_SEND;
        const sentA = mapId(info.expectedCurrencyId);
        const recvA = mapId(info.sendedCurrencyId);
        const sAmt = fromNano(info.expectedAmount as bigint);
        const pAmt = fromNano(info.partnerWillReceive as bigint);
        const rSend = fromNano(info.sendedAmount as bigint);
        const rRec = fromNano(info.expectedAmount as bigint);

        setSendAsset(sentA);
        setSendAmount(sAmt);
        setPartnerReceive(pAmt);

        setReceiveAsset(recvA);
        setRecSend(rSend);
        setRecReceive(rRec);
    };

    // Автопереключение, если дублируют
    const handleSA = (a: string) => {
        if (a === receiveAsset) {
            const idx = sendList.indexOf(a);
            setReceiveAsset(sendList[(idx + 1) % sendList.length]);
        }
        setSendAsset(a);
    };
    const handleRA = (a: string) => {
        if (a === sendAsset) {
            const idx = sendList.indexOf(a);
            setSendAsset(sendList[(idx + 1) % sendList.length]);
        }
        setReceiveAsset(a);
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <SendBlock
                asset={sendAsset}
                receiveAsset={receiveAsset}

                sendAmount={sendAmount}
                onSendAmountChange={setSendAmount}

                partnerReceive={partnerReceive}
                onPartnerReceiveChange={setPartnerReceive}

                onAssetChange={handleSA}
                disableCreate={!validRec}
                userJettons={userJettons}
                jettonBalances={jettonBalances}
            />

            <ReceiveBlock
                asset={receiveAsset}

                sendAmount={recSend}
                onSendAmountChange={setRecSend}

                receiveAmount={recReceive}
                onReceiveAmountChange={setRecReceive}

                onAssetChange={handleRA}
                onValidate={setValidRec}
            />

            <DealControl apiUrl="" onDealData={onDealData} />
        </div>
    );
};
