// src/components/TonSendTransaction.tsx
import React from 'react';
import { SendTransactionRequest, TonConnectUI, useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from '@ton/core';
import { JettonTransfer, storeJettonTransfer } from '../smartContract/JettonReceiver_JettonReceiver';
import { myContractAddress, tonApiBaseUrl, currencies } from '../constants/constants';

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
    sendedCurrencyName: string
    expectedAmount: number
    expectedCurrencyName: string
    partnerAddress?: string
}



async function getJettonWalletAddressFromTonapi(masterAddress: string, walletAddress: Address): Promise<Address> {
    console.log(masterAddress)
    console.log(walletAddress.toString())
    let url = `${tonApiBaseUrl}/v2/blockchain/accounts/${masterAddress}/methods/get_wallet_address?args=${walletAddress.toString()}`
    let response = await fetch(url);
    let data = await response.json()
    return Address.parse(data.decoded.jetton_wallet_address)
}

async function sendJetton(dealParams: DealParameters, tonConnectUI: TonConnectUI) {
    let { dealId, sendedAmount, sendedCurrencyName, expectedAmount,
        expectedCurrencyName, partnerAddress } = dealParams
    let expectedCurrencyId = currencies[expectedCurrencyName].id
    let jettonMasterAddress = currencies[sendedCurrencyName].masterAddress
    const address = useTonAddress();
    let myAddress = Address.parse(address)
    const jettonTransferAmount = toNano(sendedAmount)

    const jettonTransferForwardPayload = beginCell()
        .storeUint(dealId, 32)
        .storeCoins(toNano(expectedAmount))
        .storeUint(expectedCurrencyId, 16)
        // .storeUint(1, 8)
    jettonTransferForwardPayload.endCell()

    let myJettonWallet = await getJettonWalletAddressFromTonapi(jettonMasterAddress, myAddress)

    const transferMsg: JettonTransfer = {
        $$type: "JettonTransfer",
        queryId: 0n,
        amount: jettonTransferAmount,
        responseDestination: myAddress,
        forwardTonAmount: toNano('0.1'),
        forwardPayload: jettonTransferForwardPayload.asSlice(),
        destination: Address.parse(myContractAddress),
        customPayload: null,
    }
    let payload = beginCell().store(storeJettonTransfer(transferMsg)).endCell();

    const validUntil = Math.floor(Date.now() / 1000) + 60;

    let transaction: SendTransactionRequest = {
        validUntil,
        messages: [
            {
                address: myJettonWallet.toString(),
                amount: toNano('0.1').toString(),
                payload: payload.toBoc().toString()
            },
        ],
    }
    const result = await tonConnectUI.sendTransaction(transaction);
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
    const send = async () => {
        const [tonConnectUI] = useTonConnectUI();
        const wallet = useTonWallet();
        if (!tonConnectUI) {
            console.error('TonConnect UI не инициализирован');
            return;
        }
        if (!partnerAddress) {
            console.error('Не указан адрес партнёра');
            return;
        }

        let amountNano: string;
        try {
            amountNano = toNano(sendAmount || '0').toString();
        } catch {
            console.error('Невалидное количество для отправки:', sendAmount);
            return;
        }

        try {
            let dealParams: DealParameters = {
                sendedCurrencyName: sendAsset,
                sendedAmount: +sendAmount,
                expectedAmount: +receiveAmount,
                expectedCurrencyName: sendAsset,
                partnerAddress: partnerAddress,
                dealId: 1,
            }

            await sendJetton(dealParams, tonConnectUI)
            console.log('Отправлено через TonConnect:', {
                sendAsset,
                sendAmount,
                receiveAsset,
                receiveAmount,
                partnerAddress,
            });
        } catch (e) {
            console.error('Ошибка sendTransaction:', e);
            onResult?.({ error: e });
        }
    };

    return <>{children(send)}</>;
};
