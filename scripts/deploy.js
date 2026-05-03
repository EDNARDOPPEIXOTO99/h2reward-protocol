require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy...\n");

  const [deployer] = await ethers.getSigners();

  console.log("👤 Conta:", deployer.address);
  console.log(
    "💰 Saldo:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    "ETH\n"
  );

  // =========================
  // 1. Deploy H2Token
  // =========================
  const H2Token = await ethers.getContractFactory("H2Token");
  const token = await H2Token.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("✅ H2Token:", tokenAddress);

  // =========================
  // 2. Deploy PriceOracle (Chainlink)
  // =========================
  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await PriceOracle.deploy();
  await oracle.waitForDeployment();

  const oracleAddress = await oracle.getAddress();
  console.log("✅ PriceOracle:", oracleAddress);

  // =========================
  // 3. Deploy Staking
  // =========================
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddress);
  await staking.waitForDeployment();

  const stakingAddress = await staking.getAddress();
  console.log("✅ Staking:", stakingAddress);

  // =========================
  // 4. Deploy H2NFT
  // =========================
  const H2NFT = await ethers.getContractFactory("H2NFT");
  const nft = await H2NFT.deploy();
  await nft.waitForDeployment();

  const nftAddress = await nft.getAddress();
  console.log("✅ H2NFT:", nftAddress);

  // =========================
  // 5. Deploy DAO
  // =========================
  const DAO = await ethers.getContractFactory("DAO");
  const dao = await DAO.deploy();
  await dao.waitForDeployment();

  const daoAddress = await dao.getAddress();
  console.log("✅ DAO:", daoAddress);

  // =========================
  // FINAL
  // =========================
  console.log("\n🎯 DEPLOY FINALIZADO\n");

  console.log("📌 Endereços:");
  console.log("H2Token:     ", tokenAddress);
  console.log("PriceOracle: ", oracleAddress);
  console.log("Staking:     ", stakingAddress);
  console.log("H2NFT:       ", nftAddress);
  console.log("DAO:         ", daoAddress);

  console.log("\n👉 Copia esses endereços para o README\n");
}

main().catch((error) => {
  console.error("❌ Erro no deploy:");
  console.error(error);
  process.exitCode = 1;
});