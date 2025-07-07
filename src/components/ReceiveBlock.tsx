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

    const calcReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;
    const calcAmount = (w: number, asset: string) =>
        asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;

    const [amount, setAmount] = useState('1000');
    const [willReceive, setWillReceive] = useState(
        calcReceive(1000, asset).toFixed(6)
    );
    const [errAmt, setErrAmt] = useState(false);
    const [errRec, setErrRec] = useState(false);

    useEffect(() => {
        onValidate?.(!!amount && !!willReceive && !errAmt && !errRec);
    }, [amount, willReceive, errAmt, errRec, onValidate]);

    const onAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        if (!isNaN(a)) {
            setWillReceive(calcReceive(a, asset).toFixed(6));
            setErrAmt(false);
        } else {
            setWillReceive('');
            setErrAmt(true);
        }
    };

    const onReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        if (!isNaN(w)) {
            setAmount(calcAmount(w, asset).toFixed(6));
            setErrRec(false);
        } else {
            setAmount('');
            setErrRec(true);
        }
    };

    const onAssetSelect = (val: string) => {
        onAssetChange(val);
        const a = parseFloat(amount);
        if (!isNaN(a)) {
            setWillReceive(calcReceive(a, val).toFixed(6));
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow my-4">
            <h2 className="text-xl font-semibold mb-4">{t('receiving')}</h2>

            <SelectField
                label={t('asset')}
                options={assets}
                value={asset}
                onChange={onAssetSelect}
            />

            <InputField
                label={t('willSend')}
                type="number"
                value={amount}
                onChange={onAmountChange}
                error={errAmt}
            />

            <CommissionSection asset={asset} amount={amount} />

            <InputField
                label={t('willReceiveMe')}
                type="number"
                value={willReceive}
                onChange={onReceiveChange}
                error={errRec}
            />
        </div>
    );
};
