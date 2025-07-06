// src/components/CreateDealButton.tsx
import React from 'react';
import { useT } from '../i18n';
import { TonSendTransaction } from './TonSendTransaction';

export interface CreateDealButtonProps {
    /** Код актива, который отправляем */
    sendAsset: string;
    /** Сумма отправки */
    sendAmount: string;
    /** Код актива, который получаем */
    receiveAsset: string;
    /** Сумма получения партнёром */
    receiveAmount: string;
    /** Адрес партнёра */
    partnerAddress: string;
    /** Блокировка кнопки */
    disabled?: boolean;
    /** Обработчик результата транзакции */
    onResult?: (res: any) => void;
}

export const CreateDealButton: React.FC<CreateDealButtonProps> = ({
    sendAsset,
    sendAmount,
    receiveAsset,
    receiveAmount,
    partnerAddress,
    disabled = false,
    onResult,
}) => {
    const t = useT();

    return (
        <TonSendTransaction
            sendAsset={sendAsset}
            sendAmount={sendAmount}
            receiveAsset={receiveAsset}
            receiveAmount={receiveAmount}
            partnerAddress={partnerAddress}
            onResult={onResult}
        >
            {send => (
                <button
                    type="button"
                    onClick={() => {
                        if (disabled) return;
                        send();
                    }}
                    disabled={disabled}
                    className={`mt-4 w-full px-4 py-2 ${disabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                        } text-white rounded transition`}
                >
                    {t('createDeal')}
                </button>
            )}
        </TonSendTransaction>
    );
};
