// src/components/JettonsList.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { Address, fromNano } from '@ton/core';
import { TonApiClient, JettonsBalances, JettonBalance } from '@ton-api/client';
import { useT } from '../i18n';
import { fromDecimals } from '../utils/utils';
import { useTestnet } from '../contexts/TestnetContext';

interface JettonsListProps {
    /** Символы джеттонов пользователя */
    onJettons?: React.Dispatch<React.SetStateAction<string[]>>;
    /** Полные данные балансов джеттонов */
    onJettonBalances?: React.Dispatch<React.SetStateAction<JettonsBalances['balances']>>;
}

export const JettonsList: React.FC<JettonsListProps> = ({
    onJettons,
    onJettonBalances,
}) => {
    const t = useT();
    const address = useTonAddress();
    const [jettons, setJettons] = useState<JettonsBalances['balances']>([]);
    const [error, setError] = useState<string | null>(null);
    const { isTestnet, setTestnet } = useTestnet()

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
            onJettonBalances?.([]);
            return;
        }
        setError(null);
        client.accounts
            .getAccountJettonsBalances(Address.parse(address))
            .then((response: JettonsBalances) => {
                const arr = response.balances ?? [];
                let log: Array<any> = []
                response.balances.forEach(element => {
                    log.push({ "symbol": element.jetton.symbol, "address": element.jetton.address.toString() })
                });
              
                console.log(log)
                setJettons(arr);
                onJettons?.(arr.map(j => j.jetton.symbol));
                onJettonBalances?.(arr);
            })
            .catch(err => {
                console.error('Error fetching jettons:', err);
                onJettons?.([]);
                onJettonBalances?.([]);
            });
        // Убираем t, onJettons и onJettonBalances из зависимостей, чтобы эффект не перезапускался бесконечно
    }, [address, client]);

    if (!address) {
        return <p className="text-gray-600">{t('connectWallet')}</p>;
    }
    if (error) {
        return <p className="text-red-600">{error}</p>;
    }
    // return(<></>)
    return (
        <div className="asset-block p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t('yourJettons')}</h3>
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={isTestnet}
                        onChange={() => setTestnet(!isTestnet)}
                        className="h-4 w-4 accent-indigo-500"
                    />
                    <span>{t('testnet')}</span>
                </label>
            </div>
            <ul className="space-y-2">
                {jettons.map(j => (
                    <li key={j.jetton.address.toString()} className="flex justify-between border-b border-gray-600 pb-2 mb-2">
                        <span>
                            {j.jetton.symbol} ({j.jetton.name})
                        </span>
                        <span>
                            {fromDecimals(j.balance, j.jetton.decimals)} {j.jetton.symbol}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
