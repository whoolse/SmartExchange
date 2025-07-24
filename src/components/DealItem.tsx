// src/components/DealItem.tsx
import React from 'react';
import { Address } from '@ton/core';
import { fromNano } from '@ton/core';
import { DealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { fromDecimals, getCurrencyDataById, getCurrencyKeyById, isMobile, shareDeal } from '../utils/utils';
import { useT } from '../i18n';

import { Button } from 'antd';
import { CopyOutlined, ShareAltOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface DealItemProps {
    id: string;
    info: DealInfo;
    onCancel: (id: string) => void;
    disabled?: boolean;
}
// Обработчик отмены — тут пока заглушка, позже привяжите к контракту


export const DealItem: React.FC<DealItemProps> = ({ id: dealId, info, onCancel, disabled }) => {
    const sendedCurrencyData = getCurrencyDataById(Number(info.sendedCurrencyId));
    const sendedCurrency = sendedCurrencyData.name
    const expectedCurrencyData = getCurrencyDataById(Number(info.expectedCurrencyId));
    const expectedCurrency = expectedCurrencyData.name

    const sended = fromDecimals(info.sendedAmount, sendedCurrencyData.decimals);

    const expected = fromDecimals(info.expectedAmount, expectedCurrencyData.decimals);

    const t = useT();
    const handleCopy = () => {
        navigator.clipboard.writeText(dealId);
    };

    const handleShare = () => {
        shareDeal(dealId)
    };

    return (
        <div
            className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm hover:bg-opacity-10"
        >
            <div className="flex-1 min-w-0 space-y-1">
                <div className="text-sm text-indigo-300">ID: {dealId}</div>
                <div className="text-white truncate">
                    {`${t('sender')}: ${info.senderAddress.toString()}`}
                </div>
                <div className="text-gray-300">
                    {`${t('sent')} `}
                    {sended} {sendedCurrency}
                    {`, ${t('expect')} `}
                    {expected} {expectedCurrency}
                </div>
                {info.partnerAddress && (
                    <div className="text-gray-400 truncate">
                        {`${t('partner')}: ${info.partnerAddress.toString()}`}
                    </div>
                )}
            </div>
            {/* Кнопки в столбец одной ширины, равной самой широкой */}
            <div
                className="mt-4 inline-grid grid-flow-row grid-cols-[max-content] gap-2"
                style={{ justifyContent: 'start' }}
            >
                {/* Cancel button — primary + danger */}
                <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => onCancel(dealId)}
                    disabled={disabled}
                >
                    {t('cancel')}
                </Button>

                {/* Copy ID */}
                <Button
                    type="default"
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                >
                    {t('copyId')}
                </Button>

                {/* Share / Copy link */}
                <Button
                    type="default"
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                >
                    {isMobile() ? t('shareDeal') : t('copyLink')}
                </Button>
            </div>
        </div>

    );
};
