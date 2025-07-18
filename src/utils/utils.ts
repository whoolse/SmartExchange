// utils/Utils.ts

import { JettonBalance } from '@ton-api/client';
import { serviceComission, networkFee, currencies, Currency } from '../constants/constants';
import { Address } from '@ton/core';

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

export function getCurrencyDataById(id: number): Currency {
    let curr = Object.entries(currencies).find(([key, currency]) => currency.id == id)
    if (curr) {
        return curr[1]
    }
    return currencies.TON;
}

export function fromDecimals(amount: bigint, decimals: number): string {
    const amountStr = amount.toString().padStart(decimals + 1, '0');
    const whole = amountStr.slice(0, -decimals);
    const fraction = amountStr.slice(-decimals).replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole;
}

export function toDecimals(amount: string | number, decimals: number): bigint {
    const [wholePart, fractionPartRaw = ''] = amount.toString().split('.');
    const fractionPart = fractionPartRaw.padEnd(decimals, '0').slice(0, decimals);
    const normalized = wholePart + fractionPart;
    return BigInt(normalized.replace(/^0+/, '') || '0');
}

export function filterJettons(jettonBalances: JettonBalance[]): string[] {
    const filtered: Array<string> = []
    jettonBalances.forEach(jettonBalance => {
        let { address, symbol } = jettonBalance.jetton
        let currency = currencies[symbol]
        if (currency && Address.parse(currency.masterAddress).toString() == address.toString())
            filtered.push(symbol)
    });
    const list = ['TON', ...filtered.filter(a => a !== 'TON')];
    return list;
}

export function isMobile() {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    let isMobileDevice = regexp.test(details);
    return isMobileDevice
}

export function shareDeal(dealId: string) {
    let url = ''
    console.log(location.href.includes("app"))
    if (location.href.includes("app"))
        url = `https://t.me/escrowontonbot/smartex/?startapp=${dealId}`
    else
        url = `${window.location.origin}/?dealId=${dealId}`
    console.log(url)

    if (!isMobile() || !navigator.share) {
        navigator.clipboard.writeText(url);
        return
    }
    try {
        navigator.share({
            text: url
        });
    } catch (err) {
        console.error('Share failed:', err);
        navigator.clipboard.writeText(url);
    }
}