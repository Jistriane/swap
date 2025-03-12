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

## Funções Disponíveis

O plugin MultiversX oferece as seguintes funções principais:

### 1. SEND_TOKEN (Transferência de Tokens)

Permite enviar tokens EGLD ou ESDT para outro endereço na blockchain MultiversX.

**Parâmetros:**
- `tokenAddress`: Endereço do destinatário (formato erd1...)
- `amount`: Quantidade de tokens a ser enviada
- `tokenIdentifier`: Identificador do token (EGLD para o token nativo ou ID do token ESDT)

**Exemplo:**
```typescript
// Transferência de EGLD
await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th",
        amount: "0.5",
        tokenIdentifier: "EGLD"
    }
});

// Transferência de token ESDT
await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th",
        amount: "100",
        tokenIdentifier: "MEX-455c57"
    }
});
```

### 2. CREATE_TOKEN (Criação de Tokens)

Permite criar um novo token ESDT na blockchain MultiversX.

**Parâmetros:**
- `tokenName`: Nome completo do token
- `tokenTicker`: Ticker do token (geralmente 3-10 caracteres)
- `decimals`: Número de casas decimais (padrão: 18)
- `amount`: Quantidade inicial de tokens a ser criada

**Exemplo:**
```typescript
await eliza.execute({
    action: "CREATE_TOKEN",
    content: {
        tokenName: "Meu Token de Teste",
        tokenTicker: "MTT",
        decimals: "18",
        amount: "1000000"
    }
});
```

### 3. SWAP (Troca de Tokens)

Permite trocar um token por outro usando o protocolo xExchange.

**Parâmetros:**
- `tokenIn`: Token de entrada (que você está oferecendo)
- `amountIn`: Quantidade do token de entrada
- `tokenOut`: Token de saída (que você deseja receber)

**Exemplo:**
```typescript
await eliza.execute({
    action: "SWAP",
    content: {
        tokenIn: "EGLD",
        amountIn: "1",
        tokenOut: "MEX-455c57"
    }
});
```

### 4. CREATE_POOL (Criação de Pool de Liquidez)

Permite criar um novo pool de liquidez no xExchange para um par de tokens.

**Parâmetros:**
- `baseTokenID`: ID do token base
- `quoteTokenID`: ID do token de cotação
- `baseAmount`: Quantidade do token base a ser adicionada ao pool
- `quoteAmount`: Quantidade do token de cotação a ser adicionada ao pool

**Exemplo:**
```typescript
await eliza.execute({
    action: "CREATE_POOL",
    content: {
        baseTokenID: "MTT-a1b2c3",
        quoteTokenID: "EGLD",
        baseAmount: "1000000",
        quoteAmount: "10"
    }
});
```

## Adicionando uma nova ação

Reutilize provedores e utilitários das ações existentes sempre que possível. Adicione mais utilitários se achar que serão úteis para outras ações.

1. Adicione a ação ao diretório `actions`. Tente seguir a convenção de nomenclatura das outras ações.
2. Exporte a ação no arquivo `index.ts`.

## Arquitetura Interna do Plugin

O plugin MultiversX é estruturado em vários componentes que trabalham juntos para fornecer as funcionalidades. Entender esses componentes é útil para desenvolvedores que desejam estender o plugin.

### Provedores

O plugin utiliza três provedores principais:

#### 1. WalletProvider

Gerencia operações relacionadas à carteira, como assinatura de transações, recuperação de saldo e envio de tokens.

```typescript
import { WalletProvider } from "../providers/wallet";

// Inicializar o provedor de carteira
const walletProvider = new WalletProvider(privateKey, network);

// Obter o endereço da carteira
const address = walletProvider.getAddress().toBech32();

// Verificar saldo de EGLD
const hasBalance = await walletProvider.hasEgldBalance("1");

// Assinar e enviar uma transação
const signature = await walletProvider.signTransaction(tx);
const txHash = await walletProvider.sendTransaction(tx);
```

#### 2. GraphqlProvider

Facilita consultas à API GraphQL do xExchange para operações como swap e criação de pools.

```typescript
import { GraphqlProvider } from "../providers/graphql";

// Inicializar o provedor GraphQL
const graphqlProvider = new GraphqlProvider(
    networkConfig.graphURL,
    { Authorization: `Bearer ${accessToken}` }
);

// Executar uma consulta
const result = await graphqlProvider.query(queryString, variables);
```

#### 3. NativeAuthProvider

Gerencia a autenticação nativa para interagir com APIs que requerem autenticação.

```typescript
import { NativeAuthProvider } from "../providers/nativeAuth";

// Inicializar o provedor de autenticação
const nativeAuthProvider = new NativeAuthProvider({
    apiUrl: networkConfig.apiURL
});

// Inicializar o cliente e obter um token de acesso
await nativeAuthProvider.initializeClient();
const accessToken = await nativeAuthProvider.getAccessToken(walletProvider);
```

