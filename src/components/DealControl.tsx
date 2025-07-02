// src/components/DealControl.tsx
import React, { useState } from 'react';

interface DealControlProps {
    apiUrl: string;
    onDealData: (data: any) => void;
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
            const res = await fetch(`${apiUrl}/${dealId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            onDealData(data);
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
