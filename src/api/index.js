import axios from 'axios'
import * as multiversXApi from './multiversx'

// Exportar todas as funções da API da MultiversX
export const {
  getMultiversXPrice,
  getAvailablePairs,
  getSwapEstimate,
  getSwapFee
} = multiversXApi

// Fetch price from xExchange
export const getXExchangePrice = async (tokenIn, tokenOut) => {
  try {
    const response = await axios.get('https://api.xexchange.com/api/v1/pairs/EGLD-USDC')
    return response.data.price
  } catch (error) {
    console.error('Erro ao obter preço do xExchange:', error)
    // Retornar um valor padrão caso a API falhe (em ambiente real, seria melhor lançar um erro)
    return 0
  }
}

// Fetch price from Pulsar Money
export const getPulsarPrice = async (tokenIn, tokenOut) => {
  try {
    const response = await axios.get('https://api.pulsar.money/pools/EGLD-USDC')
    return response.data.latestPrice
  } catch (error) {
    console.error('Erro ao obter preço do Pulsar Money:', error)
    // Retornar um valor padrão caso a API falhe (em ambiente real, seria melhor lançar um erro)
    return 0
  }
}
