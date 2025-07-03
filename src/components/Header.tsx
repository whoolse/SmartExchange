// src/components/Header.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { TonApiClient } from '@ton-api/client';
import { Address, fromNano } from '@ton/core';
import { useT } from '../i18n';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const t = useT();
    const address = useTonAddress();
    const [balance, setBalance] = useState<string>('');
    const [isTestnet, setIsTestnet] = useState<boolean>(false);

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
        setBalance('—');
        api.accounts
            .getAccount(Address.parse(address))
            .then(account => {
                const nano = BigInt(account.balance).toString();
                setBalance(fromNano(nano));
            })
            .catch(() => {
                setBalance('—');
            });
    }, [address, api]);

    const toggleNetwork = () => {
        setBalance('—');
        setIsTestnet(prev => !prev);
    };

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-extrabold text-indigo-600">{title ?? t('title')}</h1>
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={isTestnet}
                        onChange={toggleNetwork}
                        className="h-4 w-4 accent-indigo-500"
                    />
                    <span>{t('testnet')}</span>
                </label>
            </div>
            <div className="flex items-center space-x-4">
                {address && balance && (
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        {t('balance')}: {balance} TON
                    </div>
                )}
                <TonConnectButton />
            </div>
        </header>
    );
};
