// // src/context/SandboxProvider.tsx
// import React, {  useState, useEffect, ReactNode } from 'react';
// import { Blockchain } from '@ton/sandbox';
// import { SandboxContext } from './SandboxContext';

// interface SandboxProviderProps {
//     children: ReactNode;
// }

// export const SandboxProvider: React.FC<SandboxProviderProps> = ({ children }) => {
//     const [blockchain, setBlockchain] = useState<Blockchain | null>(null);

//     useEffect(() => {
//         (async () => {
//             const bc = await Blockchain.create();    // создаёт локальный эмулятор TON :contentReference[oaicite:3]{index=3}
//             setBlockchain(bc);
//         })();
//     }, []);

//     // пока эмулятор не готов, можно показать лоадер или вернуть null
//     if (!blockchain) {
//         return <div>Загрузка Sandbox...</div>;
//     }

//     return (
//         <SandboxContext.Provider value={blockchain}>
//             {children}
//         </SandboxContext.Provider>
//     );
// };
