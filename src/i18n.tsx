import React, { createContext, useContext, ReactNode } from 'react';

export type Lang = 'ru' | 'en';

export const LangContext = createContext<Lang>('ru');

const translations: Record<Lang, Record<string, string>> = {
    ru: {
        title: 'Smart Exchange',
        sending: 'Отправляю',
        receiving: 'Получаю',
        willSend: 'Будет отправлено',
        willReceivePartner: 'Будет получено партнером',
        willReceiveMe: 'Будет получено мною',
        asset: 'Актив',
        partnerAddress: 'Адрес партнёра',
        createDeal: 'Создать сделку',
        idDeal: 'ID сделки',
        getDeal: 'Получить',
        testnet: 'Testnet',
        balance: 'Баланс',
        networkFee: 'Комиссия сети',
        serviceFee: 'Комиссия сервиса',
        totalFee: 'Общая комиссия',
        commissionInAsset: 'Комиссия сервиса',
    },
    en: {
        title: 'Smart Exchange',
        sending: 'I want to send',
        receiving: 'I want to get',
        willSend: 'Sent',
        willReceivePartner: 'Partner will get',
        willReceiveMe: 'Will be received by me',
        asset: 'Asset',
        partnerAddress: 'Partner address',
        createDeal: 'Create exchange',
        idDeal: 'Exchange ID',
        getDeal: 'Get',
        testnet: 'Testnet',
        balance: 'Balance',
        networkFee: 'Blockchain fee',
        serviceFee: 'Service commission',
        totalFee: 'Total',
        commissionInAsset: 'Service сommission',
    }
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const browserLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
    return (
        <LangContext.Provider value={browserLang}>
            {children}
        </LangContext.Provider>
    );
};

export function useT() {
    const lang = useContext(LangContext);
    return (key: string) => translations[lang][key] ?? key;
}
