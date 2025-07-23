// src/components/SuccessModal.tsx
import React, { useEffect, useState } from 'react';
import "./SuccessModal.css";
import { useT } from '../i18n';
import { isMobile, shareDeal } from '../utils/utils';
import { useTestnet } from '../contexts/TestnetContext';
import { TonConnectWrapper } from '../services/tonConnectWrapper';

interface SuccessModalProps {
    isOpen: boolean;
    dealId: string;
    isAcceptingDeal: boolean
    boc: string | null;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, dealId, onClose, isAcceptingDeal, boc }) => {
    const [txInfo, setTxInfo] = useState<{ hash: string; lt: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { isTestnet } = useTestnet();
    const t = useT();

    const handleCopy = () => {
        navigator.clipboard.writeText(dealId);
    };

    const handleShare = () => {
        shareDeal(dealId)
    };

    useEffect(() => {
        if (!isOpen || boc == null) return;
        setLoading(true);
        // метод опроса из TonConnectWrapper
        TonConnectWrapper.getTxIdWithPolling(boc)
            .then(id => setTxInfo(id))
            .catch(err => {
                console.error('Ошибка при опросе транзакции:', err);
            })
            .finally(() => setLoading(false));
    }, [isOpen, boc]);

    const network = isTestnet ? 'testnet' : 'mainnet';
    const link = txInfo
        ? `https://tonscan.org/external-message/${encodeURIComponent(txInfo.hash)}?network=${network}`
        : '';

    if (!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div>
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
                                className="modal-button  modal-close-button"
                                onClick={() => window.open(link, '_blank')}
                            >
                                Показать транзакцию
                            </button>
                        )}
                        {/* <button className="modal-button modal-close-button" onClick={onClose}>
                            Закрыть
                        </button> */}
                    </div>
                </div>

                <div style={{ display: isAcceptingDeal ? 'none' : '' }}>
                    <h3 className="modal-title">{t('dealCreated')}</h3>
                    <p>{t('dealId')}: {dealId}</p>
                    <div className="modal-actions">
                        <button className="modal-button modal-copy-button" onClick={handleCopy}>
                            {t('copyId')}
                        </button>
                        <button className="modal-button modal-share-button" onClick={handleShare}>
                            {isMobile() ? t('shareDeal') : t('copyLink')}
                        </button>
                        {/* <button className="modal-button modal-close-button" onClick={onClose}>
                            {t('close')}
                        </button> */}
                    </div>
                </div>
                <button className="modal-button modal-close-button m-5" onClick={onClose}>
                    {t('close')}
                </button>
            </div>
       
        </div>
    );
};
