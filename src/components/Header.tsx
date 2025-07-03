// src/components/Header.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { TonApiClient } from '@ton-api/client';
import { Address, fromNano } from '@ton/core';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Smart Exchange',
}) => {
    const address = useTonAddress();
    const [balance, setBalance] = useState<string>('');
    const [isTestnet, setIsTestnet] = useState<boolean>(false);

    // Пересоздаём клиента при смене сети, без apiKey
    const api = useMemo(
        () =>
            new TonApiClient({
                baseUrl: isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io',
            }),
        [isTestnet]
    );

    useEffect(() => {
        if (!address) {
            setBalance('');
            return;
        }

        api.accounts
            .getAccount(Address.parse(address))
            .then(account => {
                const nano = BigInt(account.balance).toString();
                setBalance(fromNano(nano));
            })
            .catch(() => {
                setBalance('');
            });
    }, [address, api]);

    const toggleNetwork = () => {
        setIsTestnet(prev => !prev);
    };

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 shadow rounded space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isTestnet}
                        onChange={toggleNetwork}
                        className="h-4 w-4"
                    />
                    <span className="text-sm">testnet</span>
                </label>
            </div>
            <div className="flex items-center space-x-4">
                {address && balance && (
                    <div className="text-gray-700">
                        Баланс: {balance} TON
                    </div>
                )}
                <TonConnectButton />
            </div>
        </header>
    );
};
