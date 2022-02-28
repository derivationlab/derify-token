// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import '@openzeppelin/contracts/utils/Context.sol';

/// @notice DRF Token
contract DRF is Context, IERC20, IERC20Metadata {
    // --- ERC20 Data ---
    string private constant _name     = "Derify Protocol Token";
    string private constant _symbol   = "DRF";
    string private constant _version  = "1.0";
    uint8  private constant _decimals = 18;
    uint256 private _totalSupply      = 100000000e18;  //100 million DRF

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    constructor(
        address founderTeamAccount, 
        address peInvestorsAccount, 
        address publicSaleAccount, 
        address strategicReserveAccount, 
        address communityFundAccount
    ) {
        _balances[founderTeamAccount] = _totalSupply * 15 / 100;
        _balances[peInvestorsAccount] = _totalSupply * 15 / 100;
        _balances[publicSaleAccount] = _totalSupply * 5 / 100;
        _balances[strategicReserveAccount] = _totalSupply * 5 / 100;
        _balances[communityFundAccount] = _totalSupply * 60 / 100;
        emit Transfer(address(0), founderTeamAccount, _balances[founderTeamAccount]);
        emit Transfer(address(0), peInvestorsAccount, _balances[peInvestorsAccount]);
        emit Transfer(address(0), publicSaleAccount, _balances[publicSaleAccount]);
        emit Transfer(address(0), strategicReserveAccount, _balances[strategicReserveAccount]);
        emit Transfer(address(0), communityFundAccount, _balances[communityFundAccount]);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function version() public view virtual returns (string memory) {
        return _version;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "DRF::decreaseAllowance: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function transferFrom(
        address from, 
        address to, 
        uint256 amount
    ) public virtual override returns (bool) {
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
