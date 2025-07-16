// src/components/DealItem.tsx
import React from 'react';
import { Address } from '@ton/core';
import { fromNano } from '@ton/core';
import { DealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { getCurrencyKeyById } from '../utils/utils';


interface DealItemProps {
    id: string;
    info: DealInfo;
    onCancel: (id: string) => void;
    disabled?: boolean;
}
// Обработчик отмены — тут пока заглушка, позже привяжите к контракту


export const DealItem: React.FC<DealItemProps> = ({ id, info, onCancel, disabled }) => {
    const sended = fromNano(info.sendedAmount);
    const sendedCurrency = getCurrencyKeyById(Number(info.sendedCurrencyId));
    const expected = fromNano(info.expectedAmount);
    const expectedCurrency = getCurrencyKeyById(Number(info.expectedCurrencyId));
    // URL сделки для копирования и шаринга
    const url = `${window.location.origin}/deal/${id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Ссылка на сделку',
                text: `Перейти к сделке ${id}`,
                url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
        }
    };
    return (
        <div
            className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm hover:bg-opacity-10"
        >
            <div className="flex-1 min-w-0 space-y-1">
                <div className="text-sm text-indigo-300">ID: {id}</div>
                <div className="text-white truncate">
                    Отправитель: {info.senderAddress.toString()}
                </div>
                <div className="text-gray-300">
                    {"Отправил "}
                    {sended} {sendedCurrency}
                    {", ожидает "}
                    {expected} {expectedCurrency}
                </div>
                {info.partnerAddress && (
                    <div className="text-gray-400 truncate">
                        Партнёр: {info.partnerAddress.toString()}
                    </div>
                )}
            </div>
            {/* Кнопки в столбец одной ширины, равной самой широкой */}
            <div
                className="mt-4 inline-grid grid-flow-row grid-cols-[max-content] gap-2"
                style={{ justifyContent: 'start' }}
            >
                <button
                    onClick={() => onCancel(id)}
                    disabled={disabled}
                    className="px-[5px] py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                    Отменить
                </button>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="px-[5px] py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                    Копировать ID
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className="px-[5px] py-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
                >
                    Поделиться
                </button>
            </div>
        </div>

    );
};
