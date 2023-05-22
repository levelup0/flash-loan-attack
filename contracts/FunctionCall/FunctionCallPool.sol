// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyERC20Pool2 is ReentrancyGuard {
    using Address for address;

    IERC20 public immutable myERC20Token;

    constructor(address _tokenAddr) {
        myERC20Token = IERC20(_tokenAddr);
    }

    function flashLoanExecute(
        uint256 toBorrow,
        address client,
        address addr,
        bytes calldata cdata
    ) external nonReentrant {
        uint256 balanceBefore = myERC20Token.balanceOf(address(this));

        require(balanceBefore >= toBorrow);

        myERC20Token.transfer(client, toBorrow);
        addr.functionCall(cdata);
        uint256 newBalance = myERC20Token.balanceOf(address(this));

        require(newBalance >= balanceBefore);
    }
}
