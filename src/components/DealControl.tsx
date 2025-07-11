// src/components/DealControl.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';      // ← обязательно
import { Address, Dictionary, TupleReader } from '@ton/core';
import { dictValueParserDealInfo, loadTupleDealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { MethodExecutionResult, TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { fromNano } from '@ton/core';

interface DealControlProps {
    /** Вызывается при получении данных сделки или null */
    onDealData: (data: any | null) => void;
    disabled?: boolean;
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
    const source = new TupleReader(res.stack);
    const result_p = source.readTupleOpt();
    return result_p ? loadTupleDealInfo(result_p) : null;
}


async function getDeals(): Promise<any | null> {
    const res = await ta.blockchain.execGetMethodForBlockchainAccount(
        Address.parse(myContractAddress),
        'deals'
    );
    const source = new TupleReader(res.stack);
    const result = Dictionary.loadDirect(Dictionary.Keys.BigInt(32), dictValueParserDealInfo(), source.readCellOpt());
    console.log(result);
}


export const DealControl: React.FC<DealControlProps> = ({
    onDealData,
    disabled = false
}) => {
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

    const handleGetDeal = async () => {
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

    const handleGetDeals = async () => {
        const res = await getDeals();
    };

    return (
        <div className="mt-4" style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : undefined }}>
            <label htmlFor="deal-id" className="block mb-1 font-medium">
                id сделки
            </label>
            <div className="flex items-center space-x-2">
                <input
                    id="deal-id"
                    type="text"
                    value={dealId}
                    disabled={disabled}
                    onChange={e => setDealId(e.target.value)}
                    className="border rounded px-2 py-1 w-[20ch]"
                    placeholder="Введите ID"
                />
                <button
                    onClick={handleGetDeal}
                    disabled={disabled}
                    className="px-4 py-1 bg-blue-500 text-white rounded whitespace-nowrap"
                >
                    получить сделку по id
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
