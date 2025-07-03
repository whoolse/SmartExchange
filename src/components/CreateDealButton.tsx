// src/components/CreateDealButton.tsx
import React from 'react';
import {TonSendTransaction} from './TonSendTransaction';

interface CreateDealButtonProps {
    willSend: string;
    partnerAddress: string;
    onResult?: (res: any) => void;
}

export const CreateDealButton: React.FC<CreateDealButtonProps> = (
    {
        willSend,
        partnerAddress,
        onResult,
    }) => (
    <TonSendTransaction
        willSend={willSend}
        partnerAddress={partnerAddress}
        onResult={onResult}
    >
        {send => (
            <button
                onClick={send}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
                создать сделку
            </button>
        )}
    </TonSendTransaction>
);
