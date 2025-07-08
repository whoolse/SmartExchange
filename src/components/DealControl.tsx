// src/components/DealControl.tsx
import { Address, TupleReader } from '@ton/core';
import React, { useState } from 'react';
import { loadTupleDealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { MethodExecutionResult, TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { fromNano } from '@ton/core';
import { currencies } from '../constants/constants';

interface DealControlProps {
    apiUrl: string;
    onDealData: (data: any) => void;
}

const ta = new TonApiClient({
    baseUrl: tonApiBaseUrl
});

async function getDealById(dealId: string) {
    const res = await getFromContract('dealById', dealId);
    let source = new TupleReader(res.stack)
    const result_p = source.readTupleOpt();
    const result = result_p ? loadTupleDealInfo(result_p) : null;
    return result
}

async function getFromContract(name: string, arg ?: string): Promise < MethodExecutionResult > {
    let query = arg ? { args: [arg] } : undefined
    return await ta.blockchain.execGetMethodForBlockchainAccount(Address.parse(myContractAddress), name, query);
}


export const DealControl: React.FC<DealControlProps> = ({
    apiUrl,
    onDealData,
}) => {
    const [dealId, setDealId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleFetch = async () => {
        console.log('handle press')
        if (!dealId) return;
        try {
            setError(null);
            const res = await getDealById(dealId);
            console.log(res)
            onDealData(res);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Unknown error');
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
