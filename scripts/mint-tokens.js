const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🎁 Minting test tokens...\n");

  const [signer] = await ethers.getSigners();
  console.log("Minting to account:", signer.address);

  // Use the deployed testnet token addresses
  const TOKEN_A = "0x170b0d27838ab234e82241C9c330ec273497a2A3";
  const TOKEN_B = "0x0C7be5406d451E84BF4EBDdcA889d017F4355e4D";

  // Get contract instances
  const tokenA = await ethers.getContractAt("MockERC20", TOKEN_A);
  const tokenB = await ethers.getContractAt("MockERC20", TOKEN_B);

  console.log("Minting 10,000 OAK tokens...");
  const txA = await tokenA.mint(signer.address, ethers.parseEther("10000"), {
    gasLimit: 100000
  });
  await txA.wait();
  console.log("✅ OAK tokens minted!");

  console.log("Minting 10,000 PINE tokens...");
  const txB = await tokenB.mint(signer.address, ethers.parseEther("10000"), {
    gasLimit: 100000
  });
  await txB.wait();
  console.log("✅ PINE tokens minted!");

  // Check balances
  const balanceA = await tokenA.balanceOf(signer.address);
  const balanceB = await tokenB.balanceOf(signer.address);

  console.log("\n📊 Your Token Balances:");
  console.log("OAK:", ethers.formatEther(balanceA));
  console.log("PINE:", ethers.formatEther(balanceB));
  console.log("\n🎉 Ready to test the AMM!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
