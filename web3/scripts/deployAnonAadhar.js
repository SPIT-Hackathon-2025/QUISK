const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying AnonAadhaarVerifier contract with account:", deployer.address);

  const AadhaarContract = await hre.ethers.getContractFactory("AnonAadhaarVerifier");
  const contract = await AadhaarContract.deploy();

  await contract.waitForDeployment();
  console.log("AnonAadhaarVerifier Contract deployed at:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
