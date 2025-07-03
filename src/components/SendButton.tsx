// // src/components/SendButton.tsx
// import React from 'react';
// import "@ton/test-utils"
// import { Address, beginCell, Cell, comment, ContractProvider, fromNano, Sender, SenderArguments, SendMode, Slice, toNano } from "@ton/core"
// import { SandboxContract, TreasuryContract, Blockchain, loadConfig, RemoteBlockchainStorage, wrapTonClient4ForRemote, BlockchainConfig, printTransactionFees, prettyLogTransactions } from "@ton/sandbox"
// import {
//     JettonMinter,
//     JettonTransfer,
//     JettonUpdateContent,
//     Mint,
// } from "../smartContract/Basic Jetton_JettonMinter"

// import {
//     AddDealWithTon,
//     AddJetton,
//     JettonNotification,
//     JettonReceiver,
//     storeAddDealWithTon,
//     storeAddJetton,
//     WithdrawJetton,
//     storeWithdrawTon,
//     storeWithdrawJetton,
//     storeCancelDeal,
//     WithdrawTon
// } from "../smartContract/JettonReceiver_JettonReceiver"

// import { JettonWallet, storeJettonNotification } from "../smartContract//Basic Jetton_JettonWallet"
// import { TonClient4 } from "@ton/ton"
// import { getHttpV4Endpoint } from "@orbs-network/ton-access"
// import { useSandbox } from '../hooks/useSandbox';

// interface SendButtonProps {
//     willSend: string;
//     partnerAddress: string;
// }

// interface JettonDeployersDictionary {
//     [key: number]: SandboxContract<TreasuryContract>;
// }

// const blockchain = useSandbox();
// let jettonsData: any
// let jettonReceiverContract: SandboxContract<JettonReceiver>
// let contractOwner: SandboxContract<TreasuryContract>
// let user1: SandboxContract<TreasuryContract>
// let user2: SandboxContract<TreasuryContract>
// let jettonDeployers: JettonDeployersDictionary
// let jettonId1 = 1
// let jettonId2 = 2
// const SEND_TON_FEE = 0.105;
// const COMISSION_RATE = 1.001;
// const TON_ID = 0;
// const FORWARD_TON_AMOUNT = toNano(0.06);

// export const SendButton: React.FC<SendButtonProps> = ({
//     willSend,
//     partnerAddress,
// }) => {

//     const handleSend = async () => {
//         if (!blockchain) {
//             console.error('Sandbox ещё не инициализирован');
//             return;
//         }
//         if (!partnerAddress) {
//             console.error('Адрес партнёра не указан');
//             return;
//         }

//         let value: bigint;
//         try {
//             // конвертируем строку "willSend" в нанотоны
//             value = toNano(willSend || '0');
//         } catch {
//             console.error('Невалидное значение для отправки:', willSend);
//             return;
//         }

//         try {
//             // const treasury = blockchain.treasury;
//             const to = Address.parse(partnerAddress.trim());
//             let user1 = await blockchain.treasury("user1")
            
//             // const result = await treasury.send({ to, value });
//             // console.log('Транзакция успешно отправлена, id:', result.transaction.id);
//         } catch (e) {
//             console.error('Ошибка при отправке в sandbox:', e);
//         }
//     };

//     return (
//         <button
//             onClick={handleSend}
//             className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
//         >
//             отправить
//         </button>
//     );
// };
