// src/components/SuccessModal.tsx
import React from 'react';
import "./SuccessModal.css";
import { useT } from '../i18n';

interface SuccessModalProps {
    isOpen: boolean;
    dealId: string;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, dealId, onClose }) => {
    if (!isOpen) return null;

    const url = `${window.location.origin}/?tgWebAppStartParam=${dealId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(dealId);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Ссылка на сделку',
                    text: `Перейти к сделке ${dealId}`,
                    url,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            // fallback to copy
            handleCopy();
        }
    };
    const t = useT();

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{t('dealCreated')}</h3>
                <p>{t('dealId')}: {dealId}</p>
                <div className="modal-actions">
                    <button className="modal-button modal-copy-button" onClick={handleCopy}>
                        {t('copyId')}
                    </button>
                    <button className="modal-button modal-share-button" onClick={handleShare}>
                        {t('shareDeal')}
                    </button>
                    <button className="modal-button modal-close-button" onClick={onClose}>
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
