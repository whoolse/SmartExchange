// src/components/DealItem.tsx
import React from 'react';
import { Address } from '@ton/core';
import { fromNano } from '@ton/core';
import { DealInfo } from '../smartContract/JettonReceiver_JettonReceiver';

interface DealItemProps {
    id: string;
    info: DealInfo;
    onCancel: (id: string) => void;
}
// Обработчик отмены — тут пока заглушка, позже привяжите к контракту


export const DealItem: React.FC<DealItemProps> = ({ id, info, onCancel }) => {
    const sended = fromNano(info.sendedAmount);
    const expected = fromNano(info.expectedAmount);

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
                    {sended} (#{info.sendedCurrencyId})
                    {' → '}
                    {expected} (#{info.expectedCurrencyId})
                </div>
                {info.partnerAddressString && (
                    <div className="text-gray-400 truncate">
                        Партнёр: {info.partnerAddressString}
                    </div>
                )}
            </div>
            <button
                onClick={() => onCancel(id)}
                className="px-3 py-1 ml-4 bg-red-600 hover:bg-red-700 text-white rounded transition"
            >
                Отменить
            </button>
        </div>
    );
};
