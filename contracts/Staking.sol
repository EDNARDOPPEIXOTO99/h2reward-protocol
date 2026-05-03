// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking is Ownable, ReentrancyGuard {
    IERC20 public token;

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakeTimestamp;

    uint256 public rewardRate = 10;
    uint256 public rewardPool;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function depositReward(uint256 amount) external onlyOwner {
        require(amount > 0, "Valor invalido");
        rewardPool += amount;
        token.transferFrom(msg.sender, address(this), amount);
    }

    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Reward rate invalido");
        rewardRate = newRate;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Valor invalido");

        stakedBalance[msg.sender] += amount;
        stakeTimestamp[msg.sender] = block.timestamp;

        token.transferFrom(msg.sender, address(this), amount);
    }

    function calculateReward(address user) public view returns (uint256) {
        if (stakedBalance[user] == 0) {
            return 0;
        }

        uint256 stakingTime = block.timestamp - stakeTimestamp[user];
        uint256 reward = (stakedBalance[user] * rewardRate * stakingTime) / (365 days * 100);

        if (reward > rewardPool) {
            return rewardPool;
        }

        return reward;
    }

    function unstake() external nonReentrant {
        uint256 staked = stakedBalance[msg.sender];
        require(staked > 0, "Nada para sacar");

        uint256 reward = calculateReward(msg.sender);

        stakedBalance[msg.sender] = 0;
        stakeTimestamp[msg.sender] = 0;
        rewardPool -= reward;

        token.transfer(msg.sender, staked + reward);
    }
}