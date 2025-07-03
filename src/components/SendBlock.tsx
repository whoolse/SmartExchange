// src/components/SendBlock.tsx
import React, { useState } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CreateDealButton } from './CreateDealButton';
import { CommissionSection } from './CommissionSection';
import { assets } from '../constants/assets';
import { useT } from '../i18n';

interface SendBlockProps {
    asset: string;
    onAssetChange: (asset: string) => void;
}

export const SendBlock: React.FC<SendBlockProps> = ({ asset, onAssetChange }) => {
    const t = useT();
    const calculateReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;

    // По умолчанию отправляемое значение = 1000
    const [amount, setAmount] = useState<string>('1000');
    // И сразу рассчитываем «Будет получено партнером»
    const [willReceive, setWillReceive] = useState<string>(
        calculateReceive(1000, asset).toFixed(6)
    );
    const [partnerAddress, setPartnerAddress] = useState<string>('');

    const handleAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        setWillReceive(isNaN(a) ? '' : calculateReceive(a, asset).toFixed(6));
    };

    const handleWillReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        if (!isNaN(w)) {
            const orig =
                asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;
            setAmount(orig.toFixed(6));
        }
    };

    const handleAssetChange = (val: string) => {
        onAssetChange(val);
        const a = parseFloat(amount);
        setWillReceive(isNaN(a) ? '' : calculateReceive(a, val).toFixed(6));
    };

    return (
        <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">{t('sending')}</h2>

            <InputField
                label={t('willSend')}
                type="number"
                value={amount}
                onChange={handleAmountChange}
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
            />

            <InputField
                label={t('partnerAddress')}
                value={partnerAddress}
                onChange={setPartnerAddress}
            />

            <CommissionSection asset={asset} amount={amount} />

            <CreateDealButton
                willSend={amount}
                partnerAddress={partnerAddress}
                onResult={res => console.log('Result:', res)}
            />
        </div>
    );
};
