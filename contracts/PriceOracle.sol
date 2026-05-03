// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceOracle
 * @dev Oracle real utilizando Chainlink Data Feed (ETH/USD) na Sepolia
 */
contract PriceOracle {

    AggregatorV3Interface internal priceFeed;

    constructor() {
        // ETH/USD Chainlink Feed - Sepolia
        priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    /**
     * @dev Retorna preço do ETH/USD (8 casas decimais)
     */
    function getPrice() external view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * @dev Número de casas decimais
     */
    function getDecimals() external view returns (uint8) {
        return priceFeed.decimals();
    }

    /**
     * @dev Descrição do feed
     */
    function getDescription() external view returns (string memory) {
        return priceFeed.description();
    }

    /**
     * @dev Interface completa Chainlink
     */
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return priceFeed.latestRoundData();
    }
}