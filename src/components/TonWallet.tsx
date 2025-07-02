// src/components/TonWallet.tsx
import React, { useEffect, useState } from 'react';
import {
    useTonAddress,
    useTonWallet,
    useTonConnectModal,
} from '@tonconnect/ui-react';

export const TonWallet: React.FC = () => {
    const address = useTonAddress();
    const wallet = useTonWallet();
    const { open } = useTonConnectModal();
    const [balance, setBalance] = useState<string>('');

    useEffect(() => {
        if (wallet && address) {
            console.log('eee gool')
            // wallet.provider
            //     .request({ method: 'ton_getBalance', params: [address] })
            //     .then((hex: string) => {
            //         setBalance(BigInt(hex).toString());
            //     })
            //     .catch(console.error);
        }
    }, [wallet, address]);

    if (!wallet) {
        return (
            <button
                onClick={open}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Подключить TON-кошелек
            </button>
        );
    }

    return (
        <div className="bg-white p-4 border rounded space-y-1">
            <div><b>Адрес:</b> {address}</div>
            <div><b>Баланс:</b> {balance}</div>
        </div>
    );
};
