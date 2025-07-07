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
    /** Сумма, рассчитанная в блоке «Получаю» */
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

    // Максимальный баланс
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

    // Доступные активы
    const availableAssets = useMemo(() => {
        const filtered = assets.filter(a => userJettons.includes(a));
        return ['TON', ...filtered.filter(a => a !== 'TON')];
    }, [userJettons]);

    // Формулы
    const calcReceive = (a: number) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;
    const calcAmount = (w: number) =>
        asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;

    // Локальные стэйты для блока «Отправляю»
    const [amount, setAmount] = useState<string>('1000');
    const [willReceive, setWillReceive] = useState<string>(
        calcReceive(1000).toFixed(6)
    );
    const [errAmt, setErrAmt] = useState<boolean>(false);
    const [errRec, setErrRec] = useState<boolean>(false);

    // При изменении amount пересчитываем willReceive
    const onAmountChange = (val: string) => {
        setAmount(val);
        const num = parseFloat(val);
        const invalid = isNaN(num) || num <= 0 || num > maxBalance;
        setErrAmt(invalid);
        if (!invalid) {
            setWillReceive(calcReceive(num).toFixed(6));
            setErrRec(false);
        } else {
            setWillReceive('');
        }
    };

    // При ручном изменении «Будет получено партнером»
    const onReceiveChange = (val: string) => {
        setWillReceive(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setErrRec(false);
            const back = calcAmount(num);
            setAmount(back.toFixed(6));
            setErrAmt(isNaN(back) || back <= 0 || back > maxBalance);
        } else {
            setErrRec(true);
        }
    };

    // При смене актива
    const onAssetSelect = (val: string) => {
        onAssetChange(val);
        const num = parseFloat(amount);
        if (!isNaN(num)) {
            setErrAmt(num <= 0 || num > maxBalance);
            setWillReceive(calcReceive(num).toFixed(6));
        }
    };

    // «Max» кнопка
    const fillMax = () => {
        const num = maxBalance;
        setAmount(num.toString());
        setErrAmt(false);
        setErrRec(false);
        setWillReceive(calcReceive(num).toFixed(6));
    };

    // При смене asset или maxBalance
    useEffect(() => {
        const num = parseFloat(amount);
        if (!isNaN(num)) {
            setErrAmt(num <= 0 || num > maxBalance);
            setWillReceive(calcReceive(num).toFixed(6));
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
                /** expectedAmount теперь берётся из блока ReceiveBlock */
                receiveAmount={receiveAmount}
                partnerAddress=""
                disabled={isDisabled}
            />
        </div>
    );
};
