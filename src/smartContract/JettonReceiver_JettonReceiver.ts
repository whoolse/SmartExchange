import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type JettonNotification = {
    $$type: 'JettonNotification';
    queryId: bigint;
    amount: bigint;
    sender: Address;
    forwardPayload: Slice;
}

export function storeJettonNotification(src: JettonNotification) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadJettonNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _sender = sc_0.loadAddress();
    const _forwardPayload = sc_0;
    return { $$type: 'JettonNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

export function loadTupleJettonNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

export function loadGetterTupleJettonNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

export function storeTupleJettonNotification(source: JettonNotification) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserJettonNotification(): DictionaryValue<JettonNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonNotification(src.loadRef().beginParse());
        }
    }
}

export type JettonTransfer = {
    $$type: 'JettonTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    responseDestination: Address | null;
    customPayload: Cell | null;
    forwardTonAmount: bigint;
    forwardPayload: Slice;
}

export function storeJettonTransfer(src: JettonTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forwardTonAmount);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadJettonTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    const _responseDestination = sc_0.loadMaybeAddress();
    const _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _forwardTonAmount = sc_0.loadCoins();
    const _forwardPayload = sc_0;
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadTupleJettonTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _responseDestination = source.readAddressOpt();
    const _customPayload = source.readCellOpt();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadGetterTupleJettonTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _responseDestination = source.readAddressOpt();
    const _customPayload = source.readCellOpt();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function storeTupleJettonTransfer(source: JettonTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardTonAmount);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserJettonTransfer(): DictionaryValue<JettonTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransfer(src.loadRef().beginParse());
        }
    }
}

export type AddDealWithTon = {
    $$type: 'AddDealWithTon';
    dealId: bigint;
    expectedJettonId: bigint;
    expectedAmount: bigint;
}

export function storeAddDealWithTon(src: AddDealWithTon) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(121, 32);
        b_0.storeUint(src.dealId, 32);
        b_0.storeUint(src.expectedJettonId, 32);
        b_0.storeCoins(src.expectedAmount);
    };
}

export function loadAddDealWithTon(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 121) { throw Error('Invalid prefix'); }
    const _dealId = sc_0.loadUintBig(32);
    const _expectedJettonId = sc_0.loadUintBig(32);
    const _expectedAmount = sc_0.loadCoins();
    return { $$type: 'AddDealWithTon' as const, dealId: _dealId, expectedJettonId: _expectedJettonId, expectedAmount: _expectedAmount };
}

export function loadTupleAddDealWithTon(source: TupleReader) {
    const _dealId = source.readBigNumber();
    const _expectedJettonId = source.readBigNumber();
    const _expectedAmount = source.readBigNumber();
    return { $$type: 'AddDealWithTon' as const, dealId: _dealId, expectedJettonId: _expectedJettonId, expectedAmount: _expectedAmount };
}

export function loadGetterTupleAddDealWithTon(source: TupleReader) {
    const _dealId = source.readBigNumber();
    const _expectedJettonId = source.readBigNumber();
    const _expectedAmount = source.readBigNumber();
    return { $$type: 'AddDealWithTon' as const, dealId: _dealId, expectedJettonId: _expectedJettonId, expectedAmount: _expectedAmount };
}

export function storeTupleAddDealWithTon(source: AddDealWithTon) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.dealId);
    builder.writeNumber(source.expectedJettonId);
    builder.writeNumber(source.expectedAmount);
    return builder.build();
}

export function dictValueParserAddDealWithTon(): DictionaryValue<AddDealWithTon> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddDealWithTon(src)).endCell());
        },
        parse: (src) => {
            return loadAddDealWithTon(src.loadRef().beginParse());
        }
    }
}

export type StringData = {
    $$type: 'StringData';
    valueInt: bigint;
    valueString: string;
}

export function storeStringData(src: StringData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(122, 32);
        b_0.storeUint(src.valueInt, 128);
        b_0.storeStringRefTail(src.valueString);
    };
}

export function loadStringData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 122) { throw Error('Invalid prefix'); }
    const _valueInt = sc_0.loadUintBig(128);
    const _valueString = sc_0.loadStringRefTail();
    return { $$type: 'StringData' as const, valueInt: _valueInt, valueString: _valueString };
}

export function loadTupleStringData(source: TupleReader) {
    const _valueInt = source.readBigNumber();
    const _valueString = source.readString();
    return { $$type: 'StringData' as const, valueInt: _valueInt, valueString: _valueString };
}

export function loadGetterTupleStringData(source: TupleReader) {
    const _valueInt = source.readBigNumber();
    const _valueString = source.readString();
    return { $$type: 'StringData' as const, valueInt: _valueInt, valueString: _valueString };
}

export function storeTupleStringData(source: StringData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.valueInt);
    builder.writeString(source.valueString);
    return builder.build();
}

export function dictValueParserStringData(): DictionaryValue<StringData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStringData(src)).endCell());
        },
        parse: (src) => {
            return loadStringData(src.loadRef().beginParse());
        }
    }
}

export type CancelDeal = {
    $$type: 'CancelDeal';
    dealId: bigint;
}

export function storeCancelDeal(src: CancelDeal) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(123, 32);
        b_0.storeUint(src.dealId, 32);
    };
}

export function loadCancelDeal(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 123) { throw Error('Invalid prefix'); }
    const _dealId = sc_0.loadUintBig(32);
    return { $$type: 'CancelDeal' as const, dealId: _dealId };
}

export function loadTupleCancelDeal(source: TupleReader) {
    const _dealId = source.readBigNumber();
    return { $$type: 'CancelDeal' as const, dealId: _dealId };
}

