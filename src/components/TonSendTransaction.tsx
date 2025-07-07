// src/components/TonSendTransaction.tsx
import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from '@ton/core';
import { JettonTransfer } from '../smartContract/JettonReceiver_JettonReceiver';
import { myContractAddress, tonApiBaseUrl } from '../constants/constants';

interface TonSendTransactionProps {
    /** Код актива, который отправляем */
    sendAsset: string;
    /** Сумма отправки */
    sendAmount: string;
    /** Код актива, который получаем */
    receiveAsset: string;
    /** Сумма получения партнёром */
    receiveAmount: string;
    /** Адрес партнёра */
    partnerAddress: string;
    /** Колбэк с результатом транзакции */
    onResult?: (res: any) => void;
    /** Рендер-проп: получает функцию отправки */
    children: (send: () => Promise<void>) => React.ReactNode;
}

interface DealParameters {
    dealId: number
    sendedAmount: number
    sendedCurrencyId: number
    expectedAmount: number
    expectedJettonId: number
}

async function getJettonWalletAddressFromTonapi(masterAddress: string, walletAddress: Address): Promise<Address> {
    console.log(masterAddress)
    console.log(walletAddress.toString())
    let url = `${tonApiBaseUrl}/v2/blockchain/accounts/${masterAddress}/methods/get_wallet_address?args=${walletAddress.toString()}`
    let response = await fetch(url);
    let data = await response.json()
    return Address.parse(data.decoded.jetton_wallet_address)
}

async function sendDeal(dealParams) {
    const jettonTransferAmount = toNano(dealParams.sendedAmount)
    const jettonTransferForwardPayload = beginCell()
        .storeUint(dealParams.dealId, 32)
        .storeCoins(toNano(dealParams.expectedAmount))
        .storeUint(dealParams.expectedJettonId, 16)
        .storeUint(1, 8)
    jettonTransferForwardPayload.endCell()

    let jettonMasterAddress = this.owner ? this.JETTON_1_MASTER : this.JETTON_2_MASTER
    let jettonWallet = await getJettonWalletAddressFromTonapi(jettonMasterAddress, this.wallet.address)

    const transferMsg: JettonTransfer = {
        $$type: "JettonTransfer",
        queryId: 0n,
        amount: jettonTransferAmount,
        responseDestination: this.wallet.address,
        forwardTonAmount: toNano('0.1'),
        forwardPayload: jettonTransferForwardPayload.asSlice(),
        destination: Address.parse(myContractAddress),
        customPayload: null,
    }
    let payload = beginCell().store(storeJettonTransfer(transferMsg)).endCell();
    await this.sendMessage(jettonWallet.toString(), payload, '1');
}

export const TonSendTransaction: React.FC<TonSendTransactionProps> = ({
    sendAsset,
    sendAmount,
    receiveAsset,
    receiveAmount,
    partnerAddress,
    onResult,
    children,
}) => {
    const [tonConnectUI] = useTonConnectUI();

    const send = async () => {
        if (!tonConnectUI) {
            console.error('TonConnect UI не инициализирован');
            return;
        }
        if (!partnerAddress) {
            console.error('Не указан адрес партнёра');
            return;
        }

        // Время жизни транзакции (секунды)
        const validUntil = Math.floor(Date.now() / 1000) + 60;

        let amountNano: string;
        try {
            amountNano = toNano(sendAmount || '0').toString();
        } catch {
            console.error('Невалидное количество для отправки:', sendAmount);
            return;
        }

        const transaction = {
            validUntil,
            messages: [
                {
                    address: partnerAddress,
                    amount: amountNano,
                },
            ],
        };

        try {
            let dealParams: DealParameters = {
                sendedCurrencyId: +sendAsset,
                sendedAmount: +sendAmount
                receiveAsset,
                receiveAmount,
                partnerAddress
            }
            await sendDeal(dealParams)
            const result = await tonConnectUI.sendTransaction(transaction);
            console.log('Отправлено через TonConnect:', {
                result,
                sendAsset,
                sendAmount,
                receiveAsset,
                receiveAmount,
                partnerAddress,
            });
            onResult?.(result);
        } catch (e) {
            console.error('Ошибка sendTransaction:', e);
            onResult?.({ error: e });
        }
    };

    return <>{children(send)}</>;
};
