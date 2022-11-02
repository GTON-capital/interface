import { Currency, ETHER, Token } from '@gton-capital/ogs-sdk'

export function currencyId(currency: Currency): string {
  // ETHER === GCD
  if (currency === ETHER) return 'GCD'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
