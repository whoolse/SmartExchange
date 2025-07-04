// src/components/JettonsList.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { Address, fromNano } from '@ton/core';
import { TonApiClient } from '@ton-api/client';
import { useT } from '../i18n';

interface JettonInfo {
    balance: bigint | string; // баланс в минимальных единицах
    jetton: {
        address: Address;
        decimals: number;
        image: string;
        name: string;
        symbol: string;
        score: number;
        verification: string;
    };
    walletAddress: {
        address: Address;
        isScam: boolean;
        isWallet: boolean;
    };
}

export const JettonsList: React.FC = () => {
    const t = useT();
    const address = useTonAddress();
    const [jettons, setJettons] = useState<JettonInfo[]>([]);
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
            return;
        }
        setError(null);
        client.accounts
            .getAccountJettonsBalances(Address.parse(address))
            .then((response: any) => {
                setJettons(response.balances as JettonInfo[]);
            })
            .catch(err => {
                console.error('Error fetching jettons:', err);
                setError(t('noJettons'));
            });
    }, [address, client]);

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
                <button
                    onClick={() => setIsTestnet(prev => !prev)}
                    className="px-2 py-1 bg-indigo-500 text-white rounded"
                >
                    {isTestnet ? 'Mainnet' : 'Testnet'}
                </button>
            </div>

            {jettons.length === 0 ? (
                <p className="text-gray-600">{t('noJettons')}</p>
            ) : (
                <ul className="space-y-2">
                    {jettons.map(j => {
                        const displayAmount = fromNano(j.balance)

                        return (
                            <li key={j.jetton.address.toString()} className="flex justify-between">
                                <span>
                                    {j.jetton.symbol} ({j.jetton.name})
                                </span>
                                <span>
                                    {displayAmount} {j.jetton.symbol}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
