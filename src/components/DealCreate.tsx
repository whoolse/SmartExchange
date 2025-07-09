// src/components/DealCreate.tsx
import React, { useState, useMemo } from 'react';
import { Address, fromNano } from '@ton/core';
import { assets, currencies } from '../constants/constants';
import { SendBlock } from './SendBlock';
import { ReceiveBlock } from './ReceiveBlock';
import { DealControl } from './DealControl';
import { type JettonsBalances } from '@ton-api/client';
import { calcBack, getCurrencyKeyById } from '../utils/utils';

const DEF_SEND = 'TON';
const DEF_RECEIVE = 'USDT';

interface DealInfo {
    senderAddress: Address;
    sendedAmount: number;
    sendedCurrencyId: number;
    partnerWillReceive: number;
    expectedCurrencyId: number;
    expectedAmount: number;
    myJettonWallet: Address | null;
    partnerAddressString: string | null;
}

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

    const onDealData = (info: DealInfo) => {
        setRecSend(fromNano(info.sendedAmount));
        let expectedAmount = +fromNano(info.expectedAmount);
        let expectedCurrency = getCurrencyKeyById(Number(info.expectedCurrencyId));
        let sendedCurrency = getCurrencyKeyById(Number(info.sendedCurrencyId));
        setSendAmount(calcBack(expectedAmount, expectedCurrency).toString());
        setSendAsset(expectedCurrency);
        setReceiveAsset(sendedCurrency);
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
