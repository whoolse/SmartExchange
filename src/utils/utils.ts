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