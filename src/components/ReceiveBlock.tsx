// src/components/ReceiveBlock.tsx
import React, { useEffect, useMemo } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets, serviceComission, networkFee } from '../constants/constants';
import { useT } from '../i18n';

interface ReceiveBlockProps {
    /** Актив, который я отправляю */
    asset: string;
    /** Контролируемое значение «Будет отправлено мною» */
    sendAmount: string;
    onSendAmountChange: (val: string) => void;
    /** Контролируемое значение «Будет получено мною» */
    receiveAmount: string;
    onReceiveAmountChange: (val: string) => void;
    /** Смена актива в выпадающем списке */
    onAssetChange: (asset: string) => void;
    /** Сообщает родителю о валидности полей */
    onValidate?: (valid: boolean) => void;
}

export const ReceiveBlock: React.FC<ReceiveBlockProps> = ({
    asset,
    sendAmount,
    onSendAmountChange,
    receiveAmount,
    onReceiveAmountChange,
    onAssetChange,
    onValidate,
}) => {
    const t = useT();

    // Формулы пересчёта
    const calcReceiveMe = (n: number) =>
        asset === 'TON'
            ? n * serviceComission - networkFee
            : n * serviceComission;
    const calcSendBack = (r: number) =>
        asset === 'TON'
            ? (r + networkFee) / serviceComission
            : r / serviceComission;

    // Опции для селекта
    const assetOptions = useMemo(() => assets, []);

    // Валидация полей
    useEffect(() => {
        const valid =
            !isNaN(parseFloat(sendAmount)) &&
            !isNaN(parseFloat(receiveAmount)) &&
            sendAmount.trim() !== '' &&
            receiveAmount.trim() !== '';
        onValidate?.(valid);
    }, [sendAmount, receiveAmount, onValidate]);

    // При ручном вводе «Будет отправлено» пересчитываем «Будет получено мною»
    const handleSendChange = (val: string) => {
        onSendAmountChange(val);
        const n = parseFloat(val);
        if (!isNaN(n)) {
            onReceiveAmountChange(calcReceiveMe(n).toFixed(6));
        } else {
            onReceiveAmountChange('');
        }
    };

    // При ручном вводе «Будет получено мною» пересчитываем «Будет отправлено»
    const handleReceiveChange = (val: string) => {
        onReceiveAmountChange(val);
        const r = parseFloat(val);
        if (!isNaN(r)) {
            onSendAmountChange(calcSendBack(r).toFixed(6));
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow my-4">
            <h2 className="text-xl font-semibold mb-4">{t('I want to get')}</h2>

            <SelectField
                label={t('Asset')}
                options={assetOptions}
                value={asset}
                onChange={onAssetChange}
            />

            <InputField
                label={t('Sent')}
                type="number"
                value={sendAmount}
                onChange={handleSendChange}
            />

            <CommissionSection asset={asset} amount={sendAmount} />

            <InputField
                label={t('Received by me')}
                type="number"
                value={receiveAmount}
                onChange={handleReceiveChange}
            />
        </div>
    );
};