export function loadGetterTupleCancelDeal(source: TupleReader) {
    const _dealId = source.readBigNumber();
    return { $$type: 'CancelDeal' as const, dealId: _dealId };
}

export function storeTupleCancelDeal(source: CancelDeal) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.dealId);
    return builder.build();
}

export function dictValueParserCancelDeal(): DictionaryValue<CancelDeal> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCancelDeal(src)).endCell());
        },
        parse: (src) => {
            return loadCancelDeal(src.loadRef().beginParse());
        }
    }
}

export type WithdrawTon = {
    $$type: 'WithdrawTon';
    value: bigint;
    destination: Address | null;
}

export function storeWithdrawTon(src: WithdrawTon) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(124, 32);
        b_0.storeCoins(src.value);
        b_0.storeAddress(src.destination);
    };
}

export function loadWithdrawTon(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 124) { throw Error('Invalid prefix'); }
    const _value = sc_0.loadCoins();
    const _destination = sc_0.loadMaybeAddress();
    return { $$type: 'WithdrawTon' as const, value: _value, destination: _destination };
}

export function loadTupleWithdrawTon(source: TupleReader) {
    const _value = source.readBigNumber();
    const _destination = source.readAddressOpt();
    return { $$type: 'WithdrawTon' as const, value: _value, destination: _destination };
}

export function loadGetterTupleWithdrawTon(source: TupleReader) {
    const _value = source.readBigNumber();
    const _destination = source.readAddressOpt();
    return { $$type: 'WithdrawTon' as const, value: _value, destination: _destination };
}

export function storeTupleWithdrawTon(source: WithdrawTon) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.value);
    builder.writeAddress(source.destination);
    return builder.build();
}

export function dictValueParserWithdrawTon(): DictionaryValue<WithdrawTon> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawTon(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawTon(src.loadRef().beginParse());
        }
    }
}

export type WithdrawJetton = {
    $$type: 'WithdrawJetton';
    value: bigint;
    contractJettonWallet: Address;
    destination: Address | null;
}

export function storeWithdrawJetton(src: WithdrawJetton) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(125, 32);
        b_0.storeCoins(src.value);
        b_0.storeAddress(src.contractJettonWallet);
        b_0.storeAddress(src.destination);
    };
}

export function loadWithdrawJetton(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 125) { throw Error('Invalid prefix'); }
    const _value = sc_0.loadCoins();
    const _contractJettonWallet = sc_0.loadAddress();
    const _destination = sc_0.loadMaybeAddress();
    return { $$type: 'WithdrawJetton' as const, value: _value, contractJettonWallet: _contractJettonWallet, destination: _destination };
}

export function loadTupleWithdrawJetton(source: TupleReader) {
    const _value = source.readBigNumber();
    const _contractJettonWallet = source.readAddress();
    const _destination = source.readAddressOpt();
    return { $$type: 'WithdrawJetton' as const, value: _value, contractJettonWallet: _contractJettonWallet, destination: _destination };
}

export function loadGetterTupleWithdrawJetton(source: TupleReader) {
    const _value = source.readBigNumber();
    const _contractJettonWallet = source.readAddress();
    const _destination = source.readAddressOpt();
    return { $$type: 'WithdrawJetton' as const, value: _value, contractJettonWallet: _contractJettonWallet, destination: _destination };
}

export function storeTupleWithdrawJetton(source: WithdrawJetton) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.value);
    builder.writeAddress(source.contractJettonWallet);
    builder.writeAddress(source.destination);
    return builder.build();
}

export function dictValueParserWithdrawJetton(): DictionaryValue<WithdrawJetton> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawJetton(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawJetton(src.loadRef().beginParse());
        }
    }
}

export type AddJetton = {
    $$type: 'AddJetton';
    myAddress: Address;
    id: bigint;
    name: string;
}

export function storeAddJetton(src: AddJetton) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(126, 32);
        b_0.storeAddress(src.myAddress);
        b_0.storeUint(src.id, 16);
        b_0.storeStringRefTail(src.name);
    };
}

export function loadAddJetton(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 126) { throw Error('Invalid prefix'); }
    const _myAddress = sc_0.loadAddress();
    const _id = sc_0.loadUintBig(16);
    const _name = sc_0.loadStringRefTail();
    return { $$type: 'AddJetton' as const, myAddress: _myAddress, id: _id, name: _name };
}

export function loadTupleAddJetton(source: TupleReader) {
    const _myAddress = source.readAddress();
    const _id = source.readBigNumber();
    const _name = source.readString();
    return { $$type: 'AddJetton' as const, myAddress: _myAddress, id: _id, name: _name };
}

export function loadGetterTupleAddJetton(source: TupleReader) {
    const _myAddress = source.readAddress();
    const _id = source.readBigNumber();
    const _name = source.readString();
    return { $$type: 'AddJetton' as const, myAddress: _myAddress, id: _id, name: _name };
}

export function storeTupleAddJetton(source: AddJetton) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.myAddress);
    builder.writeNumber(source.id);
    builder.writeString(source.name);
    return builder.build();
}

export function dictValueParserAddJetton(): DictionaryValue<AddJetton> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddJetton(src)).endCell());
        },
        parse: (src) => {
            return loadAddJetton(src.loadRef().beginParse());
        }
    }
}

export type DeleteJetton = {
    $$type: 'DeleteJetton';
    address: Address;
}

export function storeDeleteJetton(src: DeleteJetton) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(127, 32);
        b_0.storeAddress(src.address);
    };
}

export function loadDeleteJetton(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 127) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    return { $$type: 'DeleteJetton' as const, address: _address };
}

