require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const RPC_URL = process.env.SEPOLIA_RPC_URL;

if (!RPC_URL) {
  console.error("Erro: SEPOLIA_RPC_URL não foi encontrada no arquivo .env");
  process.exit(1);
}

const ADDRESSES = {
  token: "0x3Db435926635605D2f0bad1d050743958f8f52E9",
  oracle: "0x5e01ec16f6a2ce1763b1C3F0DDbe7aDCc6F16C6f",
  staking: "0x9B008559A973eBde06937317ce483a4678edD98F",
  nft: "0xb820fbf6bF81ac6a14588Ca5bCBF80fc69eD6Ad2",
  dao: "0xB4E32d322bbe4eA0041E9975745F263Ca12FaF79",
};

let provider;
try {
  provider = new ethers.JsonRpcProvider(RPC_URL);
} catch (error) {
  console.error("Erro ao criar provider:", error.message);
  process.exit(1);
}

const tokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];

const oracleAbi = [
  "function getPrice() view returns (int256)",
  "function getDescription() view returns (string)",
  "function getDecimals() view returns (uint8)"
];

const stakingAbi = [
  "function stakedBalance(address owner) view returns (uint256)"
];

const nftAbi = [
  "function totalMinted() view returns (uint256)"
];

const daoAbi = [
  "function proposalCount() view returns (uint256)"
];

const token = new ethers.Contract(ADDRESSES.token, tokenAbi, provider);
const oracle = new ethers.Contract(ADDRESSES.oracle, oracleAbi, provider);
const staking = new ethers.Contract(ADDRESSES.staking, stakingAbi, provider);
const nft = new ethers.Contract(ADDRESSES.nft, nftAbi, provider);
const dao = new ethers.Contract(ADDRESSES.dao, daoAbi, provider);

app.get("/", (req, res) => {
  res.send("H2Reward backend online");
});

app.get("/api/health", async (req, res) => {
  try {
    const block = await provider.getBlockNumber();
    res.json({ ok: true, network: "sepolia", block });
  } catch (err) {
    console.error("/api/health:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/contracts", (req, res) => {
  res.json(ADDRESSES);
});

app.get("/api/token", async (req, res) => {
  try {
    const [name, symbol, totalSupply] = await Promise.all([
      token.name(),
      token.symbol(),
      token.totalSupply()
    ]);

    res.json({
      name,
      symbol,
      totalSupply: totalSupply.toString()
    });
  } catch (err) {
    console.error("/api/token:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/oracle", async (req, res) => {
  try {
    const [description, decimals, price] = await Promise.all([
      oracle.getDescription(),
      oracle.getDecimals(),
      oracle.getPrice()
    ]);

    res.json({
      description,
      decimals: Number(decimals),
      price: price.toString()
    });
  } catch (err) {
    console.error("/api/oracle:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/account/:address", async (req, res) => {
  try {
    const address = req.params.address;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Endereço inválido" });
    }

    const [balance, staked, totalMinted, proposalCount] = await Promise.all([
      token.balanceOf(address),
      staking.stakedBalance(address),
      nft.totalMinted(),
      dao.proposalCount()
    ]);

    res.json({
      address,
      tokenBalance: balance.toString(),
      stakedBalance: staked.toString(),
      totalMinted: totalMinted.toString(),
      proposalCount: proposalCount.toString()
    });
  } catch (err) {
    console.error("/api/account/:address:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`H2Reward backend rodando em http://localhost:${PORT}`);
});