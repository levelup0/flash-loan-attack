// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20Token is ERC20 {
    constructor() ERC20("MyERC20Token", "MTKN") {
        _mint(msg.sender, type(uint256).max);
    }
}