export function loadTupleDeleteJetton(source: TupleReader) {
    const _address = source.readAddress();
    return { $$type: 'DeleteJetton' as const, address: _address };
}

export function loadGetterTupleDeleteJetton(source: TupleReader) {
    const _address = source.readAddress();
    return { $$type: 'DeleteJetton' as const, address: _address };
}

export function storeTupleDeleteJetton(source: DeleteJetton) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    return builder.build();
}

export function dictValueParserDeleteJetton(): DictionaryValue<DeleteJetton> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeleteJetton(src)).endCell());
        },
        parse: (src) => {
            return loadDeleteJetton(src.loadRef().beginParse());
        }
    }
}

export type ClearJettons = {
    $$type: 'ClearJettons';
}

export function storeClearJettons(src: ClearJettons) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(128, 32);
    };
}

export function loadClearJettons(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 128) { throw Error('Invalid prefix'); }
    return { $$type: 'ClearJettons' as const };
}

export function loadTupleClearJettons(source: TupleReader) {
    return { $$type: 'ClearJettons' as const };
}

export function loadGetterTupleClearJettons(source: TupleReader) {
    return { $$type: 'ClearJettons' as const };
}

export function storeTupleClearJettons(source: ClearJettons) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserClearJettons(): DictionaryValue<ClearJettons> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClearJettons(src)).endCell());
        },
        parse: (src) => {
            return loadClearJettons(src.loadRef().beginParse());
        }
    }
}

export type ClearDeals = {
    $$type: 'ClearDeals';
}

export function storeClearDeals(src: ClearDeals) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(129, 32);
    };
}

export function loadClearDeals(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 129) { throw Error('Invalid prefix'); }
    return { $$type: 'ClearDeals' as const };
}

export function loadTupleClearDeals(source: TupleReader) {
    return { $$type: 'ClearDeals' as const };
}

export function loadGetterTupleClearDeals(source: TupleReader) {
    return { $$type: 'ClearDeals' as const };
}

export function storeTupleClearDeals(source: ClearDeals) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserClearDeals(): DictionaryValue<ClearDeals> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClearDeals(src)).endCell());
        },
        parse: (src) => {
            return loadClearDeals(src.loadRef().beginParse());
        }
    }
}

export type SetTonFee = {
    $$type: 'SetTonFee';
    fee: bigint;
}

export function storeSetTonFee(src: SetTonFee) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(130, 32);
        b_0.storeCoins(src.fee);
    };
}

export function loadSetTonFee(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 130) { throw Error('Invalid prefix'); }
    const _fee = sc_0.loadCoins();
    return { $$type: 'SetTonFee' as const, fee: _fee };
}

export function loadTupleSetTonFee(source: TupleReader) {
    const _fee = source.readBigNumber();
    return { $$type: 'SetTonFee' as const, fee: _fee };
}

export function loadGetterTupleSetTonFee(source: TupleReader) {
    const _fee = source.readBigNumber();
    return { $$type: 'SetTonFee' as const, fee: _fee };
}

export function storeTupleSetTonFee(source: SetTonFee) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.fee);
    return builder.build();
}

export function dictValueParserSetTonFee(): DictionaryValue<SetTonFee> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetTonFee(src)).endCell());
        },
        parse: (src) => {
            return loadSetTonFee(src.loadRef().beginParse());
        }
    }
}

export type TactJettonWalletStateInit = {
    $$type: 'TactJettonWalletStateInit';
    balance: bigint;
    owner: Address;
    minter: Address;
}

export function storeTactJettonWalletStateInit(src: TactJettonWalletStateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.minter);
    };
}

export function loadTactJettonWalletStateInit(slice: Slice) {
    const sc_0 = slice;
    const _balance = sc_0.loadCoins();
    const _owner = sc_0.loadAddress();
    const _minter = sc_0.loadAddress();
    return { $$type: 'TactJettonWalletStateInit' as const, balance: _balance, owner: _owner, minter: _minter };
}

export function loadTupleTactJettonWalletStateInit(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _owner = source.readAddress();
    const _minter = source.readAddress();
    return { $$type: 'TactJettonWalletStateInit' as const, balance: _balance, owner: _owner, minter: _minter };
}

export function loadGetterTupleTactJettonWalletStateInit(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _owner = source.readAddress();
    const _minter = source.readAddress();
    return { $$type: 'TactJettonWalletStateInit' as const, balance: _balance, owner: _owner, minter: _minter };
}

export function storeTupleTactJettonWalletStateInit(source: TactJettonWalletStateInit) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.minter);
    return builder.build();
}

export function dictValueParserTactJettonWalletStateInit(): DictionaryValue<TactJettonWalletStateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTactJettonWalletStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadTactJettonWalletStateInit(src.loadRef().beginParse());
        }
    }
}

export type JettonData = {
    $$type: 'JettonData';
    myAddress: Address;
    id: bigint;
    name: string;
}

export function storeJettonData(src: JettonData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.myAddress);
        b_0.storeUint(src.id, 16);
        b_0.storeStringRefTail(src.name);
    };
}

export function loadJettonData(slice: Slice) {
    const sc_0 = slice;
    const _myAddress = sc_0.loadAddress();
    const _id = sc_0.loadUintBig(16);
    const _name = sc_0.loadStringRefTail();
    return { $$type: 'JettonData' as const, myAddress: _myAddress, id: _id, name: _name };
}

export function loadTupleJettonData(source: TupleReader) {
    const _myAddress = source.readAddress();
    const _id = source.readBigNumber();
    const _name = source.readString();
    return { $$type: 'JettonData' as const, myAddress: _myAddress, id: _id, name: _name };
}

