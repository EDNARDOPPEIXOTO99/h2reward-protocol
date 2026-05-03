# H2Reward Protocol

MVP de protocolo Web3 descentralizado desenvolvido na Residência em TIC 29 — Unidade 1, Capítulo 5.

# 🚀 H2Reward Protocol

![Solidity](https://img.shields.io/badge/Solidity-0.8.x-blue)
![Hardhat](https://img.shields.io/badge/Framework-Hardhat-yellow)
![Web3](https://img.shields.io/badge/Web3-DeFi-green)
![Status](https://img.shields.io/badge/Status-MVP-orange)
![Network](https://img.shields.io/badge/Network-Sepolia-purple)

---

## 📌 Descrição

O **H2Reward Protocol** é um MVP completo de um protocolo Web3 que integra:

- 🔹 Token ERC-20 (H2Token)
- 🔹 NFT ERC-721 (H2NFT)
- 🔹 Sistema de Staking com recompensas
- 🔹 Governança descentralizada (DAO)
- 🔹 Oracle de preço Chainlink (ETH/USD)

Deploy realizado na **Sepolia Testnet**.

---

## 🧠 Arquitetura

```text
Usuário → Frontend → Backend → Smart Contracts → Chainlink Oracle

MetaMask conexão
Ethers.js integração
Backend Node.js (proxy seguro)
Oracle Chainlink para preço dinâmico

## Contratos publicados na Sepolia (Versão Final v3)

| Contrato     | Endereço                                                                 | Explorer |
|--------------|--------------------------------------------------------------------------|----------|
| H2Token      | `0x3Db435926635605D2f0bad1d050743958f8f52E9` | https://sepolia.etherscan.io/address/0x3Db435926635605D2f0bad1d050743958f8f52E9 |
| PriceOracle  | `0x5e01ec16f6a2ce1763b1C3F0DDbe7aDCc6F16C6f` | https://sepolia.etherscan.io/address/0x5e01ec16f6a2ce1763b1C3F0DDbe7aDCc6F16C6f |
| Staking      | `0x9B008559A973eBde06937317ce483a4678edD98F` | https://sepolia.etherscan.io/address/0x9B008559A973eBde06937317ce483a4678edD98F |
| H2NFT        | `0xb820fbf6bF81ac6a14588Ca5bCBF80fc69eD6Ad2` | https://sepolia.etherscan.io/address/0xb820fbf6bF81ac6a14588Ca5bCBF80fc69eD6Ad2 |
| DAO          | `0xB4E32d322bbe4eA0041E9975745F263Ca12FaF79` | https://sepolia.etherscan.io/address/0xB4E32d322bbe4eA0041E9975745F263Ca12FaF79 |


## Arquitetura

```
Usuário / Carteira
    │
    ├─► H2Token (ERC-20)      — token utilitário (H2T)
    │       └─► approve() para Staking
    │
    ├─► Staking               — bloqueio de tokens + recompensa por tempo
    │       └─► preparado para uso de oracle em cálculo de recompensa
    │
    ├─► H2NFT (ERC-721)       — certificação digital, metadata IPFS
    │
    ├─► DAO                   — criação de proposta + votação
    │
    └─► PriceOracle           — oracle real (Chainlink ETH/USD), O contrato `PriceOracle.sol` utiliza um feed real da Chainlink na rede Sepolia para obter o preço ETH/USD diretamente da blockchain.

Feed utilizado:
ETH/USD → 0x694AA1769357215DE4FAC081bf1f309aDC325306

```

## Segurança implementada

| Mecanismo | Contratos | Motivo |
|-----------|-----------|--------|
| `ReentrancyGuard` + `nonReentrant` | Staking, H2NFT, DAO | Impede reentrância em funções que alteram estado + fazem transferências |
| Padrão Checks-Effects-Interactions | Staking | Estado zerado antes de transferências externas |
| `Ownable` | Todos | Controle de acesso a funções administrativas |
| Solidity `^0.8.20` | Todos | Proteção nativa contra overflow/underflow |
| `require` com mensagens | Todos | Validação explícita de entradas |

## Como rodar

```bash
npm install                                              # terminal 1
npx hardhat node                                      
npx hardhat run scripts/deploy.js --network localhost  

npx hardhat compile                                      # terminal 2
node scripts/verificar.js                                 

npx hardhat run scripts/interact.js --network sepolia    # terminal 3
```

### Deploy em Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Configure o `.env`: não subir para o GitHub por serem chaves privadas.

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/SEU_KEY
PRIVATE_KEY=sua_chave_privada
```

## Estrutura do repositório

```
contracts/
  H2Token.sol       — ERC-20 utilitário
  H2NFT.sol         — ERC-721 com ReentrancyGuard
  Staking.sol       — Staking com ReentrancyGuard + CEI
  DAO.sol           — Governança com ReentrancyGuard
  PriceOracle.sol   — Oracle Chainlink (ETH/USD), O contrato `PriceOracle.sol` utiliza um feed real da Chainlink na Sepolia.
scripts/
  deploy.js         — Deploy de todos os contratos
  interact.js       — Demonstração de todos os fluxos
  verificar.js      — Verificando contratos
docs/
  U1C5O1T1_EdnardoPinheiroPeixoto_FINAL.pdf     — Relatório técnico completo
  auditoria.md                                  — Relatório de auditoria simples
```

COMANDOS GERAIS PARA BACKEND E FRONTEND:

npx hardhat compile
node scripts/verificar.js
npx hardhat run scripts/interact.js --network sepolia

“O H2Reward Protocol integra todos os componentes de um sistema Web3 moderno — tokens, NFTs, incentivos econômicos, governança e dados externos — validado na Sepolia com boas práticas de segurança.”

C:\h2reward-protocol>node scripts/verificar.js

C:\h2reward-protocol>npx hardhat run scripts/interact.js --network sepolia

:: 1) Compilar
npx hardhat compile

:: 2) Verificar contratos na Sepolia (usa .env)
node scripts/verificar.js

:: 3) Rodar script de integração (mint, stake, DAO)
npx hardhat run scripts/interact.js --network sepolia

node backend-server.js
:: em outro terminal/aba
curl http://localhost:3001/api/health

(Opcional – Frontend)

Abra frontend-index.html no navegador
Clique Conectar MetaMask → Mint / Stake / Proposta / Votar


1) Subir o backend

No terminal 1, dentro do projeto:

cd C:\h2reward-protocol
node backend-server.js

Tem que aparecer algo tipo:

H2Reward backend rodando em http://localhost:3001 ; http://localhost:3001/api/oracle; http://localhost:3001/api/token;

http://localhost:3001/api/contracts; http://localhost:3001/api/account/0xaac477ff1eF0Ea5263965E0e2431A5Dd758723b3;

Deixa esse terminal aberto.

Agora testa em outro terminal:

curl http://localhost:3001/api/health

2) Abrir o frontend

No VSCode:

Confere se existe o arquivo na raiz:
frontend-index.html
Instala/extensão Live Server.
Clica com botão direito em frontend-index.html.
Clica em:
Open with Live Server

Ele vai abrir algo como: http://localhost:5500/

http://127.0.0.1:5500/frontend-index.html

ou

http://localhost:5500/frontend-index.html
3) Se não quiser usar Live Server

No terminal, roda:

cd C:\h2reward-protocol
npx serve .

Depois abre o endereço que aparecer, geralmente:

http://localhost:3000/frontend-index.html
4) Ordem certa pra gravação

Use 3 terminais:

:: Terminal 1
node backend-server.js
:: Terminal 2
npx hardhat compile
node scripts/verificar.js
npx hardhat run scripts/interact.js --network sepolia
:: Terminal 3, se não usar Live Server
npx serve .



## Aluno

Ednardo Pinheiro Peixoto — Residência em TIC 29 🚀

Link do Github: https://github.com/EDNARDOPPEIXOTO99/h2reward-protocol

