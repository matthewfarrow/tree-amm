# 🌲 Forest Tree AMM - Quick Start Guide

## ✅ Problem Solved!

The wallet connection issue was caused by **ethers.js failing to load from CDN**. 

**Solution:** Downloaded ethers.js locally (742KB) - no more CDN dependency!

## 🚀 Getting Started

### 1. Start the Web Server

The server should already be running on port 8000. If not:

```bash
cd /Users/mattfarrow/GitRepos/tree-dex
python3 -m http.server --directory frontend 8000
```

Or run in background:
```bash
nohup python3 -m http.server --directory frontend 8000 > /dev/null 2>&1 &
```

### 2. Open the App

**Main App:** http://localhost:8000/index.html
**Diagnostic Tool:** http://localhost:8000/test-connection.html

### 3. Connect Your Wallet

1. Click **"Connect Wallet"** button
2. MetaMask popup will appear - click **"Next"** then **"Connect"**
3. If prompted to switch networks, click **"Switch network"**
4. You should see "✅ Connected" and your wallet address

## 🧪 Test Connection First

If you want to verify everything works before using the main app:

1. Open http://localhost:8000/test-connection.html
2. Click **"Test Ethers.js Library"** - Should show ✅
3. Click **"Test MetaMask Installation"** - Should show ✅
4. Click **"Test Full Connection"** - Should complete all 6 steps

## 📋 Pre-Flight Checklist

- [x] ✅ Ethers.js downloaded locally (no CDN issues)
- [ ] MetaMask browser extension installed
- [ ] MetaMask is unlocked
- [ ] Web server running on port 8000
- [ ] Browser can access localhost:8000

## 🔧 Common Issues

### "Please install MetaMask"
→ Install from https://metamask.io/download/

### "Connection request already pending"
→ Open MetaMask and approve/reject the pending request

### Server not starting (port already in use)
```bash
lsof -ti:8000 | xargs kill -9
python3 -m http.server --directory frontend 8000
```

### Need to mint test tokens
```bash
npx hardhat run scripts/mint-tokens.js --network fuji
```

## 🎯 What to Do After Connection

### Add Liquidity
1. Go to **"🌱 Add Liquidity"** tab
2. Enter amount for Token A (Oak)
3. Token B (Pine) amount will auto-calculate
4. Click **"Plant Liquidity 🌱"**
5. Approve both tokens in MetaMask
6. Confirm the transaction

### Swap Tokens
1. Go to **"🔄 Swap"** tab
2. Select which token to swap FROM
3. Enter amount
4. See estimated output
5. Click **"Swap Tokens"**
6. Approve token (if needed)
7. Confirm transaction

### Remove Liquidity
1. Go to **"🍂 Remove Liquidity"** tab
2. Use slider to select percentage
3. Preview amounts you'll receive
4. Click **"Harvest Liquidity 🍂"**
5. Confirm transaction

### Check Pool Info
1. Go to **"📊 Pool Info"** tab
2. See reserves, LP supply, your share
3. Click **"Refresh 🔄"** to update

## 📊 Network Info

**Avalanche Fuji Testnet**
- Chain ID: 43113
- RPC: https://api.avax-test.network/ext/bc/C/rpc
- Explorer: https://testnet.snowtrace.io
- Faucet: https://faucet.avax.network/ (get test AVAX for gas)

## 🔗 Contract Addresses

- **AMM:** `0xe9FDbF7Ee526327b766Cb882Fc57610E4622f932`
- **Token A (OAK):** `0x170b0d27838ab234e82241C9c330ec273497a2A3`
- **Token B (PINE):** `0x0C7be5406d451E84BF4EBDdcA889d017F4355e4D`

## 🆘 Still Having Issues?

1. Open browser console (F12)
2. Look for error messages
3. Run the diagnostic tool
4. Check MetaMask is on Avalanche Fuji Testnet
5. Ensure you have test AVAX for gas fees

## 📝 Files Modified

- `frontend/index.html` - Updated script loading
- `frontend/app.js` - Enhanced error handling
- `frontend/styles.css` - Added connected button styling
- `frontend/test-connection.html` - NEW diagnostic tool
- `frontend/ethers.min.js` - NEW local library (742KB)
- `WALLET_CONNECTION_FIXES.md` - Detailed fix documentation

---

**Ready to trade? 🌲 Let's grow some liquidity! 🌱**
