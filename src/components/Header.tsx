// src/components/Header.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { TonApiClient } from '@ton-api/client';
import { Address, fromNano } from '@ton/core';
import { useT } from '../i18n';
import { useBalance } from '../contexts/BalanceContext';
import { HamburgerMenu } from './HamburgerMenu';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const t = useT();
    const address = useTonAddress();
    const { balance, setBalance } = useBalance();
    // По умолчанию Testnet включён
    const [isTestnet, setIsTestnet] = useState<boolean>(true);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const api = useMemo(
        () =>
            new TonApiClient({
                baseUrl: isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io',
            }),
        [isTestnet]
    );

    useEffect(() => {
        if (!address) {
            setBalance('0');
            return;
        }
        // Пока идёт загрузка — показываем прочерк
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
    }, [address, api, setBalance]);

    return (
        <header className="header header-container relative z-30">
            <HamburgerMenu />
            <div className="flex items-center space-x-4">
                <h1 className="logo">
                    {title ?? t('title')}
                </h1>
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={isTestnet}
                        onChange={() => setIsTestnet(prev => !prev)}
                        className="h-4 w-4 accent-indigo-500"
                    />
                    {/* <span>{t('testnet')}</span> */}
                </label>
            </div>

            <div className="flex items-center tonconnect-wrapper">
                <TonConnectButton />
            </div>
        </header>
    );
};
