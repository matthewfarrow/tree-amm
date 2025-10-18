# 🌲 Forest Tree AMM - Nature-Inspired DEX on Avalanche

![Forest Tree AMM](https://img.shields.io/badge/Avalanche-E84142?style=for-the-badge&logo=avalanche&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**Where liquidity grows like ancient trees** 🌳

A fully functional Automated Market Maker (AMM) inspired by Uniswap V2, featuring the constant product formula (x * y = k), designed with a beautiful green forest tree theme. Deploy and run your own DEX on Avalanche mainnet!

## 🌟 Features

- ✅ **Constant Product Formula**: Classic x * y = k algorithm
- ✅ **0.3% Swap Fee**: Standard fee structure for liquidity providers
- ✅ **Add/Remove Liquidity**: Full liquidity pool management
- ✅ **LP Tokens**: ERC-20 tokens representing pool shares
- ✅ **Slippage Protection**: Minimum amount parameters for safety
- ✅ **Tree-Themed Code**: Nature-inspired variable names and comments
- ✅ **Beautiful Frontend**: Green forest-themed Web3 UI
- ✅ **Avalanche Optimized**: Built for AVAX mainnet deployment

## ⚠️ CRITICAL SECURITY WARNINGS

**READ THIS BEFORE DEPLOYING TO MAINNET:**

1. **🚨 NOT AUDITED**: This contract has NOT been professionally audited. Use at your own risk.
2. **💰 Start Small**: Always test with small amounts first.
3. **📉 Impermanent Loss**: Understand IL risks before providing liquidity.
4. **🔐 Private Keys**: Never share your private keys or commit `.env` files.
5. **⛽ Gas Costs**: Avalanche mainnet transactions cost real AVAX.
6. **🐛 Bugs**: There may be undiscovered vulnerabilities.
7. **📜 License**: This is MIT licensed - use at your own risk.
8. **🔍 Due Diligence**: Recommend professional audit before production use.

## 📋 Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16+
   ```

2. **MetaMask Wallet**
   - Install from [metamask.io](https://metamask.io)
   - Create an account and secure your seed phrase
   - Fund with AVAX for gas fees

3. **AVAX for Gas**
   - Mainnet: Buy AVAX from an exchange (Coinbase, Binance, etc.)
   - Testnet: Get free AVAX from [Avalanche Fuji Faucet](https://faucet.avax.network/)

4. **Snowtrace API Key** (for contract verification)
   - Get free API key at [snowtrace.io](https://snowtrace.io/myapikey)

### Required Tokens

For mainnet deployment, you need two ERC-20 tokens. Common options:
- **WAVAX**: 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7 (Wrapped AVAX)
- **USDC**: 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E
- **USDT.e**: 0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7

## 🚀 Installation & Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd tree-dex

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Update `.env` with:**
```env
# Your wallet private key (NEVER share this!)
PRIVATE_KEY=your_private_key_here

# Snowtrace API key for verification
SNOWTRACE_API_KEY=your_api_key_here

# Token addresses (use real tokens for mainnet)
TOKEN_A_ADDRESS=0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7  # WAVAX
TOKEN_B_ADDRESS=0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E  # USDC
```

**🔐 Security Note**: Add `.env` to `.gitignore` (already done) and NEVER commit it!

### Step 3: Compile Contracts

```bash
# Compile the smart contracts
npm run compile

# You should see:
# ✓ Compiled X Solidity files successfully
```

## 🧪 Testing on Fuji Testnet (RECOMMENDED FIRST)

**Always test on Fuji before mainnet deployment!**

### 1. Get Testnet AVAX

- Visit [Avalanche Fuji Faucet](https://faucet.avax.network/)
- Connect your wallet
- Request testnet AVAX (free)

### 2. Configure MetaMask for Fuji

```
Network Name: Avalanche Fuji C-Chain
RPC URL: https://api.avax-test.network/ext/bc/C/rpc
Chain ID: 43113
Symbol: AVAX
Explorer: https://testnet.snowtrace.io
```

### 3. Deploy to Testnet

```bash
# Deploy contracts (includes mock tokens)
npm run deploy:testnet

# Output will show:
# ✅ Token A (Oak) deployed to: 0x...
# ✅ Token B (Pine) deployed to: 0x...
# ✅ Forest Tree AMM deployed to: 0x...
```

### 4. Test Interactions

```bash
# Add liquidity (update AMM_ADDRESS in .env first)
npx hardhat run scripts/add-liquidity.js --network fuji

# Perform a swap
npx hardhat run scripts/swap.js --network fuji

# Remove liquidity
npx hardhat run scripts/remove-liquidity.js --network fuji
```

### 5. Test the Frontend

```bash
# Update frontend/config.js with your testnet contract addresses
# Then open frontend/index.html in a browser
# Or use a local server:
npx http-server frontend
```

## 🎯 Mainnet Deployment (Production)

**⚠️ Only proceed after thorough testnet testing!**

### Step 1: Configure for Mainnet

1. **Update `.env`**:
   ```env
   TOKEN_A_ADDRESS=0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7  # Real token
   TOKEN_B_ADDRESS=0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E  # Real token
   ```

2. **Verify Token Addresses**: Double-check on [Snowtrace](https://snowtrace.io)

3. **Fund Your Wallet**: Ensure you have enough AVAX for gas (~0.5 AVAX recommended)

### Step 2: Configure MetaMask for Mainnet

```
Network Name: Avalanche Network
RPC URL: https://api.avax.network/ext/bc/C/rpc
Chain ID: 43114
Symbol: AVAX
Explorer: https://snowtrace.io
```

### Step 3: Deploy to Mainnet

```bash
# Deploy to Avalanche C-Chain Mainnet
npm run deploy:mainnet

# ⚠️ This will cost real AVAX!

# Save the contract address from the output:
# ✅ Forest Tree AMM deployed to: 0xYourContractAddress
```

**Expected Gas Cost**: ~0.1-0.3 AVAX (depending on network conditions)

### Step 4: Verify Contract on Snowtrace

```bash
# Verify the contract (makes source code public)
npx hardhat verify --network avalanche YOUR_CONTRACT_ADDRESS "TOKEN_A_ADDRESS" "TOKEN_B_ADDRESS"

# Example:
npx hardhat verify --network avalanche 0x123... "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7" "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
```

After verification, your contract will show a green checkmark on Snowtrace and users can read the code.

### Step 5: Configure Frontend

1. **Update `frontend/config.js`**:
   ```javascript
   CONTRACTS: {
       AMM: "0xYourDeployedContractAddress",
       TOKEN_A: "0xYourTokenAAddress",
       TOKEN_B: "0xYourTokenBAddress"
   }
   ```

2. **Update token information** to match your tokens:
   ```javascript
   TOKENS: {
       TOKEN_A: {
           symbol: "WAVAX",
           name: "Wrapped AVAX",
           decimals: 18
       },
       TOKEN_B: {
           symbol: "USDC",
           name: "USD Coin",
           decimals: 6  // IMPORTANT: Check actual decimals!
       }
   }
   ```

3. **Test locally**:
   ```bash
   npx http-server frontend
   # Open http://localhost:8080 in browser
   ```

4. **Deploy frontend**: Upload to:
   - IPFS (decentralized)
   - Vercel/Netlify (easy)
   - GitHub Pages (free)
   - Your own hosting

## 💻 Using the DEX

### Via Frontend (Recommended)

1. Open `frontend/index.html` in a browser
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. Switch to Avalanche network if prompted

**Swap Tokens**:
- Select token and enter amount
- Review output and price impact
- Click "Swap Tokens"
- Approve in MetaMask
- Wait for confirmation

**Add Liquidity**:
- Enter Token A amount
- Token B amount auto-calculates
- Review pool share
- Click "Plant Liquidity 🌱"
- Approve both tokens (if first time)
- Wait for confirmation

**Remove Liquidity**:
- Move slider to select percentage
- Review amounts to receive
- Click "Harvest Liquidity 🍂"
- Confirm in MetaMask

### Via Scripts (Advanced)

```bash
# Add liquidity
npx hardhat run scripts/add-liquidity.js --network avalanche

# Swap tokens
npx hardhat run scripts/swap.js --network avalanche

# Remove liquidity
npx hardhat run scripts/remove-liquidity.js --network avalanche
```

### Via Snowtrace (Expert)

1. Go to [snowtrace.io](https://snowtrace.io)
2. Find your contract address
3. Click "Contract" → "Write Contract"
4. Connect wallet
5. Call functions directly

## 📊 Understanding the AMM

### Constant Product Formula

```
x * y = k
```

Where:
- `x` = Token A reserve
- `y` = Token B reserve
- `k` = Constant (stays the same)

### Pricing

```
Price of Token A in B = Reserve B / Reserve A
Price of Token B in A = Reserve A / Reserve B
```

### Swap Fee (0.3%)

```
Output = (Input * 0.997 * Reserve_Out) / (Reserve_In + Input * 0.997)
```

The 0.3% fee goes to liquidity providers proportionally.

### Impermanent Loss

When token prices diverge, LPs may have less value than HODLing. Learn more:
- [Impermanent Loss Calculator](https://dailydefi.org/tools/impermanent-loss-calculator/)
- [Understanding IL](https://academy.binance.com/en/articles/impermanent-loss-explained)

## 🏗️ Project Structure

```
tree-dex/
├── contracts/
│   ├── ForestTreeAMM.sol      # Main AMM contract
│   └── MockERC20.sol           # Test token (testnet only)
├── scripts/
│   ├── deploy-mainnet.js       # Mainnet deployment
│   ├── deploy-testnet.js       # Testnet deployment
│   ├── add-liquidity.js        # Add liquidity script
│   ├── swap.js                 # Token swap script
│   └── remove-liquidity.js     # Remove liquidity script
├── frontend/
│   ├── index.html              # Main UI
│   ├── styles.css              # Forest theme styling
│   ├── app.js                  # Web3 logic
│   └── config.js               # Contract configuration
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Dependencies
├── .env.example                # Environment template
└── README.md                   # This file
```

## 🔧 Troubleshooting

### "Insufficient funds for gas"
- Check your AVAX balance
- Mainnet: Buy more AVAX
- Testnet: Use faucet

### "Invalid network"
- Verify you're on correct network
- Chain ID: 43114 (mainnet) or 43113 (testnet)
- Update MetaMask RPC if needed

### "Transaction reverted"
- Check slippage settings
- Ensure sufficient token balance
- Verify token approvals
- Check pool has liquidity

### "Nonce too high"
- Reset MetaMask: Settings → Advanced → Reset Account

### Contract not verifying
- Ensure exact constructor parameters
- Check Solidity version matches
- Try manual verification on Snowtrace

## 📈 Gas Optimization Tips

1. **Deploy during low traffic**: Check [Snowtrace gas tracker](https://snowtrace.io/gastracker)
2. **Batch operations**: Combine multiple actions when possible
3. **Use multicall**: For reading multiple values
4. **Optimize slippage**: Lower slippage = less likely to need retries

## 🔐 Security Best Practices

### Before Mainnet:
- [ ] Test thoroughly on Fuji testnet
- [ ] Review all contract code
- [ ] Consider professional audit
- [ ] Start with small liquidity
- [ ] Test all functions (add/remove/swap)
- [ ] Verify token addresses multiple times
- [ ] Check token decimals are correct

### After Deployment:
- [ ] Verify contract on Snowtrace
- [ ] Monitor first transactions closely
- [ ] Set up alerts for large transactions
- [ ] Document contract address securely
- [ ] Consider timelock for admin functions (if added)
- [ ] Monitor for unusual activity

### For Users:
- [ ] Understand impermanent loss
- [ ] Start with small amounts
- [ ] Check price impact before swapping
- [ ] Verify you're on official contract
- [ ] Never share private keys
- [ ] Use hardware wallet for large amounts

## 🌐 Additional Resources

### Avalanche
- [Avalanche Docs](https://docs.avax.network/)
- [Avalanche Bridge](https://bridge.avax.network/)
- [Snowtrace Explorer](https://snowtrace.io/)

### DeFi & AMMs
- [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf)
- [AMM Basics](https://academy.binance.com/en/articles/what-is-an-automated-market-maker-amm)
- [Impermanent Loss Guide](https://finematics.com/impermanent-loss-explained/)

### Development
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

**Disclaimer**: This software is provided "as is" without warranty. Use at your own risk.

## 🌲 Support

- **Issues**: Open a GitHub issue
- **Questions**: Check existing issues first
- **Security**: Report vulnerabilities privately

## 🎉 Acknowledgments

- Inspired by Uniswap V2
- Built with OpenZeppelin
- Powered by Avalanche
- Themed by nature lovers 🌳

---

**🌲 May your liquidity grow like ancient trees! 🌲**

*Built with 💚 for the DeFi community*
