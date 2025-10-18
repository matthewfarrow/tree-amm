const hre = require("hardhat");

async function main() {
  console.log("🌲 Deploying Forest Tree AMM to Avalanche Fuji Testnet... 🌲\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "AVAX\n");

  // Deploy mock tokens for testing
  console.log("🌱 Creating mock tokens for testing...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  
  // Deploy Token A (Oak Token)
  const tokenA = await MockERC20.deploy(
    "Oak Token",
    "OAK",
    18,
    ethers.parseEther("1000000") // 1 million tokens
  );
  await tokenA.waitForDeployment();
  const tokenAAddress = await tokenA.getAddress();
  console.log("✅ Token A (Oak) deployed to:", tokenAAddress);
  
  // Deploy Token B (Pine Token)
  const tokenB = await MockERC20.deploy(
    "Pine Token",
    "PINE",
    18,
    ethers.parseEther("1000000") // 1 million tokens
  );
  await tokenB.waitForDeployment();
  const tokenBAddress = await tokenB.getAddress();
  console.log("✅ Token B (Pine) deployed to:", tokenBAddress);
  
  // Deploy ForestTreeAMM
  console.log("\n🌳 Planting the Forest Tree AMM contract...");
  const ForestTreeAMM = await ethers.getContractFactory("ForestTreeAMM");
  const forestTreeAMM = await ForestTreeAMM.deploy(tokenAAddress, tokenBAddress);
  
  await forestTreeAMM.waitForDeployment();
  const ammAddress = await forestTreeAMM.getAddress();
  
  console.log("✅ Forest Tree AMM deployed to:", ammAddress);
  
  console.log("\n🌳 Deployment Summary:");
  console.log("════════════════════════════════════════════════════════");
  console.log("Contract: ForestTreeAMM");
  console.log("AMM Address:", ammAddress);
  console.log("Token A (Oak):", tokenAAddress);
  console.log("Token B (Pine):", tokenBAddress);
  console.log("Network: Avalanche Fuji Testnet");
  console.log("Deployer:", deployer.address);
  console.log("════════════════════════════════════════════════════════\n");

  // Mint some tokens to deployer for testing
  console.log("🎁 Minting test tokens to deployer...");
  await tokenA.mint(deployer.address, ethers.parseEther("10000"));
  await tokenB.mint(deployer.address, ethers.parseEther("10000"));
  console.log("✅ Minted 10,000 OAK and 10,000 PINE to deployer\n");

  console.log("✅ Testnet deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Approve tokens for the AMM:");
  console.log(`   npx hardhat run scripts/approve-tokens.js --network fuji`);
  console.log("2. Add initial liquidity:");
  console.log(`   npx hardhat run scripts/add-liquidity.js --network fuji`);
  console.log("3. Test swapping:");
  console.log(`   npx hardhat run scripts/swap.js --network fuji`);
  
  console.log("\n🌲 Happy testing on Fuji! 🌲");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
