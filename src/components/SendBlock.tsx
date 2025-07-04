// src/components/SendBlock.tsx
import React, { useState } from 'react';
import { Address } from '@ton/core';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { CreateDealButton } from './CreateDealButton';
import { assets } from '../constants/assets';
import { useT } from '../i18n';

interface SendBlockProps {
    asset: string;
    onAssetChange: (asset: string) => void;
    disableCreate?: boolean;
}

export const SendBlock: React.FC<SendBlockProps> = ({
    asset,
    onAssetChange,
    disableCreate = false,
}) => {
    const t = useT();

    // Прямой расчёт (отправляю -> получит партнер)
    const calculateReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;
    // Обратный расчёт (получит партнер -> отправляю)
    const calculateAmount = (w: number, asset: string) =>
        asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;

    const [amount, setAmount] = useState<string>('1000');
    const [willReceive, setWillReceive] = useState<string>(
        calculateReceive(1000, asset).toFixed(6)
    );
    const [partnerAddress, setPartnerAddress] = useState<string>('');
    const [errorAmount, setErrorAmount] = useState<boolean>(false);
    const [errorWillReceive, setErrorWillReceive] = useState<boolean>(false);
    const [errorPartner, setErrorPartner] = useState<boolean>(true);

    const handleAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        if (!isNaN(a)) {
            const willGet = calculateReceive(a, asset);
            setWillReceive(willGet.toFixed(6));
            setErrorAmount(false);
            setErrorWillReceive(false);
        } else {
            setWillReceive('');
            setErrorAmount(true);
        }
    };

    // Теперь можно редактировать поле "Будет получено партнером"
    const handleWillReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        if (!isNaN(w)) {
            const send = calculateAmount(w, asset);
            setAmount(send.toFixed(6));
            setErrorWillReceive(false);
            setErrorAmount(false);
        } else {
            setAmount('');
            setErrorWillReceive(true);
        }
    };

    const handlePartnerChange = (val: string) => {
        setPartnerAddress(val);
        setErrorPartner(val.trim() === '');
    };

    const handleAssetChange = (val: string) => {
        onAssetChange(val);
        const a = parseFloat(amount);
        if (!isNaN(a)) {
            setWillReceive(calculateReceive(a, val).toFixed(6));
        }
    };

    const isDisabled = disableCreate || errorAmount || errorWillReceive || errorPartner;

    return (
        <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">
                {t('sending')}
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
                label={t('willReceivePartner')}
                type="number"
                value={willReceive}
                onChange={handleWillReceiveChange}
                error={errorWillReceive}
            />

            <InputField
                label={t('partnerAddress')}
                value={partnerAddress}
                onChange={handlePartnerChange}
                error={errorPartner}
            />

            <CommissionSection asset={asset} amount={amount} />

            <CreateDealButton
                willSend={amount}
                partnerAddress={partnerAddress}
                disabled={isDisabled}
                onResult={res => console.log('Result:', res)}
            />
        </div>
    );
};
