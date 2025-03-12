# @elizaos/plugin-multiversx

Plugin de integração com a blockchain MultiversX para Eliza OS que permite gerenciamento e transferências de tokens.

## Visão Geral

Este plugin serve como base para todas as interações com o ecossistema MultiversX.

## Funcionalidades

- Transferências de tokens EGLD e ESDT
- Criação e gerenciamento de tokens
- Troca de tokens na xExchange
- Criação e gerenciamento de pools de liquidez
- Suporte a múltiplas redes (mainnet, devnet, testnet)
- Assinatura segura de transações
- Gerenciamento automático de nonce
- Rastreamento de status de transações
- Tratamento integrado de denominações
- Tratamento abrangente de erros

## Adicionando uma nova ação

Reutilize provedores e utilitários das ações existentes sempre que possível. Adicione mais utilitários se achar que serão úteis para outras ações.

1. Adicione a ação ao diretório `actions`. Tente seguir a convenção de nomenclatura das outras ações.
2. Exporte a ação no arquivo `index.ts`.

## Instalação

```bash
pnpm install @elizaos/plugin-multiversx
```

## Configuração

O plugin requer variáveis de ambiente ou configurações de runtime:

```env
MVX_PRIVATE_KEY=sua-chave-privada-da-carteira
MVX_NETWORK=devnet  # mainnet, devnet, ou testnet
ACCESS_TOKEN_MANAGEMENT_TO=everyone  # você pode colocar um ID de usuário para limitar o gerenciamento de tokens a apenas um usuário (use o mesmo ID que está no banco de dados)
```

## Uso

### Transferência de Tokens

```typescript
import { multiversxPlugin } from "@elizaos/plugin-multiversx";

// Enviar EGLD
const result = await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1...",
        amount: "1",
        tokenIdentifier: "EGLD",
    },
});

// Enviar ESDT
const result = await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1...",
        amount: "100",
        tokenIdentifier: "TEST-a1b2c3",
    },
});
```

### Criação de Tokens

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

### Troca de Tokens

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

### Criação de Pool de Liquidez

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

## Solução de Problemas

### Problemas Comuns

1. **Falhas de Transação**

    - Verifique se a carteira tem saldo suficiente
    - Confira se a configuração de rede corresponde à rede pretendida
    - Garanta que os identificadores de token estejam corretos
    - Verifique o formato do endereço do destinatário

2. **Problemas de Configuração**

    - Valide o formato da chave privada
    - Verifique se a seleção de rede é válida
    - Certifique-se de que as variáveis de ambiente estão configuradas corretamente
    - Verifique as permissões da carteira para operações com tokens

3. **Problemas na Criação de Tokens**

    - Verifique o formato do nome e ticker do token
    - Confirme o saldo de EGLD para a taxa de emissão
    - Garanta identificadores de token únicos
    - Monitore o status da transação

4. **Problemas de Conectividade de Rede**
    - Verifique a disponibilidade do endpoint da rede
    - Confira os limites de taxa da API
    - Monitore o status da rede
    - Garanta a seleção correta da rede

5. **Problemas na Criação de Pool de Liquidez**
    - Verifique se os tokens existem na rede
    - Certifique-se de ter saldo suficiente de ambos os tokens
    - Verifique se o par de tokens já existe
    - Monitore cada etapa da transação no explorador
    - Certifique-se de que a rede suporta a criação de pools de liquidez

## Melhores Práticas de Segurança

1. **Gerenciamento de Chaves**

    - Nunca exponha chaves privadas no código
    - Use variáveis de ambiente para dados sensíveis
    - Implemente políticas de rotação de chaves
    - Monitore a atividade da carteira

2. **Segurança de Transações**

    - Valide todos os parâmetros de transação
    - Implemente limites de transação
    - Use tratamento adequado de denominação
    - Verifique duas vezes os endereços dos destinatários

3. **Segurança de Rede**

    - Use conexões de rede seguras
    - Implemente mecanismos de retry
    - Monitore atividades suspeitas
    - Mantenha as dependências atualizadas

4. **Tratamento de Erros**
    - Implemente registro abrangente de erros
    - Trate os timeouts de rede com elegância
    - Valide todas as entradas do usuário
    - Forneça mensagens de erro claras

## Testes

Execute a suíte de testes:

```bash
pnpm test
```

Modo de observação para desenvolvimento:

```bash
pnpm test:watch
```

## Dependências

- @multiversx/sdk-core: ^13.15.0
- bignumber.js: ^9.1.2
- tsup: ^8.3.5
- vitest: ^2.1.5

## Contribuindo

Contribuições são bem-vindas! Por favor, consulte o arquivo [CONTRIBUTING.md](https://github.com/elizaOS/eliza/blob/main/CONTRIBUTING.md) para mais informações.

## Créditos

Este plugin integra-se com a [blockchain MultiversX](https://multiversx.com/) usando seu SDK oficial.

Agradecimentos especiais a:

- A equipe MultiversX pelo desenvolvimento da blockchain MultiversX
- A comunidade Eliza por suas contribuições e feedback.

Para mais informações sobre as capacidades da blockchain MultiversX:

- [Documentação MultiversX](https://docs.multiversx.com/)
- [Portal do Desenvolvedor MultiversX](https://docs.multiversx.com/developers/getting-started/introduction)
- [Repositório GitHub MultiversX](https://github.com/multiversx/mx-sdk-js)

## Licença

Este plugin é parte do projeto Eliza. Consulte o repositório principal do projeto para informações sobre licença.

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
MVX_PRIVATE_KEY=sua-chave-privada-da-carteira
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
