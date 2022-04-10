// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    constructor() ERC20("$ALGO", "ALGO") {
        _mint(msg.sender, 1000000 ether);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
