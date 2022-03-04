// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration;

  /// @notice Emitted when lock token
  event MigrationCompleted(address indexed owner, uint completed, uint256 timestamp);

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function setCompleted(uint completed) external restricted {
    last_completed_migration = completed;
    // emit event
    emit MigrationCompleted(msg.sender, completed, block.timestamp);
  }
}
