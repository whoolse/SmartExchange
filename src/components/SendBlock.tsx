// src/components/SendBlock.tsx
import React, { useState, useMemo } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { TonSendTransaction } from './TonSendTransaction';

const assets = ['TON', 'ETH', 'BTC'];
const dealTypes = ['без комиссии', 'с комиссией'];

export const SendBlock: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [asset, setAsset] = useState<string>(assets[0]);
    const [dealType, setDealType] = useState<string>(dealTypes[0]);
    const [partnerAddress, setPartnerAddress] = useState<string>('');

    const tonValue = useMemo(() => {
        const a = parseFloat(amount);
        if (isNaN(a)) return '';
        const factor = dealType === dealTypes[0] ? 1.01 : 1.1;
        return (a * factor).toFixed(2);
    }, [amount, dealType]);

    return (
        <div className="bg-white p-4 border rounded">
            <h2 className="italic font-bold mb-4">отправляю</h2>
            <InputField
                label="количество"
                type="number"
                value={amount}
                onChange={setAmount}
            />
            <SelectField
                label="актив"
                options={assets}
                value={asset}
                onChange={setAsset}
            />
            <SelectField
                label="тип сделки"
                options={dealTypes}
                value={dealType}
                onChange={setDealType}
            />
            <InputField
                label="будет отправлено"
                value={tonValue}
                onChange={() => { }}
                readOnly
            />
            <InputField
                label="адрес партнёра"
                value={partnerAddress}
                onChange={setPartnerAddress}
            />
            <TonSendTransaction
                tonValue={tonValue}
                partnerAddress={partnerAddress}
                onResult={res => console.log('Результат транзакции:', res)}
            >
                {send => (
                    <button
                        onClick={send}
                        className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        отправить
                    </button>
                )}
            </TonSendTransaction>
        </div>
    );
};
