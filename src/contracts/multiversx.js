import { Wallet, Transaction, Address, TokenTransfer } from '@multiversx/sdk-core'

// Endereço do contrato de swap da MultiversX
const MULTIVERSX_SWAP_CONTRACT = 'erd1qqqqqqqqqqqqqpgq72l6vl07fkn3alyfq753mcy4nakm0l72396qkcud5x'

/**
 * Executa um swap através do contrato da MultiversX
 * @param {string} tokenIn - Token de entrada
 * @param {string} tokenOut - Token de saída
 * @param {string} amountIn - Quantidade de entrada
 * @param {string} minAmountOut - Quantidade mínima de saída aceitável
 * @param {string} userAddress - Endereço do usuário
 * @returns {Promise<Transaction>} - Transação assinada
 */
export const swapOnMultiversX = async (tokenIn, tokenOut, amountIn, minAmountOut, userAddress) => {
  try {
    // Criar uma nova transação para o contrato de swap
    const transaction = new Transaction({
      value: tokenIn === 'EGLD' ? amountIn : '0',
      sender: new Address(userAddress),
      receiver: new Address(MULTIVERSX_SWAP_CONTRACT),
      gasLimit: 10_000_000,
      data: Buffer.from(
        `swap@${tokenIn}@${tokenOut}@${amountIn}@${minAmountOut}`,
        'utf-8'
      ).toString('base64'),
      chainID: 'T' // Usar 'D' para devnet, '1' para mainnet
    })

    // Se o token de entrada não for EGLD, adicionar transferência de token ESDT
    if (tokenIn !== 'EGLD') {
      const tokenTransfer = TokenTransfer.fungibleFromAmount(tokenIn, amountIn, 18)
      transaction.setData(
        Buffer.from(
          `ESDTTransfer@${tokenTransfer.toString()}@${tokenOut}@${minAmountOut}`,
          'utf-8'
        ).toString('base64')
      )
    }

    return transaction
  } catch (error) {
    console.error('Erro ao criar transação de swap:', error)
    throw new Error('Falha ao criar transação de swap')
  }
}

/**
 * Adiciona liquidez a um pool na MultiversX
 * @param {string} tokenA - Primeiro token
 * @param {string} tokenB - Segundo token
 * @param {string} amountA - Quantidade do primeiro token
 * @param {string} amountB - Quantidade do segundo token
 * @param {string} userAddress - Endereço do usuário
 * @returns {Promise<Transaction>} - Transação assinada
 */
export const addLiquidity = async (tokenA, tokenB, amountA, amountB, userAddress) => {
  try {
    const transaction = new Transaction({
      value: tokenA === 'EGLD' ? amountA : (tokenB === 'EGLD' ? amountB : '0'),
      sender: new Address(userAddress),
      receiver: new Address(MULTIVERSX_SWAP_CONTRACT),
      gasLimit: 15_000_000,
      data: Buffer.from(
        `addLiquidity@${tokenA}@${tokenB}@${amountA}@${amountB}`,
        'utf-8'
      ).toString('base64'),
      chainID: 'T' // Usar 'D' para devnet, '1' para mainnet
    })

    return transaction
  } catch (error) {
    console.error('Erro ao criar transação de adição de liquidez:', error)
    throw new Error('Falha ao criar transação de adição de liquidez')
  }
}

/**
 * Remove liquidez de um pool na MultiversX
 * @param {string} tokenA - Primeiro token
 * @param {string} tokenB - Segundo token
 * @param {string} liquidityAmount - Quantidade de tokens de liquidez a remover
 * @param {string} userAddress - Endereço do usuário
 * @returns {Promise<Transaction>} - Transação assinada
 */
export const removeLiquidity = async (tokenA, tokenB, liquidityAmount, userAddress) => {
  try {
    const transaction = new Transaction({
      value: '0',
      sender: new Address(userAddress),
      receiver: new Address(MULTIVERSX_SWAP_CONTRACT),
      gasLimit: 10_000_000,
      data: Buffer.from(
        `removeLiquidity@${tokenA}@${tokenB}@${liquidityAmount}`,
        'utf-8'
      ).toString('base64'),
      chainID: 'T' // Usar 'D' para devnet, '1' para mainnet
    })

    return transaction
  } catch (error) {
    console.error('Erro ao criar transação de remoção de liquidez:', error)
    throw new Error('Falha ao criar transação de remoção de liquidez')
  }
} 