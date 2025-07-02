// src/components/CreateDealButton.tsx
import React from 'react';

export const CreateDealButton: React.FC = () => {
    // Логика создания сделки теперь внутри компонента
    const handleCreate = () => {
        console.log('Создать новую сделку');
        // TODO: здесь ваша логика создания сделки (например, POST-запрос)
    };

    return (
        <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
            создать сделку
        </button>
    );
};
