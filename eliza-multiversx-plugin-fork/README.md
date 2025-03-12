# @elizaos/plugin-multiversx

MultiversX blockchain integration plugin for Eliza OS that enables token management and transfers.

## Overview

This plugin aims to be the basis of all interactions with the MultiversX ecosystem.

## Features

- EGLD and ESDT token transfers
- Token creation and management
- Token swapping on xExchange
- Liquidity pool creation and management
- Multiple network support (mainnet, devnet, testnet)
- Secure transaction signing
- Automatic nonce management
- Transaction status tracking
- Built-in denomination handling
- Comprehensive error handling

## Adding a new action

Reuse providers and utilities from the existing actions where possible. Add more utilities if you think they will be useful for other actions.

1. Add the action to the `actions` directory. Try to follow the naming convention of the other actions.
2. Export the action in the `index.ts` file.

## Installation

```bash
pnpm install @elizaos/plugin-multiversx
```

## Configuration

The plugin requires environment variables or runtime settings:

```env
MVX_PRIVATE_KEY=your-wallet-private-key
MVX_NETWORK=devnet  # mainnet, devnet, or testnet
ACCESS_TOKEN_MANAGEMENT_TO=everyone  # you can put an userid to limit token managament to one user only (use same id as in the database)
```

## Usage

### Token Transfer

```typescript
import { multiversxPlugin } from "@elizaos/plugin-multiversx";

// Send EGLD
const result = await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1...",
        amount: "1",
        tokenIdentifier: "EGLD",
    },
});

// Send ESDT
const result = await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1...",
        amount: "100",
        tokenIdentifier: "TEST-a1b2c3",
    },
});
```

### Token Creation

```typescript
const result = await eliza.execute({
    action: "CREATE_TOKEN",
    content: {
        tokenName: "TestToken",
        tokenTicker: "TEST",
        decimals: "18",
        amount: "1000000",
    },
});
```

### Token Swap

```typescript
const result = await eliza.execute({
    action: "SWAP",
    content: {
        tokenIn: "EGLD",
        amountIn: "1",
        tokenOut: "MEX"
    },
});
```

### Pool Creation

```typescript
const result = await eliza.execute({
    action: "CREATE_POOL",
    content: {
        baseTokenID: "KWAK",
        quoteTokenID: "EGLD",
        baseAmount: "1000000",
        quoteAmount: "20"
    },
});
```

A criação de pool de liquidez permite que você crie um novo par de negociação no xExchange. O processo envolve várias etapas:

1. Criação do par de tokens
2. Criação do token LP (Liquidity Provider)
3. Configuração das funções do token LP
4. Definição da taxa de câmbio inicial
5. Bloqueio dos tokens no contrato de liquidez
6. Habilitação da troca para o par

Todos esses passos são automatizados pela ação `CREATE_POOL`.

## Troubleshooting

### Common Issues

1. **Transaction Failures**

    - Verify wallet has sufficient balance
    - Check network configuration matches intended network
    - Ensure correct token identifiers
    - Verify recipient address format

2. **Configuration Problems**

    - Validate private key format
    - Check network selection is valid
    - Ensure environment variables are properly set
    - Verify wallet permissions for token operations

3. **Token Creation Issues**

    - Check token name and ticker format
    - Verify EGLD balance for issuance fee
    - Ensure unique token identifiers
    - Monitor transaction status

4. **Network Connectivity**
    - Verify network endpoint availability
    - Check API rate limits
    - Monitor network status
    - Ensure proper network selection

5. **Problemas na Criação de Pool de Liquidez**
    - Verifique se os tokens existem na rede
    - Certifique-se de ter saldo suficiente de ambos os tokens
    - Verifique se o par de tokens já existe
    - Monitore cada etapa da transação no explorador
    - Certifique-se de que a rede suporta a criação de pools de liquidez

## Security Best Practices

1. **Key Management**

    - Never expose private keys in code
    - Use environment variables for sensitive data
    - Implement key rotation policies
    - Monitor wallet activity

2. **Transaction Safety**

    - Validate all transaction parameters
    - Implement transaction limits
    - Use proper denomination handling
    - Double-check recipient addresses

3. **Network Security**

    - Use secure network connections
    - Implement retry mechanisms
    - Monitor for suspicious activity
    - Keep dependencies updated

4. **Error Handling**
    - Implement comprehensive error logging
    - Handle network timeouts gracefully
    - Validate all user inputs
    - Provide clear error messages

## Testing

Run the test suite:

```bash
pnpm test
```

Watch mode for development:

```bash
pnpm test:watch
```

## Dependencies

- @multiversx/sdk-core: ^13.15.0
- bignumber.js: ^9.1.2
- tsup: ^8.3.5
- vitest: ^2.1.5

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](https://github.com/elizaOS/eliza/blob/main/CONTRIBUTING.md) file for more information.

## Credits

This plugin integrates with the [MultiversX blockchain](https://multiversx.com/) using their official SDK.

Special thanks to:

- The MultiversX team for developing the MultiversX blockchain
- The Eliza community for their contributions and feedback.

For more information about MultiversX blockchain capabilities:

- [MultiversX Documentation](https://docs.multiversx.com/)
- [MultiversX Developer Portal](https://docs.multiversx.com/developers/getting-started/introduction)
- [MultiversX GitHub Repository](https://github.com/multiversx/mx-sdk-js)

## License

This plugin is part of the Eliza project. See the main project repository for license information.

## Integração com a Eliza

Para integrar este plugin com a Eliza, siga os passos abaixo:

1. Instale o plugin usando o gerenciador de pacotes:

```bash
pnpm install @elizaos/plugin-multiversx
```

2. Importe e registre o plugin na sua aplicação Eliza:

```typescript
import { Eliza } from "@elizaos/core";
import { multiversxPlugin } from "@elizaos/plugin-multiversx";

const eliza = new Eliza();
eliza.registerPlugin(multiversxPlugin);
```

3. Configure as variáveis de ambiente necessárias:

```env
MVX_PRIVATE_KEY=your-wallet-private-key
MVX_NETWORK=devnet  # mainnet, devnet, ou testnet
ACCESS_TOKEN_MANAGEMENT_TO=everyone  # ou um ID de usuário específico
```

4. Use as ações do plugin conforme necessário:

```typescript
// Exemplo de transferência de token
const result = await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1...",
        amount: "1",
        tokenIdentifier: "EGLD",
    },
});

// Exemplo de criação de token
const tokenResult = await eliza.execute({
    action: "CREATE_TOKEN",
    content: {
        tokenName: "TestToken",
        tokenTicker: "TEST",
        decimals: "18",
        amount: "1000000",
    },
});

// Exemplo de swap de tokens
const swapResult = await eliza.execute({
    action: "SWAP",
    content: {
        tokenIn: "EGLD",
        amountIn: "1",
        tokenOut: "MEX"
    },
});

// Exemplo de criação de pool de liquidez
const poolResult = await eliza.execute({
    action: "CREATE_POOL",
    content: {
        baseTokenID: "KWAK",
        quoteTokenID: "EGLD",
        baseAmount: "1000000",
        quoteAmount: "20"
    },
});
```
