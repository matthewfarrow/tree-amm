// Forest Tree AMM - Main Application Logic

let provider;
let signer;
let ammContract;
let tokenAContract;
let tokenBContract;
let userAddress;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        console.error('Ethers.js library failed to load');
        showToast('Failed to load required libraries. Please refresh the page.', 'error');
        return;
    }
    
    setupEventListeners();
    checkWalletConnection();
});

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Wallet connection
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('disconnectWallet').addEventListener('click', disconnectWallet);


    // Swap
    document.getElementById('swapAmountIn').addEventListener('input', calculateSwapOutput);
    document.getElementById('swapTokenIn').addEventListener('change', updateSwapTokens);
    document.getElementById('executeSwap').addEventListener('click', executeSwap);

    // Add Liquidity
    document.getElementById('liquidityAmountA').addEventListener('input', calculateLiquidityB);
    document.getElementById('addLiquidity').addEventListener('click', addLiquidity);

    // Remove Liquidity
    document.getElementById('removePercentage').addEventListener('input', updateRemovalPreview);
    document.getElementById('removeLiquidity').addEventListener('click', removeLiquidity);

    // Refresh
    document.getElementById('refreshInfo').addEventListener('click', refreshPoolInfo);
}

// Tab switching
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

// Check if wallet is already connected
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    }
}

// Connect wallet
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        showToast('Please install MetaMask! Visit metamask.io', 'error');
        window.open('https://metamask.io/download/', '_blank');
        return;
    }

    try {
        showLoading();
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length === 0) {
            showToast('No accounts found. Please unlock MetaMask.', 'error');
            hideLoading();
            return;
        }
        
        // Create provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        // Check network
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.chainId);
        
        if (network.chainId !== CONFIG.NETWORK.CHAIN_ID) {
            showToast('Switching to Avalanche Fuji Testnet...', 'warning');
            await switchNetwork();
        }

        // Initialize contracts
        ammContract = new ethers.Contract(CONFIG.CONTRACTS.AMM, ABIS.AMM, signer);
        tokenAContract = new ethers.Contract(CONFIG.CONTRACTS.TOKEN_A, ABIS.ERC20, signer);
        tokenBContract = new ethers.Contract(CONFIG.CONTRACTS.TOKEN_B, ABIS.ERC20, signer);

        // Update UI
        document.getElementById('connectWallet').textContent = '✅ Connected';
        document.getElementById('connectWallet').disabled = true;
        document.getElementById('connectWallet').classList.add('connected');
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('disconnectWallet').style.display = 'inline-block';
        document.getElementById('walletAddress').textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

        // Load initial data
        await loadAllData();
        
        showToast('Wallet connected successfully! 🌲', 'success');
        hideLoading();
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
        console.error('Connection error:', error);
        let errorMessage = 'Failed to connect wallet';
        
        if (error.code === 4001) {
            errorMessage = 'Connection request rejected. Please try again.';
        } else if (error.code === -32002) {
            errorMessage = 'Connection request already pending. Please check MetaMask.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showToast(errorMessage, 'error');
        hideLoading();
    }
}

//Disconnect wallet
function disconnectWallet() {
    // Clear state
    provider = null;
    signer = null;
    ammContract = null;
    tokenAContract = null;
    tokenBContract = null;
    userAddress = null;

    // Reset UI
    document.getElementById('connectWallet').textContent = 'Connect Wallet';
    document.getElementById('connectWallet').disabled = false;
    document.getElementById('connectWallet').classList.remove('connected');
    document.getElementById('connectWallet').style.display = 'inline-block';
    document.getElementById('disconnectWallet').style.display = 'none';
    document.getElementById('walletAddress').textContent = '';

    showToast('Wallet disconnected', 'success');
}

// Switch to Avalanche network
async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CONFIG.NETWORK.CHAIN_ID.toString(16)}` }],
        });
        showToast('Switched to Avalanche Fuji Testnet', 'success');
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${CONFIG.NETWORK.CHAIN_ID.toString(16)}`,
                        chainName: CONFIG.NETWORK.NAME,
                        rpcUrls: [CONFIG.NETWORK.RPC_URL],
                        nativeCurrency: {
                            name: 'AVAX',
                            symbol: 'AVAX',
                            decimals: 18
                        },
                        blockExplorerUrls: [CONFIG.NETWORK.EXPLORER]
                    }]
                });
                showToast('Avalanche Fuji Testnet added successfully!', 'success');
            } catch (addError) {
                console.error('Error adding network:', addError);
                throw new Error('Failed to add Avalanche network. Please add it manually in MetaMask.');
            }
        } else if (switchError.code === 4001) {
            throw new Error('Please approve the network switch in MetaMask.');
        } else {
            throw switchError;
        }
    }
}

