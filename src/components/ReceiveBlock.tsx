// src/components/ReceiveBlock.tsx
import React, { useState, useEffect } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets, serviceComission, networkFee } from '../constants/constants';
import { useT } from '../i18n';

interface ReceiveBlockProps {
    asset: string;
    /** Начальное значение «Будет отправлено» */
    initialSendAmount?: string;
    onAssetChange: (asset: string) => void;
    /** Вызывается при изменении «Будет получено мною» */
    onAmountChange: (val: string) => void;
    /** Сообщает родителю о валидности */
    onValidate?: (valid: boolean) => void;
}

export const ReceiveBlock: React.FC<ReceiveBlockProps> = ({
    asset,
    initialSendAmount = '10',
    onAssetChange,
    onAmountChange,
    onValidate,
}) => {
    const t = useT();

    // Формулы расчёта
    const calcReceive = (send: number) =>
        asset === 'TON'
            ? send * serviceComission - networkFee
            : send * serviceComission;
    const calcSend = (recv: number) =>
        asset === 'TON'
            ? (recv + networkFee) / serviceComission
            : recv / serviceComission;

    // Локальное состояние полей
    const [sendVal, setSendVal] = useState<string>(initialSendAmount);
    const [recvVal, setRecvVal] = useState<string>(
        calcReceive(parseFloat(initialSendAmount)).toFixed(6)
    );
    const [errSend, setErrSend] = useState<boolean>(false);
    const [errRecv, setErrRecv] = useState<boolean>(false);

    // При монтировании отправляем начальное значение родителю и валидируем
    useEffect(() => {
        onAmountChange(recvVal);
        onValidate?.(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Обработчик изменения «Будет отправлено»
    const handleSendChange = (val: string) => {
        setSendVal(val);
        const s = parseFloat(val);
        if (!isNaN(s) && s >= 0) {
            const r = calcReceive(s);
            const rStr = r.toFixed(6);
            setErrSend(false);
            setErrRecv(r < 0);
            setRecvVal(rStr);
            onAmountChange(rStr);
            onValidate?.(!false && !(r < 0));
        } else {
            setErrSend(true);
            setErrRecv(true);
            setRecvVal('');
            onAmountChange('');
            onValidate?.(false);
        }
    };

    // Обработчик изменения «Будет получено мною»
    const handleReceiveChange = (val: string) => {
        setRecvVal(val);
        const r = parseFloat(val);
        if (!isNaN(r) && r >= 0) {
            const s = calcSend(r);
            const sStr = s.toFixed(6);
            setErrRecv(false);
            setErrSend(s < 0);
            setSendVal(sStr);
            onAmountChange(val);
            onValidate?.(!(s < 0) && !false);
        } else {
            setErrRecv(true);
            setErrSend(true);
            setSendVal('');
            onAmountChange('');
            onValidate?.(false);
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
