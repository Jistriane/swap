<template>
  <div>
    <h1>Magic Swap</h1>
    <input type="text" placeholder="Amount" v-model="amount" />
    <select v-model="tokenIn">
      <option value="EGLD">EGLD</option>
      <option value="USDC">USDC</option>
    </select>
    <span>to</span>
    <select v-model="tokenOut">
      <option value="USDC">USDC</option>
      <option value="EGLD">EGLD</option>
    </select>
    <button @click="handleSwap">Swap</button>

    <p v-if="bestRate">
      Best rate: 1 {{ tokenIn }} = {{ bestRate.price }} {{ tokenOut }} on {{ bestRate.platform }}
    </p>
  </div>
</template>

<script>
import { findBestRate } from './utils/comparePrices'
import { swapOnXExchange, swapOnPulsar } from './contracts'

export default {
  data() {
    return {
      amount: '',
      tokenIn: 'EGLD',
      tokenOut: 'USDC',
      bestRate: null,
    }
  },
  methods: {
    async handleSwap() {
      const { bestPlatform, bestPrice } = await findBestRate(this.tokenIn, this.tokenOut)
      this.bestRate = { platform: bestPlatform, price: bestPrice }

      if (bestPlatform === 'xExchange') {
        await swapOnXExchange(this.amount, 'erd1...userAddress') // Replace with user's address
      } else {
        await swapOnPulsar(this.amount, 'erd1...userAddress') // Replace with user's address
      }
    },
  },
}
</script>

<style>
/* Add your styles here */
</style>
