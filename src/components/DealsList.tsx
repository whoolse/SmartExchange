// src/components/DealsList.tsx
import React, { useEffect, useState } from 'react';
import { Address, Dictionary, TupleReader } from '@ton/core';
import { DealInfo, dictValueParserDealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { TonApiClient } from '@ton-api/client';
import { tonApiBaseUrl, myContractAddress } from '../constants/constants';
import { DealItem } from './DealItem';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { TonConnectWrapper } from '../services/tonConnectWrapper';
import { useT } from '../i18n';
import { SuccessModal } from './SuccessModal';

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
    const [lastCancelTime, setLastCancelTime] = useState<number | null>(null);
    const [refreshDisabled, setRefreshDisabled] = useState<boolean>(false);
    const [txBoc, setTxBoc] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const t = useT();
    const loadDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const allDeals = await fetchDeals();
            const filtered: Record<string, DealInfo> = {};
            let rawAddress = Address.parse(address).toRawString();
            Object.values(allDeals).forEach(dealInfo => {
                if (dealInfo.senderAddress.toRawString() == rawAddress) {
                    filtered[dealInfo.id.toString()] = dealInfo;
                }
            });
            setDeals(filtered);
        } catch (e: any) {
            setError(e.message || t('dealsUpdateError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDeal = async (id: string): Promise<void> => {
        setBlocked(true);
        setError(null);
        try {
            let boc = await TonConnectWrapper.cancelDealById(id, tonConnectUI);
            setTxBoc(boc)
            setIsModalOpen(true)
            setLastCancelTime(Date.now());
        } catch (e: any) {
            setError(e.message || t('dealCancelError'));
            setBlocked(false);
            return;
        }
    };

    const entries = Object.entries(deals);

    useEffect(() => {
        if (address) {
            loadDeals();
        }
    }, [address]);

    useEffect(() => {
        if (lastCancelTime && address) {
            const timer = setTimeout(() => {
                loadDeals();
                setBlocked(false);
                setRefreshDisabled(true)
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastCancelTime]);

    return (
        <>
            {/* Кнопка ручного обновления списка */}
            <div className="mb-4">
                <button
                    onClick={async () => {
                        setRefreshDisabled(true);
                        await loadDeals();
                        setTimeout(() => setRefreshDisabled(false), 10000);
                    }}
                    disabled={refreshDisabled || loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded"
                >
                    {t('updateDeals')}
                </button>
            </div>

            <div className="asset-block w-full">
                {error && <div className="text-red-500">{t('errorPrefix')} {error}</div>}

                {entries.length === 0 && !loading && !error && (
                    <div className="text-gray-400">{t('noDeals')}</div>
                )}
                <div className="deals-list">
                    {entries.map(([id, info]) => (
                        <DealItem
                            key={id}
                            id={id}
                            info={info}
                            onCancel={handleCancelDeal}
                            disabled={blocked}
                        />))
                    }
                </div>
            </div>
            {/* Модалка отмены сделки, без dealId */}
            <SuccessModal
                isOpen={isModalOpen}
                dealId={''}
                onClose={() => setIsModalOpen(false)}
                isAcceptingDeal={true}
                boc={txBoc}
            />
        </>
    );
};
