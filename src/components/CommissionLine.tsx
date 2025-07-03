// src/components/CommissionLine.tsx
import React from 'react';

interface CommissionLineProps {
    label: string;
    value: number;
    decimals?: number;
    bold?: boolean;
}

export const CommissionLine: React.FC<CommissionLineProps> = ({
    label,
    value,
    decimals = 6,
    bold = false,
}) => (
    <div className={`flex justify-between items-center py-1 border-b ${bold ? 'font-bold' : ''}`}>
        <span className="italic">{label}</span>
        <span>{value.toFixed(decimals)}</span>
    </div>
);
