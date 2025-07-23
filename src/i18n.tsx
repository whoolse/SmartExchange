import React, { createContext, useContext, ReactNode, useState } from 'react';

export type Lang = 'ru' | 'en';

interface LangContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

// Контекст для переключения языка
export const LangContext = createContext<LangContextType>({
    lang: 'ru',
    setLang: () => { },
});

type TranslationsType = {
    [key: string]: {
        ru: string;
        en: string;
    };
};

// Структура переводов: ключи — идентификаторы строк, значения — объекты с переводами
const translations: TranslationsType = {
    title:
    {
        ru: 'Smart Exchange',
        en: 'Smart Exchange'
    },
    sending:
    {
        ru: 'Отправляю',
        en: 'I Want to Send'
    },
    receiving:
    {
        ru: 'Получаю',
        en: 'I Want to Get'
    },
    willSend:
    {
        ru: 'Будет отправлено',
        en: 'Send'
    },
    willReceivePartner:
    {
        ru: 'Будет получено партнёром',
        en: 'Partner Will Get'
    },
    willReceiveMe:
    {
        ru: 'Будет получено мною',
        en: 'Will Be Received by Me'
    },
    IWillGet:
    {
        ru: 'получу я',
        en: 'I will get'
    },
    asset:
    {
        ru: 'Актив',
        en: 'Asset'
    },
    partnerAddress:
    {
        ru: 'Адрес партнёра',
        en: 'Partner Address'
    },
    createDeal:
    {
        ru: 'Предложить обмен',
        en: 'Offer swap'
    },
    idDeal:
    {
        ru: 'ID сделки',
        en: 'Swap ID'
    },
    testnet:
    {
        ru: 'testnet',
        en: 'testnet'
    },
    balance:
    {
        ru: 'Баланс',
        en: 'Balance'
    },
    networkFee:
    {
        ru: 'Комиссия сети',
        en: 'Blockchain Fee'
    },
    serviceFee:
    {
        ru: 'Комиссия сервиса',
        en: 'Service Commission'
    },
    totalFee:
    {
        ru: 'Общая комиссия',
        en: 'Total commission'
    },
    commissionInAsset:
    {
        ru: 'Комиссия',
        en: 'Commission'
    },
    noJettons:
    {
        ru: 'Нет джетонов',
        en: 'No Jettons'
    },
    connectWallet:
    {
        ru: 'Подключить кошелёк',
        en: 'Connect Wallet'
    },
    confirmDeal:
    {
        ru: 'Подтвердить сделку',
        en: 'Confirm swap'
    },
    yourJettons:
    {
        ru: 'Ваши джетоны',
        en: 'Your Jettons'
    },
    loading:
    {
        ru: 'Загрузка...',
        en: 'Loading...'
    },
    noDeals:
    {
        ru: 'Сделки не загружены или отсутствуют',
        en: 'No swaps loaded or available'
    },
    errorLoadingDeals:
    {
        ru: 'Ошибка при загрузке сделок',
        en: 'Failed to load swaps'
    },
    error:
    {
        ru: 'Ошибка',
        en: 'Error'
    },
    errorPrefix:
    {
        ru: 'Ошибка',
        en: 'Error'
    },
    cancel:
    {
        ru: 'Отменить',
        en: 'Cancel'
    },
    copyId:
    {
        ru: 'Копировать ID',
        en: 'Copy ID'
    },
    shareDeal:
    {
        ru: 'Поделиться',
        en: 'Share link'
    },
    copyLink:
    {
        ru: 'Скоп. ссылку',
        en: 'Copy link'
    },
    refreshDeals:
    {
        ru: 'Обновить мои сделки',
        en: 'Refresh my swaps'
    },
    sent:
    {
        ru: 'Отправил',
        en: 'Sent'
    },
    sender:
    {
        ru: 'Отправитель',
        en: 'Sender'
    },
    expect:
    {
        ru: 'ожидает',
        en: 'expect'
    },
    dealsUpdateError:
    {
        ru: 'Ошибка при загрузке сделок',
        en: 'Loading error'
    },
    dealCancelError:
    {
        ru: 'Ошибка при отмене сделки',
        en: 'Cancel deal error'
    },
    partner:
    {
        ru: 'Партнёр',
        en: 'Partner'
    },
    dealsList:
    {
        ru: 'Список сделок',
        en: 'Swaps List'
    },
    mainPage:
    {
        ru: 'Главная страница',
        en: 'Create swap'
    },
    getDealById:
    {
        ru: 'Получить сделку по ID',
        en: 'Get swap by ID'
    },
    enterId:
    {
        ru: 'Введите ID',
        en: 'Enter swap ID'
    },
    swapId:
    {
        ru: 'ID сделки',
        en: 'Swap ID'
    },
    dealNotFound:
    {
        ru: 'Сделка не найдена',
        en: 'Swap not found'
    },
    updateDeals:
    {
        ru: 'Сделка не найдена',
        en: 'Update swaps'
    },
    dealCreated:
    {
        ru: 'Сделка создана',
        en: 'Swap created'
    },
}
// Провайдер i18n
export const I18nProvider: React.FC<{
    children: ReactNode
}> = ({ children }) => {
    const initialLang: Lang = navigator.language.startsWith('ru') ? 'en' : 'en';
    const [lang, setLang] = useState<Lang>(initialLang);

    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
};

// Хук для доступа к текущему языку и ф-ии переключения
export function useLang() {
    return useContext(LangContext);
}

// Хук для получения перевода по ключу
export function useT() {
    const { lang } = useContext(LangContext);
    return (key: string): string => {
        const entry = translations[key];
        return entry ? entry[lang] : key;
    };
}
