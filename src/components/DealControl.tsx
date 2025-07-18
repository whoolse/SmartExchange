// src/components/DealControl.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';      // ← обязательно
import { Address, Dictionary, TupleReader } from '@ton/core';
import { dictValueParserDealInfo, loadTupleDealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { MethodExecutionResult, TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { fromNano } from '@ton/core';
import { useT } from '../i18n';

interface DealControlProps {
    /** Вызывается при получении данных сделки или null */
    onDealData: (data: any | null) => void;
    disabled?: boolean;
    onSetDealId?: (id: string) => void;
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
    disabled = false,
    onSetDealId
}) => {
    // Возьмём id из URL — работает как с BrowserRouter, так и с HashRouter
    const params = new URLSearchParams(location.search);
    const id = params.get('dealId') ?? '';
    const [dealId, setDealId] = useState<string>(id ?? '');
    const [error, setError] = useState<string | null>(null);
    const t = useT();

    const getIdFromUrl = (): string | null => {
        let id = params.get('dealId')
        console.log(id);
        if (!id) 
            id = params.get('startapp')
        if (isNaN(Number(id))) return null;
        return id;
    };

    // Авто-запрос при первом рендере с id из URL
    useEffect(() => {
        let id = getIdFromUrl();
        if (!id) return;
        if (id && !fetchedDealIds.has(id)) {
            fetchedDealIds.add(id);
            setError(null);
            setDealId(id);
            onSetDealId?.(id);
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
            onSetDealId?.(dealId);
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
        <div className="mt-4 pb-15">
            <label htmlFor="deal-id" className="block mb-1 font-medium">
                {t('dealId')}
            </label>
            <div className="flex items-center space-x-2">
                <input
                    id="deal-id"
                    type="text"
                    value={dealId}
                    // disabled={disabled}
                    onChange={e => setDealId(e.target.value)}
                    className="border rounded px-2 py-1 w-[20ch]"
                    placeholder={t('enterId')}
                />
                <button
                    onClick={handleGetDeal}
                    // disabled={disabled}
                    className="px-4 py-1 bg-blue-500 text-white rounded whitespace-nowrap"
                >
                    {t('getDealById')}
                </button>
            </div>
            {error && (
                <div className="mt-1 text-red-500 text-sm">
                    {t('error')}: {error}
                </div>
            )}
        </div>
    );
};
