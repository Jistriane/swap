import axios from 'axios'

// Fetch price from xExchange
export const getXExchangePrice = async (tokenIn, tokenOut) => {
  const response = await axios.get('https://api.xexchange.com/api/v1/pairs/EGLD-USDC')
  return response.data.price
}

// Fetch price from Pulsar Money
export const getPulsarPrice = async (tokenIn, tokenOut) => {
  const response = await axios.get('https://api.pulsar.money/pools/EGLD-USDC')
  return response.data.latestPrice
}
