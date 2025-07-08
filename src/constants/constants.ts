// src/constants/constants.ts
/** Описание одной валюты/джеттона */
export interface Currency {
  /** Адрес мастер-контракта */
  masterAddress: string;
  /** Внутренний идентификатор */
  id: number;
}

export const currencies: Record<string, Currency> = {
  SE1: { masterAddress: 'kQBQaekJ-eLhMwSjKUvCWouTyxBOQlLcb7Z-J7gQwdrqt-mo', id: 1 },
  SE2: { masterAddress: 'kQCXBMC_4duteYxznKizeIzhhCiR0ETTEYXIQmuURHLJ7OB0', id: 2 },
  TON: { masterAddress: '', id: 0 },
  USDT: { masterAddress: '', id: 3 },
  USDe: { masterAddress: '', id: 4 },
  tsTON: { masterAddress: '', id: 5 },
  NOT: { masterAddress: '', id: 6 },
  STORM: { masterAddress: '', id: 7 },
  DOGS: { masterAddress: '', id: 8 },
  CATI: { masterAddress: '', id: 9 },
  HMSTR: { masterAddress: '', id: 10 },
};

export const assets = Object.keys(currencies) as Array<keyof typeof currencies>;

export type Asset = typeof assets[number];

export const myContractAddress = 'kQDDQfgiIO5K12M_VApgv2B_Lb2L-dowzBqdNF1tfRm0eKz6';

export const tonApiBaseUrl = 'https://testnet.tonapi.io';

/** Коэффициент сервисной комиссии (1 - 0.001 = 0.999) */
export const serviceComission = 0.999;

/** Сетевая комиссия для TON (фиксированная) */
export const networkFee = 0.018;