import React, { createContext, useContext, ReactNode, useState } from 'react';

interface TestnetContextValue {
    isTestnet: boolean;
    setTestnet: (value: boolean) => void;
}

const TestnetContext = createContext<TestnetContextValue | undefined>(undefined);

export const TestnetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isTestnet, setTestnet] = useState(true);

    return (
        <TestnetContext.Provider value={{ isTestnet, setTestnet }}>
            {children}
        </TestnetContext.Provider>
    );
};

// хук для потребления
export function useTestnet(): TestnetContextValue {
    const ctx = useContext(TestnetContext);
    if (!ctx) {
        throw new Error('useTestnet must be used within a TestnetProvider');
    }
    return ctx;
}
