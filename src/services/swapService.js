import { calculateBestSwap } from '../utils/bestSwapRate'
import { swapOnXExchange, swapOnPulsar } from '../contracts'
import { swapOnMultiversX } from '../contracts/multiversx'
import { getSwapEstimate } from '../api/multiversx'

/**
 * Classe de serviço para gerenciar operações de swap
 */
class SwapService {
  /**
   * Obtém o melhor preço e plataforma para um swap
   * @param {string} tokenIn - Token de entrada
   * @param {string} tokenOut - Token de saída
   * @param {number} amountIn - Quantidade de entrada
   * @return {Promise<Object>} - Informações detalhadas sobre o melhor swap
   */
  async getBestSwapRate(tokenIn, tokenOut, amountIn) {
    return calculateBestSwap(tokenIn, tokenOut, amountIn)
  }

  /**
   * Executa um swap utilizando a melhor plataforma disponível
   * @param {string} tokenIn - Token de entrada
   * @param {string} tokenOut - Token de saída
   * @param {number} amountIn - Quantidade de entrada
   * @param {string} userAddress - Endereço do usuário
   * @param {number} slippageTolerance - Tolerância de deslizamento em percentual (padrão: 0.5%)
   * @return {Promise<Object>} - Informações sobre a transação de swap
   */
  async executeSwap(tokenIn, tokenOut, amountIn, userAddress, slippageTolerance = 0.5) {
    try {
      // Obter o melhor preço e plataforma
      const bestSwap = await this.getBestSwapRate(tokenIn, tokenOut, amountIn)
      
      // Calcular o montante mínimo de saída com base na tolerância de deslizamento
      const minAmountOut = bestSwap.amountOut * (1 - slippageTolerance / 100)
      
      let transaction
      let txHash

      // Executar o swap na plataforma escolhida
      switch (bestSwap.bestPlatform) {
        case 'xExchange':
          transaction = await swapOnXExchange(amountIn, userAddress)
          txHash = transaction.getHash().toString()
          break
          
        case 'Pulsar Money':
          transaction = await swapOnPulsar(amountIn, userAddress)
          txHash = transaction.getHash().toString()
          break
          
        case 'MultiversX':
          transaction = await swapOnMultiversX(
            tokenIn, 
            tokenOut, 
            amountIn.toString(), 
            minAmountOut.toString(), 
            userAddress
          )
          txHash = transaction.getHash().toString()
          break
          
        default:
          throw new Error('Plataforma de swap não suportada')
      }

      return {
        status: 'success',
        txHash,
        platform: bestSwap.bestPlatform,
        tokenIn,
        tokenOut,
        amountIn,
        estimatedAmountOut: bestSwap.amountOut,
        minAmountOut,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erro ao executar swap:', error)
      throw new Error(`Falha ao executar swap: ${error.message}`)
    }
  }

  /**
   * Estima a quantidade recebida em um swap
   * @param {string} tokenIn - Token de entrada
   * @param {string} tokenOut - Token de saída
   * @param {number} amountIn - Quantidade de entrada
   * @return {Promise<Object>} - Estimativa detalhada
   */
  async estimateSwap(tokenIn, tokenOut, amountIn) {
    try {
      // Obter o melhor preço e plataforma
      const bestSwap = await this.getBestSwapRate(tokenIn, tokenOut, amountIn)
      
      return {
        bestPlatform: bestSwap.bestPlatform,
        estimatedAmountOut: bestSwap.amountOut,
        priceImpact: bestSwap.savings.vsSecondBest,
        allPlatforms: bestSwap.allPrices
      }
    } catch (error) {
      console.error('Erro ao estimar swap:', error)
      throw new Error(`Falha ao estimar swap: ${error.message}`)
    }
  }
}

// Exportar uma única instância do serviço
export default new SwapService() 