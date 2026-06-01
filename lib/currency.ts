export type Currency = 'JPY' | 'TWD'

export const DEFAULT_RATE = 0.203 // 1 JPY ≈ 0.203 TWD

export function makeFormatter(currency: Currency, rate: number) {
  return (amount: number): string => {
    if (currency === 'JPY') return `¥${Math.round(amount).toLocaleString()}`
    return `NT$${Math.round(amount * rate).toLocaleString()}`
  }
}
