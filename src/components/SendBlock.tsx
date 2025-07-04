// src/components/SendBlock.tsx
import React, { useState } from 'react';
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

    const calculateReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;

    const [amount, setAmount] = useState<string>('1000');
    const [willReceive, setWillReceive] = useState<string>(
        calculateReceive(1000, asset).toFixed(6)
    );
    const [partnerAddress, setPartnerAddress] = useState<string>('');
    const [errorAmount, setErrorAmount] = useState<boolean>(false);
    const [errorPartner, setErrorPartner] = useState<boolean>(true);

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

    const handlePartnerChange = (val: string) => {
        setPartnerAddress(val);
        // Если есть любой непустой ввод — считаем валидным
        setErrorPartner(val.trim() === '');
    };

    const handleAssetChange = (val: string) => {
        onAssetChange(val);
        const a = parseFloat(amount);
        if (!isNaN(a)) {
            setWillReceive(calculateReceive(a, val).toFixed(6));
        }
    };

    const isDisabled = disableCreate || errorAmount || errorPartner;

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
                onChange={() => { }}
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
