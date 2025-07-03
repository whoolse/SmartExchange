// src/hooks/useSandbox.ts
import { useEffect, useState } from 'react';
import { Blockchain } from '@ton/sandbox';

export function useSandbox() {
    const [blockchain, setBlockchain] = useState<Blockchain | null>(null);

    useEffect(() => {
        (async () => {
            // Создаёт локальную сеть с дефолтным конфигом
            const bc = await Blockchain.create();
            setBlockchain(bc);
        })();
    }, []);

    return blockchain;
}
