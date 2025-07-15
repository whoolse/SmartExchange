// src/services/tonConnectWrapper.tsx

import { Address, beginCell, toNano } from "@ton/core";
import { currencies, myContractAddress, tonApiBaseUrl } from "../constants/constants";
import { SendTransactionRequest, TonConnectUI } from "@tonconnect/ui-react";
import { JettonTransfer, storeJettonTransfer, AddDealWithTon, storeAddDealWithTon, CancelDeal, storeCancelDeal } from "../smartContract/JettonReceiver_JettonReceiver";
import { DealParameters } from "../components/TonSendTransaction";


export class TonConnectWrapper {
    static async sendJettonDeal(
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
            partnerAddressString,
        } = dealParams;

        const expectedCurrencyId = currencies[expectedCurrencyName].id;
        const jettonMasterAddress = currencies[sendedCurrencyName].masterAddress;
        const jettonTransferAmount = toNano(sendedAmount.toString());

        const jettonTransferForwardPayload = beginCell()
            .storeUint(dealId, 32)
            .storeCoins(toNano(expectedAmount))
            .storeUint(expectedCurrencyId, 16)
        // .endCell();

        if (partnerAddressString && partnerAddressString != '') {
            const addr = Address.parse(partnerAddressString);
            const subCell = beginCell()
                .storeAddress(addr)
                .endCell();
            jettonTransferForwardPayload.storeRef(subCell)
        }

        const myJettonWallet = await this.getJettonWalletAddressFromTonapi(
            jettonMasterAddress,
            myAddress
        );

        const transferMsg: JettonTransfer = {
            $$type: 'JettonTransfer',
            queryId: 0n,
            amount: jettonTransferAmount,
            responseDestination: myAddress,
            forwardTonAmount: toNano('0.06'),
            forwardPayload: jettonTransferForwardPayload.asSlice(),
            destination: Address.parse(myContractAddress),
            customPayload: null,
        };
        const payload = beginCell().store(storeJettonTransfer(transferMsg)).endCell().toBoc().toString("base64");
        await this.sendTransaction(toNano('0.4'), payload, tonConnectUI, myJettonWallet.toString());
    }

    static async sendTonDeal(
        dealParams: DealParameters,
        tonConnectUI: TonConnectUI
    ) {
        const {
            dealId,
            sendedAmount,
            expectedAmount,
            expectedCurrencyName,
            partnerAddressString: partnerAddress,
        } = dealParams;

        const expectedJettonId = BigInt(currencies[expectedCurrencyName].id);

        const transferMsg: AddDealWithTon = {
            $$type: 'AddDealWithTon',
            dealId: BigInt(dealId),
            expectedAmount: toNano(expectedAmount),
            expectedJettonId: expectedJettonId,
            partnerAddress: partnerAddress != '' ? Address.parse(partnerAddress) : null
        };
        console.log(transferMsg)
        const payload = beginCell().store(storeAddDealWithTon(transferMsg)).endCell().toBoc().toString("base64");
        await this.sendTransaction(toNano(sendedAmount), payload, tonConnectUI);
    }

    static async sendTransaction(amount: bigint, payload: string, tonConnectUI: TonConnectUI, address: string = myContractAddress) {
        const validUntil = Math.floor(Date.now() / 1000) + 60;
        const transaction: SendTransactionRequest = {
            validUntil,
            messages: [
                {
                    address: address,
                    amount: amount.toString(),
                    payload
                },
            ],
        };

        await tonConnectUI.sendTransaction(transaction, { returnStrategy: "back" });
    }

    static async cancelDealById(dealId: string, tonConnectUI: TonConnectUI) {
        const transferMsg: CancelDeal = {
            $$type: 'CancelDeal',
            dealId: BigInt(dealId)
        };
        const payload = beginCell().store(storeCancelDeal(transferMsg)).endCell().toBoc().toString("base64");
        await this.sendTransaction(toNano('0.1'), payload, tonConnectUI);
    }

    static async getJettonWalletAddressFromTonapi(
        masterAddress: string,
        walletAddress: Address
    ): Promise<Address> {
        const url = `${tonApiBaseUrl}/v2/blockchain/accounts/${masterAddress}/methods/get_wallet_address?args=${walletAddress.toString()}`;
        const response = await fetch(url);
        const data = await response.json();
        return Address.parse(data.decoded.jetton_wallet_address);
    }

    static createCell(): string {
        const body = beginCell()
            .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
            .storeStringTail("TEST") // write our text comment
            .endCell();
        return body.toBoc().toString("base64")
    }

}
