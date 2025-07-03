// src/components/TonSendTransaction.tsx
import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';                         // TonConnect UI React hook :contentReference[oaicite:0]{index=0}
import { toNano } from '@ton/core';                                             // Утилита конвертации в нанотоны 

export interface TonSendTransactionProps {
    tonValue: string;
    partnerAddress: string;
    onResult?: (result: any) => void;
    children: (send: () => Promise<void>) => React.ReactNode;
}

export const TonSendTransaction: React.FC<TonSendTransactionProps> = ({
    tonValue: willSend,
    partnerAddress,
    onResult,
    children,
}) => {
    const [tonConnectUI] = useTonConnectUI();                                      // Получаем экземпляр TonConnectUI :contentReference[oaicite:2]{index=2}

    const send = async () => {
        if (!tonConnectUI) {
            console.error('TonConnect UI не инициализирован');                        // Проверка инициализации :contentReference[oaicite:3]{index=3}
            return;
        }
        // if (!partnerAddress) {
        //     console.error('Не указан адрес партнёра');                                 // Проверка обязательного поля :contentReference[oaicite:4]{index=4}
        //     return;
        // }

        // Формируем объект транзакции по спецификации TonConnect
        const validUntil = Math.floor(Date.now() / 1000) + 60;                        // Время жизни транзакции в секундах :contentReference[oaicite:5]{index=5}
        let amountNano: string;
        try {
            amountNano = toNano(willSend || '0').toString();                           // Конвертация в строку нанотонов 
        } catch {
            console.error('Невалидное количество для отправки:', willSend);            // Обработка ошибок конвертации :contentReference[oaicite:7]{index=7}
            return;
        }

        const transaction = {
            validUntil,
            messages: [
                {
                    address: "kQBa5jkSDTIB4TPwPoY89DKVnO_fmegu0TupPANBCef5_VVD",                                        // Адрес получателя :contentReference[oaicite:8]{index=8}
                    amount: amountNano,                                                     // Сумма в нанотонах :contentReference[oaicite:9]{index=9}
                },
            ],
        };

        try {
            const result = await tonConnectUI.sendTransaction(transaction);            // Отправка через TonConnect UI :contentReference[oaicite:10]{index=10}
            console.log('Отправлено через TonConnect:', result);
            onResult?.(result);                                                        // Колбэк с результатом :contentReference[oaicite:11]{index=11}
        } catch (e) {
            console.error('Ошибка sendTransaction:', e);                               // Логирование ошибок SDK :contentReference[oaicite:12]{index=12}
        }
    };

    return <>{children(send)}</>;
};
