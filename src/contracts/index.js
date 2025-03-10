import { Wallet, Transaction } from '@multiversx/sdk-core'

// Swap on xExchange
export const swapOnXExchange = async (amount, userAddress) => {
  const transaction = new Transaction({
    receiver: 'erd1qqqq...xExchangeContractAddress', // Replace with actual address
    data: `swapTokensFixedInput@${tokenIn}@${tokenOut}@${amount}`,
    gasLimit: 10_000_000,
  })

  const wallet = Wallet.fromAddress(userAddress)
  await wallet.signTransaction(transaction)
  await wallet.sendTransaction(transaction)
}

// Swap on Pulsar Money
export const swapOnPulsar = async (amount, userAddress) => {
  const transaction = new Transaction({
    receiver: 'erd1qqqq...pulsarContractAddress', // Replace with actual address
    data: `swap@${tokenIn}@${tokenOut}@${amount}`,
    gasLimit: 10_000_000,
  })

  const wallet = Wallet.fromAddress(userAddress)
  await wallet.signTransaction(transaction)
  await wallet.sendTransaction(transaction)
}
