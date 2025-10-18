require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  
  networks: {
    // Avalanche Fuji Testnet
    fuji: {
      url: process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 25000000000, // 25 gwei
    },
    
    // Avalanche Mainnet (C-Chain)
    avalanche: {
      url: process.env.AVALANCHE_RPC_URL || "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 25000000000, // 25 gwei - adjust based on network conditions
    },
    
    // Local Hardhat Network (for testing)
    hardhat: {
      chainId: 31337,
    },
  },
  
  etherscan: {
    apiKey: {
      avalanche: process.env.SNOWTRACE_API_KEY || "YOUR_SNOWTRACE_API_KEY",
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || "YOUR_SNOWTRACE_API_KEY",
    },
  },
  
  sourcify: {
    enabled: false
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
