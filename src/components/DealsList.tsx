// src/components/DealsList.tsx
import React, { useEffect, useState } from 'react';
import { Address, Dictionary, TupleReader } from '@ton/core';
import { DealInfo, dictValueParserDealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { DealItem } from './DealItem';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { TonConnectWrapper } from '../services/tonConnectWrapper';

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
    const [tonConnectUI] = useTonConnectUI();
    const [blocked, setBlocked] = useState<boolean>(false);

    const loadDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const allDeals = await fetchDeals();
            const filtered: Record<string, DealInfo> = {};
            let rawAddress = Address.parse(address).toRawString();
            console.log(allDeals)
            Object.values(allDeals).forEach(dealInfo => {
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

    const handleCancelDeal = async (id: string): Promise<void> => {
        setBlocked(true);
        setError(null);
        try {
            await TonConnectWrapper.cancelDealById(id, tonConnectUI);
            setTimeout(async () => {
                await loadDeals();
                setBlocked(false);
            }, 5000);
        } catch (e: any) {
            setError(e.message || 'Ошибка при отмене сделки');
            setBlocked(false);
            return;
        }
        // через 5 секунд перезагрузить список и снять блокировку
        // setTimeout(async () => {
        //     await loadDeals();
        //     setBlocked(false);
        // }, 5000);
    };

    const entries = Object.entries(deals);
    
    useEffect(() => {
        loadDeals();
    }, []);

    return (
        <div className="asset-block w-full">
            {error && <div className="text-red-500">Ошибка: {error}</div>}

            {entries.length === 0 && !loading && !error && (
                <div className="text-gray-400">Сделки не загружены или отсутствуют</div>
            )}

            {entries.map(([id, info]) => (
                <DealItem
                    key={id}
                    id={id}
                    info={info}
                    onCancel={handleCancelDeal}
                    disabled={blocked}
                />))}
        </div>
    );
};
