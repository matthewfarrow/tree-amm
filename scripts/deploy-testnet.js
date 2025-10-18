const hre = require("hardhat");

async function main() {
  console.log("🌲 Deploying Tree AMM to Avalanche Fuji Testnet... 🌲\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "AVAX\n");

  // Use existing WAVAX and WETH.e tokens on Fuji
  const tokenAAddress = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c"; // WAVAX
  const tokenBAddress = "0x8226EC2c1926c9162b6F815153d10018A7ccdf07"; // WETH.e
  
  console.log("✅ Using Token A (WAVAX):", tokenAAddress);
  console.log("✅ Using Token B (WETH.e):", tokenBAddress);
  
  // Deploy ForestTreeAMM
  console.log("\n🌳 Planting the Tree AMM contract...");
  const ForestTreeAMM = await ethers.getContractFactory("ForestTreeAMM");
  const forestTreeAMM = await ForestTreeAMM.deploy(tokenAAddress, tokenBAddress);
  
  await forestTreeAMM.waitForDeployment();
  const ammAddress = await forestTreeAMM.getAddress();
  
  console.log("✅ Tree AMM deployed to:", ammAddress);
  
  console.log("\n🌳 Deployment Summary:");
  console.log("════════════════════════════════════════════════════════");
  console.log("Contract: TreeAMM");
  console.log("AMM Address:", ammAddress);
  console.log("Token A (WAVAX):", tokenAAddress);
  console.log("Token B (WETH.e):", tokenBAddress);
  console.log("Network: Avalanche Fuji Testnet");
  console.log("Deployer:", deployer.address);
  console.log("════════════════════════════════════════════════════════\n");

  console.log("✅ Testnet deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Get WAVAX from faucet or wrap AVAX");
  console.log("2. Get WETH.e from faucet");
  console.log("3. Approve tokens and add liquidity via frontend");
  console.log("4. Update frontend config.js with new AMM address:", ammAddress);
  
  console.log("\n🌲 Happy trading on Fuji! 🌲");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
