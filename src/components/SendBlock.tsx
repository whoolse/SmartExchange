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
import { assets } from '../constants/assets';
import { useT } from '../i18n';

interface SendBlockProps {
    /** Актив, который отправляем */
    asset: string;
    /** Обработчик изменения актива */
    onAssetChange: (asset: string) => void;
    /** Заблокировать кнопку */
    disableCreate?: boolean;
    /** Символы джеттонов пользователя */
    userJettons: string[];
    /** Балансы джеттонов пользователя */
    jettonBalances: JettonsBalances['balances'];
    /** Актив, который получаем */
    receiveAsset: string;
}

export const SendBlock: React.FC<SendBlockProps> = ({
    asset,
    onAssetChange,
    disableCreate = false,
    userJettons,
    jettonBalances,
    receiveAsset,
}) => {
    const t = useT();
    const address = useTonAddress();
    const { balance: tonBalance } = useBalance();

    const client = useMemo(
        () => new TonApiClient({ baseUrl: 'https://tonapi.io' }),
        []
    );

    // Доступные активы: TON + пересечение глобального списка и userJettons
    const availableAssets = useMemo(() => {
        const filtered = assets.filter(a => userJettons.includes(a));
        return ['TON', ...filtered.filter(a => a !== 'TON')];
    }, [userJettons]);

    // Формулы расчёта
    const calcReceive = (a: number, asset: string) =>
        asset === 'TON' ? a * 0.999 - 0.105 : a * 0.999;
    const calcAmount = (w: number, asset: string) =>
        asset === 'TON' ? (w + 0.105) / 0.999 : w / 0.999;

    // Состояния полей
    const [amount, setAmount] = useState<string>('1000');
    const [willReceive, setWillReceive] = useState<string>(
        calcReceive(1000, asset).toFixed(6)
    );
    const [partnerAddress, setPartnerAddress] = useState<string>('');
    const [errAmt, setErrAmt] = useState<boolean>(false);
    const [errRec, setErrRec] = useState<boolean>(false);
    const [errPar, setErrPar] = useState<boolean>(true);

    // Максимальный баланс для выбранного актива
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
        const fracPart = (raw.length > d ? raw.slice(-d) : raw).padStart(d, '0').replace(/0+$/, '');
        const display = fracPart ? `${intPart}.${fracPart}` : intPart;
        const mb = parseFloat(display);
        return isNaN(mb) ? 0 : mb;
    }, [asset, tonBalance, jettonBalances]);

    // Обработчики
    const onAmountChange = (val: string) => {
        setAmount(val);
        const a = parseFloat(val);
        if (!isNaN(a)) {
            setErrAmt(a > maxBalance);
            setErrRec(false);
            setWillReceive(calcReceive(a, asset).toFixed(6));
        } else {
            setErrAmt(true);
            setWillReceive('');
        }
    };

    const onReceiveChange = (val: string) => {
        setWillReceive(val);
        const w = parseFloat(val);
        if (!isNaN(w)) {
            setErrRec(false);
            setErrAmt(false);
            setAmount(calcAmount(w, asset).toFixed(6));
        } else {
            setErrRec(true);
            setAmount('');
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
            setErrAmt(a > maxBalance);
            setWillReceive(calcReceive(a, val).toFixed(6));
        }
    };

    const fillMax = () => {
        const a = maxBalance;
        setAmount(a.toString());
        setErrAmt(false);
        setErrRec(false);
        setWillReceive(calcReceive(a, asset).toFixed(6));
    };

    const isDisabled = disableCreate || errAmt || errRec || errPar;

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

            <InputField
                label={t('partnerAddress')}
                value={partnerAddress}
                onChange={onPartnerChange}
                error={errPar}
            />

            <CreateDealButton
                sendAsset={asset}
                sendAmount={amount}
                receiveAsset={receiveAsset}
                receiveAmount={willReceive}
                partnerAddress={partnerAddress}
                disabled={isDisabled}
            />
        </div>
    );
};
