// src/components/TonSendTransaction.tsx
import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/core';

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

    const send = async () => {
        if (!tonConnectUI) {
            console.error('TonConnect UI не инициализирован');
            return;
        }
        if (!partnerAddress) {
            console.error('Не указан адрес партнёра');
            return;
        }

        // Время жизни транзакции (секунды)
        const validUntil = Math.floor(Date.now() / 1000) + 60;

        let amountNano: string;
        try {
            amountNano = toNano(sendAmount || '0').toString();
        } catch {
            console.error('Невалидное количество для отправки:', sendAmount);
            return;
        }

        const transaction = {
            validUntil,
            messages: [
                {
                    address: partnerAddress,
                    amount: amountNano,
                },
            ],
        };

        try {
            const result = await tonConnectUI.sendTransaction(transaction);
            console.log('Отправлено через TonConnect:', {
                result,
                sendAsset,
                sendAmount,
                receiveAsset,
                receiveAmount,
                partnerAddress,
            });
            onResult?.(result);
        } catch (e) {
            console.error('Ошибка sendTransaction:', e);
            onResult?.({ error: e });
        }
    };

    return <>{children(send)}</>;
};
