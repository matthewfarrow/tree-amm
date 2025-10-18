const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔄 Swapping tokens through Forest Tree AMM...\n");

  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  // Contract addresses - update these after deployment
  const AMM_ADDRESS = process.env.AMM_ADDRESS || "YOUR_AMM_ADDRESS";
  const TOKEN_A_ADDRESS = process.env.TOKEN_A_ADDRESS || "YOUR_TOKEN_A_ADDRESS";
  const TOKEN_B_ADDRESS = process.env.TOKEN_B_ADDRESS || "YOUR_TOKEN_B_ADDRESS";

  // Swap parameters
  const SWAP_TOKEN_IN = TOKEN_A_ADDRESS; // Token to swap from
  const AMOUNT_IN = ethers.parseEther("0.1"); // Amount to swap
  const SLIPPAGE = 0.005; // 0.5% slippage tolerance

  console.log("AMM Address:", AMM_ADDRESS);
  console.log("Swapping from:", SWAP_TOKEN_IN);
  console.log("Amount In:", ethers.formatEther(AMOUNT_IN));
  console.log("Slippage tolerance:", SLIPPAGE * 100 + "%\n");

  // Get contract instances
  const amm = await ethers.getContractAt("ForestTreeAMM", AMM_ADDRESS);
  const tokenIn = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", SWAP_TOKEN_IN);

  // Get reserves to calculate expected output
  const reserves = await amm.getReserves();
  console.log("📊 Current Pool Reserves:");
  console.log("Reserve A:", ethers.formatEther(reserves[0]));
  console.log("Reserve B:", ethers.formatEther(reserves[1]));

  // Calculate expected output
  const isTokenA = SWAP_TOKEN_IN === TOKEN_A_ADDRESS;
  const reserveIn = isTokenA ? reserves[0] : reserves[1];
  const reserveOut = isTokenA ? reserves[1] : reserves[0];
  const expectedOut = await amm.getAmountOut(AMOUNT_IN, reserveIn, reserveOut);
  const minAmountOut = (expectedOut * BigInt(Math.floor((1 - SLIPPAGE) * 10000))) / 10000n;

  console.log("\n💱 Swap Details:");
  console.log("Expected output:", ethers.formatEther(expectedOut));
  console.log("Minimum output:", ethers.formatEther(minAmountOut));

  // Check balance
  const balance = await tokenIn.balanceOf(signer.address);
  console.log("\nYour balance:", ethers.formatEther(balance));

  if (balance < AMOUNT_IN) {
    console.error("❌ Insufficient token balance!");
    return;
  }

  // Check and approve if needed
  const allowance = await tokenIn.allowance(signer.address, AMM_ADDRESS);
  if (allowance < AMOUNT_IN) {
    console.log("\n🔓 Approving token...");
    const approveTx = await tokenIn.approve(AMM_ADDRESS, AMOUNT_IN);
    await approveTx.wait();
    console.log("✅ Token approved");
  }

  // Execute swap
  console.log("\n🔄 Executing swap...");
  const tx = await amm.swapTokens(SWAP_TOKEN_IN, AMOUNT_IN, minAmountOut);
  
  console.log("Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Swap completed successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());

  // Get updated reserves
  const newReserves = await amm.getReserves();
  console.log("\n📊 Updated Pool Reserves:");
  console.log("Reserve A:", ethers.formatEther(newReserves[0]));
  console.log("Reserve B:", ethers.formatEther(newReserves[1]));
  
  console.log("\n🎉 Swap successful! Check your wallet for tokens.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
