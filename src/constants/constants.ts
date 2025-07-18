// src/constants/constants.ts
/** Описание одной валюты/джеттона */
export interface Currency {
  /** Адрес мастер-контракта */
  masterAddress: string;
  /** Внутренний идентификатор */
  id: number;
  icon: string;
  decimals: number
  name: string
}
export const myContractAddress = 'EQCtf89xrg00t5hayAUSwEXdcz7EPcn5lH7stQjVwoMv9Bxa';

import TonIcon from '../assets/currencies/TON.webp';
import USDTIcon from '../assets/currencies/USDT.webp';
import USDeIcon from '../assets/currencies/USDE.webp';
import TsTONIcon from '../assets/currencies/TSTON.webp';
import NotIcon from '../assets/currencies/NOT.webp';
import StormIcon from '../assets/currencies/STORM.webp';
import DogsIcon from '../assets/currencies/DOGS.webp';
import CatiIcon from '../assets/currencies/CATI.webp';
import HmstrIcon from '../assets/currencies/HMSTR.webp';
import SE1 from '../assets/currencies/SE1.webp';
import SE2 from '../assets/currencies/SE1.webp';

export const currencies: Record<string, Currency> = {
  TON: { masterAddress: '', id: 0, icon: TonIcon, decimals: 9, name: "TON"},
  "USD₮": { masterAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', id: 1, icon: USDTIcon, decimals: 6, name: "USD₮"},
  NOT: { masterAddress: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT', id: 2, icon: NotIcon, decimals: 6, name: "NOT"},
  USDe: { masterAddress: 'EQAIb6KmdfdDR7CN1GBqVJuP25iCnLKCvBlJ07Evuu2dzP5f', id: 2, icon: USDeIcon, decimals: 6, name: "USDe"},
  tsTON: { masterAddress: 'EQC98_qAmNEptUtPc7W6xdHh_ZHrBUFpw5Ft_IzNU20QAJav', id: 4, icon: TsTONIcon, decimals: 6, name: "tsTON"},
  STORM: { masterAddress: 'EQBsosmcZrD6FHijA7qWGLw5wo_aH8UN435hi935jJ_STORM', id: 5, icon: StormIcon, decimals: 6, name: "STORM"},
  DOGS: { masterAddress: 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS', id: 6, icon: DogsIcon, decimals: 6, name: "DOGS"},
  CATI: { masterAddress: 'EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7', id: 7, icon: CatiIcon, decimals: 6, name: "CATI"},
  HMSTR: { masterAddress: 'EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo', id: 8, icon: HmstrIcon, decimals: 6, name: "HMSTR" },
  SE1: { masterAddress: 'kQBQaekJ-eLhMwSjKUvCWouTyxBOQlLcb7Z-J7gQwdrqt-mo', id: 90, icon: SE1, decimals: 9, name: "SE1" },
  SE2: { masterAddress: 'kQCXBMC_4duteYxznKizeIzhhCiR0ETTEYXIQmuURHLJ7OB0', id: 91, icon: SE2, decimals: 9, name: "SE2" },
  PD: { masterAddress: 'kQC6GAd96G6qkAIfJJUN8an-ByDMBCHS6VqipKlSgYvjXOl9', id: 93, icon: HmstrIcon, decimals: 6, name: "PD"},
};

export const assets = Object.keys(currencies) as Array<keyof typeof currencies>;

export type Asset = typeof assets[number];


export let tonApiBaseUrl = 'https://tonapi.io';

/** Коэффициент сервисной комиссии (1 - 0.001 = 0.999) */
export const serviceComission = 0.999;

/** Сетевая комиссия для TON (фиксированная) */
export const networkFee = 0.018;