export function loadGetterTupleJettonData(source: TupleReader) {
    const _myAddress = source.readAddress();
    const _id = source.readBigNumber();
    const _name = source.readString();
    return { $$type: 'JettonData' as const, myAddress: _myAddress, id: _id, name: _name };
}

export function storeTupleJettonData(source: JettonData) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.myAddress);
    builder.writeNumber(source.id);
    builder.writeString(source.name);
    return builder.build();
}

export function dictValueParserJettonData(): DictionaryValue<JettonData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonData(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletData = {
    $$type: 'JettonWalletData';
    balance: bigint;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

export function storeJettonWalletData(src: JettonWalletData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.ownerAddress);
        b_0.storeAddress(src.jettonMasterAddress);
        b_0.storeRef(src.jettonWalletCode);
    };
}

export function loadJettonWalletData(slice: Slice) {
    const sc_0 = slice;
    const _balance = sc_0.loadCoins();
    const _ownerAddress = sc_0.loadAddress();
    const _jettonMasterAddress = sc_0.loadAddress();
    const _jettonWalletCode = sc_0.loadRef();
    return { $$type: 'JettonWalletData' as const, balance: _balance, ownerAddress: _ownerAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletCode: _jettonWalletCode };
}

export function loadTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _ownerAddress = source.readAddress();
    const _jettonMasterAddress = source.readAddress();
    const _jettonWalletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, ownerAddress: _ownerAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletCode: _jettonWalletCode };
}

export function loadGetterTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _ownerAddress = source.readAddress();
    const _jettonMasterAddress = source.readAddress();
    const _jettonWalletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, ownerAddress: _ownerAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletCode: _jettonWalletCode };
}

export function storeTupleJettonWalletData(source: JettonWalletData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.ownerAddress);
    builder.writeAddress(source.jettonMasterAddress);
    builder.writeCell(source.jettonWalletCode);
    return builder.build();
}

export function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type DealInfo = {
    $$type: 'DealInfo';
    senderAddress: Address;
    sendedAmount: bigint;
    sendedCurrencyId: bigint;
    partnerWillReceive: bigint;
    expectedCurrencyId: bigint;
    expectedAmount: bigint;
    myJettonWallet: Address | null;
    partnerAddressString: string | null;
}

export function storeDealInfo(src: DealInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.senderAddress);
        b_0.storeCoins(src.sendedAmount);
        b_0.storeUint(src.sendedCurrencyId, 16);
        b_0.storeCoins(src.partnerWillReceive);
        b_0.storeUint(src.expectedCurrencyId, 16);
        b_0.storeCoins(src.expectedAmount);
        b_0.storeAddress(src.myJettonWallet);
        if (src.partnerAddressString !== null && src.partnerAddressString !== undefined) { b_0.storeBit(true).storeStringRefTail(src.partnerAddressString); } else { b_0.storeBit(false); }
    };
}

export function loadDealInfo(slice: Slice) {
    const sc_0 = slice;
    const _senderAddress = sc_0.loadAddress();
    const _sendedAmount = sc_0.loadCoins();
    const _sendedCurrencyId = sc_0.loadUintBig(16);
    const _partnerWillReceive = sc_0.loadCoins();
    const _expectedCurrencyId = sc_0.loadUintBig(16);
    const _expectedAmount = sc_0.loadCoins();
    const _myJettonWallet = sc_0.loadMaybeAddress();
    const _partnerAddressString = sc_0.loadBit() ? sc_0.loadStringRefTail() : null;
    return { $$type: 'DealInfo' as const, senderAddress: _senderAddress, sendedAmount: _sendedAmount, sendedCurrencyId: _sendedCurrencyId, partnerWillReceive: _partnerWillReceive, expectedCurrencyId: _expectedCurrencyId, expectedAmount: _expectedAmount, myJettonWallet: _myJettonWallet, partnerAddressString: _partnerAddressString };
}

export function loadTupleDealInfo(source: TupleReader) {
    const _senderAddress = source.readAddress();
    const _sendedAmount = source.readBigNumber();
    const _sendedCurrencyId = source.readBigNumber();
    const _partnerWillReceive = source.readBigNumber();
    const _expectedCurrencyId = source.readBigNumber();
    const _expectedAmount = source.readBigNumber();
    const _myJettonWallet = source.readAddressOpt();
    const _partnerAddressString = source.readStringOpt();
    return { $$type: 'DealInfo' as const, senderAddress: _senderAddress, sendedAmount: _sendedAmount, sendedCurrencyId: _sendedCurrencyId, partnerWillReceive: _partnerWillReceive, expectedCurrencyId: _expectedCurrencyId, expectedAmount: _expectedAmount, myJettonWallet: _myJettonWallet, partnerAddressString: _partnerAddressString };
}

export function loadGetterTupleDealInfo(source: TupleReader) {
    const _senderAddress = source.readAddress();
    const _sendedAmount = source.readBigNumber();
    const _sendedCurrencyId = source.readBigNumber();
    const _partnerWillReceive = source.readBigNumber();
    const _expectedCurrencyId = source.readBigNumber();
    const _expectedAmount = source.readBigNumber();
    const _myJettonWallet = source.readAddressOpt();
    const _partnerAddressString = source.readStringOpt();
    return { $$type: 'DealInfo' as const, senderAddress: _senderAddress, sendedAmount: _sendedAmount, sendedCurrencyId: _sendedCurrencyId, partnerWillReceive: _partnerWillReceive, expectedCurrencyId: _expectedCurrencyId, expectedAmount: _expectedAmount, myJettonWallet: _myJettonWallet, partnerAddressString: _partnerAddressString };
}

