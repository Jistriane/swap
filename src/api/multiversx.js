import axios from 'axios'

// URL base da API da MultiversX
const MULTIVERSX_API_BASE_URL = 'https://api.multiversx.com'

/**
 * Obtém o preço atual de um par de tokens da MultiversX
 * @param {string} tokenIn - Token de entrada
 * @param {string} tokenOut - Token de saída
 * @return {Promise<number>} - Preço do token
 */
export const getMultiversXPrice = async (tokenIn, tokenOut) => {
  try {
    const response = await axios.get(`${MULTIVERSX_API_BASE_URL}/rates/${tokenIn}-${tokenOut}`)
    return response.data.price
  } catch (error) {
    console.error('Erro ao obter preço da MultiversX:', error)
    throw new Error('Falha ao obter preço da MultiversX')
  }
}

/**
 * Obtém todos os pares de swap disponíveis na MultiversX
 * @return {Promise<Array>} - Lista de pares disponíveis
 */
export const getAvailablePairs = async () => {
  try {
    const response = await axios.get(`${MULTIVERSX_API_BASE_URL}/swap/pairs`)
    return response.data
  } catch (error) {
    console.error('Erro ao obter pares disponíveis:', error)
    throw new Error('Falha ao obter pares disponíveis')
  }
}

/**
 * Obtém a estimativa de quantidade recebida em um swap
 * @param {string} tokenIn - Token de entrada
 * @param {string} tokenOut - Token de saída
 * @param {number} amountIn - Quantidade de entrada
 * @return {Promise<number>} - Quantidade estimada de saída
 */
export const getSwapEstimate = async (tokenIn, tokenOut, amountIn) => {
  try {
    const response = await axios.get(
      `${MULTIVERSX_API_BASE_URL}/swap/estimate`,
      {
        params: {
          tokenIn,
          tokenOut,
          amountIn
        }
      }
    )
    return response.data.amountOut
  } catch (error) {
    console.error('Erro ao obter estimativa de swap:', error)
    throw new Error('Falha ao obter estimativa de swap')
  }
}

/**
 * Obtém a taxa de swap para um par de tokens
 * @param {string} tokenIn - Token de entrada
 * @param {string} tokenOut - Token de saída
 * @return {Promise<number>} - Taxa de swap em percentual
 */
export const getSwapFee = async (tokenIn, tokenOut) => {
  try {
    const response = await axios.get(
      `${MULTIVERSX_API_BASE_URL}/swap/fee`,
      {
        params: {
          tokenIn,
          tokenOut
        }
      }
    )
    return response.data.feePercentage
  } catch (error) {
    console.error('Erro ao obter taxa de swap:', error)
    throw new Error('Falha ao obter taxa de swap')
  }
} 