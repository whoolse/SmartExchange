// src/components/TransactionModal.tsx
import React, { useEffect, useState } from 'react';
import './TransactionModal.css';
import { TonConnectWrapper } from '../services/tonConnectWrapper';
import { useTestnet } from '../contexts/TestnetContext';

interface TransactionModalProps {
    isOpen: boolean;
    boc: string;                // base64 BOC, который вернул sendTransaction
    onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    boc,
    onClose,
}) => {
    const [txInfo, setTxInfo] = useState<{ hash: string; lt: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { isTestnet } = useTestnet();

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        // метод опроса из TonConnectWrapper
        TonConnectWrapper.getTxIdWithPolling(boc)
            .then(id => setTxInfo(id))
            .catch(err => {
                console.error('Ошибка при опросе транзакции:', err);
            })
            .finally(() => setLoading(false));
    }, [isOpen, boc]);

    if (!isOpen) return null;

    // ссылка на Tonscan по external-message-hash
    const network = isTestnet ? 'testnet' : 'mainnet';
    const link = txInfo
        ? `https://tonscan.org/external-message/${encodeURIComponent(txInfo.hash)}?network=${network}`
        : '';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-header">Транзакция</h2>
                <div className="modal-body">
                    {loading ? (
                        <p>Ожидание транзакции...</p>
                    ) : (
                        <p>Транзакция подтверждена</p>
                    )}
                </div>
                <div className="modal-actions">
                    {!loading && txInfo && (
                        <button
                            className="modal-button modal-showtx-button"
                            onClick={() => window.open(link, '_blank')}
                        >
                            Показать транзакцию
                        </button>
                    )}
                    <button className="modal-button modal-close-button" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};
