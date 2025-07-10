import React, { useEffect, useMemo, useRef } from 'react';
import { TonApiClient } from '@ton-api/client';
import { useBalance } from '../contexts/BalanceContext';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CommissionSection } from './CommissionSection';
import { CreateDealButton } from './CreateDealButton';
import { assets } from '../constants/constants';
import { useT } from '../i18n';
import { calcBack, calcPartner } from "../utils/utils";

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

    // Убраны локальные функции CalcPartner и CalcBack

    // Пересчёт partnerReceive только если последний change был не 'receive'
    useEffect(() => {
        if (lastChange.current !== 'receive') {
            const n = parseFloat(sendAmount);
            if (!isNaN(n)) {
                onPartnerReceiveChange(calcPartner(n, asset).toFixed(6));
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
            onSendAmountChange(calcBack(r, asset).toFixed(6));
        }
    };

    return (
        <div className="asset-block">
            <h2 className="block-title">{t('sending')}</h2>

            <div className="asset-selector">
                <div className="asset-row">
                    <SelectField
                        label={t('asset')}
                        options={assetOptions}
                        value={asset}
                        onChange={onAssetChange}
                    />

                    <InputField
                        label={t('willSend')}
                        type="number"
                        value={sendAmount}
                        onChange={handleSendChange}
                        error={errSend}
                    />
                </div>

                <div className="second-row">
                    <div className="wallet-balance">
                        {817}
                    </div>
                    <InputField
                        label={t('willReceivePartner')}
                        type="number"
                        value={partnerReceive}
                        onChange={handleReceiveChange}
                        error={errRecv}
                    />
                </div>
            </div>

            <CommissionSection asset={asset} amount={sendAmount} />

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