// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title H2NFT
 * @dev NFT ERC-721 para certificação digital no H2Reward Protocol
 * @notice Cada token representa um certificado digital único com metadata via IPFS
 *
 * Segurança aplicada:
 * - ReentrancyGuard: protege a função mint contra ataques de reentrância
 * - Ownable: apenas o owner pode autorizar mints públicos futuramente
 * - Solidity ^0.8.20: proteção nativa contra overflow/underflow
 */
contract H2NFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("H2NFT", "H2N") {}

    /**
     * @dev Cunha um novo NFT com metadata IPFS
     * @param to Endereço que receberá o NFT
     * @param uri URI do metadata (ex: ipfs://...)
     *
     * Proteção nonReentrant aplicada pois:
     * - A função altera estado (_tokenIdCounter, ownership)
     * - Antes de emitir o evento externo
     * - Evita que um contrato malicioso reentrar e cunhar múltiplos tokens
     */
    function mint(address to, string memory uri) external nonReentrant {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTMinted(to, tokenId, uri);
    }

    /**
     * @dev Retorna o total de NFTs cunhados
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