export function storeTupleDealInfo(source: DealInfo) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.senderAddress);
    builder.writeNumber(source.sendedAmount);
    builder.writeNumber(source.sendedCurrencyId);
    builder.writeNumber(source.partnerWillReceive);
    builder.writeNumber(source.expectedCurrencyId);
    builder.writeNumber(source.expectedAmount);
    builder.writeAddress(source.myJettonWallet);
    builder.writeString(source.partnerAddressString);
    return builder.build();
}

export function dictValueParserDealInfo(): DictionaryValue<DealInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDealInfo(src)).endCell());
        },
        parse: (src) => {
            return loadDealInfo(src.loadRef().beginParse());
        }
    }
}

export type JettonReceiver$Data = {
    $$type: 'JettonReceiver$Data';
    deals: Dictionary<number, DealInfo>;
    jettons: Dictionary<Address, JettonData>;
    jettonTransferGas: bigint;
    minimalForwardTonAmount: bigint;
    sendTonFee: bigint;
    sendTonStandartFee: bigint;
    tonId: bigint;
    owner: Address;
    commission: bigint;
}

export function storeJettonReceiver$Data(src: JettonReceiver$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeDict(src.deals, Dictionary.Keys.Uint(32), dictValueParserDealInfo());
        b_0.storeDict(src.jettons, Dictionary.Keys.Address(), dictValueParserJettonData());
        b_0.storeCoins(src.jettonTransferGas);
        b_0.storeCoins(src.minimalForwardTonAmount);
        b_0.storeCoins(src.sendTonFee);
        b_0.storeCoins(src.sendTonStandartFee);
        b_0.storeInt(src.tonId, 8);
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.commission, 8);
    };
}

export function loadJettonReceiver$Data(slice: Slice) {
    const sc_0 = slice;
    const _deals = Dictionary.load(Dictionary.Keys.Uint(32), dictValueParserDealInfo(), sc_0);
    const _jettons = Dictionary.load(Dictionary.Keys.Address(), dictValueParserJettonData(), sc_0);
    const _jettonTransferGas = sc_0.loadCoins();
    const _minimalForwardTonAmount = sc_0.loadCoins();
    const _sendTonFee = sc_0.loadCoins();
    const _sendTonStandartFee = sc_0.loadCoins();
    const _tonId = sc_0.loadIntBig(8);
    const _owner = sc_0.loadAddress();
    const _commission = sc_0.loadIntBig(8);
    return { $$type: 'JettonReceiver$Data' as const, deals: _deals, jettons: _jettons, jettonTransferGas: _jettonTransferGas, minimalForwardTonAmount: _minimalForwardTonAmount, sendTonFee: _sendTonFee, sendTonStandartFee: _sendTonStandartFee, tonId: _tonId, owner: _owner, commission: _commission };
}

export function loadTupleJettonReceiver$Data(source: TupleReader) {
    const _deals = Dictionary.loadDirect(Dictionary.Keys.Uint(32), dictValueParserDealInfo(), source.readCellOpt());
    const _jettons = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonData(), source.readCellOpt());
    const _jettonTransferGas = source.readBigNumber();
    const _minimalForwardTonAmount = source.readBigNumber();
    const _sendTonFee = source.readBigNumber();
    const _sendTonStandartFee = source.readBigNumber();
    const _tonId = source.readBigNumber();
    const _owner = source.readAddress();
    const _commission = source.readBigNumber();
    return { $$type: 'JettonReceiver$Data' as const, deals: _deals, jettons: _jettons, jettonTransferGas: _jettonTransferGas, minimalForwardTonAmount: _minimalForwardTonAmount, sendTonFee: _sendTonFee, sendTonStandartFee: _sendTonStandartFee, tonId: _tonId, owner: _owner, commission: _commission };
}

export function loadGetterTupleJettonReceiver$Data(source: TupleReader) {
    const _deals = Dictionary.loadDirect(Dictionary.Keys.Uint(32), dictValueParserDealInfo(), source.readCellOpt());
    const _jettons = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonData(), source.readCellOpt());
    const _jettonTransferGas = source.readBigNumber();
    const _minimalForwardTonAmount = source.readBigNumber();
    const _sendTonFee = source.readBigNumber();
    const _sendTonStandartFee = source.readBigNumber();
    const _tonId = source.readBigNumber();
    const _owner = source.readAddress();
    const _commission = source.readBigNumber();
    return { $$type: 'JettonReceiver$Data' as const, deals: _deals, jettons: _jettons, jettonTransferGas: _jettonTransferGas, minimalForwardTonAmount: _minimalForwardTonAmount, sendTonFee: _sendTonFee, sendTonStandartFee: _sendTonStandartFee, tonId: _tonId, owner: _owner, commission: _commission };
}

export function storeTupleJettonReceiver$Data(source: JettonReceiver$Data) {
    const builder = new TupleBuilder();
    builder.writeCell(source.deals.size > 0 ? beginCell().storeDictDirect(source.deals, Dictionary.Keys.Uint(32), dictValueParserDealInfo()).endCell() : null);
    builder.writeCell(source.jettons.size > 0 ? beginCell().storeDictDirect(source.jettons, Dictionary.Keys.Address(), dictValueParserJettonData()).endCell() : null);
    builder.writeNumber(source.jettonTransferGas);
    builder.writeNumber(source.minimalForwardTonAmount);
    builder.writeNumber(source.sendTonFee);
    builder.writeNumber(source.sendTonStandartFee);
    builder.writeNumber(source.tonId);
    builder.writeAddress(source.owner);
    builder.writeNumber(source.commission);
    return builder.build();
}