### Utilitários

O plugin inclui vários utilitários para tarefas comuns:

#### 1. Manipulação de Valores (amount.ts)

Funções para converter entre valores denominados e não denominados.

```typescript
import { denominateAmount, getRawAmount } from "../utils/amount";

// Converter para valor denominado (para exibição)
const displayValue = denominateAmount({
    amount: "1000000000000000000",
    decimals: 18
}); // Resultado: "1"

// Converter para valor bruto (para transações)
const rawValue = getRawAmount({
    amount: "1",
    decimals: 18
}); // Resultado: "1000000000000000000"
```

#### 2. Obtenção de Tokens (getToken.ts)

Funções para buscar informações sobre tokens.

```typescript
import { getToken } from "../utils/getToken";

// Obter informações de um token pelo ticker
const token = await getToken({
    provider: graphqlProvider,
    ticker: "MEX"
});
```

#### 3. Resolução de Herotags (resolveHerotag.ts)

Funções para resolver herotags para endereços.

```typescript
import { resolveHerotag } from "../utils/resolveHerotag";

// Resolver um herotag para um endereço
const address = await resolveHerotag(herotag, apiNetworkProvider);
```

#### 4. Gerenciamento de Acesso (accessTokenManagement.ts)

Funções para verificar se um usuário está autorizado a realizar operações.

```typescript
import { isUserAuthorized } from "../utils/accessTokenManagement";

// Verificar se um usuário está autorizado
const authorized = isUserAuthorized(userId, runtime);
```

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

## Casos de Uso Avançados

### Integração com Chatbots

O plugin MultiversX pode ser facilmente integrado com chatbots para permitir transações via comandos de texto:

```typescript
// Exemplo de integração com um chatbot
bot.onMessage(async (message) => {
    if (message.text.startsWith('/send')) {
        // Formato: /send 1 EGLD para erd1...
        const parts = message.text.split(' ');
        const amount = parts[1];
        const token = parts[2];
        const recipient = parts[4];
        
        try {
            const result = await eliza.execute({
                action: "SEND_TOKEN",
                content: {
                    tokenAddress: recipient,
                    amount: amount,
                    tokenIdentifier: token,
                },
            });
            
            bot.sendMessage(message.chat.id, `Transação enviada com sucesso! Hash: ${result.txHash}`);
        } catch (error) {
            bot.sendMessage(message.chat.id, `Erro ao enviar transação: ${error.message}`);
        }
    }
});
```

### Monitoramento de Transações

Você pode implementar um sistema de monitoramento de transações para acompanhar o status das transações enviadas:

```typescript
import { TransactionWatcher } from "@multiversx/sdk-core";

// Função para monitorar o status de uma transação
async function monitorTransaction(txHash, apiNetworkProvider) {
    const watcher = new TransactionWatcher(apiNetworkProvider);
    
    try {
        const transactionOnNetwork = await watcher.awaitCompleted({
            getHash: () => txHash,
        });
        
        if (transactionOnNetwork.status.isSuccessful()) {
            console.log(`Transação ${txHash} concluída com sucesso!`);
            return true;
        } else {
            console.error(`Transação ${txHash} falhou: ${transactionOnNetwork.status.toString()}`);
            return false;
        }
    } catch (error) {
        console.error(`Erro ao monitorar transação: ${error.message}`);
        return false;
    }
}

// Uso com o plugin
const result = await eliza.execute({
    action: "SEND_TOKEN",
    content: {
        tokenAddress: "erd1...",
        amount: "1",
        tokenIdentifier: "EGLD",
    },
});

// Monitorar a transação
const success = await monitorTransaction(result.txHash, apiNetworkProvider);
```

### Integração com Aplicações Web

Você pode integrar o plugin com aplicações web para criar interfaces de usuário para interações com a blockchain:

```typescript
// Exemplo de componente React para envio de tokens
function SendTokenForm() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState('EGLD');
    const [status, setStatus] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando transação...');
        
        try {
            const result = await eliza.execute({
                action: "SEND_TOKEN",
                content: {
                    tokenAddress: recipient,
                    amount: amount,
                    tokenIdentifier: token,
                },
            });
            
            setStatus(`Transação enviada com sucesso! Hash: ${result.txHash}`);
        } catch (error) {
            setStatus(`Erro ao enviar transação: ${error.message}`);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Endereço do destinatário"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />
            <input
                type="text"
                placeholder="Quantidade"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <select value={token} onChange={(e) => setToken(e.target.value)}>
                <option value="EGLD">EGLD</option>
                <option value="MEX-455c57">MEX</option>
                <option value="USDC-c76f1f">USDC</option>
            </select>
            <button type="submit">Enviar</button>
            {status && <p>{status}</p>}
        </form>
    );
}
```
