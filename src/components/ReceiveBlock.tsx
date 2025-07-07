// src/components/ReceiveBlock.tsx
import React, { useState, useEffect } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets } from '../constants/constants';
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

    const calcReceive = (a: number, assetKey: string) =>
        assetKey === 'TON' ? a * 0.999 - 0.105 : a * 0.999;

    const [amount, setAmount] = useState<string>('1000');
    const [errAmt, setErrAmt] = useState<boolean>(false);

    // Notify parent about validity
    useEffect(() => {
        onValidate?.(!errAmt && amount.trim() !== '');
    }, [amount, errAmt, onValidate]);

    const handleAmountChange = (val: string) => {
        setAmount(val);
        const n = parseFloat(val);
        setErrAmt(isNaN(n) || n <= 0);
    };

    const handleAssetChange = (val: string) => {
        onAssetChange(val);
        console.log('Asset changed to:', val);
        // amount remains unchanged; willReceive will update via calcReceive
    };

    const receivedValue = (() => {
        const n = parseFloat(amount);
        return !isNaN(n) ? calcReceive(n, asset).toFixed(6) : '';
    })();

    return (
        <div className="bg-white p-6 rounded-2xl shadow my-4">
            <h2 className="text-xl font-semibold mb-4">{t('receiving')}</h2>

            <SelectField
                label={t('asset')}
                options={assets}
                value={asset}
                onChange={handleAssetChange}
            />

            <InputField
                label={t('willSend')}
                type="number"
                value={amount}
                onChange={handleAmountChange}
                error={errAmt}
            />

            <CommissionSection asset={asset} amount={amount} />

            <InputField
                label={t('willReceiveMe')}
                type="number"
                value={receivedValue}
                onChange={() => { }}
                error={false}
                readOnly
            />
        </div>
    );
};
