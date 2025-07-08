// src/components/ReceiveBlock.tsx
import React, { useState, useEffect } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets, tonApiBaseUrl, networkFee, serviceComission } from '../constants/constants';
import { useT } from '../i18n';

interface ReceiveBlockProps {
    asset: string;
    onAssetChange: (asset: string) => void;
    onAmountChange: (val: string) => void;
    onValidate?: (valid: boolean) => void;
}

export const ReceiveBlock: React.FC<ReceiveBlockProps> = ({
    asset,
    onAssetChange,
    onAmountChange,
    onValidate,
}) => {
    const t = useT();

    // Формулы расчёта по тому же принципу, что в SendBlock:
    // для TON: (n - 0.1%) - networkFee, иначе только (n - 0.1%)
    const calcReceive = (send: number) =>
        asset === 'TON'
            ? send * serviceComission - networkFee
            : send * serviceComission;
    const calcSend = (recv: number) =>
        asset === 'TON'
            ? (recv + networkFee) / serviceComission
            : recv / serviceComission;

    // стартовые значения
    const [sendVal, setSendVal] = useState<string>('10');
    const [recvVal, setRecvVal] = useState<string>(
        calcReceive(10).toFixed(6)
    );
    const [errSend, setErrSend] = useState<boolean>(false);
    const [errRecv, setErrRecv] = useState<boolean>(false);

    // при монтировании сообщаем родителю первоначальное количество
    useEffect(() => {
        onAmountChange(recvVal);
        onValidate?.(!errSend && !errRecv);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // при смене актива — пересчитываем из sendVal
    useEffect(() => {
        const s = parseFloat(sendVal);
        if (!isNaN(s)) {
            const r = calcReceive(s);
            setRecvVal(r.toFixed(6));
            setErrSend(s < 0);
            setErrRecv(r < 0);
            onAmountChange(r.toFixed(6));
        }
    }, [asset]);

    // валидация на изменения полей
    useEffect(() => {
        const valid =
            !errSend &&
            !errRecv &&
            sendVal.trim() !== '' &&
            recvVal.trim() !== '' &&
            !isNaN(parseFloat(sendVal)) &&
            !isNaN(parseFloat(recvVal));
        onValidate?.(valid);
    }, [sendVal, recvVal, errSend, errRecv, onValidate]);

    const handleSendChange = (val: string) => {
        setSendVal(val);
        const s = parseFloat(val);
        if (!isNaN(s) && s >= 0) {
            const r = calcReceive(s);
            setErrSend(false);
            setErrRecv(r < 0);
            setRecvVal(r.toFixed(6));
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
        const r = parseFloat(val);
        if (!isNaN(r) && r >= 0) {
            const s = calcSend(r);
            setErrRecv(false);
            setErrSend(s < 0);
            setSendVal(s.toFixed(6));
            onAmountChange(val);
        } else {
            setErrRecv(true);
            setErrSend(true);
            setSendVal('');
            onAmountChange('');
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
