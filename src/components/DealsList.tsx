// src/components/DealsList.tsx
import React, { useEffect, useState } from 'react';
import { Address } from '@ton/core';
import { Dictionary, TupleReader } from '@ton/core';
import { dictValueParserDealInfo, loadTupleDealInfo, DealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { fromNano } from '@ton/core';
import { DealItem } from './DealItem';




const ta = new TonApiClient({ baseUrl: tonApiBaseUrl });

// Функция получения всех сделок как словаря <id → DealInfo>
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
    // Получаем JS-объект { [id: string]: DealInfo }
    const result: Record<string, DealInfo> = {};
    dict.values().forEach(dealInfo => {
        result[dealInfo.id.toString()] = dealInfo;
    });
    return result;
}

const handleCancel = async (id: string) => {
    try {
        console.log(`Отмена сделки ${id}`);
        // TODO: вызвать метод контракта, например cancelDeal(id)
    } catch (e) {
        console.error('Ошибка отмены сделки', e);
    }
};

export const DealsList: React.FC = () => {
    const [deals, setDeals] = useState<Record<string, DealInfo>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDeals()
            .then(data => setDeals(data))
            .catch(e => setError(e.message ?? 'Error fetching deals'));
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const entries = Object.entries(deals);
    if (entries.length === 0) {
        return <div className="text-gray-400">Нет сделок</div>;
    }

    return (
        <div className="asset-list">
            {entries.map(([id, info]) => (<DealItem
                key={id}
                id={id}
                info={info}
                onCancel={handleCancel}
            />))}
        </div>
    );
};
