// src/components/CommissionLine.tsx
import React from 'react';

interface CommissionLineProps {
    label: string;
    value: number;
    decimals?: number;
    suffix?: string;       // добавляем суффикс валюты
    total?: boolean;
}

export const CommissionLine: React.FC<CommissionLineProps> = ({
    label,
    value,
    decimals = 6,
    suffix,
    total = false,
}) => (
    <div className={`info-line ${total ? 'total-line' : ''}`}>
        <span className="info-label">{label}</span>
        <span className="info-value">
            {value.toFixed(decimals)}{suffix ? ` ${suffix}` : ''}
        </span>
    </div>
);
