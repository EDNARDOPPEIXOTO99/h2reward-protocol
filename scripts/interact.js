/**
 * interact.js — Script de integração Web3 (ethers.js)
 * Demonstra: consulta token, consulta oráculo, mint NFT, stake e votação na DAO
 *
 * Uso:
 * npx hardhat run scripts/interact.js --network sepolia
 */

const { ethers } = require("hardhat");

const ADDRESSES = {
  token:  "0x3Db435926635605D2f0bad1d050743958f8f52E9",
  oracle: "0x5e01ec16f6a2ce1763b1C3F0DDbe7aDCc6F16C6f",
  staking:"0x9B008559A973eBde06937317ce483a4678edD98F",
  nft:    "0xb820fbf6bF81ac6a14588Ca5bCBF80fc69eD6Ad2",
  dao:    "0xB4E32d322bbe4eA0041E9975745F263Ca12FaF79",
};

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("🚀 Iniciando interação Web3 — H2Reward Protocol v3");
  console.log("👤 Conta:", owner.address);
  console.log("🌐 Rede: Sepolia");

  const token   = await ethers.getContractAt("H2Token", ADDRESSES.token);
  const oracle  = await ethers.getContractAt("PriceOracle", ADDRESSES.oracle);
  const staking = await ethers.getContractAt("Staking", ADDRESSES.staking);
  const nft     = await ethers.getContractAt("H2NFT", ADDRESSES.nft);
  const dao     = await ethers.getContractAt("DAO", ADDRESSES.dao);

  console.log("\n[1] TOKEN ERC-20");
  console.log("name():", await token.name());
  console.log("symbol():", await token.symbol());
  console.log("totalSupply():", (await token.totalSupply()).toString());
  console.log("balanceOf(owner):", (await token.balanceOf(owner.address)).toString());

  console.log("\n[2] ORÁCULO CHAINLINK");
  console.log("description():", await oracle.getDescription());
  console.log("decimals():", (await oracle.getDecimals()).toString());
  console.log("getPrice():", (await oracle.getPrice()).toString());

  console.log("\n[3] MINT NFT");
  const txMint = await nft.mint(owner.address, "ipfs://h2reward-metadata-v3");
  await txMint.wait();

  const totalMinted = await nft.totalMinted();
  const lastTokenId = totalMinted - 1n;

  console.log("mint() concluído ✅");
  console.log("totalMinted():", totalMinted.toString());
  console.log("tokenId:", lastTokenId.toString());
  console.log("ownerOf(tokenId):", await nft.ownerOf(lastTokenId));
  console.log("tokenURI(tokenId):", await nft.tokenURI(lastTokenId));

  console.log("\n[4] STAKING");
  const stakeAmount = ethers.parseUnits("1000", 18);

  console.log("Aprovando 1000 H2T para Staking...");
  const txApprove = await token.approve(ADDRESSES.staking, stakeAmount);
  await txApprove.wait();
  console.log("approve() concluído ✅");

  console.log("Executando stake...");
  const txStake = await staking.stake(stakeAmount);
  await txStake.wait();
  console.log("stake(1000 H2T) concluído ✅");

  console.log(
    "stakedBalance(owner):",
    (await staking.stakedBalance(owner.address)).toString()
  );

  console.log("\n[5] DAO");
  const txProp = await dao.createProposal("Proposta teste Sepolia - H2Reward v3");
  await txProp.wait();
  console.log("createProposal() concluído ✅");

  const lastProposal = (await dao.proposalCount()) - 1n;
  console.log("proposalId criado:", lastProposal.toString());

  const txVote = await dao.vote(lastProposal);
  await txVote.wait();
  console.log("vote(proposalId) concluído ✅");

  const proposal = await dao.getProposal(lastProposal);
  console.log("description:", proposal[0]);
  console.log("voteCount:", proposal[1].toString());

  console.log("\n✅ Todos os fluxos Web3 executados com sucesso.");
}

main().catch((error) => {
  console.error("\n❌ Erro na execução:");
  console.error(error);
  process.exitCode = 1;
});