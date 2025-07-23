// src/components/TonSendTransaction.tsx
import React from 'react';
import {
    useTonAddress,
    useTonConnectUI,
} from '@tonconnect/ui-react';
import { Address, toNano } from '@ton/core';
import { TonConnectWrapper } from '../services/tonConnectWrapper';
import { JettonBalance } from '@ton-api/client';

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
    onResult?: (res: TxResult) => void;
    /** Рендер-проп: получает функцию отправки */
    children: (send: () => Promise<void>) => React.ReactNode;
    sendCurrency?: JettonBalance;

}


export interface DealParameters {
    dealId: number;
    sendedAmount: number;
    sendedCurrencyName: string;
    expectedAmount: number;
    expectedCurrencyName: string;
    partnerAddressString: string;
    sendCurrency?: JettonBalance;
}

export interface TxResult {
    error?: string;
    boc?: string;
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
    sendCurrency
}) => {
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress();
    const send = async () => {
        if (!tonConnectUI) {
            console.error('TonConnect UI не инициализирован');
            return;
        }

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
                sendCurrency: sendCurrency
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
            let boc: string = ''
            if (sendAsset == "TON")
                boc = await TonConnectWrapper.sendTonDeal(dealParams, tonConnectUI)
            else
                boc = await TonConnectWrapper.sendJettonDeal(dealParams, tonConnectUI, Address.parse(address!));

            onResult?.({ boc });
        } catch (e: unknown) {
            console.error('Ошибка sendTransaction:', e);
            onResult?.({ error: e as string });
        }
    };

    return <>{children(send)}</>;
};
