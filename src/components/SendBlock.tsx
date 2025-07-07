// src/components/SendBlock.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { Address, fromNano } from '@ton/core';
import { TonApiClient, type JettonsBalances } from '@ton-api/client';
import { useBalance } from '../contexts/BalanceContext';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { CreateDealButton } from './CreateDealButton';
import { assets, tonApiBaseUrl } from '../constants/constants';
import { useT } from '../i18n';

interface SendBlockProps {
    asset: string;
    receiveAsset: string;
    onAssetChange: (asset: string) => void;
    disableCreate?: boolean;
    userJettons: string[];
    jettonBalances: JettonsBalances['balances'];
}

export const SendBlock: React.FC<SendBlockProps> = ({
    asset,
    receiveAsset,
    onAssetChange,
    disableCreate = false,
    userJettons,
    jettonBalances,
}) => {
    const t = useT();
    const address = useTonAddress();
    const { balance: tonBalance } = useBalance();

    const client = useMemo(
        () => new TonApiClient({ baseUrl: tonApiBaseUrl }),
        []
    );

    // Compute max balance for selected asset
    const maxBalance = useMemo(() => {
        if (asset === 'TON') {
            const mb = parseFloat(tonBalance);
            return isNaN(mb) ? 0 : mb;
        }
        const jb = jettonBalances.find(j => j.jetton.symbol === asset);
        if (!jb) return 0;
        const raw = jb.balance.toString();
        const d = jb.jetton.decimals;
        const intPart = raw.length > d ? raw.slice(0, -d) : '0';
        const fracPart = (raw.length > d ? raw.slice(-d) : raw)
            .padStart(d, '0')
            .replace(/0+$/, '');
        const display = fracPart ? `${intPart}.${fracPart}` : intPart;
        const mb = parseFloat(display);
        return isNaN(mb) ? 0 : mb;
    }, [asset, tonBalance, jettonBalances]);

    // Available assets: TON always + intersection
    const availableAssets = useMemo(() => {
        const filtered = assets.filter(a => userJettons.includes(a));
        return ['TON', ...filtered.filter(a => a !== 'TON')];
    }, [userJettons]);

    // Calculation formulas
    const calcReceive = (a: number) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;

    // Local state
    const [amount, setAmount] = useState<string>('1000');
    const [willReceive, setWillReceive] = useState<string>(
        calcReceive(1000).toFixed(6)
    );
    const [errAmt, setErrAmt] = useState<boolean>(false);
    const [errRec, setErrRec] = useState<boolean>(false);

    // Validate on amount change
    const onAmountChange = (val: string) => {
        setAmount(val);
        const num = parseFloat(val);
        const invalid = isNaN(num) || num <= 0 || num > maxBalance;
        setErrAmt(invalid);
        setErrRec(false);
        if (!invalid) {
            setWillReceive(calcReceive(num).toFixed(6));
        } else {
            setWillReceive('');
        }
    };

    // Validate on manual willReceive change
    const onReceiveChange = (val: string) => {
        setWillReceive(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setErrRec(false);
            // back-calculate: amount = (receive + fee)/0.999 for TON else receive/0.999
            const back = asset === 'TON' ? (num + 0.105) / 0.999 : num / 0.999;
            setAmount(back.toFixed(6));
            setErrAmt(back <= 0 || back > maxBalance);
        } else {
            setErrRec(true);
        }
    };

    // On asset switch, recalc and clear errors
    const onAssetSelect = (val: string) => {
        onAssetChange(val);
        const num = parseFloat(amount);
        if (!isNaN(num)) {
            setErrAmt(num <= 0 || num > maxBalance);
            setWillReceive(calcReceive(num).toFixed(6));
        }
    };

    // Fill max
    const fillMax = () => {
        const num = maxBalance;
        setAmount(num.toString());
        setErrAmt(false);
        setErrRec(false);
        setWillReceive(calcReceive(num).toFixed(6));
    };

    const isDisabled = disableCreate || errAmt || errRec;

    // Recalculate on asset change
    useEffect(() => {
        const num = parseFloat(amount);
        if (!isNaN(num)) {
            setErrAmt(num <= 0 || num > maxBalance);
            setWillReceive(calcReceive(num).toFixed(6));
        }
    }, [asset, maxBalance]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow my-4">
            <h2 className="text-xl font-semibold mb-4">{t('sending')}</h2>

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

            <CreateDealButton
                sendAsset={asset}
                sendAmount={amount}
                receiveAsset={receiveAsset}
                receiveAmount={willReceive}
                partnerAddress={''}
                disabled={isDisabled}
            />
        </div>
    );
};
