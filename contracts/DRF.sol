// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import '@openzeppelin/contracts/utils/Context.sol';

/// @notice DRF Token
contract DRF is Context, IERC20, IERC20Metadata {
    // --- ERC20 Data ---
    string private constant _name = "Derify Protocol Token";
    string private constant _symbol = "DRF";
    string private constant _version = "1.0";
    uint8  private constant _decimals = 18;
    uint256 private constant _totalSupply = 100000000e18;  // 100 million DRF

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(
        address founderTeamAccount, 
        address peInvestorsAccount, 
        address publicSaleAccount, 
        address strategicReserveAccount, 
        address communityFundAccount
    ) {
        _balances[founderTeamAccount] += _totalSupply * 15 / 100;
        emit Transfer(address(0), founderTeamAccount, _totalSupply * 15 / 100);

        _balances[peInvestorsAccount] += _totalSupply * 15 / 100;
        emit Transfer(address(0), peInvestorsAccount, _totalSupply * 15 / 100);

        _balances[publicSaleAccount] += _totalSupply * 5 / 100;
        emit Transfer(address(0), publicSaleAccount, _totalSupply * 5 / 100);

        _balances[strategicReserveAccount] += _totalSupply * 5 / 100;
        emit Transfer(address(0), strategicReserveAccount, _totalSupply * 5 / 100);

        _balances[communityFundAccount] += _totalSupply * 60 / 100;
        emit Transfer(address(0), communityFundAccount, _totalSupply * 60 / 100);
    }

    /// @notice Returns the name of the token
    function name() external view virtual override returns (string memory) {
        return _name;
    }

    /// @notice Returns the symbol of the token
    function symbol() external view virtual override returns (string memory) {
        return _symbol;
    }

    /// @notice Returns the number of decimals used to get its user representation
    function decimals() external view virtual override returns (uint8) {
        return _decimals;
    }

    /// @notice Returns the version of the token
    function version() external view virtual returns (string memory) {
        return _version;
    }

    /// @notice Returns the totalSupply of the token
    function totalSupply() external view virtual override returns (uint256) {
        return _totalSupply;
    }

    /// @notice Returns the amount of tokens owned by `account`
    function balanceOf(address account) external view virtual override returns (uint256) {
        return _balances[account];
    }

    /// @notice Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner`
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /// @notice Sets `amount` as the allowance of `spender` over the caller's tokens
    function approve(address spender, uint256 amount) external virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /// @notice Increases the allowance granted to `spender` by the caller
    function increaseAllowance(address spender, uint256 addedValue) external virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /// @notice Decreases the allowance granted to `spender` by the caller
    function decreaseAllowance(address spender, uint256 subtractedValue) external virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "DRF::decreaseAllowance: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /// @notice Moves `amount` tokens from the caller's account to `to`
    function transfer(address to, uint256 amount) external virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /// @notice Moves `amount` tokens from `from` to `to` using the allowance mechanism
    function transferFrom(
        address from, 
        address to, 
        uint256 amount
    ) external virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "DRF::_approve: approve from the zero address");
        require(spender != address(0), "DRF::_approve: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "DRF::_transfer: transfer from the zero address");
        require(to != address(0), "DRF::_transfer: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "DRF::_transfer: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "DRF::_spendAllowance: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}
