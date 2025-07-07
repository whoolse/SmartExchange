// src/components/ReceiveBlock.tsx
import React, { useState, useEffect } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets } from '../constants/constants';
import { useT } from '../i18n';

interface ReceiveBlockProps {
    asset: string;
    /** Текущее значение «Будет получено мною» из родителя */
    amount: string;
    /** Коллбэк при изменении «Будет получено мною» */
    onAmountChange: (val: string) => void;
    onAssetChange: (asset: string) => void;
    onValidate?: (valid: boolean) => void;
}

export const ReceiveBlock: React.FC<ReceiveBlockProps> = ({
    asset,
    amount,
    onAmountChange,
    onAssetChange,
    onValidate,
}) => {
    const t = useT();

    const serviceFactor = 0.999;                    // 1 - 0.001
    const networkFee = asset === 'TON' ? 0.105 : 0.07;

    // send→receive и receive→send
    const calcReceive = (send: number) =>
        asset === 'TON' ? send * serviceFactor - networkFee : send * serviceFactor;
    const calcSend = (recv: number) =>
        asset === 'TON' ? (recv + networkFee) / serviceFactor : recv / serviceFactor;

    // Локальное состояние полей
    const [recvVal, setRecvVal] = useState<string>(amount);
    const [sendVal, setSendVal] = useState<string>(() => {
        const n = parseFloat(amount);
        return !isNaN(n) ? calcSend(n).toFixed(6) : '';
    });
    const [errRecv, setErrRecv] = useState<boolean>(false);
    const [errSend, setErrSend] = useState<boolean>(false);

    // Инициализация при смене asset (только один раз на asset)
    useEffect(() => {
        const n = parseFloat(amount);
        if (!isNaN(n)) {
            setRecvVal(amount);
            setErrRecv(false);
            const s = calcSend(n);
            setSendVal(s.toFixed(6));
            setErrSend(false);
        } else {
            setRecvVal('');
            setSendVal('');
            setErrRecv(true);
            setErrSend(true);
        }
    }, [asset]);

    // Валидация блока
    useEffect(() => {
        const valid =
            !errRecv &&
            !errSend &&
            recvVal.trim() !== '' &&
            !isNaN(parseFloat(recvVal));
        onValidate?.(valid);
    }, [recvVal, errRecv, errSend, onValidate]);

    const handleSendChange = (val: string) => {
        setSendVal(val);
        const n = parseFloat(val);
        if (!isNaN(n) && n >= 0) {
            setErrSend(false);
            const r = calcReceive(n);
            setRecvVal(r.toFixed(6));
            setErrRecv(false);
            onAmountChange(r.toFixed(6));
        } else {
            setErrSend(true);
            setErrRecv(true);
            setRecvVal('');
            onAmountChange('');
        }
    };

    const handleReceiveChange = (val: string) => {
        setRecvVal(val);
        const n = parseFloat(val);
        if (!isNaN(n) && n >= 0) {
            setErrRecv(false);
            const s = calcSend(n);
            setSendVal(s.toFixed(6));
            setErrSend(false);
            onAmountChange(val);
        } else {
            setErrRecv(true);
            setErrSend(true);
            setSendVal('');
            onAmountChange(val);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow my-4">
            <h2 className="text-xl font-semibold mb-4">{t('receiving')}</h2>

            <SelectField
                label={t('asset')}
                options={assets}
                value={asset}
                onChange={onAssetChange}
            />

            <InputField
                label={t('willSend')}
                type="number"
                value={sendVal}
                onChange={handleSendChange}
                error={errSend}
            />

            <CommissionSection asset={asset} amount={sendVal} />

            <InputField
                label={t('willReceiveMe')}
                type="number"
                value={recvVal}
                onChange={handleReceiveChange}
                error={errRecv}
            />
        </div>
    );
};
