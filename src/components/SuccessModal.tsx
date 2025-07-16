// src/components/SuccessModal.tsx
import React from 'react';
import "./SuccessModal.css";

interface SuccessModalProps {
    isOpen: boolean;
    dealId: string;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, dealId, onClose }) => {
    if (!isOpen) return null;

    const url = `${window.location.origin}/deal/${dealId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
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

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Сделка создана</h3>
                <p>ID сделки: {dealId}</p>
                <div className="modal-actions">
                    <button className="modal-button modal-copy-button" onClick={handleCopy}>
                        Скопировать ссылку
                    </button>
            
                    <button className="modal-button modal-share-button" onClick={handleShare}>
                        Поделиться
                    </button>
                    <button className="modal-button modal-close-button" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};
