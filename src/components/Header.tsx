// src/components/Header.tsx
import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';

interface HeaderProps {
    title?: string;
    buttonClassName?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'My Ton App',
    buttonClassName = 'px-4 py-2 bg-blue-600 text-white rounded'
}) => (
    <header className="flex justify-between items-center bg-white p-4 shadow rounded">
        <h1 className="text-2xl font-bold">{title}</h1>
        <TonConnectButton />
    </header>
);
