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
        AMM: "0x483fE4F52BF57bc0aA83FdbF5eDee251334CAA14", // NEW AMM
        TOKEN_A: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c", // WAVAX
        TOKEN_B: "0x8226EC2c1926c9162b6F815153d10018A7ccdf07"  // WETH.e
    },
    
    // Token Information
    TOKENS: {
        TOKEN_A: {
            symbol: "WAVAX",
            name: "Wrapped AVAX",
            decimals: 18
        },
        TOKEN_B: {
            symbol: "WETH.e",
            name: "Wrapped Ether",
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
