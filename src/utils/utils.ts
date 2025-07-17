// utils/Utils.ts

import { serviceComission, networkFee, currencies } from '../constants/constants';

export function calcPartner(n: number, asset: string): number {
    return asset === 'TON'
        ? +n * serviceComission - networkFee
        : +n * serviceComission;
}

export function calcBack(r: number, asset: string): number {
    return asset === 'TON'
        ? (r + networkFee) / serviceComission
        : r / serviceComission;
}

export function getCurrencyKeyById(id: number): string {
    return Object.keys(currencies).find(key => currencies[key].id === id) || 'TON';
}

export function fromDecimals(amount: bigint, decimals: number): string {
    const amountStr = amount.toString().padStart(decimals + 1, '0');
    const whole = amountStr.slice(0, -decimals);
    const fraction = amountStr.slice(-decimals).replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole;
}
