// src/components/ReceiveBlock.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { assets } from '../constants/constants';
import { useT } from '../i18n';
import { calcPartner, calcBack } from "../utils/utils"

interface ReceiveBlockProps {
    asset: string;
    sendAmount: string;
    onSendAmountChange: (val: string) => void;
    receiveAmount: string;
    onReceiveAmountChange: (val: string) => void;
    onAssetChange: (asset: string) => void;
    onValidate?: (valid: boolean) => void;
    disabled?: boolean;
}

export const ReceiveBlock: React.FC<ReceiveBlockProps> = ({
    asset,
    sendAmount,
    onSendAmountChange,
    receiveAmount,
    onReceiveAmountChange,
    onAssetChange,
    onValidate,
    disabled = false
}) => {
    const t = useT();
    const lastChange = useRef<'send' | 'receive' | ''>('');
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

    // Пересчёт «будет получено мною» при изменении sendAmount, если это было не ручное изменение receiveAmount
    useEffect(() => {
        if (lastChange.current !== 'receive') {
            const n = parseFloat(sendAmount);
            if (!isNaN(n)) {
                onReceiveAmountChange(calcPartner(n, asset).toFixed(6));
            } else {
                onReceiveAmountChange('');
            }
        }
        lastChange.current = '';
    }, [sendAmount, asset, onReceiveAmountChange]);

    // Обработчики ручного ввода
    const handleSendChange = (val: string) => {
        lastChange.current = 'send';
        onSendAmountChange(val);
    };
    const handleReceiveChange = (val: string) => {
        lastChange.current = 'receive';
        onReceiveAmountChange(val);
        const r = parseFloat(val);
        if (!isNaN(r)) {
            onSendAmountChange(calcBack(r, asset).toFixed(6));
        }
    };

    return (
        <div className="asset-block">
            <h2 className="block-title">{t('receiving')}</h2>
            <div className="asset-selector">
                <div className="asset-row">
                    <SelectField
                        label={t('asset')}
                        options={assetOptions}
                        value={asset}
                        onChange={onAssetChange}
                        disabled={disabled}
                    />

                    <InputField
                        label={t('willSend')}
                        type="number"
                        value={sendAmount}
                        onChange={handleSendChange}
                        disabled={disabled}
                    />
                </div>
                <div className="second-row">
                    <div className="wallet-balance">
                        {"-"}
                    </div>
                    <InputField
                        label={t('IWillGet')}
                        type="number"
                        value={receiveAmount}
                        onChange={handleReceiveChange}
                        disabled={disabled}
                    />
                </div>
            </div>
            <CommissionSection asset={asset} amount={sendAmount} />
        </div>
    );
};
