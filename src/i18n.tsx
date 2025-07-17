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
        IWillGet: 'получу я',
        asset: 'Актив',
        partnerAddress: 'Адрес партнёра',
        createDeal: 'Создать сделку',
        idDeal: 'ID сделки',
        testnet: 'testnet',
        balance: 'Баланс',
        networkFee: 'Комиссия сети',
        serviceFee: 'Комиссия сервиса',
        totalFee: 'Общая комиссия',
        commissionInAsset: 'Комиссия',
        noJettons: 'Нет джетонов',
        connectWallet: 'Подключить кошелёк',
        confirmDeal: 'Подтвердить сделку',
        yourJettons: 'Ваши джетоны',
        loading: 'Загрузка...',
        noDeals: 'Сделки не загружены или отсутствуют',
        errorLoadingDeals: 'Ошибка при загрузке сделок',
        errorPrefix: 'Ошибка',
        cancel: 'Отменить',
        copyId: 'Копировать ID',
        shareDeal: 'Поделиться',
        updateDeals: 'Обновить мои сделки',
        sent: 'Отправил',
        sender: 'Отправитель',
        expect: 'ожидает',
        dealsUpdateError: 'Ошибка при загрузке сделок',
        dealCancelError: 'Ошибка при отмене сделки',
        partner: 'Партнёр',
        dealsList: 'Список сделок',
        mainPage: 'Главная страница',
        getDealById: 'Получить сделку по ID',

    },
    en: {
        title: 'Smart Exchange',
        sending: 'I Want to Send',
        receiving: 'I Want to Get',
        willSend: 'Sent',
        willReceivePartner: 'Partner Will Get',
        willReceiveMe: 'Will Be Received by Me',
        IWillGet: 'I will get',
        asset: 'Asset',
        partnerAddress: 'Partner Address',
        createDeal: 'Create Exchange',
        idDeal: 'Exchange ID',
        testnet: 'testnet',
        balance: 'Balance',
        networkFee: 'Blockchain Fee',
        serviceFee: 'Service Commission',
        totalFee: 'Total comission',
        commissionInAsset: 'Commission',
        noJettons: 'No Jettons',
        connectWallet: 'Connect Wallet',
        confirmDeal: 'Confirm deal',
        yourJettons: 'Your Jettons',
        loading: 'Loading...',
        noDeals: 'No deals loaded or available',
        errorLoadingDeals: 'Failed to load deals',
        errorPrefix: 'Error',
        cancel: 'Cancel',
        copyId: 'Copy ID',
        shareDeal: 'Share deal',
        refreshDeals: 'Refresh my deals',
        sent: 'Sent',
        expect: 'expect',
        dealsUpdateError: 'Loading error',
        dealCancelError: 'Cancel deal error',
        updateDeals: 'Update my deals',
        sender: 'Sender',
        partner: 'Partner',
        dealsList: 'Deals List',
        mainPage: 'Main page',

    },
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const initialLang: Lang = navigator.language.startsWith('ru') ? 'en' : 'en';
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
