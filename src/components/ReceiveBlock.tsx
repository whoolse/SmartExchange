// src/components/ReceiveBlock.tsx
import React, { useState } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';

const assets = ['TON', 'ETH', 'BTC'];

export const ReceiveBlock: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [asset, setAsset] = useState<string>(assets[0]);

    return (
        <div className="bg-white p-4 border rounded">
            <h2 className="italic font-bold mb-4">получаю</h2>
            <InputField
                label="количество"
                value={amount}
                onChange={setAmount}
            />
            <SelectField
                label="актив"
                options={assets}
                value={asset}
                onChange={setAsset}
            />
        </div>
    );
};
