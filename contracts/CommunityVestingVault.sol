// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice VestingVault for Community Fund
contract CommunityVestingVault is Ownable {
    /// @notice The structure of Grant
    struct Grant {
        uint256 startTime;
        uint256 amount;
        uint16 vestingDuration;
        uint16 daysClaimed;
        uint256 totalClaimed;
        address recipient;
    }

    /// @notice The grant token address 
    address public token;
    /// @notice The total vesting amount left 
    uint256 public totalVestingAmount;
    /// @notice The grants added 
    mapping(address => Grant) private grants;
    /// @notice The all recipients of grants 
    address[] allRecipients;
    /// @notice The max days of the vesting cliff
    uint16 constant CLIFF_MAX_DAYS = 10 * 365;
    /// @notice The max days of the vesting duration
    uint16 constant DURATION_MAX_DAYS = 25 * 365;

    /// @notice Emitted when lock token
    event TokenLocked(address indexed owner, uint256 amount, uint256 timestamp);
    /// @notice Emitted when grant added
    event GrantAdded(address indexed recipient, uint256 amount, uint16 vestingDuration, uint16 vestingCliffInDays, uint256 timestamp);
    /// @notice Emitted when grant token claimed
    event GrantTokensClaimed(address indexed recipient, uint256 amountClaimed);
    /// @notice Emitted when grant revoked
    event GrantRevoked(address recipient, uint256 amountVested, uint256 amountNotVested);

    constructor(address _token) {
        require(_token != address(0), "CVV_C: ZERO_ADDRESS");
        token = _token;
    }

    /// @notice Lock token from owner to contract
    /// @param amount The token amount to lock 
    function lockToken(uint256 amount) external onlyOwner {
        totalVestingAmount = totalVestingAmount + amount;
        // require owner approve
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "CVV_LT: TOKEN_TRANSFER_ERR");
        // emit event
        emit TokenLocked(msg.sender, amount, currentTime());
    }

    /// @notice Add grant by owner
    /// @param recipient The recipient address
    /// @param amount The total token amount that recipient grant
    /// @param vestingDurationInDays The vesting duration in days
    /// @param vestingCliffInDays The vesting cliff in days
    function addGrant(
        address recipient,
        uint256 amount,
        uint16 vestingDurationInDays,
        uint16 vestingCliffInDays    
    ) 
        external
        onlyOwner
    {
        // check variables
        require(grants[recipient].amount == 0, "TVV_AG: GRANT_EXISTS");
        require(vestingCliffInDays <= CLIFF_MAX_DAYS, "TVV_AG: CLIFF_EXCEED");
        require(vestingDurationInDays <= DURATION_MAX_DAYS, "TVV_AG: DURATION_EXCEED");
        // check vested amount per day
        uint256 amountVestedPerDay = amount / vestingDurationInDays;
        require(amountVestedPerDay > 0, "TVV_AG: UNIT_VESTED_AMOUNT_ERR");
        // check total vesting amount left
        require(totalVestingAmount >= amount, "TVV_AG: TOTAL_VESTING_AMOUNT_EXCEED");
        totalVestingAmount = totalVestingAmount - amount;
        // add grant
        Grant memory grant = Grant({
            startTime: currentTime() + vestingCliffInDays * 1 days,
            amount: amount,
            vestingDuration: vestingDurationInDays,
            daysClaimed: 0,
            totalClaimed: 0,
            recipient: recipient
        });
        grants[recipient] = grant;
        allRecipients.push(recipient);
        // emit event
        emit GrantAdded(recipient, amount, vestingDurationInDays, vestingCliffInDays, currentTime());
    }

    /// @notice Claim vested tokens by recipient
    function claimVestedTokens() external {
        // calcylate vested days and amount
        (uint16 daysVested, uint256 amountVested) = calculateGrantClaim(msg.sender);
        require(amountVested > 0, "TVV_CVT: VESTED_AMOUNT_ZERO");
        // update grant information
        Grant storage grant = grants[msg.sender];
        grant.daysClaimed = uint16(grant.daysClaimed + daysVested);
        grant.totalClaimed = uint256(grant.totalClaimed + amountVested);
        // transfer claimed token
        require(IERC20(token).transfer(grant.recipient, amountVested), "TVV_CVT: TOKEN_TRANSFER_ERR");
        // emit event
        emit GrantTokensClaimed(grant.recipient, amountVested);
    }

    /// @notice Revoke grant by owner
    /// @param recipient The recipient address
    function revokeGrant(address recipient) external onlyOwner {
        // calculate vested days and amount, not vested amount
        Grant storage grant = grants[recipient];
        (, uint256 amountVested) = calculateGrantClaim(recipient);
        uint256 amountNotVested = (grant.amount - grant.totalClaimed) - amountVested;
        // revoke not vested amount
        totalVestingAmount = totalVestingAmount + amountNotVested;
        // reset grant
        grant.startTime = 0;
        grant.amount = 0;
        grant.vestingDuration = 0;
        grant.daysClaimed = 0;
        grant.totalClaimed = 0;
        grant.recipient = address(0);
        // transfer vested amount
        require(IERC20(token).transfer(recipient, amountVested), "TVV_RG: TOKEN_TRANSFER_ERR");
        // emit event
        emit GrantRevoked(recipient, amountVested, amountNotVested);
    }

    /// @notice Calculate vested days and amount
    /// @param recipient The recipient address
    function calculateGrantClaim(address recipient) public view returns (uint16, uint256) {
        Grant storage grant = grants[recipient];
        require(grant.totalClaimed < grant.amount, "TVV_CGC: GRANT_ALL_CLAIMED");
        // the case that start time has not been reached
        if (currentTime() < grant.startTime) {
            return (0, 0);
        }
        // calculate elapsed days
        uint elapsedDays = (currentTime() - (grant.startTime - 1 days)) / 1 days;
        // the case that over vesting duration, return entire remaining days and amount
        if (elapsedDays >= grant.vestingDuration) {
            uint16 remainingDays = uint16(grant.vestingDuration - grant.daysClaimed);
            uint256 remainingAmount = grant.amount - grant.totalClaimed;
            return (remainingDays, remainingAmount);
        } else {
            uint16 daysVested = uint16(elapsedDays - grant.daysClaimed);
            uint256 amountVestedPerDay = grant.amount / uint256(grant.vestingDuration);
            uint256 amountVested = uint256(daysVested * amountVestedPerDay);
            return (daysVested, amountVested);
        }
    }

    /// @notice Get grant 
    /// @param recipient The recipient address
    function getGrant(address recipient) external view returns(Grant memory) {
        return grants[recipient];
    }

    /// @notice Get total vesting amount left
    function getTotalVestingAmount() external view returns(uint256) {
        return totalVestingAmount;
    }

    /// @notice Get all recipients
    function getAllRecipients() external view returns(address[] memory) {
        return allRecipients;
    }

    /// @notice Get current time
    function currentTime() private view returns(uint256) {
        return block.timestamp;
    }
}