// Load all data
async function loadAllData() {
    await Promise.all([
        loadBalances(),
        loadReserves(),
        loadLPBalance()
    ]);
}

// Load user balances
async function loadBalances() {
    try {
        const balanceA = await tokenAContract.balanceOf(userAddress);
        const balanceB = await tokenBContract.balanceOf(userAddress);

        const formattedA = ethers.utils.formatUnits(balanceA, CONFIG.TOKENS.TOKEN_A.decimals);
        const formattedB = ethers.utils.formatUnits(balanceB, CONFIG.TOKENS.TOKEN_B.decimals);

        document.getElementById('balanceA').textContent = parseFloat(formattedA).toFixed(4);
        document.getElementById('balanceB').textContent = parseFloat(formattedB).toFixed(4);
        document.getElementById('swapBalanceIn').textContent = parseFloat(formattedA).toFixed(4);
        document.getElementById('swapBalanceOut').textContent = parseFloat(formattedB).toFixed(4);
    } catch (error) {
        console.error('Error loading balances:', error);
    }
}

// Load pool reserves
async function loadReserves() {
    try {
        const reserves = await ammContract.getReserves();
        
        const formattedA = ethers.utils.formatUnits(reserves[0], CONFIG.TOKENS.TOKEN_A.decimals);
        const formattedB = ethers.utils.formatUnits(reserves[1], CONFIG.TOKENS.TOKEN_B.decimals);

        document.getElementById('reserveA').textContent = parseFloat(formattedA).toFixed(4);
        document.getElementById('reserveB').textContent = parseFloat(formattedB).toFixed(4);

        // Update price ratio
        if (parseFloat(formattedA) > 0) {
            const ratio = parseFloat(formattedB) / parseFloat(formattedA);
            document.getElementById('priceRatio').textContent = `1 ${CONFIG.TOKENS.TOKEN_A.symbol} = ${ratio.toFixed(4)} ${CONFIG.TOKENS.TOKEN_B.symbol}`;
        }
    } catch (error) {
        console.error('Error loading reserves:', error);
    }
}

// Load LP balance
async function loadLPBalance() {
    try {
        const lpBalance = await ammContract.balanceOf(userAddress);
        const totalSupply = await ammContract.totalSupply();

        const formattedLP = ethers.utils.formatEther(lpBalance);
        const formattedTotal = ethers.utils.formatEther(totalSupply);

        document.getElementById('lpBalance').textContent = parseFloat(formattedLP).toFixed(4);
        document.getElementById('yourLpBalance').textContent = parseFloat(formattedLP).toFixed(4);
        document.getElementById('totalSupply').textContent = parseFloat(formattedTotal).toFixed(4);

        // Calculate pool share
        if (parseFloat(formattedTotal) > 0) {
            const share = (parseFloat(formattedLP) / parseFloat(formattedTotal)) * 100;
            document.getElementById('poolShare').textContent = share.toFixed(4) + '%';
        }
    } catch (error) {
        console.error('Error loading LP balance:', error);
    }
}

// Calculate swap output
async function calculateSwapOutput() {
    const amountIn = document.getElementById('swapAmountIn').value;
    
    if (!amountIn || parseFloat(amountIn) <= 0 || !ammContract) {
        document.getElementById('swapAmountOut').value = '';
        document.getElementById('priceImpact').textContent = '-';
        document.getElementById('swapFee').textContent = '-';
        return;
    }

    try {
        const isTokenA = document.getElementById('swapTokenIn').value === 'tokenA';
        const decimals = isTokenA ? CONFIG.TOKENS.TOKEN_A.decimals : CONFIG.TOKENS.TOKEN_B.decimals;
        const outDecimals = isTokenA ? CONFIG.TOKENS.TOKEN_B.decimals : CONFIG.TOKENS.TOKEN_A.decimals;
        
        const amountInWei = ethers.utils.parseUnits(amountIn, decimals);
        const reserves = await ammContract.getReserves();
        
        const reserveIn = isTokenA ? reserves[0] : reserves[1];
        const reserveOut = isTokenA ? reserves[1] : reserves[0];
        
        const amountOut = await ammContract.getAmountOut(amountInWei, reserveIn, reserveOut);
        const formattedOut = ethers.utils.formatUnits(amountOut, outDecimals);
        
        document.getElementById('swapAmountOut').value = parseFloat(formattedOut).toFixed(6);
        
        // Calculate fee (0.3%)
        const fee = parseFloat(amountIn) * 0.003;
        document.getElementById('swapFee').textContent = fee.toFixed(6);
        
        // Calculate price impact
        const reserveInFormatted = parseFloat(ethers.utils.formatUnits(reserveIn, decimals));
        const priceImpact = (parseFloat(amountIn) / reserveInFormatted) * 100;
        document.getElementById('priceImpact').textContent = priceImpact.toFixed(4) + '%';
        
    } catch (error) {
        console.error('Error calculating swap:', error);
    }
}

