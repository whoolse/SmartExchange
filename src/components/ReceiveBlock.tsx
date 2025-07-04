// src/components/ReceiveBlock.tsx
import React, { useState, useEffect } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets } from '../constants/assets';
import { useT } from '../i18n';

interface ReceiveBlockProps {
    asset: string;
    onAssetChange: (asset: string) => void;
    onValidate?: (valid: boolean) => void;
}

export const ReceiveBlock: React.FC<ReceiveBlockProps> = ({
    asset,
    onAssetChange,
    onValidate,
}) => {
    const t = useT();
    const calculateReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;
    const calculateAmount = (w: number, asset: string) =>
        asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;

    const [amount, setAmount] = useState<string>('1000');
    const [willReceive, setWillReceive] = useState<string>(
        calculateReceive(1000, asset).toFixed(6)
    );
    const [errorAmount, setErrorAmount] = useState<boolean>(false);
    const [errorWillReceive, setErrorWillReceive] = useState<boolean>(false);

    useEffect(() => {
        const valid =
            !!amount && !!willReceive && !errorAmount && !errorWillReceive;
        onValidate?.(valid);
    }, [amount, willReceive, errorAmount, errorWillReceive, onValidate]);

    const handleAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        if (!isNaN(a)) {
            setWillReceive(calculateReceive(a, asset).toFixed(6));
            setErrorAmount(false);
        } else {
            setWillReceive('');
            setErrorAmount(true);
        }
    };

    const handleWillReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        if (!isNaN(w)) {
            setAmount(calculateAmount(w, asset).toFixed(6));
            setErrorWillReceive(false);
        } else {
            setAmount('');
            setErrorWillReceive(true);
        }
    };

    const handleAssetChange = (val: string) => {
        onAssetChange(val);
        const a = parseFloat(amount);
        if (!isNaN(a)) {
            setWillReceive(calculateReceive(a, val).toFixed(6));
        }
    };

    return (
        <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">
                {t('receiving')}
            </h2>

            <InputField
                label={t('willSend')}
                type="number"
                value={amount}
                onChange={handleAmountChange}
                error={errorAmount}
            />

            <SelectField
                label={t('asset')}
                options={assets}
                value={asset}
                onChange={handleAssetChange}
            />

            <InputField
                label={t('willReceiveMe')}
                type="number"
                value={willReceive}
                onChange={handleWillReceiveChange}
                error={errorWillReceive}
            />

            <CommissionSection asset={asset} amount={amount} />
        </div>
    );
};
