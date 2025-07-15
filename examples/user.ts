import {
    WalletContractV3R2,
    internal,
    SendMode,
    toNano,
    WalletContractV4,
    Cell,
    OpenedContract,
    Dictionary
} from '@ton/ton';

import { TupleReader, Address, beginCell, contractAddress } from '@ton/core';

import { mnemonicToPrivateKey } from '@ton/crypto';
import { MethodExecutionResult, TonApiClient } from '@ton-api/client';
import { ContractAdapter } from '@ton-api/ton-adapter';
import 'dotenv/config';
import {
    AddJetton,
    ClearDeals,
    dictValueParserDealInfo,
    dictValueParserJettonData,
    JettonTransfer,
    loadTupleDealInfo,
    storeAddJetton,
    storeClearDeals,
    storeJettonTransfer,
    storeWithdrawJetton,
    storeWithdrawTon,
    WithdrawJetton,
    WithdrawTon
} from '../build/JettonReceiver/JettonReceiver_JettonReceiver';
import { tonDeepLink } from '@ton/blueprint';

interface DealParameters {
    dealId: number
    sendedAmount: number
    sendedJettonId: number
    expectedAmount: number
    expectedJettonId: number
}

export class User {
    public ta: TonApiClient;
    public methodName: string;
    public methodParams: string;
    public owner: boolean;
    public mnemonics: Array<string>;
    public messageCodes: {
        AddJetton: number;
        AddDealWithTon: number;
        CancelDeal: number;
        WithdrawTon: number;
        WithdrawJetton: number
    };
    public keyPair: any;
    public wallet!: WalletContractV4 | WalletContractV3R2;
    public contract!: OpenedContract<WalletContractV4 | WalletContractV3R2>;
    public BASE_URL: string
    public TONAPI_API_KEY: string
    public CONTRACT_ADDRESS: string
    public MNEMONICS: string
    public JETTON_1_MASTER: string
    public JETTON_2_MASTER: string
    public OWNER_ADDRESS: string
    public SECOND_ADDRESS: string

    constructor(owner: boolean, method: string, methodParams: string) {
        let envv = process.env as any
        this.BASE_URL = envv.BASE_URL
        this.TONAPI_API_KEY = envv.TONAPI_API_KEY
        this.CONTRACT_ADDRESS = envv.CONTRACT_ADDRESS
        this.MNEMONICS = envv.WALLET_MNEMONIC
        this.JETTON_1_MASTER = envv.JETTON_1_MASTER
        this.JETTON_2_MASTER = envv.JETTON_2_MASTER
        this.OWNER_ADDRESS = envv.OWNER_ADDRESS
        this.SECOND_ADDRESS = envv.SECOND_ADDRESS

        this.ta = new TonApiClient({
            baseUrl: this.BASE_URL,
            apiKey: this.TONAPI_API_KEY // Optional, improves limits and access
        });
        this.methodName = method;
        this.methodParams = methodParams;
        this.owner = owner
        this.mnemonics = (this.MNEMONICS).split(' ')
        this.messageCodes = {
            AddJetton: 120,
            AddDealWithTon: 121,
            CancelDeal: 123,
            WithdrawTon: 124,
            WithdrawJetton: 125,
        }

        this.init()
    }

    async init() {
        this.keyPair = await mnemonicToPrivateKey(this.mnemonics); // Generate key pair
        let params = { workchain: 0, publicKey: this.keyPair.publicKey }

        if (this.owner) {
            this.wallet = WalletContractV4.create(params)
        } else
            this.wallet = WalletContractV3R2.create(params)

        console.log(`OWNER: ${this.owner}, my address: ${this.wallet.address.toString()}`);

        const adapter = new ContractAdapter(this.ta);

        this.contract = adapter.open(this.wallet); // Open the contract using the adapter
        if (this.methodName) {
            console.log(`method: ${this.methodName}`);
            let method = (this as any)[this.methodName]
            if (method != null) {
                if (this.methodParams != '')
                    (this as any)[this.methodName](this.methodParams)
                else
                    (this as any)[this.methodName]()
            }
        }
    }

    async sendTransaction(address: string, payload: Cell | string, value: string | number = '0.1') {
        const seqno = await this.contract.getSeqno(); // Required for transaction signing


        let tx = await this.contract.sendTransfer({
            secretKey: this.keyPair.secretKey, // Sign transaction with the private key
            seqno, // Use the latest seqno
            sendMode: SendMode.PAY_GAS_SEPARATELY, // Specify sending mode
            messages: [
                internal({
                    to: address, // Recipient address
                    value: toNano(value),
                    body: payload // Optional message body
                })
            ]
        })
            .then((result) => {
                console.log('✅ Transfer successful');
            })
            .catch((error) => {
                console.error('❌ Transfer failed:', error);
            });
    }

