// src/i18n.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

export type Lang = 'ru' | 'en';

interface LangContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

// Контекст языка с возможностью переключения
export const LangContext = createContext<LangContextType>({
    lang: 'ru',
    setLang: () => { },
});

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
        idDeal: 'Exchange ID',
        getDeal: 'Get',
        testnet: 'testnet',
        balance: 'Баланс',
        networkFee: 'Комиссия сети',
        serviceFee: 'Комиссия сервиса',
        totalFee: 'Total',
        commissionInAsset: 'Комиссия',
    },
    en: {
        title: 'Smart Exchange',
        sending: 'I Want to Send',
        receiving: 'I Want to Get',
        willSend: 'Sent',
        willReceivePartner: 'Partner Will Get',
        willReceiveMe: 'Will Be Received by Me',
        asset: 'Asset',
        partnerAddress: 'Partner Address',
        createDeal: 'Create Exchange',
        idDeal: 'Exchange ID',
        getDeal: 'Get',
        testnet: 'testnet',
        balance: 'Balance',
        networkFee: 'Blockchain Fee',
        serviceFee: 'Service Commission',
        totalFee: 'Total',
        commissionInAsset: 'Commission',
    },
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const initialLang: Lang = navigator.language.startsWith('ru') ? 'ru' : 'en';
    const [lang, setLang] = useState<Lang>(initialLang);

    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
};

// Хук для доступа к языку и функции переключения
export function useLang() {
    return useContext(LangContext);
}

// Хук для получения перевода по ключу
export function useT() {
    const { lang } = useContext(LangContext);
    return (key: string) => translations[lang][key] ?? key;
}
