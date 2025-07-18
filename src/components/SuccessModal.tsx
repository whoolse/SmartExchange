// src/components/SuccessModal.tsx
import React from 'react';
import "./SuccessModal.css";
import { useT } from '../i18n';
import { isMobile, shareDeal } from '../utils/utils';

interface SuccessModalProps {
    isOpen: boolean;
    dealId: string;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, dealId, onClose }) => {
    if (!isOpen) return null;

    const t = useT();

    const handleCopy = () => {
        navigator.clipboard.writeText(dealId);
    };

    const handleShare =  () => {
        shareDeal(dealId)
    };

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
                        {isMobile() ? t('shareDeal') : t('copyLink')}
                    </button>
                    <button className="modal-button modal-close-button" onClick={onClose}>
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
