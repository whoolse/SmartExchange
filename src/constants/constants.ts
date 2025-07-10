// src/constants/constants.ts
/** Описание одной валюты/джеттона */
export interface Currency {
  /** Адрес мастер-контракта */
  masterAddress: string;
  /** Внутренний идентификатор */
  id: number;
  icon: string;
}

import TonIcon from '../assets/currencies/TON.webp';
import USDTIcon from '../assets/currencies/USDT.webp';
import USDeIcon from '../assets/currencies/USDE.webp';
import TsTONIcon from '../assets/currencies/TSTON.webp';
import NotIcon from '../assets/currencies/NOT.webp';
import StormIcon from '../assets/currencies/STORM.webp';
import DogsIcon from '../assets/currencies/DOGS.webp';
import CatiIcon from '../assets/currencies/CATI.webp';
import HmstrIcon from '../assets/currencies/HMSTR.webp';
import SE1 from '../assets/currencies/SE1.png';
import SE2 from '../assets/currencies/SE1.png';

export const currencies: Record<string, Currency> = {
  SE1: { masterAddress: 'kQBQaekJ-eLhMwSjKUvCWouTyxBOQlLcb7Z-J7gQwdrqt-mo', id: 1, icon: SE1 },
  SE2: { masterAddress: 'kQCXBMC_4duteYxznKizeIzhhCiR0ETTEYXIQmuURHLJ7OB0', id: 2, icon: SE2 },
  TON: { masterAddress: '', id: 0, icon: TonIcon },
  USDT: { masterAddress: '', id: 3, icon: USDTIcon },
  USDe: { masterAddress: '', id: 4, icon: USDeIcon },
  tsTON: { masterAddress: '', id: 5, icon: TsTONIcon },
  NOT: { masterAddress: '', id: 6, icon: NotIcon },
  STORM: { masterAddress: '', id: 7, icon: StormIcon },
  DOGS: { masterAddress: '', id: 8, icon: DogsIcon },
  CATI: { masterAddress: '', id: 9, icon: CatiIcon },
  HMSTR: { masterAddress: '', id: 10, icon: HmstrIcon },
};

export const assets = Object.keys(currencies) as Array<keyof typeof currencies>;

export type Asset = typeof assets[number];

export const myContractAddress = 'kQDDQfgiIO5K12M_VApgv2B_Lb2L-dowzBqdNF1tfRm0eKz6';

export const tonApiBaseUrl = 'https://testnet.tonapi.io';

/** Коэффициент сервисной комиссии (1 - 0.001 = 0.999) */
export const serviceComission = 0.999;

/** Сетевая комиссия для TON (фиксированная) */
export const networkFee = 0.018;