    async sendMessageToContract(payload: Cell | string, value: string | number = '0.01') {
        await this.sendTransaction(this.CONTRACT_ADDRESS, payload, value)
    }

    async getWalletCode(jettonMasterAddress: string): Promise<Cell> {
        const res = await this.ta.blockchain.execGetMethodForBlockchainAccount(Address.parse(jettonMasterAddress), 'get_jetton_data');
        let { jettonWalletCode } = res.decoded
        let cell = Cell.fromBoc(Buffer.from(jettonWalletCode, 'hex'))[0]
        return cell
    }

    async addJetton1Address() {
        this.addJettonAddress(this.JETTON_1_MASTER, 1)
    }

    async addJetton2Address() {
        this.addJettonAddress(this.JETTON_2_MASTER, 2)
    }

    // async addJetton(jettonMasterAddress: string, id: number) {
    //     let jetton_wallet_code = await this.getWalletCode(jettonMasterAddress);
    //     let data: AddJetton = {
    //         $$type: 'AddJetton',
    //         minterAddress: Address.parse(jettonMasterAddress),
    //         jettonWalletCode: jetton_wallet_code,
    //         id: BigInt(id),
    //     }
    //     let payload = beginCell().store(storeAddJetton(data)).endCell();
    //     this.sendMessageToContract(payload, '0.1');
    // }

    async widthdrawJettonFromContract() {
        // console.log(Address.parse("kQDgFtSBhicdIOtM_G0W7-dKH34z2zGBOsD9A06XLiRxUrWa"))
        // return
        let data: WithdrawJetton = {
            $$type: 'WithdrawJetton',
            contractJettonWallet: Address.parse("EQDvkA6Cgsd0N6RkogHEDlgcxnEQRxVHGTKz-O6UX05kCvDK"),
            value: toNano(1),
            destination: Address.parse(this.SECOND_ADDRESS),
        }
        let payload = beginCell().store(storeWithdrawJetton(data)).endCell();
        this.sendMessageToContract(payload, '0.1');
    }

    async widthdrawTonFromContract() {
        // console.log(Address.parse("kQDgFtSBhicdIOtM_G0W7-dKH34z2zGBOsD9A06XLiRxUrWa"))
        // return
        let data: WithdrawTon = {
            $$type: 'WithdrawTon',
            // contractJettonWallet: Address.parse("EQDvkA6Cgsd0N6RkogHEDlgcxnEQRxVHGTKz-O6UX05kCvDK"),
            value: toNano(2),
            destination: null,
        }
        let payload = beginCell().store(storeWithdrawTon(data)).endCell();
        this.sendMessageToContract(payload, '0.1');
    }

    async addJettonAddress(jettonMasterAddress: string, id: number) {
        let jettonWallet = await this.getJettonWalletAddressFromTonapi(jettonMasterAddress, Address.parse(this.CONTRACT_ADDRESS))
        let data: AddJetton = {
            $$type: 'AddJetton',
            myAddress: jettonWallet,
            id: BigInt(id),
            name: `Jetton_${id}`
        }
        let payload = beginCell().store(storeAddJetton(data)).endCell();
        this.sendMessageToContract(payload, '0.1');
    }

    getDealParams(): DealParameters {
        let jettonId1 = this.owner ? 1 : 2
        let jettonId2 = this.owner ? 2 : 1
        let dealId = 5
        let dealParams: DealParameters = {
            dealId,
            sendedAmount: this.owner ? 10 : 20,
            sendedJettonId: jettonId1,
            expectedAmount: this.owner ? 20 : 10,
            expectedJettonId: jettonId2,
        }
        return dealParams
    }

