// src/contexts/BalanceContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BalanceContextType {
    balance: string;
    setBalance: React.Dispatch<React.SetStateAction<string>>;
}

const BalanceContext = createContext<BalanceContextType>({
    balance: '0',
    setBalance: () => { },
});

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [balance, setBalance] = useState<string>('0');
    return (
        <BalanceContext.Provider value={{ balance, setBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

// Хук для удобного доступа
export function useBalance() {
    return useContext(BalanceContext);
}
