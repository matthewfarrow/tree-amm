const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🍂 Removing liquidity from Forest Tree AMM...\n");

  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  // Contract addresses - update these after deployment
  const AMM_ADDRESS = process.env.AMM_ADDRESS || "YOUR_AMM_ADDRESS";

  // Amount of LP tokens to burn (0 = all your LP tokens)
  const LP_AMOUNT = ethers.parseEther("0"); // Set to 0 to remove all
  const SLIPPAGE = 0.01; // 1% slippage tolerance

  console.log("AMM Address:", AMM_ADDRESS);

  // Get contract instance
  const amm = await ethers.getContractAt("ForestTreeAMM", AMM_ADDRESS);

  // Get LP token balance
  const lpBalance = await amm.balanceOf(signer.address);
  console.log("Your LP token balance:", ethers.formatEther(lpBalance), "FOREST-LP");

  if (lpBalance === 0n) {
    console.error("❌ No LP tokens to remove!");
    return;
  }

  // Use all LP tokens if amount is 0
  const liquidityToRemove = LP_AMOUNT === 0n ? lpBalance : LP_AMOUNT;

  if (liquidityToRemove > lpBalance) {
    console.error("❌ Insufficient LP token balance!");
    return;
  }

  console.log("Removing:", ethers.formatEther(liquidityToRemove), "FOREST-LP");

  // Get current reserves and total supply to calculate expected amounts
  const reserves = await amm.getReserves();
  const totalSupply = await amm.totalSupply();

  const expectedA = (liquidityToRemove * reserves[0]) / totalSupply;
  const expectedB = (liquidityToRemove * reserves[1]) / totalSupply;
  
  const minA = (expectedA * BigInt(Math.floor((1 - SLIPPAGE) * 10000))) / 10000n;
  const minB = (expectedB * BigInt(Math.floor((1 - SLIPPAGE) * 10000))) / 10000n;

  console.log("\n📊 Expected to receive:");
  console.log("Token A:", ethers.formatEther(expectedA));
  console.log("Token B:", ethers.formatEther(expectedB));
  console.log("\nMinimum amounts (with", SLIPPAGE * 100 + "% slippage):");
  console.log("Min Token A:", ethers.formatEther(minA));
  console.log("Min Token B:", ethers.formatEther(minB));

  // Remove liquidity
  console.log("\n🍂 Harvesting liquidity from the forest...");
  const tx = await amm.harvestLiquidity(liquidityToRemove, minA, minB);

  console.log("Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Liquidity removed successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());

  // Get updated balances
  const newLpBalance = await amm.balanceOf(signer.address);
  console.log("\n📊 Updated Status:");
  console.log("Remaining LP tokens:", ethers.formatEther(newLpBalance), "FOREST-LP");

  const newReserves = await amm.getReserves();
  console.log("\nPool Reserves:");
  console.log("Reserve A:", ethers.formatEther(newReserves[0]));
  console.log("Reserve B:", ethers.formatEther(newReserves[1]));
  
  console.log("\n🎉 Harvest complete! Tokens returned to your wallet.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
