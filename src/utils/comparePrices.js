import { getXExchangePrice, getPulsarPrice } from '../api'

export const findBestRate = async (tokenIn, tokenOut) => {
  const xExchangePrice = await getXExchangePrice(tokenIn, tokenOut)
  const pulsarPrice = await getPulsarPrice(tokenIn, tokenOut)

  return {
    bestPlatform: xExchangePrice > pulsarPrice ? 'xExchange' : 'Pulsar Money',
    bestPrice: Math.max(xExchangePrice, pulsarPrice),
  }
}
