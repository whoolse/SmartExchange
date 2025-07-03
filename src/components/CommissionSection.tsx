// src/components/CommissionSection.tsx
import React from 'react';
import { useT } from '../i18n';
import { CommissionLine } from './CommissionLine';

interface CommissionSectionProps {
    asset: string;
    amount: string;
}

export const CommissionSection: React.FC<CommissionSectionProps> = ({
    asset,
    amount,
}) => {
    const t = useT();
    const parsedAmount = parseFloat(amount);
    const serviceFee = !isNaN(parsedAmount) ? parsedAmount * 0.001 : 0;
    const networkFee = asset === 'TON' ? 0.105 : 0.07;
    const totalFee = networkFee + serviceFee;

    if (asset === 'TON') {
        return (
            <>
                <CommissionLine
                    label={t('networkFee')}
                    value={networkFee}
                    decimals={3}
                    suffix="TON"
                />
                <CommissionLine
                    label={t('serviceFee')}
                    value={serviceFee}
                    decimals={5}
                    suffix="TON"
                />
                <CommissionLine
                    label={t('totalFee')}
                    value={totalFee}
                    decimals={5}
                    suffix="TON"
                    bold
                />
            </>
        );
    }

    return (
        <>
            <CommissionLine
                label={t('commissionInAsset').replace('{{asset}}', asset)}
                value={serviceFee}
                decimals={5}
                suffix={asset}
            />
            <CommissionLine
                label={t('networkFee')}
                value={networkFee}
                decimals={3}
                suffix="TON"
            />
        </>
    );
};
