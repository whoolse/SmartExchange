// src/components/DealCreate.tsx
import React, { useState, useMemo } from 'react';
import { Address, fromNano } from '@ton/core';
import { assets, currencies } from '../constants/constants';
import { SendBlock } from './SendBlock';
import { ReceiveBlock } from './ReceiveBlock';
import { DealControl } from './DealControl';
import { type JettonsBalances } from '@ton-api/client';
import { calcBack, getCurrencyKeyById } from '../utils/utils';
import { CreateDealButton } from './CreateDealButton';

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
    // Флаг для случая, когда сделка не найдена
    const [dealNotFound, setDealNotFound] = useState<boolean>(false);

    const [disableCreate, setDisableCreate] = useState(false);

    // TON + те, что у пользователя
    const sendList = useMemo(() => {
        const f = assets.filter(a => userJettons.includes(a));
        const l = ['TON', ...f.filter(a => a !== 'TON')];
        if (!l.includes(sendAsset)) l.push(sendAsset);
        return l;
    }, [userJettons, sendAsset]);

    const onDealData = (info: DealInfo | null) => {
        // Если инфа о сделке отсутствует
        if (info == null) {
            setDealNotFound(true);
            return;
        }
        setDealNotFound(false);
        console.log(info)
        // Обновляем поля на основе данных из смарт-контракта
        setRecSend(fromNano(info.sendedAmount));
        const expectedAmount = +fromNano(info.expectedAmount);
        const expectedCurrency = getCurrencyKeyById(Number(info.expectedCurrencyId));
        const sendedCurrency = getCurrencyKeyById(Number(info.sendedCurrencyId));

        console.log(expectedCurrency, sendedCurrency)
        setSendAmount(calcBack(expectedAmount, expectedCurrency).toString());
        setReceiveAsset(sendedCurrency);
        setSendAsset(expectedCurrency);
    };

    // Автопереключение, если выбранный asset совпадает с receiveAsset/sendAsset
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
        <>
            <div className="main-content">
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
                    onValidationChange={setDisableCreate}
                />
                <div className="exchange-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17"></path>
                    </svg>
                </div>
                <ReceiveBlock
                    asset={receiveAsset}
                    sendAmount={recSend}
                    onSendAmountChange={setRecSend}
                    receiveAmount={recReceive}
                    onReceiveAmountChange={setRecReceive}
                    onAssetChange={handleRA}
                    onValidate={setValidRec}
                />            

                {dealNotFound && (
                    <div className="mt-2 text-red-500">
                        Сделка не найдена
                    </div>
                )}
            </div>
            <CreateDealButton
                sendAsset={sendAsset}
                sendAmount={sendAmount}
                receiveAsset={receiveAsset}
                receiveAmount={partnerReceive}
                partnerAddress=""
                disabled={disableCreate}
            />
            <DealControl onDealData={onDealData} />

        </>
    );
};
