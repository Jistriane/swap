<template>
  <div class="container">
    <h1>Magic Swap</h1>
    <div class="swap-form">
      <div class="input-group">
        <input type="number" placeholder="Quantidade" v-model="amount" class="amount-input" />
        <select v-model="tokenIn" class="token-select">
          <option value="EGLD">EGLD</option>
          <option value="USDC">USDC</option>
          <option value="MEX">MEX</option>
        </select>
      </div>
      
      <div class="swap-arrow">
        <button @click="swapTokens" class="swap-direction-btn">↓↑</button>
      </div>
      
      <div class="input-group">
        <input type="number" placeholder="Você receberá (estimativa)" v-model="estimatedAmount" class="amount-input" disabled />
        <select v-model="tokenOut" class="token-select">
          <option value="USDC">USDC</option>
          <option value="EGLD">EGLD</option>
          <option value="MEX">MEX</option>
        </select>
      </div>
      
      <div class="slippage-control">
        <label>Tolerância de deslizamento: {{ slippageTolerance }}%</label>
        <input type="range" min="0.1" max="5" step="0.1" v-model="slippageTolerance" />
      </div>
      
      <button @click="handleSwap" class="swap-button" :disabled="!amount || amount <= 0">
        Trocar
      </button>
    </div>

    <div v-if="loading" class="loading">
      <p>Calculando melhores taxas...</p>
    </div>

    <div v-if="bestRate && !loading" class="rate-info">
      <h3>Melhor taxa encontrada:</h3>
      <p class="best-rate">1 {{ tokenIn }} = {{ bestRate.bestPrice.toFixed(6) }} {{ tokenOut }} em <strong>{{ bestRate.bestPlatform }}</strong></p>
      
      <h4>Comparativo de preços:</h4>
      <ul class="rate-list">
        <li v-for="(rate, index) in bestRate.allPrices" :key="index" :class="{ 'best-platform': rate.platform === bestRate.bestPlatform }">
          {{ rate.platform }}: {{ rate.price.toFixed(6) }}
        </li>
      </ul>
      
      <p v-if="bestRate.savings && bestRate.savings.vsSecondBest > 0" class="savings">
        Economia: {{ bestRate.savings.vsSecondBest.toFixed(2) }}% em relação à segunda melhor opção
      </p>
    </div>

    <div v-if="txResult" class="transaction-result">
      <h3>Transação {{ txResult.status === 'success' ? 'Completada' : 'Falhou' }}</h3>
      <p>Plataforma: {{ txResult.platform }}</p>
      <p>Hash: <a :href="`https://explorer.multiversx.com/transactions/${txResult.txHash}`" target="_blank">{{ txResult.txHash }}</a></p>
    </div>
  </div>
</template>

<script>
import swapService from './services/swapService'

export default {
  data() {
    return {
      amount: '',
      estimatedAmount: '',
      tokenIn: 'EGLD',
      tokenOut: 'USDC',
      slippageTolerance: 0.5,
      bestRate: null,
      loading: false,
      txResult: null
    }
  },
  watch: {
    async amount(newAmount) {
      if (newAmount && newAmount > 0) {
        await this.estimateSwap()
      } else {
        this.estimatedAmount = ''
        this.bestRate = null
      }
    },
    async tokenIn() {
      if (this.tokenIn === this.tokenOut) {
        this.tokenOut = this.tokenIn === 'EGLD' ? 'USDC' : 'EGLD'
      }
      if (this.amount && this.amount > 0) {
        await this.estimateSwap()
      }
    },
    async tokenOut() {
      if (this.tokenIn === this.tokenOut) {
        this.tokenIn = this.tokenOut === 'EGLD' ? 'USDC' : 'EGLD'
      }
      if (this.amount && this.amount > 0) {
        await this.estimateSwap()
      }
    }
  },
  methods: {
    swapTokens() {
      const temp = this.tokenIn
      this.tokenIn = this.tokenOut
      this.tokenOut = temp
    },
    async estimateSwap() {
      try {
        this.loading = true
        const amountNumber = parseFloat(this.amount)
        
        if (isNaN(amountNumber) || amountNumber <= 0) {
          this.estimatedAmount = ''
          this.bestRate = null
          return
        }
        
        // Usar o serviço de swap para estimar o valor da troca
        const swapData = await swapService.estimateSwap(this.tokenIn, this.tokenOut, amountNumber)
        
        this.bestRate = {
          bestPlatform: swapData.bestPlatform,
          bestPrice: swapData.estimatedAmountOut / amountNumber,
          allPrices: swapData.allPlatforms,
          savings: {
            vsSecondBest: swapData.priceImpact
          }
        }
        
        this.estimatedAmount = swapData.estimatedAmountOut.toFixed(6)
      } catch (error) {
        console.error('Erro ao estimar swap:', error)
        alert(`Erro ao estimar swap: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    async handleSwap() {
      try {
        this.loading = true
        this.txResult = null
        
        const amountNumber = parseFloat(this.amount)
        
        if (isNaN(amountNumber) || amountNumber <= 0) {
          alert('Por favor, insira uma quantidade válida')
          return
        }
        
        // Endereço de teste - em um app real, seria obtido do wallet conectado
        const userAddress = 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th'
        
        // Executar o swap usando o serviço
        const result = await swapService.executeSwap(
          this.tokenIn,
          this.tokenOut,
          amountNumber,
          userAddress,
          this.slippageTolerance
        )
        
        this.txResult = result
        
        // Resetar o formulário após swap bem-sucedido
        this.amount = ''
        this.estimatedAmount = ''
        this.bestRate = null
      } catch (error) {
        console.error('Erro ao executar swap:', error)
        alert(`Erro ao executar swap: ${error.message}`)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.swap-form {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  margin-bottom: 15px;
}

.amount-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 5px 0 0 5px;
  font-size: 16px;
}

.token-select {
  width: 100px;
  padding: 12px;
  border: 1px solid #ced4da;
  border-left: none;
  border-radius: 0 5px 5px 0;
  background-color: #fff;
  font-size: 16px;
}

.swap-arrow {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.swap-direction-btn {
  background-color: #e9ecef;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 18px;
}

.swap-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
}

.swap-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.slippage-control {
  margin: 15px 0;
}

.rate-info {
  margin-top: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.best-rate {
  font-size: 18px;
  margin-bottom: 15px;
}

.rate-list {
  list-style-type: none;
  padding-left: 0;
}

.rate-list li {
  padding: 8px 0;
  border-bottom: 1px solid #ced4da;
}

.best-platform {
  font-weight: bold;
  color: #28a745;
}

.savings {
  margin-top: 15px;
  font-weight: bold;
  color: #28a745;
}

.transaction-result {
  margin-top: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  margin: 20px 0;
  font-style: italic;
  color: #6c757d;
}
</style>
