// src/components/JettonsList.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { Address, fromNano } from '@ton/core';
import { TonApiClient, type JettonsBalances } from '@ton-api/client';
import { useT } from '../i18n';

interface JettonsListProps {
    /** Опционально передаёт в App список символов джеттонов */
    onJettons?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const JettonsList: React.FC<JettonsListProps> = ({ onJettons }) => {
    const t = useT();
    const address = useTonAddress();
    const [jettons, setJettons] = useState<JettonsBalances['balances']>([]);
    const [error, setError] = useState<string | null>(null);
    const [isTestnet, setIsTestnet] = useState<boolean>(true);

    const client = useMemo(
        () =>
            new TonApiClient({
                baseUrl: isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io',
            }),
        [isTestnet]
    );

    useEffect(() => {
        if (!address) {
            setJettons([]);
            onJettons?.([]);
            return;
        }
        setError(null);
        client.accounts
            .getAccountJettonsBalances(Address.parse(address))
            .then((response: JettonsBalances) => {
                const arr = response.balances ?? [];
                setJettons(arr);
                onJettons?.(arr.map(j => j.jetton.symbol));
            })
            .catch(err => {
                console.error('Error fetching jettons:', err);
                setError(t('noJettons'));
                onJettons?.([]);
            });
    }, [address, client, onJettons]); // убрали t из зависимостей

    if (!address) {
        return <p className="text-gray-600">{t('connectWallet')}</p>;
    }
    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t('yourJettons')}</h3>
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={isTestnet}
                        onChange={() => setIsTestnet(prev => !prev)}
                        className="h-4 w-4 accent-indigo-500"
                    />
                    <span>{t('testnet')}</span>
                </label>
            </div>
            {jettons.length === 0 ? (
                <p className="text-gray-600">{t('noJettons')}</p>
            ) : (
                <ul className="space-y-2">
                    {jettons.map(j => (
                        <li key={j.jetton.address.toString()} className="flex justify-between">
                            <span>
                                {j.jetton.symbol} ({j.jetton.name})
                            </span>
                            <span>
                                {fromNano(j.balance)} {j.jetton.symbol}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
