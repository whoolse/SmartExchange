// src/components/SendBlock.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
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
    receiveAmount: string;
    onAssetChange: (asset: string) => void;
    disableCreate?: boolean;
    userJettons: string[];
    jettonBalances: JettonsBalances['balances'];
}

export const SendBlock: React.FC<SendBlockProps> = ({
    asset,
    receiveAsset,
    receiveAmount,
    onAssetChange,
    disableCreate = false,
    userJettons,
    jettonBalances,
}) => {
    const t = useT();
    const { balance: tonBalance } = useBalance();
    const client = useMemo(
        () => new TonApiClient({ baseUrl: tonApiBaseUrl }),
        []
    );

    // максимальный баланс выбранного актива
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
        return parseFloat(fracPart ? `${intPart}.${fracPart}` : intPart) || 0;
    }, [asset, tonBalance, jettonBalances]);

    // доступные активы для отправки: TON всегда + пересечение с userJettons
    const availableAssets = useMemo(() => {
        const filtered = assets.filter(a => userJettons.includes(a));
        return ['TON', ...filtered.filter(a => a !== 'TON')];
    }, [userJettons]);

    // расчёт «Будет получено партнёром» и обратный
    const calcReceive = (n: number) =>
        asset === 'TON' ? n * 0.999 - 0.105 : n * 0.999;
    const calcSend = (r: number) =>
        asset === 'TON' ? (r + 0.105) / 0.999 : r / 0.999;

    const [amount, setAmount] = useState<string>('1000');
    const [willReceive, setWillReceive] = useState<string>(
        calcReceive(1000).toFixed(6)
    );
    const [errAmt, setErrAmt] = useState<boolean>(false);
    const [errRec, setErrRec] = useState<boolean>(false);

    // при изменении «Будет отправлено»
    const onAmountChange = (val: string) => {
        setAmount(val);
        const n = parseFloat(val);
        const invalid = isNaN(n) || n <= 0 || n > maxBalance;
        setErrAmt(invalid);
        if (!invalid) {
            setWillReceive(calcReceive(n).toFixed(6));
            setErrRec(false);
        } else {
            setWillReceive('');
        }
    };

    // при ручном изменении «Будет получено партнёром»
    const onReceiveChange = (val: string) => {
        setWillReceive(val);
        const r = parseFloat(val);
        if (!isNaN(r)) {
            setErrRec(false);
            const back = calcSend(r);
            setAmount(back.toFixed(6));
            setErrAmt(isNaN(back) || back <= 0 || back > maxBalance);
        } else {
            setErrRec(true);
        }
    };

    // смена актива
    const onAssetSelect = (val: string) => {
        onAssetChange(val);
        const n = parseFloat(amount);
        if (!isNaN(n)) {
            setErrAmt(n <= 0 || n > maxBalance);
            setWillReceive(calcReceive(n).toFixed(6));
        }
    };

    // «max» кнопка
    const fillMax = () => {
        const n = maxBalance;
        setAmount(n.toString());
        setErrAmt(false);
        setErrRec(false);
        setWillReceive(calcReceive(n).toFixed(6));
    };

    // при изменении asset или maxBalance пересчитываем
    useEffect(() => {
        const n = parseFloat(amount);
        if (!isNaN(n)) {
            setErrAmt(n <= 0 || n > maxBalance);
            setWillReceive(calcReceive(n).toFixed(6));
        }
    }, [asset, maxBalance]);

    const isDisabled = disableCreate || errAmt || errRec;

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
                receiveAmount={receiveAmount}
                partnerAddress=""
                disabled={isDisabled}
            />
        </div>
    );
};
