import { getXExchangePrice, getPulsarPrice } from '../api'
import { getMultiversXPrice, getSwapEstimate, getSwapFee } from '../api/multiversx'

/**
 * Calcula o melhor preço de swap entre diferentes plataformas
 * @param {string} tokenIn - Token de entrada
 * @param {string} tokenOut - Token de saída
 * @param {number} amountIn - Quantidade de entrada (opcional)
 * @return {Promise<Object>} - Informações sobre o melhor preço e plataforma
 */
export const findBestSwapRate = async (tokenIn, tokenOut, amountIn = 1) => {
  try {
    // Obtém preços de diferentes plataformas
    const [xExchangePrice, pulsarPrice, multiversXPrice] = await Promise.all([
      getXExchangePrice(tokenIn, tokenOut),
      getPulsarPrice(tokenIn, tokenOut),
      getMultiversXPrice(tokenIn, tokenOut)
    ])

    // Se amountIn for fornecido, obtém estimativa mais precisa da MultiversX
    let multiversXEstimate = multiversXPrice
    if (amountIn > 1) {
      multiversXEstimate = await getSwapEstimate(tokenIn, tokenOut, amountIn)
      multiversXEstimate = multiversXEstimate / amountIn // Normaliza para preço unitário
    }

    // Obtém a taxa de swap da MultiversX para calcular o preço real
    const multiversXFee = await getSwapFee(tokenIn, tokenOut)
    const multiversXPriceAfterFee = multiversXEstimate * (1 - multiversXFee / 100)

    // Compara os preços para encontrar o melhor
    const prices = [
      { platform: 'xExchange', price: xExchangePrice },
      { platform: 'Pulsar Money', price: pulsarPrice },
      { platform: 'MultiversX', price: multiversXPriceAfterFee }
    ]

    // Ordena por preço decrescente se estamos comprando, ou crescente se estamos vendendo
    // Aqui assumimos que estamos comprando tokenOut com tokenIn
    prices.sort((a, b) => b.price - a.price)

    // Retorna informações detalhadas
    return {
      bestPlatform: prices[0].platform,
      bestPrice: prices[0].price,
      allPrices: prices,
      savings: {
        vsSecondBest: ((prices[0].price - prices[1].price) / prices[1].price) * 100,
        vsWorst: ((prices[0].price - prices[prices.length - 1].price) / prices[prices.length - 1].price) * 100
      }
    }
  } catch (error) {
    console.error('Erro ao calcular melhor taxa de swap:', error)
    throw new Error('Falha ao encontrar melhor taxa de swap')
  }
}

/**
 * Calcula o montante a receber baseado nos melhores preços
 * @param {string} tokenIn - Token de entrada
 * @param {string} tokenOut - Token de saída
 * @param {number} amountIn - Quantidade de entrada
 * @return {Promise<Object>} - Informações detalhadas sobre o swap
 */
export const calculateBestSwap = async (tokenIn, tokenOut, amountIn) => {
  const bestRate = await findBestSwapRate(tokenIn, tokenOut, amountIn)
  const amountOut = amountIn * bestRate.bestPrice

  return {
    ...bestRate,
    amountIn,
    amountOut,
    tokenIn,
    tokenOut,
    timestamp: new Date().toISOString()
  }
} 