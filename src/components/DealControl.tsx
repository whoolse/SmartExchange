// src/components/DealControl.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';      // ← обязательно
import { Address, TupleReader } from '@ton/core';
import { loadTupleDealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { MethodExecutionResult, TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { fromNano } from '@ton/core';

interface DealControlProps {
    /** Вызывается при получении данных сделки или null */
    onDealData: (data: any | null) => void;
}

const ta = new TonApiClient({ baseUrl: tonApiBaseUrl });

// Чтобы в StrictMode и при HashRouter запрос выполнялся ровно один раз
const fetchedDealIds = new Set<string>();

async function getDealById(dealId: string): Promise<any | null> {
    const res = await ta.blockchain.execGetMethodForBlockchainAccount(
        Address.parse(myContractAddress),
        'dealById',
        { args: [dealId] }
    );
    const reader = new TupleReader(res.stack);
    const tupleOpt = reader.readTupleOpt();
    return tupleOpt ? loadTupleDealInfo(tupleOpt) : null;
}

export const DealControl: React.FC<DealControlProps> = ({ onDealData }) => {
    // Возьмём id из URL — работает как с BrowserRouter, так и с HashRouter
    const { id } = useParams<{ id: string }>();
    const [dealId, setDealId] = useState<string>(id ?? '');
    const [error, setError] = useState<string | null>(null);

    // Авто-запрос при первом рендере с id из URL
    useEffect(() => {
        if (id && !fetchedDealIds.has(id)) {
            fetchedDealIds.add(id);
            setError(null);
            setDealId(id);
            getDealById(id)
                .then(res => onDealData(res))
                .catch(e => {
                    console.error(e);
                    setError(e.message ?? 'Unknown error');
                });
        }
    }, [id, onDealData]);

    const handleFetch = async () => {
        if (!dealId) return;
        try {
            setError(null);
            const res = await getDealById(dealId);
            onDealData(res);
        } catch (e: any) {
            console.error(e);
            setError(e.message ?? 'Unknown error');
        }
    };

    return (
        <div className="mt-4">
            <label htmlFor="deal-id" className="block mb-1 font-medium">
                id сделки
            </label>
            <div className="flex items-center space-x-2">
                <input
                    id="deal-id"
                    type="text"
                    value={dealId}
                    onChange={e => setDealId(e.target.value)}
                    className="border rounded px-2 py-1 w-[20ch]"
                    placeholder="Введите ID"
                />
                <button
                    onClick={handleFetch}
                    className="px-4 py-1 bg-blue-500 text-white rounded whitespace-nowrap"
                >
                    получить
                </button>
            </div>
            {error && (
                <div className="mt-1 text-red-500 text-sm">
                    Ошибка: {error}
                </div>
            )}
        </div>
    );
};
