// src/components/SendBlock.tsx
import React, { useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { fromNano } from '@ton/core';
import { type JettonsBalances } from '@ton-api/client';
import { useBalance } from '../contexts/BalanceContext';
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
    userJettons: string[];
    /** Переданные из JettonsList балансы джеттонов */
    jettonBalances: JettonsBalances['balances'];
}

export const SendBlock: React.FC<SendBlockProps> = ({
    asset,
    onAssetChange,
    disableCreate = false,
    userJettons,
    jettonBalances,
}) => {
    const t = useT();
    const { balance: tonBalance } = useBalance();

    // Доступные активы: TON + пересечение глобального списка и userJettons
    const availableAssets = React.useMemo(() => {
        const filtered = assets.filter(a => userJettons.includes(a));
        return ['TON', ...filtered.filter(a => a !== 'TON')];
    }, [userJettons]);

    const calcReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;
    const calcAmount = (w: number, asset: string) =>
        asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;

    const [amount, setAmount] = useState('1000');
    const [willReceive, setWillReceive] = useState(
        calcReceive(1000, asset).toFixed(6)
    );
    const [partnerAddress, setPartnerAddress] = useState('');
    const [errAmt, setErrAmt] = useState(false);
    const [errRec, setErrRec] = useState(false);
    const [errPar, setErrPar] = useState(true);

    const onAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        if (!isNaN(a)) {
            setWillReceive(calcReceive(a, asset).toFixed(6));
            setErrAmt(false);
            setErrRec(false);
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
            setErrAmt(false);
        } else {
            setAmount('');
            setErrRec(true);
        }
    };

    const onPartnerChange = (val: string) => {
        setPartnerAddress(val);
        setErrPar(val.trim() === '');
    };

    const onAssetSelect = (val: string) => {
        onAssetChange(val);
        const a = parseFloat(amount);
        if (!isNaN(a)) {
            setWillReceive(calcReceive(a, val).toFixed(6));
        }
    };

    const fillMax = () => {
        if (asset === 'TON') {
            setAmount(tonBalance);
            const a = parseFloat(tonBalance);
            if (!isNaN(a)) setWillReceive(calcReceive(a, asset).toFixed(6));
        } else {
            const jb = jettonBalances.find(j => j.jetton.symbol === asset);
            if (jb) {
                const raw = jb.balance.toString();
                // Конвертация баланса джеттона, учитывая decimals
                const intPart = raw.slice(0, -jb.jetton.decimals) || '0';
                const fracPart = raw
                    .slice(-jb.jetton.decimals)
                    .padStart(jb.jetton.decimals, '0')
                    .replace(/0+$/, '');
                const display = fracPart ? `${intPart}.${fracPart}` : intPart;
                setAmount(display);
                const m = parseFloat(display);
                if (!isNaN(m)) setWillReceive(calcReceive(m, asset).toFixed(6));
            }
        }
    };

    const isDisabled = disableCreate || errAmt || errRec || errPar;

    return (
        <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">{t('sending')}</h2>

            <SelectField
                label={t('asset')}
                options={availableAssets}
                value={asset}
                onChange={onAssetSelect}
            />

            <div className="mb-4">
                <InputField
                    label={t('willSend')}
                    type="number"
                    value={amount}
                    onChange={onAmountChange}
                    error={errAmt}
                />
                <button
                    type="button"
                    onClick={fillMax}
                    className="mt-2 text-sm text-indigo-600 hover:underline"
                >
                    {t('max')}
                </button>
            </div>

            <CommissionSection asset={asset} amount={amount} />

            <div className="mt-4">
                <InputField
                    label={t('willReceivePartner')}
                    type="number"
                    value={willReceive}
                    onChange={onReceiveChange}
                    error={errRec}
                />
            </div>

            <InputField
                label={t('partnerAddress')}
                value={partnerAddress}
                onChange={onPartnerChange}
                error={errPar}
            />

            <CreateDealButton
                willSend={amount}
                partnerAddress={partnerAddress}
                disabled={isDisabled}
            />
        </div>
    );
};
