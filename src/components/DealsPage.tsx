import React from 'react';
import { Header } from '../components/Header';
import { DealsList } from '../components/DealsList';
import { useT } from '../i18n';

export const DealsPage: React.FC = () => {
    const t = useT();

    return (
        <div className="container">
            <Header title={t('dealsList')} />
            <DealsList />
        </div>
    );
};