export function dictValueParserJettonReceiver$Data(): DictionaryValue<JettonReceiver$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonReceiver$Data(src)).endCell());
        },
        parse: (src) => {
            return loadJettonReceiver$Data(src.loadRef().beginParse());
        }
    }
}

type JettonReceiver_init_args = {
    $$type: 'JettonReceiver_init_args';
    jettonTransferGas: bigint;
    sendTonFee: bigint;
}

function initJettonReceiver_init_args(src: JettonReceiver_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.jettonTransferGas, 257);
        b_0.storeInt(src.sendTonFee, 257);
    };
}

async function JettonReceiver_init(jettonTransferGas: bigint, sendTonFee: bigint) {
    const __code = Cell.fromHex('b5ee9c7241023201000d06000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9010f02027102040193bc73076a268690000c70b7a027a027d007d007d007d006903fd206903aac0360cc711408080eb80408080eb802c816880fc2136b6a221c105312d004105a39de0382c0238f16d9e3648c030004f828020120050d020166060b02012007090192a9c2ed44d0d200018e16f404f404fa00fa00fa00fa00d207fa40d20755806c198e22810101d700810101d7005902d101f8426d6d4443820a625a00820b473bc070580471e2db3c6c91080002270192aac0ed44d0d200018e16f404f404fa00fa00fa00fa00d207fa40d20755806c198e22810101d700810101d7005902d101f8426d6d4443820a625a00820b473bc070580471e2db3c6c910a0008f8276f1001c3af1e76a268690000c70b7a027a027d007d007d007d006903fd206903aac0360cc711408080eb80408080eb802c816880fc2136b6a221c105312d004105a39de0382c0238f12a846d9e36489037491836cc903779684037943784711037491836ef400c008480202a0259f40f6fa192306ddf206e92306d8e2dd0fa40fa00d30ffa00d30ffa00d72c01916d93fa4001e201d2000193d401d0916de2181716151443306c186f08e20193b99a5ed44d0d200018e16f404f404fa00fa00fa00fa00d207fa40d20755806c198e22810101d700810101d7005902d101f8426d6d4443820a625a00820b473bc070580471e2db3c6c9180e00022802f83001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e16f404f404fa00fa00fa00fa00d207fa40d20755806c198e22810101d700810101d7005902d101f8426d6d4443820a625a00820b473bc070580471e20a925f0ae07029d74920c21f963129d70b1f01de2182107362d09cbae30221c079101302f85b088020d721d33f31fa00fa408200f26b5337bef2f481010bf8422a5959f40b6fa192306ddf206e92306d9ed0fa40d30fd401d043306c136f03e28123ff216eb3f2f4206ef2d0806f23303101d31f810dff21c701b3f2f4108b107a1069105b104a10394bcd2a70db3c0efa00d30ff842106d105e041111041f43301b1101fa1034126d546dd0546dd0546dd0561401561601561a01561a01561101561101561101561101561101561101561101ed41ed43ed44ed45ed47915bed67ed65ed64ed63ed6180127fed118e200fd430d00c11110c0b11100b10af109e108d5e47107910671056104510344130ed41edf101f2ff561180202a59f40e6fa1311201f28e82db3c8e4f07060504431380205028c855705078ce5005fa0213cb0f01fa02cb0f01fa0201206e9430cf84809201cee2216eb39701c8cec901f400947032ca00e2c9103b12206e953059f45b30944133f417e208e2c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed541404fe8ffb5b088020d721d31fd31ffa0030f8416f24135f03f84225108c107b106a1059104c103b4ade2a7fdb3c105e104b103f40cd016d6d2b80202e59f40e6fa1318e960b11110b0a11100a109f108e10ad10ac109a1089db3ce30ec87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed54e0211b14232404e8561180202a59f40f6fa192306ddf206e92306d8e2dd0fa40fa00d30ffa00d30ffa00d72c01916d93fa4001e201d2000193d401d0916de2181716151443306c186f08e2206ef2d0806f2853b5ba9353d3ba9170e2216eb38e9821206ef2d080018e8b5610db3c01f90101f901ba923070e2dee30f15191c1d0242fa44c88b111801ce028307a0a9380758cb07cbffc9d020db3c01c8cecec9d0db3c16170094c8ce8b20000801cec9d0709421c701b38e2a01d30783069320c2008e1b03aa005323b091a4de03ab0023840fbc9903840fb0811021b203dee8303101e8318307a90c01c8cb07cb07c9d001a08d10105090d1115191d2125292d3135393d4145494d5155595d61656985898d9195999da1a5a9adb1b5b9bdc1c5c9cdd1d5d9dde1e5e8c0c4c8ccd0d4d8dce0e4b57e0c89522d749c2178ae86c21c9d018009a02d307d307d30703aa0f02aa0712b101b120ab11803fb0aa02523078d7245004ce23ab0b803fb0aa02523078d72401ce23ab05803fb0aa02523078d72401ce03803fb0aa02522078d7245003ce0188081119080711180706111706051116050411150403111403021113020111120111115618561856185618561856185618561856175617561756175617561756175628db3c1a02b210245f046c3334343603c00010ae109d108c107b106e105d104c103b4ec0db3c1bba8e970bc000107a10691058104710364540103b102bdb3c1aba9e3839391068104710364513504270e210891078106710561045103441301b1b00228103e823a112a88103e8a904019225a1de0046081119080711180706111706051116050411150403111403021113020111120111117003d28f3f88c88258c000000000000000000000000101cb67ccc970fb00081119080711180706111706051116050411150403111403021113020111120111115577db3c8ea56c99393939393939393988c88258c000000000000000000000000101cb67ccc970fb005570e21e1f22001a000000006d616b65206465616c03f608111908071118070611170605111605041115040311140302111302011112011111547fed547fed2f562056205620562056205620562056205620db3c08111808071117070611160605111505041114040311130302111202011111011110108f107e106d105c104b103a49801119171615144330db3c509880202020210230195f096c33028e8801206ef2d080db3c8e853126a0db3ce22c2a000cf45b30085506001a000000006e6f74206d6174636800a807060504431380205028c855705078ce5005fa0213cb0f01fa02cb0f01fa0201206e9430cf84809201cee2216eb39701c8cec901f400947032ca00e2c910354160206e953059f45b30944133f417e25e7040040304d6c07e8f5e5b088020d721fa40d30fd430d010891079106910591049103949abdb3c5449bc0281010b5023c855205023cecb0f01c8cecdc910374190206e953059f45930944133f413e2f842c8cf8508ce70cf0b6ec98042fb00105807103645404330e021c07ce30221c07d3031252601f65b088020d721fa00d72c01916d93fa4001e231509adb3cf8422b6eb398300a206ef2d0800a913be250a9726d40037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00f842c8cf8508ce70cf0b6ec98042fb005516c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed543004aee30221c07be30221810082ba8ec55b088020d721fa0030107810671056104510344139db3c3410781067105610455502c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed54e021c07f2729302e03fc5b088020d721fa00fa40d72c01916d93fa4001e23110891079106910591049103949abdb3c2781010b2c59f40b6fa192306ddf206e92306d9ed0fa40d30fd401d043306c136f03e28123ff016eb3f2f4f8422c6eb398300b206ef2d0800b913ce2108b107a1069105810471036453304db3cf842c8cf8508ce70cf0b6ec9302c28004e8042fb00c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed5403fc5b088020d721d31f302780202259f40f6fa192306ddf206e92306d8e2dd0fa40fa00d30ffa00d30ffa00d72c01916d93fa4001e201d2000193d401d0916de2181716151443306c186f08e2815199216eb3f2f4206ef2d0806f28145f048200f12bf84215c70514f2f424ba8e8831f8425114a1db3ce30e50078020f45b302a2b2d0038736d40037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb000144f84202206ef2d08010ab109a10891078106710561045103cdb3c50891716151443302c00bc821005f5e10071802af8286d706dc8f400c9d0104610581049c8556082100f8a7ea55008cb1f16cb3f5004fa0212ce01206e9430cf84809201cee2f40001fa02cec9433040037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb000078f842c8cf8508ce70cf0b6ec98042fb00081057104610354430c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed5403fe8ec65b088020d721fa4030107810671056104510344139db3c509781010bf4593007085505c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed54e03a20810081ba8ead303810685515db3c6d39c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed54e030302f02d2208306ba8ead303810685515db3c6d38c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed54e0c00009c12119b08e2710685515c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed54e010685515303100168200e594f84223c705f2f40046c87f01ca0055805089f40016f4005004fa0258fa0201fa0201fa02ca07ceca07c9ed542d4dcc6f');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initJettonReceiver_init_args({ $$type: 'JettonReceiver_init_args', jettonTransferGas, sendTonFee })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const JettonReceiver_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    3583: { message: "forward Payload empty" },
    9215: { message: "Incorrect sender" },
    20889: { message: "Deal does not exist" },
    58772: { message: "only owner" },
    61739: { message: "Wrong sender" },
    62059: { message: "not enough forward ton amount" },
} as const

