// Configuration for Forest Tree AMM
// Update these values after deploying your contracts

const CONFIG = {
    // Network Configuration
    NETWORK: {
        CHAIN_ID: 43113, // Avalanche Fuji Testnet
        // CHAIN_ID: 43114, // Uncomment for Mainnet
        NAME: "Avalanche Fuji Testnet",
        RPC_URL: "https://api.avax-test.network/ext/bc/C/rpc",
        EXPLORER: "https://testnet.snowtrace.io"
    },
    
    // Contract Addresses - DEPLOYED ON FUJI TESTNET
    CONTRACTS: {
        AMM: "0xe9FDbF7Ee526327b766Cb882Fc57610E4622f932", // ForestTreeAMM on Fuji
        TOKEN_A: "0x170b0d27838ab234e82241C9c330ec273497a2A3", // Oak Token (Test)
        TOKEN_B: "0x0C7be5406d451E84BF4EBDdcA889d017F4355e4D"  // Pine Token (Test)
    },
    
    // Token Information
    TOKENS: {
        TOKEN_A: {
            symbol: "OAK",
            name: "Oak Token",
            decimals: 18
        },
        TOKEN_B: {
            symbol: "PINE",
            name: "Pine Token",
            decimals: 18
        }
    },
    
    // Settings
    SETTINGS: {
        DEFAULT_SLIPPAGE: 0.005, // 0.5%
        REFRESH_INTERVAL: 10000  // 10 seconds
    }
};

// Contract ABIs (simplified for frontend use)
const ABIS = {
    AMM: [
        "function plantLiquidity(uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)",
        "function harvestLiquidity(uint256 liquidity, uint256 amountAMin, uint256 amountBMin) external returns (uint256 amountA, uint256 amountB)",
        "function swapTokens(address tokenIn, uint256 amountIn, uint256 amountOutMin) external returns (uint256 amountOut)",
        "function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256 amountOut)",
        "function getReserves() external view returns (uint256 _reserveA, uint256 _reserveB)",
        "function balanceOf(address account) external view returns (uint256)",
        "function totalSupply() external view returns (uint256)",
        "function tokenSaplingA() external view returns (address)",
        "function tokenSaplingB() external view returns (address)"
    ],
    ERC20: [
        "function balanceOf(address account) external view returns (uint256)",
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function symbol() external view returns (string)",
        "function decimals() external view returns (uint8)"
    ]
};
