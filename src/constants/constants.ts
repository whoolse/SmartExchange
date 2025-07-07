// src/constants/constants.ts
/** Описание одной валюты/джеттона */
export interface Currency {
    /** Адрес мастер-контракта */
    masterAddress: string;
    /** Внутренний идентификатор */
    id: number;
  }
  
export const currencies: Record<string, Currency> = {
    TON: { masterAddress: '', id: 0 },
    USDT: { masterAddress: '', id: 0 },
    USDe: { masterAddress: '', id: 0 },
    tsTON: { masterAddress: '', id: 0 },
    NOT: { masterAddress: '', id: 0 },
    STORM: { masterAddress: '', id: 0 },
    DOGS: { masterAddress: '', id: 0 },
    CATI: { masterAddress: '', id: 0 },
    HMSTR: { masterAddress: '', id: 0 },
    SE1: { masterAddress: 'kQBQaekJ-eLhMwSjKUvCWouTyxBOQlLcb7Z-J7gQwdrqt-mo', id: 1 },
    SE2: { masterAddress: 'kQCXBMC_4duteYxznKizeIzhhCiR0ETTEYXIQmuURHLJ7OB0', id: 2 },
};

export const assets = Object.keys(currencies) as Array<keyof typeof currencies>;

export type Asset = typeof assets[number];

export const myContractAddress = 'kQBa5jkSDTIB4TPwPoY89DKVnO_fmegu0TupPANBCef5_VVD';

export const tonApiBaseUrl = 'https://testnet.tonapi.io';