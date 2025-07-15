// src/components/DealCreate.tsx
import React, { useState, useMemo } from 'react';
import { fromNano } from '@ton/core';
import { assets, } from '../constants/constants';
import { SendBlock } from './SendBlock';
import { ReceiveBlock } from './ReceiveBlock';
import { DealControl } from './DealControl';
import { type JettonsBalances } from '@ton-api/client';
import { calcBack, getCurrencyKeyById } from '../utils/utils';
import { CreateDealButton } from './CreateDealButton';
import { DealInfo } from '../smartContract/JettonReceiver_JettonReceiver';
import { Address } from '@ton/core';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { SuccessModal } from './SuccessModal';

const DEF_SEND = 'SE1';
const DEF_RECEIVE = 'SE2';

interface TxResult {
    error: any
    success: boolean
}

export const DealCreate: React.FC<{
    userJettons: string[];
    jettonBalances: JettonsBalances['balances'];
}> = ({ userJettons, jettonBalances }) => {
    const [sendAsset, setSendAsset] = useState<string>(DEF_SEND);
    const [receiveAsset, setReceiveAsset] = useState<string>(DEF_RECEIVE);

    const [sendAmount, setSendAmount] = useState<string>('10');
    const [partnerReceive, setPartnerReceive] = useState<string>('0');

    const [recSend, setRecSend] = useState<string>('20');
    const [recReceive, setRecReceive] = useState<string>('0');

    const [validRec, setValidRec] = useState<boolean>(true);
    // Флаг для случая, когда сделка не найдена
    const [dealNotFound, setDealNotFound] = useState<boolean>(false);

    const [disableCreate, setDisableCreate] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [partnerAddress, setPartnerAddress] = useState<string>('');

    const [fetchedPartnerAddress, setFetchedPartnerAddress] = useState<string>('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [tonConnectUI, setOptions] = useTonConnectUI();
    // TON + те, что у пользователя
    const sendList = useMemo(() => {
        const f = assets.filter(a => userJettons.includes(a));
        const l = ['TON', ...f.filter(a => a !== 'TON')];
        if (!l.includes(sendAsset)) l.push(sendAsset);
        return l;
    }, [userJettons, sendAsset]);

    const [dealId, setDealId] = useState<string>(
        () => (Math.floor(Math.random() * Math.pow(2, 32)) + 1).toString()
    );
    const walletAddress = useTonAddress() ?? '';

    const isPartnerMismatch =
        fetchedPartnerAddress.trim() !== '' &&
        fetchedPartnerAddress !== walletAddress;

    const onDealData = (info: DealInfo | null) => {
        // Если инфа о сделке отсутствует
        if (info == null) {
            setDealNotFound(true);
            return;
        }
        setDealNotFound(false);
        setDisabled(true);
        setIsConfirmed(true);
        if (info.partnerAddress) {
            setFetchedPartnerAddress(info.partnerAddress.toString());
        }
        // Обновляем поля на основе данных из смарт-контракта
        setRecSend(fromNano(info.sendedAmount));
        const expectedAmount = +fromNano(info.expectedAmount);
        const expectedCurrency = getCurrencyKeyById(Number(info.expectedCurrencyId));
        const sendedCurrency = getCurrencyKeyById(Number(info.sendedCurrencyId));

        console.log(expectedCurrency, sendedCurrency)
        setSendAmount(calcBack(expectedAmount, expectedCurrency).toString());
        setReceiveAsset(sendedCurrency);
        setSendAsset(expectedCurrency);
    };

    // Автопереключение, если выбранный asset совпадает с receiveAsset/sendAsset
    const handleSA = (a: string) => {
        if (a === receiveAsset) {
            const idx = sendList.indexOf(a);
            setReceiveAsset(sendList[(idx + 1) % sendList.length]);
        }
        setSendAsset(a);
    };
    const handleRA = (a: string) => {
        if (a === sendAsset) {
            const idx = sendList.indexOf(a);
            setSendAsset(sendList[(idx + 1) % sendList.length]);
        }
        setReceiveAsset(a);
    };

    const handleSwap = () => {
        // Меняем активы
        setSendAsset(receiveAsset);
        setReceiveAsset(sendAsset);

        // Меняем суммы
        setSendAmount(recSend);
        setPartnerReceive(recReceive);

        setRecSend(sendAmount);
        setRecReceive(partnerReceive);
    };

    const handleTxResult = (result: TxResult) => {
        console.log("handleTxResult", result)
        if (result.error) return
        setIsSuccessModalOpen(true)
        // let newDealId = (Math.floor(Math.random() * Math.pow(2, 32)) + 1).toString()
        // setDealId(newDealId);
    }

    const isAddressValid = (() => {
        if (partnerAddress.trim() === '') return true;
        try {
            Address.parse(partnerAddress);
            return true;
        } catch {
            return false;
        }
    })();

    return (
        <>
            <div className="main-content">
                <SendBlock
                    disabled={disabled}
                    asset={sendAsset}
                    sendAmount={sendAmount}
                    onSendAmountChange={setSendAmount}
                    partnerReceive={partnerReceive}
                    onPartnerReceiveChange={setPartnerReceive}
                    onAssetChange={handleSA}
                    disableCreate={!validRec}
                    userJettons={userJettons}
                    jettonBalances={jettonBalances}
                    onValidationChange={setDisableCreate}
                    dealId={dealId}
                    partnerAddress={partnerAddress}
                    onPartnerAddressChange={setPartnerAddress}
                />
                <button type="button"
                    onClick={handleSwap}
                    disabled={disabled}
                    className="exchange-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17"></path>
                    </svg>
                </button>
                <ReceiveBlock
                    disabled={disabled}
                    asset={receiveAsset}
                    sendAmount={recSend}
                    onSendAmountChange={setRecSend}
                    receiveAmount={recReceive}
                    onReceiveAmountChange={setRecReceive}
                    onAssetChange={handleRA}
                    onValidate={setValidRec}
                    showPartnerAddress={Boolean(fetchedPartnerAddress)}
                    partnerAddress={fetchedPartnerAddress}
                />

                <CreateDealButton
                    sendAsset={sendAsset}
                    sendAmount={sendAmount}
                    receiveAsset={receiveAsset}
                    receiveAmount={recReceive}
                    disabled={disableCreate || !isAddressValid || (isConfirmed && isPartnerMismatch)}
                    dealId={+dealId}
                    confirmed={isConfirmed}
                    partnerAddress={partnerAddress}
                    onResult={handleTxResult}
                />

            </div>
            {dealNotFound && (
                <div className="mt-2 text-red-500">
                    Сделка не найдена
                </div>
            )}

            <DealControl onDealData={onDealData} disabled={disabled} onSetDealId={setDealId} />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                dealId={dealId}
                onClose={() => setIsSuccessModalOpen(false)}
            />

        </>
    );
};
