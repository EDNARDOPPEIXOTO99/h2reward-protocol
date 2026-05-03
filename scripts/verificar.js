// scripts/verificar.js
require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.SEPOLIA_RPC_URL;

const CONTRACTS = {
  TOKEN: "0x3Db435926635605D2f0bad1d050743958f8f52E9",
  ORACLE: "0x5e01ec16f6a2ce1763b1C3F0DDbe7aDCc6F16C6f",
  STAKING: "0x9B008559A973eBde06937317ce483a4678edD98F",
  NFT: "0xb820fbf6bF81ac6a14588Ca5bCBF80fc69eD6Ad2",
  DAO: "0xB4E32d322bbe4eA0041E9975745F263Ca12FaF79",
};

async function main() {
  if (!RPC_URL) {
    throw new Error("SEPOLIA_RPC_URL não encontrado no .env");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const network = await provider.getNetwork();

  console.log("--- Verificando Contratos ---");
  console.log("Rede:", network.name, Number(network.chainId));

  for (const [name, address] of Object.entries(CONTRACTS)) {
    const code = await provider.getCode(address);

    if (code && code !== "0x") {
      console.log(`✅ ${name} encontrado: ${address}`);
    } else {
      console.log(`❌ ${name} NÃO encontrado: ${address}`);
    }
  }
}

main().catch((error) => {
  console.error("Erro na verificação:", error.message);
  process.exitCode = 1;
});