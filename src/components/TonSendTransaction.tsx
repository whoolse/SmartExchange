// src/components/TonSendTransaction.tsx
import React from 'react';
import {
    useTonAddress,
    useTonConnectUI,
} from '@tonconnect/ui-react';
import { Address, toNano } from '@ton/core';
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
    dealId: number;
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
    partnerAddressString: string;
}

export const TonSendTransaction: React.FC<TonSendTransactionProps> = ({
    sendAsset,
    sendAmount,
    receiveAsset,
    receiveAmount,
    partnerAddress,
    dealId,
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
                dealId,
                sendedCurrencyName: sendAsset,
                sendedAmount: +sendAmount,
                expectedAmount: +receiveAmount,
                expectedCurrencyName: receiveAsset,
                partnerAddressString: partnerAddress,
            };
            console.log(dealParams);
            if (dealParams.partnerAddressString != '') {
                try {
                    Address.parse(dealParams.partnerAddressString)
                }
                catch (error: any) {
                    console.error('wrong address')
                    return
                }
            }
            if (sendAsset == "TON")
                await TonConnectWrapper.sendTonDeal(dealParams, tonConnectUI)
            else
                await TonConnectWrapper.sendJettonDeal(dealParams, tonConnectUI, Address.parse(address!));

            onResult?.({ success: true });
        } catch (e) {
            console.error('Ошибка sendTransaction:', e);
            onResult?.({ error: e });
        }
    };

    return <>{children(send)}</>;
};
