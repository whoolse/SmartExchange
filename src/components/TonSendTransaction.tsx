// src/components/TonSendTransaction.tsx
import React from 'react';
import {
    SendTransactionRequest,
    TonConnectUI,
    useTonAddress,
    useTonConnectUI,
} from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from '@ton/core';
import {
    JettonTransfer,
    storeJettonTransfer,
} from '../smartContract/JettonReceiver_JettonReceiver';
import {
    myContractAddress,
    tonApiBaseUrl,
    currencies,
} from '../constants/constants';
import { TonConnectWrapper } from '../services/tonConnectWrapper';

interface TonSendTransactionProps {
    /** Код актива, который отправляем */
    sendAsset: string;
    /** Сумма отправки */
    sendAmount: string;
    /** Код актива, который получаем */
    receiveAsset: string;
    /** Сумма получения партнёром */
    receiveAmount: string;
    /** Адрес партнёра */
    partnerAddress: string;
    /** Колбэк с результатом транзакции */
    onResult?: (res: any) => void;
    /** Рендер-проп: получает функцию отправки */
    children: (send: () => Promise<void>) => React.ReactNode;
}

export interface DealParameters {
    dealId: number;
    sendedAmount: number;
    sendedCurrencyName: string;
    expectedAmount: number;
    expectedCurrencyName: string;
    partnerAddress?: string;
}


const tonConnectWrapper = new TonConnectWrapper()

export const TonSendTransaction: React.FC<TonSendTransactionProps> = ({
    sendAsset,
    sendAmount,
    receiveAsset,
    receiveAmount,
    partnerAddress,
    onResult,
    children,
}) => {
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress();
    const send = async () => {
        if (!tonConnectUI) {
            console.error('TonConnect UI не инициализирован');
            return;
        }
        console.log('TonSendTransaction')

        let amountNano: string;
        try {
            amountNano = toNano(sendAmount || '0').toString();
        } catch {
            console.error('Невалидное количество для отправки:', sendAmount);
            return;
        }

        try {
            const dealParams: DealParameters = {
                dealId: 2,
                sendedCurrencyName: sendAsset,
                sendedAmount: +sendAmount,
                expectedAmount: +receiveAmount,
                expectedCurrencyName: receiveAsset,
                partnerAddress,
            };
            console.log(dealParams);
            if (sendAsset == "TON")
                await tonConnectWrapper.sendTon(dealParams, tonConnectUI)
            else
                await tonConnectWrapper.sendJetton(dealParams, tonConnectUI, Address.parse(address!));
     
            onResult?.({ success: true });
        } catch (e) {
            console.error('Ошибка sendTransaction:', e);
            onResult?.({ error: e });
        }
    };

    return <>{children(send)}</>;
};
