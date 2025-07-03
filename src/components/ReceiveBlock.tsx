// src/components/ReceiveBlock.tsx
import React, { useState } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets } from '../constants/assets';

export const ReceiveBlock: React.FC = () => {
    // Расчёт «будет получено мною» на основе отправленного
    const calculateReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;

    // Обратная формула: расчёт отправленного из полученного
    const calculateAmount = (w: number, asset: string) =>
        asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;

    const [amount, setAmount] = useState<string>('');
    const [willReceive, setWillReceive] = useState<string>('');
    const [asset, setAsset] = useState<string>(assets[0]);

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
            setAmount(calculateAmount(w, asset).toFixed(6));
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
            <h2 className="italic font-bold mb-4">получаю</h2>

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
                label="Будет получено мною"
                type="number"
                value={willReceive}
                onChange={handleWillReceiveChange}
            />

            {/* Блок комиссий */}
            <CommissionSection asset={asset} amount={amount} />
        </div>
    );
};
