// src/components/DealCreate.tsx
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
    // Получаем параметр :id из URL
    const { id: initialDealId } = useParams<{ id: string }>();

    const [sendAsset, setSendAsset] = useState<string>(DEF_SEND);
    const [receiveAsset, setReceiveAsset] = useState<string>(DEF_RECEIVE);

    const [sendAmount, setSendAmount] = useState<string>('1000');
    const [partnerReceive, setPartnerReceive] = useState<string>('0');

    const [recSend, setRecSend] = useState<string>('10');
    const [recReceive, setRecReceive] = useState<string>('0');

    const [validRec, setValidRec] = useState<boolean>(true);

    // Формируем список доступных отправляемых активов
    const sendList = useMemo(() => {
        const f = assets.filter(a => userJettons.includes(a));
        const l = ['TON', ...f.filter(a => a !== 'TON')];
        if (!l.includes(sendAsset)) l.push(sendAsset);
        return l;
    }, [userJettons, sendAsset]);

    const onDealData = (info: DealInfo) => {
        // Обновляем состояние на основе данных из смарт-контракта
        setRecSend(fromNano(info.sendedAmount));
        const expectedAmount = +fromNano(info.expectedAmount);
        const expectedCurrency = getCurrencyKeyById(info.expectedCurrencyId);
        const sendedCurrency = getCurrencyKeyById(info.sendedCurrencyId);

        setSendAmount(calcBack(expectedAmount, expectedCurrency).toString());
        setSendAsset(expectedCurrency);
        setReceiveAsset(sendedCurrency);
    };

    // Авто-переключение, если пользователь выбирает уже выбранный актив в другом блоке
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

            <DealControl
                onDealData={onDealData}
                initialDealId={initialDealId}
            />
        </div>
    );
};