export const JettonReceiver_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "forward Payload empty": 3583,
    "Incorrect sender": 9215,
    "Deal does not exist": 20889,
    "only owner": 58772,
    "Wrong sender": 61739,
    "not enough forward ton amount": 62059,
} as const

const JettonReceiver_types: ABIType[] = [
    { "name": "DataSize", "header": null, "fields": [{ "name": "cells", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bits", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "refs", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "SignedBundle", "header": null, "fields": [{ "name": "signature", "type": { "kind": "simple", "type": "fixed-bytes", "optional": false, "format": 64 } }, { "name": "signedData", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounceable", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "MessageParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "DeployParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "init", "type": { "kind": "simple", "type": "StateInit", "optional": false } }] },
    { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "BasechainAddress", "header": null, "fields": [{ "name": "hash", "type": { "kind": "simple", "type": "int", "optional": true, "format": 257 } }] },
    { "name": "JettonNotification", "header": 1935855772, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "forwardPayload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "JettonTransfer", "header": 260734629, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "responseDestination", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "customPayload", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "forwardTonAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "forwardPayload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "AddDealWithTon", "header": 121, "fields": [{ "name": "dealId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "expectedJettonId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "expectedAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "StringData", "header": 122, "fields": [{ "name": "valueInt", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }, { "name": "valueString", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "CancelDeal", "header": 123, "fields": [{ "name": "dealId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
    { "name": "WithdrawTon", "header": 124, "fields": [{ "name": "value", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": true } }] },
    { "name": "WithdrawJetton", "header": 125, "fields": [{ "name": "value", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "contractJettonWallet", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": true } }] },
    { "name": "AddJetton", "header": 126, "fields": [{ "name": "myAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "name", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "DeleteJetton", "header": 127, "fields": [{ "name": "address", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ClearJettons", "header": 128, "fields": [] },
    { "name": "ClearDeals", "header": 129, "fields": [] },
    { "name": "SetTonFee", "header": 130, "fields": [{ "name": "fee", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "TactJettonWalletStateInit", "header": null, "fields": [{ "name": "balance", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "minter", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "JettonData", "header": null, "fields": [{ "name": "myAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "name", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "JettonWalletData", "header": null, "fields": [{ "name": "balance", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "ownerAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "jettonMasterAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "jettonWalletCode", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "DealInfo", "header": null, "fields": [{ "name": "senderAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "sendedAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "sendedCurrencyId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "partnerWillReceive", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "expectedCurrencyId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "expectedAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "myJettonWallet", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "partnerAddressString", "type": { "kind": "simple", "type": "string", "optional": true } }] },
    { "name": "JettonReceiver$Data", "header": null, "fields": [{ "name": "deals", "type": { "kind": "dict", "key": "uint", "keyFormat": 32, "value": "DealInfo", "valueFormat": "ref" } }, { "name": "jettons", "type": { "kind": "dict", "key": "address", "value": "JettonData", "valueFormat": "ref" } }, { "name": "jettonTransferGas", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "minimalForwardTonAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "sendTonFee", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "sendTonStandartFee", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "tonId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "commission", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }] },
]

const JettonReceiver_opcodes = {
    "JettonNotification": 1935855772,
    "JettonTransfer": 260734629,
    "AddDealWithTon": 121,
    "StringData": 122,
    "CancelDeal": 123,
    "WithdrawTon": 124,
    "WithdrawJetton": 125,
    "AddJetton": 126,
    "DeleteJetton": 127,
    "ClearJettons": 128,
    "ClearDeals": 129,
    "SetTonFee": 130,
}

const JettonReceiver_getters: ABIGetter[] = [
    { "name": "deals", "methodId": 121253, "arguments": [], "returnType": { "kind": "dict", "key": "uint", "keyFormat": 32, "value": "DealInfo", "valueFormat": "ref" } },
    { "name": "dealById", "methodId": 106044, "arguments": [{ "name": "dealId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "DealInfo", "optional": true } },
    { "name": "jettons", "methodId": 102850, "arguments": [], "returnType": { "kind": "dict", "key": "address", "value": "JettonData", "valueFormat": "ref" } },
    { "name": "balance", "methodId": 104128, "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "address", "methodId": 69216, "arguments": [], "returnType": { "kind": "simple", "type": "address", "optional": false } },
]

export const JettonReceiver_getterMapping: { [key: string]: string } = {
    'deals': 'getDeals',
    'dealById': 'getDealById',
    'jettons': 'getJettons',
    'balance': 'getBalance',
    'address': 'getAddress',
}

const JettonReceiver_receivers: ABIReceiver[] = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "JettonNotification" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddDealWithTon" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddJetton" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "WithdrawTon" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "WithdrawJetton" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "CancelDeal" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "SetTonFee" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "DeleteJetton" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "ClearDeals" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "ClearJettons" } },
    { "receiver": "internal", "message": { "kind": "empty" } },
    { "receiver": "internal", "message": { "kind": "any" } },
]


export class JettonReceiver implements Contract {

    public static readonly storageReserve = 0n;
    public static readonly errors = JettonReceiver_errors_backward;
    public static readonly opcodes = JettonReceiver_opcodes;

    static async init(jettonTransferGas: bigint, sendTonFee: bigint) {
        return await JettonReceiver_init(jettonTransferGas, sendTonFee);
    }

    static async fromInit(jettonTransferGas: bigint, sendTonFee: bigint) {
        const __gen_init = await JettonReceiver_init(jettonTransferGas, sendTonFee);
        const address = contractAddress(0, __gen_init);
        return new JettonReceiver(address, __gen_init);
    }

    static fromAddress(address: Address) {
        return new JettonReceiver(address);
    }

    readonly address: Address;
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types: JettonReceiver_types,
        getters: JettonReceiver_getters,
        receivers: JettonReceiver_receivers,
        errors: JettonReceiver_errors,
    };

    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }

    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean | null | undefined }, message: JettonNotification | AddDealWithTon | AddJetton | WithdrawTon | WithdrawJetton | CancelDeal | SetTonFee | DeleteJetton | ClearDeals | ClearJettons | null | Slice) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonNotification') {
            body = beginCell().store(storeJettonNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddDealWithTon') {
            body = beginCell().store(storeAddDealWithTon(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddJetton') {
            body = beginCell().store(storeAddJetton(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawTon') {
            body = beginCell().store(storeWithdrawTon(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawJetton') {
            body = beginCell().store(storeWithdrawJetton(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CancelDeal') {
            body = beginCell().store(storeCancelDeal(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetTonFee') {
            body = beginCell().store(storeSetTonFee(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DeleteJetton') {
            body = beginCell().store(storeDeleteJetton(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClearDeals') {
            body = beginCell().store(storeClearDeals(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClearJettons') {
            body = beginCell().store(storeClearJettons(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && message instanceof Slice) {
            body = message.asCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }

        await provider.internal(via, { ...args, body: body });

    }

    async getDeals(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('deals', builder.build())).stack;
        const result = Dictionary.loadDirect(Dictionary.Keys.Uint(32), dictValueParserDealInfo(), source.readCellOpt());
        return result;
    }

    async getDealById(provider: ContractProvider, dealId: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(dealId);
        const source = (await provider.get('dealById', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleDealInfo(result_p) : null;
        return result;
    }

    async getJettons(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('jettons', builder.build())).stack;
        const result = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonData(), source.readCellOpt());
        return result;
    }

    async getBalance(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('balance', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }

    async getAddress(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('address', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }

}