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
    const handleCopy = () => {
        const url = `${window.location.origin}/#/deals/${dealId}`;
        navigator.clipboard.writeText(url);
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Сделка создана</h3>
                <p>ID сделки: {dealId}</p>
                <div className="modal-actions">
                    <button className="modal-copy-button" onClick={handleCopy}>
                        Скопировать ссылку
                    </button>
                    <button className="modal-close-button" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
      );
};
