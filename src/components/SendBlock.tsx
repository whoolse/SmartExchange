// src/components/SendBlock.tsx
import React, { useState } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CreateDealButton } from './CreateDealButton';
import { CommissionSection } from './CommissionSection';
import { assets } from '../constants/assets';

export const SendBlock: React.FC = () => {
    // Формула расчёта получаемой суммы
    const calculateReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;

    // Начальное значение amount = 1000
    const [amount, setAmount] = useState<string>('1000');
    // Начальное willReceive рассчитываем сразу
    const [willReceive, setWillReceive] = useState<string>(() => {
        const initial = calculateReceive(1000, assets[0]);
        return initial.toFixed(6);
    });
    const [asset, setAsset] = useState<string>(assets[0]);
    const [partnerAddress, setPartnerAddress] = useState<string>('');

    const handleAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        if (isNaN(a)) {
            setWillReceive('');
        } else {
            setWillReceive(calculateReceive(a, asset).toFixed(6));
        }
    };

    const handleWillReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        if (isNaN(w)) {
            setAmount('');
        } else {
            // Обратная формула
            const orig =
                asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;
            setAmount(orig.toFixed(6));
        }
    };

    const handleAssetChange = (val: string) => {
        setAsset(val);
        const a = parseFloat(amount);
        if (!isNaN(a)) {
            setWillReceive(calculateReceive(a, val).toFixed(6));
        }
    };

    return (
        <div className="bg-white p-4 border rounded">
            <h2 className="italic font-bold mb-4">отправляю</h2>

            <InputField
                label="Будет отправлено"
                type="number"
                value={amount}
                onChange={handleAmountChange}
            />

            <SelectField
                label="актив"
                options={assets as string[]}
                value={asset}
                onChange={handleAssetChange}
            />

            <InputField
                label="Будет получено партнером"
                type="number"
                value={willReceive}
                onChange={handleWillReceiveChange}
            />

            <InputField
                label="адрес партнёра"
                value={partnerAddress}
                onChange={setPartnerAddress}
            />

            {/* Блок комиссии */}
            <CommissionSection asset={asset} amount={amount} />

            <CreateDealButton
                willSend={amount}
                partnerAddress={partnerAddress}
                onResult={res =>
                    console.log('Результат транзакции через TonConnect:', res)
                }
            />
        </div>
    );
};
