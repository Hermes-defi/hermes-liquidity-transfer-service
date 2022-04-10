import { ethers } from "hardhat";
async function main() {
  // npx hardhat run scripts\testnet.js --network bsc_testnet
  const LiquidityTransfer = await ethers.getContractFactory("LiquidityTransfer");
  const main = await LiquidityTransfer.deploy(
  await main.deployed();
  console.log("main:", main.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
