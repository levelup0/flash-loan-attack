// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/Address.sol";

interface IReceiver {
    function loanExec() external payable;
}

contract FlashLenderPool {
    using Address for address payable;

    mapping (address => uint256) private deposits;

    function pay() external payable {
        deposits[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amountToWithdraw = deposits[msg.sender];
        deposits[msg.sender] = 0;
        payable(msg.sender).sendValue(amountToWithdraw);
    }

    function flashLoan(uint256 amount) external {
        uint256 oldBalance = address(this).balance;
        require(oldBalance >= amount);
        IReceiver(msg.sender).loanExec{value: amount}();
        require(address(this).balance >= oldBalance);        
    }
}
 