# magic-swap
A MultiversX ElizaOS Plugin that allow Eliza to fetch prices, compare swaps, and execute trades across exchanges.

-   **Goal**: Allow Eliza to fetch prices, compare swaps, and execute trades across  **Pulsar Money**  and  **xExchange**.
    
-   **Key Features**:
    
    -   Price comparison between the two platforms.
        
    -   Auto-routing swaps to the best rate.
        
    -   Simple chat-based UI for users.

### **Code Repository Structure**

    magic-swap/
    ├── src/
    │   ├── api/                 # xExchange/Pulsar API calls
    │   ├── contracts/           # Interaction logic for swaps
    │   ├── components/          # React UI for chat/swap
    │   └── utils/               # Price comparison logic
    ├── tests/                   # Puppeteer tests
    └── config.js                # API endpoints, contract addresses

### ** Next Steps**

-   **Add Limit Orders**:  _“Notify me when EGLD/USDC > 45.”_
    
-   **Integrate More DEXs**: Add Jexchange or Hatom.
    
-   **Monetize**: Charge 0.1% fee on swaps routed through Eliza.