    async addDeal() {
        let dealParams = this.getDealParams()
        const jettonTransferAmount = toNano(dealParams.sendedAmount)
        const jettonTransferForwardPayload = beginCell()
            .storeUint(dealParams.dealId, 32)
            .storeCoins(toNano(dealParams.expectedAmount))
            .storeUint(dealParams.expectedJettonId, 16)
            .storeUint(1, 8)
        jettonTransferForwardPayload.endCell()

        let jettonMasterAddress = this.owner ? this.JETTON_1_MASTER : this.JETTON_2_MASTER
        let jettonWallet = await this.getJettonWalletAddressFromTonapi(jettonMasterAddress, this.wallet.address)

        const transferMsg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: jettonTransferAmount,
            responseDestination: this.wallet.address,
            forwardTonAmount: toNano('0.1'),
            forwardPayload: jettonTransferForwardPayload.asSlice(),
            destination: Address.parse(this.CONTRACT_ADDRESS),
            customPayload: null,
        }
        let payload = beginCell().store(storeJettonTransfer(transferMsg)).endCell();
        await this.sendTransaction(jettonWallet.toString(), payload, '1');
    }

    async sendJettonToContract() {
        let dealParams = this.getDealParams()
        const jettonTransferAmount = toNano(dealParams.sendedAmount)
        const jettonTransferForwardPayload = beginCell()
            .storeUint(dealParams.dealId, 128)
            .storeCoins(toNano(dealParams.expectedAmount))
            .storeUint(dealParams.expectedJettonId, 16)
            .storeUint(1, 8)
        jettonTransferForwardPayload.endCell()

        let jettonMasterAddress = this.owner ? this.JETTON_1_MASTER : this.JETTON_2_MASTER
        let jettonWallet = await this.getJettonWalletAddressFromTonapi(jettonMasterAddress, this.wallet.address)

        const transferMsg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: jettonTransferAmount,
            responseDestination: this.wallet.address,
            forwardTonAmount: toNano('0.1'),
            forwardPayload: jettonTransferForwardPayload.asSlice(),
            destination: Address.parse(this.CONTRACT_ADDRESS),
            customPayload: null,
        }
        let payload = beginCell().store(storeJettonTransfer(transferMsg)).endCell();
        await this.sendTransaction(jettonWallet.toString(), payload, '1');
    }

    async sendJetton(destination: Address) { }

    async clearJettons() {
        await this.sendMessageToContract('clearJettons', '0.1');
    }

    async clearDeals() {
        let data: ClearDeals = {
            $$type: 'ClearDeals'
        }
        let payload = beginCell().store(storeClearDeals(data)).endCell();
        await this.sendMessageToContract(payload, '0.1');
    }

    async getJettonsAddresses() {
        const res = await this.getFromContract('jettons');
        let source = new TupleReader(res.stack)
        const result = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonData(), source.readCellOpt());
        console.log(result)
    }

    async getDeals() {
        const res = await this.getFromContract('deals');
        let source = new TupleReader(res.stack)
        const result = Dictionary.loadDirect(Dictionary.Keys.BigInt(32), dictValueParserDealInfo(), source.readCellOpt());
        console.log(result)
    }

    async getDealById(dealId: number) {
        dealId = 3
        const res = await this.getFromContract('dealById', dealId.toString());
        let source = new TupleReader(res.stack)
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleDealInfo(result_p) : null;
        console.log(result)
    }

    async getAddress() {
        const res = await this.getFromContract('address');
        console.log(res)
        let source = new TupleReader(res.stack)
        const result = source.readAddress();
        console.log(result)
    }

    async getFromContract(name: string, arg?: string): Promise<MethodExecutionResult> {
        let query = arg ? { args: [arg] } : undefined
        return await this.ta.blockchain.execGetMethodForBlockchainAccount(Address.parse(this.CONTRACT_ADDRESS), name, query);
    }

    async test() {
        let res = await this.getJettonWalletAddressFromTonapi(this.JETTON_1_MASTER, Address.parse(this.CONTRACT_ADDRESS))
        console.log(res)
        let code = await this.getWalletCode(this.JETTON_1_MASTER)
        console.log(code)

        // this.getJettonWalletAddressJT1()
    }

    async getJettonWalletAddressJT1(): Promise<Address> {
        let code = await this.getWalletCode(this.JETTON_1_MASTER)
        let result = this.getJettonWalletAddress(this.wallet.address, code)
        return result
    }

    async getJettonWalletAddressJT2(): Promise<Address> {
        let code = await this.getWalletCode(this.JETTON_2_MASTER)
        return this.getJettonWalletAddress(this.wallet.address, code)
    }

    getJettonWalletAddress(walletAddress: Address, jettonWalletCode: Cell): Address {
        const dataCell = beginCell()
            .storeAddress(walletAddress)
            .storeAddress(Address.parse(this.JETTON_1_MASTER))
            .storeRef(jettonWalletCode)
            .endCell();
        const jettonWalletAddress = contractAddress(0, { code: jettonWalletCode, data: dataCell });
        return jettonWalletAddress
    }

    async getJettonWalletAddressFromTonapi(masterAddress: string, walletAddress: Address): Promise<Address> {
        console.log(masterAddress)
        console.log(walletAddress.toString())
        let url = `${this.BASE_URL}/v2/blockchain/accounts/${masterAddress}/methods/get_wallet_address?args=${walletAddress.toString()}`
        let response = await fetch(url);
        let data = await response.json()
        return Address.parse(data.decoded.jetton_wallet_address)
    }
}

