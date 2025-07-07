// src/components/TonSendTransaction.tsx
import React from 'react';
import {
    SendTransactionRequest,
    TonConnectUI,
    useTonAddress,
    useTonConnectUI,
} from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from '@ton/core';
import {
    JettonTransfer,
    storeJettonTransfer,
} from '../smartContract/JettonReceiver_JettonReceiver';
import {
    myContractAddress,
    tonApiBaseUrl,
    currencies,
} from '../constants/constants';

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
    dealId: number;
    sendedAmount: number;
    sendedCurrencyName: string;
    expectedAmount: number;
    expectedCurrencyName: string;
    partnerAddress?: string;
}

async function getJettonWalletAddressFromTonapi(
    masterAddress: string,
    walletAddress: Address
): Promise<Address> {
    const url = `${tonApiBaseUrl}/v2/blockchain/accounts/${masterAddress}/methods/get_wallet_address?args=${walletAddress.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return Address.parse(data.decoded.jetton_wallet_address);
}

function createCell():string {
    const body = beginCell()
        .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
        .storeStringTail("TEST") // write our text comment
        .endCell();
    return body.toBoc().toString("base64")
}

async function sendJetton(
    dealParams: DealParameters,
    tonConnectUI: TonConnectUI,
    myAddress: Address
) {
    const {
        dealId,
        sendedAmount,
        sendedCurrencyName,
        expectedAmount,
        expectedCurrencyName,
        partnerAddress,
    } = dealParams;

    const expectedCurrencyId = currencies[expectedCurrencyName].id;
    const jettonMasterAddress = currencies[sendedCurrencyName].masterAddress;
    const jettonTransferAmount = toNano(sendedAmount.toString());

    const forwardPayload = beginCell()
        .storeUint(dealId, 32)
        .storeCoins(toNano(expectedAmount))
        .storeUint(expectedCurrencyId, 16)
        .endCell();

    const myJettonWallet = await getJettonWalletAddressFromTonapi(
        jettonMasterAddress,
        myAddress
    );

    const transferMsg: JettonTransfer = {
        $$type: 'JettonTransfer',
        queryId: 0n,
        amount: jettonTransferAmount,
        responseDestination: myAddress,
        forwardTonAmount: toNano('0.1'),
        forwardPayload: forwardPayload.asSlice(),
        destination: Address.parse(myContractAddress),
        customPayload: null,
    };
    const payload = beginCell().store(storeJettonTransfer(transferMsg)).endCell();

    const validUntil = Math.floor(Date.now() / 1000) + 60;
    const transaction: SendTransactionRequest = {
        validUntil,
        messages: [
            {
                address: myJettonWallet.toString(),
                amount: toNano('0.4').toString(),
                // payload: createCell()
                payload: payload.toBoc().toString("base64"),
            },
        ],
    };

    await tonConnectUI.sendTransaction(transaction);
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
    const address = useTonAddress();
    const send = async () => {
        if (!tonConnectUI) {
            console.error('TonConnect UI не инициализирован');
            return;
        }
        console.log('TonSendTransaction')

        let amountNano: string;
        try {
            amountNano = toNano(sendAmount || '0').toString();
        } catch {
            console.error('Невалидное количество для отправки:', sendAmount);
            return;
        }

        try {
            const dealParams: DealParameters = {
                dealId: 1,
                sendedCurrencyName: sendAsset,
                sendedAmount: +sendAmount,
                expectedAmount: +receiveAmount,
                expectedCurrencyName: receiveAsset,
                partnerAddress,
            };
            console.log(dealParams);
            await sendJetton(dealParams, tonConnectUI, Address.parse(address!));
     
            onResult?.({ success: true });
        } catch (e) {
            console.error('Ошибка sendTransaction:', e);
            onResult?.({ error: e });
        }
    };

    return <>{children(send)}</>;
};
