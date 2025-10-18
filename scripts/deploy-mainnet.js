const hre = require("hardhat");

async function main() {
  console.log("🌲 Deploying Forest Tree AMM to Avalanche Mainnet... 🌲\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "AVAX\n");

  // ⚠️ IMPORTANT: Replace these with your actual token addresses on Avalanche mainnet
  // Example tokens on Avalanche C-Chain:
  // WAVAX: 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7
  // USDC: 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E
  // USDT: 0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7
  
  const TOKEN_A_ADDRESS = process.env.TOKEN_A_ADDRESS || "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"; // WAVAX
  const TOKEN_B_ADDRESS = process.env.TOKEN_B_ADDRESS || "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"; // USDC
  
  console.log("Token A (Sapling A):", TOKEN_A_ADDRESS);
  console.log("Token B (Sapling B):", TOKEN_B_ADDRESS);
  console.log("\n⚠️  WARNING: Ensure these token addresses are correct for mainnet!\n");

  // Deploy ForestTreeAMM
  console.log("🌱 Planting the Forest Tree AMM contract...");
  const ForestTreeAMM = await ethers.getContractFactory("ForestTreeAMM");
  const forestTreeAMM = await ForestTreeAMM.deploy(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
  
  await forestTreeAMM.waitForDeployment();
  const ammAddress = await forestTreeAMM.getAddress();
  
  console.log("✅ Forest Tree AMM deployed to:", ammAddress);
  console.log("\n🌳 Deployment Summary:");
  console.log("════════════════════════════════════════════════════════");
  console.log("Contract: ForestTreeAMM");
  console.log("Address:", ammAddress);
  console.log("Token A:", TOKEN_A_ADDRESS);
  console.log("Token B:", TOKEN_B_ADDRESS);
  console.log("Network: Avalanche C-Chain Mainnet");
  console.log("Deployer:", deployer.address);
  console.log("════════════════════════════════════════════════════════\n");

  // Wait for a few block confirmations before verification
  console.log("⏳ Waiting for 5 block confirmations...");
  await forestTreeAMM.deploymentTransaction().wait(5);
  
  console.log("✅ Confirmed! Now you can verify the contract on Snowtrace.");
  console.log("\n📝 To verify on Snowtrace, run:");
  console.log(`npx hardhat verify --network avalanche ${ammAddress} "${TOKEN_A_ADDRESS}" "${TOKEN_B_ADDRESS}"`);
  
  console.log("\n🎉 Deployment complete! Your forest is ready to grow.");
  console.log("\n⚠️  SECURITY REMINDERS:");
  console.log("1. This contract has NOT been audited. Use at your own risk.");
  console.log("2. Start with small amounts to test functionality.");
  console.log("3. Understand impermanent loss before providing liquidity.");
  console.log("4. Be aware of price impact on large trades.");
  console.log("5. Double-check all token addresses and amounts before transactions.");
  console.log("\n🌲 May your liquidity grow like ancient trees! 🌲");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
