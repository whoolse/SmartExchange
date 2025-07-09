// src/components/SendBlock.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { TonApiClient } from '@ton-api/client';
import { useBalance } from '../contexts/BalanceContext';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { CreateDealButton } from './CreateDealButton';
import { assets, serviceComission, networkFee } from '../constants/constants';
import { useT } from '../i18n';

interface SendBlockProps {
    asset: string;
    sendAmount: string;
    onSendAmountChange: (val: string) => void;
    partnerReceive: string;
    onPartnerReceiveChange: (val: string) => void;
    receiveAsset: string;
    onAssetChange: (asset: string) => void;
    disableCreate?: boolean;
    userJettons: string[];
    jettonBalances: any[];
}

export const SendBlock: React.FC<SendBlockProps> = ({
    asset,
    sendAmount,
    onSendAmountChange,
    partnerReceive,
    onPartnerReceiveChange,
    receiveAsset,
    onAssetChange,
    disableCreate = false,
    userJettons,
    jettonBalances,
}) => {
    const t = useT();
    useMemo(() => new TonApiClient({ baseUrl: '' }), []);
    const { balance: tonBalance } = useBalance();
    const lastChange = useRef<'send' | 'receive' | ''>('');

    // Доступные активы
    const assetOptions = useMemo(() => {
        const filtered = assets.filter(a => userJettons.includes(a));
        const list = ['TON', ...filtered.filter(a => a !== 'TON')];
        if (!list.includes(asset)) list.push(asset);
        return list;
    }, [userJettons, asset]);

    // Максимальный баланс
    const maxBalance = useMemo(() => {
        if (asset === 'TON') {
            const n = parseFloat(tonBalance);
            return isNaN(n) ? 0 : n;
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

    const calcPartner = (n: number) =>
        asset === 'TON' ? n * serviceComission - networkFee : n * serviceComission;
    const calcBack = (r: number) =>
        asset === 'TON'
            ? (r + networkFee) / serviceComission
            : r / serviceComission;

    // Пересчёт partnerReceive только если последний change был не 'receive'
    useEffect(() => {
        if (lastChange.current !== 'receive') {
            const n = parseFloat(sendAmount);
            if (!isNaN(n)) {
                onPartnerReceiveChange(calcPartner(n).toFixed(6));
            } else {
                onPartnerReceiveChange('');
            }
        }
        lastChange.current = '';
    }, [sendAmount, asset, onPartnerReceiveChange]);

    const errSend = (() => {
        const n = parseFloat(sendAmount);
        return isNaN(n) || n < 0 || n > maxBalance;
    })();
    const errRecv = (() => {
        const r = parseFloat(partnerReceive);
        return isNaN(r) || r < 0;
    })();

    const handleSendChange = (val: string) => {
        lastChange.current = 'send';
        onSendAmountChange(val);
    };

    const handleReceiveChange = (val: string) => {
        lastChange.current = 'receive';
        onPartnerReceiveChange(val);
        const r = parseFloat(val);
        if (!isNaN(r)) {
            onSendAmountChange(calcBack(r).toFixed(6));
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow my-4">
            <h2 className="text-xl font-semibold mb-4">{t('I want to send')}</h2>

            <SelectField
                label={t('Asset')}
                options={assetOptions}
                value={asset}
                onChange={onAssetChange}
            />

            <InputField
                label={t('Sent')}
                type="number"
                value={sendAmount}
                onChange={handleSendChange}
                error={errSend}
            />

            <CommissionSection asset={asset} amount={sendAmount} />

            <InputField
                label={t('Partner will get')}
                type="number"
                value={partnerReceive}
                onChange={handleReceiveChange}
                error={errRecv}
            />

            <CreateDealButton
                sendAsset={asset}
                sendAmount={sendAmount}
                receiveAsset={receiveAsset}
                receiveAmount={partnerReceive}
                partnerAddress=""
                disabled={disableCreate || errSend || errRecv}
            />
        </div>
    );
};
