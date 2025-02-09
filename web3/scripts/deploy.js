const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const RentContract = await hre.ethers.getContractFactory("TorRent");
  const contract = await RentContract.deploy();

  await contract.waitForDeployment();
  console.log("Contract deployed at:", await contract.getAddress());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
