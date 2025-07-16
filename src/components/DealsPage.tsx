import React from 'react';
import { Header } from '../components/Header';
import { DealsList } from '../components/DealsList';

export const DealsPage: React.FC = () => (
    <div className="container">
        <Header title="Список сделок" />
        <div className="main-content">
            <DealsList />
        </div>
    </div>
);