// src/components/CreateDealButton.tsx
import React from 'react';
import { useT } from '../i18n';
import { TonSendTransaction } from './TonSendTransaction';

interface CreateDealButtonProps {
    willSend: string;
    partnerAddress: string;
    onResult?: (res: any) => void;
    disabled?: boolean;
}

export const CreateDealButton: React.FC<CreateDealButtonProps> = ({
    willSend,
    partnerAddress,
    onResult,
    disabled = false,
}) => {
    const t = useT();

    return (
        <TonSendTransaction
            willSend={willSend}
            partnerAddress={partnerAddress}
            onResult={onResult}
        >
            {send => (
                <button
                    type="button"
                    onClick={() => !disabled && send()}
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
