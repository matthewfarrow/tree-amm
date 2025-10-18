const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🌱 Adding liquidity to Forest Tree AMM...\n");

  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  // Contract addresses - update these after deployment
  const AMM_ADDRESS = process.env.AMM_ADDRESS || "YOUR_AMM_ADDRESS";
  const TOKEN_A_ADDRESS = process.env.TOKEN_A_ADDRESS || "YOUR_TOKEN_A_ADDRESS";
  const TOKEN_B_ADDRESS = process.env.TOKEN_B_ADDRESS || "YOUR_TOKEN_B_ADDRESS";

  // Amounts to add (adjust based on your needs and token decimals)
  const AMOUNT_A = ethers.parseEther("1"); // 1 token A
  const AMOUNT_B = ethers.parseEther("1000"); // 1000 token B (adjust ratio as needed)
  
  // Slippage tolerance (1% = 0.99)
  const SLIPPAGE = 0.99;
  const AMOUNT_A_MIN = (AMOUNT_A * BigInt(Math.floor(SLIPPAGE * 100))) / 100n;
  const AMOUNT_B_MIN = (AMOUNT_B * BigInt(Math.floor(SLIPPAGE * 100))) / 100n;

  console.log("AMM Address:", AMM_ADDRESS);
  console.log("Token A:", TOKEN_A_ADDRESS);
  console.log("Token B:", TOKEN_B_ADDRESS);
  console.log("Amount A:", ethers.formatEther(AMOUNT_A));
  console.log("Amount B:", ethers.formatEther(AMOUNT_B));
  console.log("Slippage:", (1 - SLIPPAGE) * 100 + "%\n");

  // Get contract instances
  const amm = await ethers.getContractAt("ForestTreeAMM", AMM_ADDRESS);
  const tokenA = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", TOKEN_A_ADDRESS);
  const tokenB = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", TOKEN_B_ADDRESS);

  // Check balances
  const balanceA = await tokenA.balanceOf(signer.address);
  const balanceB = await tokenB.balanceOf(signer.address);
  console.log("Your Token A balance:", ethers.formatEther(balanceA));
  console.log("Your Token B balance:", ethers.formatEther(balanceB));

  if (balanceA < AMOUNT_A || balanceB < AMOUNT_B) {
    console.error("❌ Insufficient token balance!");
    return;
  }

  // Check allowances
  const allowanceA = await tokenA.allowance(signer.address, AMM_ADDRESS);
  const allowanceB = await tokenB.allowance(signer.address, AMM_ADDRESS);

  // Approve if needed
  if (allowanceA < AMOUNT_A) {
    console.log("\n🔓 Approving Token A...");
    const txA = await tokenA.approve(AMM_ADDRESS, AMOUNT_A);
    await txA.wait();
    console.log("✅ Token A approved");
  }

  if (allowanceB < AMOUNT_B) {
    console.log("🔓 Approving Token B...");
    const txB = await tokenB.approve(AMM_ADDRESS, AMOUNT_B);
    await txB.wait();
    console.log("✅ Token B approved");
  }

  // Add liquidity
  console.log("\n🌳 Adding liquidity to the forest...");
  const tx = await amm.plantLiquidity(
    AMOUNT_A,
    AMOUNT_B,
    AMOUNT_A_MIN,
    AMOUNT_B_MIN
  );

  console.log("Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Liquidity added successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());

  // Get LP token balance
  const lpBalance = await amm.balanceOf(signer.address);
  console.log("\n🎉 You received", ethers.formatEther(lpBalance), "FOREST-LP tokens");

  // Get reserves
  const reserves = await amm.getReserves();
  console.log("\n📊 Pool Status:");
  console.log("Reserve A:", ethers.formatEther(reserves[0]));
  console.log("Reserve B:", ethers.formatEther(reserves[1]));
  console.log("\n🌲 Your trees are growing! 🌲");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
