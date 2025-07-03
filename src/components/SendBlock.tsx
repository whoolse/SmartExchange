// src/components/SendBlock.tsx
import React, { useState } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CreateDealButton } from './CreateDealButton';
import { CommissionLine } from './CommissionLine';
import { assets } from '../constants/assets';

export const SendBlock: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [willReceive, setWillReceive] = useState<string>('');
    const [asset, setAsset] = useState<string>(assets[0]);
    const [partnerAddress, setPartnerAddress] = useState<string>('');

    const handleAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        setWillReceive(!isNaN(a) ? (a / 1.01).toFixed(5) : '');
    };

    const handleWillReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        setAmount(!isNaN(w) ? (w * 1.01).toFixed(5) : '');
    };

    const networkFee = asset === 'TON' ? 0.105 : 0.07;
    const serviceFee = parseFloat(amount) * 0.001 || 0;
    const totalFee = networkFee + serviceFee;

    return (
        <div className="bg-white p-4 border rounded">
            <h2 className="italic font-bold mb-4">отправляю</h2>

            <InputField
                label="будет отправлено"
                type="number"
                value={amount}
                onChange={handleAmountChange}
            />
            <SelectField
                label="актив"
                options={assets as string[]}
                value={asset}
                onChange={setAsset}
            />
            <InputField
                label="будет получено"
                type="number"
                value={willReceive}
                onChange={handleWillReceiveChange}
            />
            <InputField
                label="адрес партнёра"
                value={partnerAddress}
                onChange={setPartnerAddress}
            />

            <CommissionLine
                label="комиссия сети"
                value={networkFee}
                decimals={3}
            />
            <CommissionLine
                label="комиссия сервиса"
                value={serviceFee}
                decimals={5}
            />
            <CommissionLine
                label="общая комиссия"
                value={totalFee}
                decimals={5}
                bold
            />

            <CreateDealButton
                willSend={amount}
                partnerAddress={partnerAddress}
                onResult={res => console.log('Результат транзакции через TonConnect:', res)}
            />
        </div>
    );
};
