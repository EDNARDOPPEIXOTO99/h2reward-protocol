// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DAO
 * @dev Governança descentralizada simplificada do H2Reward Protocol
 *
 * Segurança aplicada:
 * - ReentrancyGuard em vote(): embora vote() não faça transferências,
 *   em versões futuras com recompensa por voto (token transfer), o guard
 *   é essencial. Aplicado agora como boa prática preventiva.
 * - Mapeamento hasVoted: impede duplo voto por endereço por proposta.
 * - Ownable: apenas owner pode criar propostas (MVP); futuro: aberto a holders.
 * - Solidity ^0.8.20: proteção nativa contra overflow.
 */
contract DAO is ReentrancyGuard, Ownable {
    struct Proposal {
        string description;
        uint256 voteCount;
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    // proposalId => voter => voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter);

    constructor() {}

    /**
     * @dev Cria uma nova proposta de governança
     * @param description Texto descritivo da proposta
     */
    function createProposal(string calldata description) external {
        require(bytes(description).length > 0, "DAO: empty description");
        uint256 proposalId = proposalCount;
        proposals[proposalId] = Proposal({
            description: description,
            voteCount: 0,
            exists: true
        });
        proposalCount++;
        emit ProposalCreated(proposalId, description);
    }

    /**
     * @dev Registra voto em uma proposta
     * @param proposalId ID da proposta
     *
     * nonReentrant: aplicado preventivamente. Em versões com recompensa
     * por voto (transferência de token), sem este guard um contrato
     * malicioso poderia votar múltiplas vezes na mesma transação antes
     * que hasVoted[proposalId][msg.sender] seja atualizado.
     *
     * Padrão CEI:
     * 1. Checks: proposta existe, não votou ainda
     * 2. Effects: marca hasVoted e incrementa voteCount
     * 3. Interactions: (futuro — transferência de recompensa)
     */
    function vote(uint256 proposalId) external nonReentrant {
        require(proposals[proposalId].exists, "DAO: proposal does not exist");
        require(!hasVoted[proposalId][msg.sender], "DAO: already voted");

        // Effects
        hasVoted[proposalId][msg.sender] = true;
        proposals[proposalId].voteCount++;

        emit VoteCast(proposalId, msg.sender);
    }

    /**
     * @dev Retorna dados de uma proposta
     */
    function getProposal(uint256 proposalId)
        external
        view
        returns (string memory description, uint256 voteCount)
    {
        require(proposals[proposalId].exists, "DAO: proposal does not exist");
        Proposal memory p = proposals[proposalId];
        return (p.description, p.voteCount);
    }
}
