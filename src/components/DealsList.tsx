// src/components/DealsList.tsx
import React, { useState } from 'react';
import { Address, Dictionary, TupleReader } from '@ton/core';
import {DealInfo, dictValueParserDealInfo} from '../smartContract/JettonReceiver_JettonReceiver';
import { TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { DealItem } from './DealItem';
import { useTonAddress } from '@tonconnect/ui-react';

const ta = new TonApiClient({ baseUrl: tonApiBaseUrl });

async function fetchDeals(): Promise<Record<string, DealInfo>> {
    const res = await ta.blockchain.execGetMethodForBlockchainAccount(
        Address.parse(myContractAddress),
        'deals'
    );
    const source = new TupleReader(res.stack);
    const dict = Dictionary.loadDirect(
        Dictionary.Keys.BigInt(32),
        dictValueParserDealInfo(),
        source.readCellOpt()
    );
    const result: Record<string, DealInfo> = {};
    dict.values().forEach(dealInfo => {
        result[dealInfo.id.toString()] = dealInfo;
    });
    return result;
}

export const DealsList: React.FC = () => {
    const address = useTonAddress() ?? '';
    const [deals, setDeals] = useState<Record<string, DealInfo>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const all = await fetchDeals();
            const filtered: Record<string, DealInfo> = {};
            let rawAddress = Address.parse(address).toRawString();

            Object.values(all).forEach(dealInfo => {
                if (dealInfo.senderAddress.toRawString() == rawAddress) {
                    filtered[dealInfo.id.toString()] = dealInfo;
                }
            });
            setDeals(filtered);
        } catch (e: any) {
            setError(e.message || 'Ошибка при загрузке сделок');
        } finally {
            setLoading(false);
        }
    };

    const entries = Object.entries(deals);

    return (
        <div className="asset-block">
            <button
                onClick={loadDeals}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded"
            >
                {loading ? 'Загрузка…' : 'Получить список сделок'}
            </button>

            {error && <div className="text-red-500">Ошибка: {error}</div>}

            {entries.length === 0 && !loading && !error && (
                <div className="text-gray-400">Сделки не загружены или отсутствуют</div>
            )}

            {entries.map(([id, info]) => (
                <DealItem key={id} id={id} info={info} onCancel={() => { /* TODO: отмена */ }} />
            ))}
        </div>
    );
};