// Update swap token dropdowns
function updateSwapTokens() {
    const tokenIn = document.getElementById('swapTokenIn').value;
    const tokenOutSelect = document.getElementById('swapTokenOut');
    
    if (tokenIn === 'tokenA') {
        tokenOutSelect.value = 'tokenB';
    } else {
        tokenOutSelect.value = 'tokenA';
    }
    
    calculateSwapOutput();
    loadBalances();
}

// Execute swap
async function executeSwap() {
    if (!signer) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    const amountIn = document.getElementById('swapAmountIn').value;
    const amountOut = document.getElementById('swapAmountOut').value;

    if (!amountIn || parseFloat(amountIn) <= 0) {
        showToast('Please enter a valid amount', 'warning');
        return;
    }

    try {
        showLoading();

        const isTokenA = document.getElementById('swapTokenIn').value === 'tokenA';
        const tokenIn = isTokenA ? CONFIG.CONTRACTS.TOKEN_A : CONFIG.CONTRACTS.TOKEN_B;
        const tokenContract = isTokenA ? tokenAContract : tokenBContract;
        const decimals = isTokenA ? CONFIG.TOKENS.TOKEN_A.decimals : CONFIG.TOKENS.TOKEN_B.decimals;
        const outDecimals = isTokenA ? CONFIG.TOKENS.TOKEN_B.decimals : CONFIG.TOKENS.TOKEN_A.decimals;

        const amountInWei = ethers.utils.parseUnits(amountIn, decimals);
        const minAmountOut = ethers.utils.parseUnits(
            (parseFloat(amountOut) * (1 - CONFIG.SETTINGS.DEFAULT_SLIPPAGE)).toFixed(6),
            outDecimals
        );

        // Check and approve if needed
        const allowance = await tokenContract.allowance(userAddress, CONFIG.CONTRACTS.AMM);
        if (allowance.lt(amountInWei)) {
            showToast('Approving tokens...', 'warning');
            const approveTx = await tokenContract.approve(CONFIG.CONTRACTS.AMM, amountInWei);
            await approveTx.wait();
        }

        // Execute swap
        showToast('Swapping tokens...', 'warning');
        const swapTx = await ammContract.swapTokens(tokenIn, amountInWei, minAmountOut);
        await swapTx.wait();

        showToast('Swap successful! 🔄', 'success');
        
        // Reset and reload
        document.getElementById('swapAmountIn').value = '';
        document.getElementById('swapAmountOut').value = '';
        await loadAllData();

    } catch (error) {
        console.error('Swap error:', error);
        showToast('Swap failed: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Calculate liquidity B amount
async function calculateLiquidityB() {
    const amountA = document.getElementById('liquidityAmountA').value;
    
    if (!amountA || parseFloat(amountA) <= 0 || !ammContract) {
        return;
    }

    try {
        const reserves = await ammContract.getReserves();
        
        if (reserves[0].gt(0) && reserves[1].gt(0)) {
            const amountAWei = ethers.utils.parseUnits(amountA, CONFIG.TOKENS.TOKEN_A.decimals);
            const amountBWei = amountAWei.mul(reserves[1]).div(reserves[0]);
            const amountB = ethers.utils.formatUnits(amountBWei, CONFIG.TOKENS.TOKEN_B.decimals);
            
            document.getElementById('liquidityAmountB').value = parseFloat(amountB).toFixed(6);
        }
    } catch (error) {
        console.error('Error calculating liquidity B:', error);
    }
}

// Add liquidity
async function addLiquidity() {
    if (!signer) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    const amountA = document.getElementById('liquidityAmountA').value;
    const amountB = document.getElementById('liquidityAmountB').value;

    if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
        showToast('Please enter valid amounts', 'warning');
        return;
    }

    try {
        showLoading();

        const amountAWei = ethers.utils.parseUnits(amountA, CONFIG.TOKENS.TOKEN_A.decimals);
        const amountBWei = ethers.utils.parseUnits(amountB, CONFIG.TOKENS.TOKEN_B.decimals);

        const minAmountA = amountAWei.mul(99).div(100); // 1% slippage
        const minAmountB = amountBWei.mul(99).div(100);

        // Check and approve tokens
        const allowanceA = await tokenAContract.allowance(userAddress, CONFIG.CONTRACTS.AMM);
        if (allowanceA.lt(amountAWei)) {
            showToast('Approving Token A...', 'warning');
            const approveTx = await tokenAContract.approve(CONFIG.CONTRACTS.AMM, amountAWei);
            await approveTx.wait();
        }

        const allowanceB = await tokenBContract.allowance(userAddress, CONFIG.CONTRACTS.AMM);
        if (allowanceB.lt(amountBWei)) {
            showToast('Approving Token B...', 'warning');
            const approveTx = await tokenBContract.approve(CONFIG.CONTRACTS.AMM, amountBWei);
            await approveTx.wait();
        }

        // Add liquidity
        showToast('Planting liquidity... 🌱', 'warning');
        const addTx = await ammContract.plantLiquidity(amountAWei, amountBWei, minAmountA, minAmountB);
        await addTx.wait();

        showToast('Liquidity added successfully! 🌳', 'success');
        
        // Reset and reload
        document.getElementById('liquidityAmountA').value = '';
        document.getElementById('liquidityAmountB').value = '';
        await loadAllData();

    } catch (error) {
        console.error('Add liquidity error:', error);
        showToast('Failed to add liquidity: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Update removal preview
async function updateRemovalPreview() {
    const percentage = document.getElementById('removePercentage').value;
    document.getElementById('removePercentageDisplay').textContent = percentage + '%';

    if (!ammContract || percentage == 0) {
        document.getElementById('receiveA').textContent = '0.0';
        document.getElementById('receiveB').textContent = '0.0';
        return;
    }

    try {
        const lpBalance = await ammContract.balanceOf(userAddress);
        const reserves = await ammContract.getReserves();
        const totalSupply = await ammContract.totalSupply();

        const liquidityToRemove = lpBalance.mul(percentage).div(100);
        
        const amountA = liquidityToRemove.mul(reserves[0]).div(totalSupply);
        const amountB = liquidityToRemove.mul(reserves[1]).div(totalSupply);

        const formattedA = ethers.utils.formatUnits(amountA, CONFIG.TOKENS.TOKEN_A.decimals);
        const formattedB = ethers.utils.formatUnits(amountB, CONFIG.TOKENS.TOKEN_B.decimals);

        document.getElementById('receiveA').textContent = parseFloat(formattedA).toFixed(6);
        document.getElementById('receiveB').textContent = parseFloat(formattedB).toFixed(6);
    } catch (error) {
        console.error('Error updating removal preview:', error);
    }
}

// Remove liquidity
async function removeLiquidity() {
    if (!signer) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    const percentage = document.getElementById('removePercentage').value;

    if (percentage == 0) {
        showToast('Please select an amount to remove', 'warning');
        return;
    }

    try {
        showLoading();

        const lpBalance = await ammContract.balanceOf(userAddress);
        const liquidityToRemove = lpBalance.mul(percentage).div(100);

        const reserves = await ammContract.getReserves();
        const totalSupply = await ammContract.totalSupply();

        const amountA = liquidityToRemove.mul(reserves[0]).div(totalSupply);
        const amountB = liquidityToRemove.mul(reserves[1]).div(totalSupply);

        const minAmountA = amountA.mul(99).div(100); // 1% slippage
        const minAmountB = amountB.mul(99).div(100);

        showToast('Harvesting liquidity... 🍂', 'warning');
        const removeTx = await ammContract.harvestLiquidity(liquidityToRemove, minAmountA, minAmountB);
        await removeTx.wait();

        showToast('Liquidity removed successfully! 🍂', 'success');
        
        // Reset and reload
        document.getElementById('removePercentage').value = 0;
        document.getElementById('removePercentageDisplay').textContent = '0%';
        document.getElementById('receiveA').textContent = '0.0';
        document.getElementById('receiveB').textContent = '0.0';
        await loadAllData();

    } catch (error) {
        console.error('Remove liquidity error:', error);
        showToast('Failed to remove liquidity: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Refresh pool info
async function refreshPoolInfo() {
    if (!ammContract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    try {
        showLoading();
        await loadAllData();
        
        // Update contract addresses
        document.getElementById('ammAddress').textContent = CONFIG.CONTRACTS.AMM;
        document.getElementById('tokenAAddress').textContent = CONFIG.CONTRACTS.TOKEN_A;
        document.getElementById('tokenBAddress').textContent = CONFIG.CONTRACTS.TOKEN_B;
        
        showToast('Pool info refreshed! 🔄', 'success');
    } catch (error) {
        console.error('Refresh error:', error);
        showToast('Failed to refresh info', 'error');
    } finally {
        hideLoading();
    }
}

// UI Helper Functions
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected wallet
        showToast('Wallet disconnected. Please reconnect.', 'warning');
        location.reload();
    } else {
        // User switched accounts
        showToast('Account changed. Reloading...', 'warning');
        location.reload();
    }
}

// Handle chain changes
function handleChainChanged(chainId) {
    showToast('Network changed. Reloading...', 'warning');
    location.reload();
}
