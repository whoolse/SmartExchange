// src/components/ReceiveBlock.tsx
import React, { useState } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { assets } from '../constants/assets';

export const ReceiveBlock: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [willReceive, setWillReceive] = useState<string>('');
    const [asset, setAsset] = useState<string>(assets[0]);

    const handleAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        if (!isNaN(a)) {
            setWillReceive((a / 1.01).toFixed(2));
        } else {
            setWillReceive('');
        }
    };

    const handleWillReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        if (!isNaN(w)) {
            setAmount((w * 1.01).toFixed(2));
        } else {
            setAmount('');
        }
    };

    return (
        <div className="bg-white p-4 border rounded">
            <h2 className="italic font-bold mb-4">получаю</h2>
            <InputField
                label="будет отправлено"
                type="number"
                value={amount}
                onChange={handleAmountChange}
            />
            <SelectField
                label="актив"
                options={assets}
                value={asset}
                onChange={setAsset}
            />
            <InputField
                label="будет получено"
                type="number"
                value={willReceive}
                onChange={handleWillReceiveChange}
            />
        </div>
    );
};
