# magic-swap

![logo](docs/imgs/magic-swap-plugin_logo.jpg)

A MultiversX ElizaOS Plugin that allow Eliza to fetch prices, compare swaps, and execute trades across exchanges.

- **Goal**: Allow Eliza to fetch prices, compare swaps, and execute trades across **Pulsar Money** and **xExchange**.
- **Key Features**:

  - Price comparison between the two platforms.
  - Auto-routing swaps to the best rate.
  - Simple chat-based UI for users.

### **Code Repository Structure**

    magic-swap/
    ├── src/
    │   ├── api/                 # API calls to xExchange and Pulsar Money
    │   ├── contracts/           # Smart contract interactions
    │   ├── components/          # Vue components
    │   ├── utils/               # Utility functions (e.g., price comparison)
    │   ├── App.vue              # Main application
    │   └── main.js              # Entry point
    ├── public/                  # Static assets
    ├── index.html               # HTML entry point
    ├── vite.config.js           # Vite configuration
    └── package.json

## Next Steps

- **Add Limit Orders**: _“Notify me when EGLD/USDC > 45.”_
- **Integrate More DEXs**: Add Jexchange or Hatom.
- **Monetize**: Charge 0.1% fee on swaps routed through Eliza.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with Vitest

```sh
npm run test:unit
```
# swap
