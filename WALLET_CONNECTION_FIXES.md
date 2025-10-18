# Wallet Connection Fixes for Forest Tree AMM

## Issues Fixed

### 1. **Downloaded Ethers.js Locally (CRITICAL FIX)**
**Problem:** CDN sources for ethers.js were being blocked or failing to load, causing the entire app to fail.

**Fix:** Downloaded ethers.js library locally (742KB) so the app doesn't depend on external CDNs:
```html
<!-- Now loads from local file -->
<script src="ethers.min.js"></script>
```

This eliminates:
- CDN downtime issues
- CORS/security policy blocks
- Network connectivity problems
- Integrity check failures

### 2. **Updated Ethers.js CDN Link (Initial attempt)**
**Problem:** The previous CDN link from cdnjs.cloudflare.com might have CORS issues or integrity check failures.

**Fix:** Changed to the official ethers.io CDN:
```html
<!-- OLD -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js" ...></script>

<!-- NEW -->
<script src="https://cdn.ethers.io/lib/ethers-5.7.umd.min.js" type="text/javascript"></script>
```

### 2. **Added Ethers.js Loading Check**
**Problem:** App tried to use ethers before checking if the library loaded successfully.

**Fix:** Added check in DOMContentLoaded:
```javascript
if (typeof ethers === 'undefined') {
    console.error('Ethers.js library failed to load');
    showToast('Failed to load required libraries. Please refresh the page.', 'error');
    return;
}
```

### 3. **Enhanced Wallet Connection Error Handling**
**Problem:** Generic error messages didn't help users understand what went wrong.

**Fix:** Added specific error handling for common MetaMask errors:
- Error 4001: User rejected the request
- Error -32002: Request already pending
- Better error messages with actionable feedback
- Link to MetaMask download page if not installed

### 4. **Improved Network Switching**
**Problem:** Network switch failures weren't handled properly.

**Fix:** Added better error handling and user feedback:
- Success messages for network switches
- Clear error messages for failed network additions
- Better handling of user rejections

### 5. **Added Account & Chain Change Listeners**
**Problem:** App didn't react to wallet changes (account switches or network changes).

**Fix:** Added event listeners:
```javascript
window.ethereum.on('accountsChanged', handleAccountsChanged);
window.ethereum.on('chainChanged', handleChainChanged);
```

### 6. **Better UI Feedback**
**Problem:** Users couldn't tell if wallet was connected.

**Fix:** 
- Changed button text to "✅ Connected"
- Added CSS class for connected state
- Shows shortened wallet address

### 7. **Added Diagnostic Tool**
**Problem:** Hard to debug connection issues.

**Fix:** Created `test-connection.html` to test:
- MetaMask installation
- Ethers.js loading
- Full connection flow
- Network information
- Balance retrieval

## How to Use

### Main App
1. Open http://localhost:8000/index.html
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. If on wrong network, approve network switch to Avalanche Fuji

### Diagnostic Tool
1. Open http://localhost:8000/test-connection.html
2. Click each test button:
   - "Test MetaMask Installation"
   - "Test Ethers.js Library"
   - "Test Full Connection"
3. Review results to identify any issues

## Common Issues & Solutions

### Issue: "Please install MetaMask"
**Solution:** Install MetaMask browser extension from metamask.io

### Issue: "Connection request already pending"
**Solution:** Open MetaMask and approve/reject the pending request

### Issue: "Wrong network"
**Solution:** 
- Approve the network switch prompt in MetaMask
- OR manually switch to Avalanche Fuji Testnet in MetaMask

### Issue: Ethers.js not loading
**Solution:** 
- ✅ **FIXED:** Now using local copy of ethers.js (ethers.min.js)
- No longer depends on CDN availability
- File is included in the frontend directory
- If you need to re-download: `curl -o frontend/ethers.min.js https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js`

### Issue: Page won't load
**Solution:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Restart server
python3 -m http.server --directory frontend 8000
```

## Testing Checklist

- [ ] MetaMask is installed
- [ ] Server is running on port 8000
- [ ] Page loads without console errors
- [ ] "Connect Wallet" button is visible
- [ ] Clicking button opens MetaMask
- [ ] Approving connection works
- [ ] Network switches to Fuji if needed
- [ ] Wallet address displays correctly
- [ ] Pool information loads
- [ ] Token balances display

## Network Configuration

The app is configured for **Avalanche Fuji Testnet**:
- Chain ID: 43113
- RPC URL: https://api.avax-test.network/ext/bc/C/rpc
- Explorer: https://testnet.snowtrace.io

## Contract Addresses (from config.js)
- AMM: 0xe9FDbF7Ee526327b766Cb882Fc57610E4622f932
- Token A (OAK): 0x170b0d27838ab234e82241C9c330ec273497a2A3
- Token B (PINE): 0x0C7be5406d451E84BF4EBDdcA889d017F4355e4D

## Next Steps After Connection

1. **Get Test Tokens:**
   ```bash
   npx hardhat run scripts/mint-tokens.js --network fuji
   ```

2. **Add Liquidity:**
   - Go to "Add Liquidity" tab
   - Enter amounts for both tokens
   - Click "Plant Liquidity 🌱"

3. **Swap Tokens:**
   - Go to "Swap" tab
   - Enter amount to swap
   - Click "Swap Tokens"

## Support

If issues persist:
1. Check browser console (F12) for errors
2. Check MetaMask is unlocked
3. Verify you're on Avalanche Fuji Testnet
4. Try the diagnostic tool (test-connection.html)
5. Ensure you have test AVAX for gas fees
