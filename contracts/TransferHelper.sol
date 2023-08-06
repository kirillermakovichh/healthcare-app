// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TransferHelper
 * @dev A library for safe token transfers
 */
library TransferHelper {
    /**
     * @dev Safely transfer tokens
     * @param token The address of the token
     * @param to The address to transfer tokens to
     * @param value The amount of tokens to transfer
     */
    function safeTransfer(address token, address to, uint256 value) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "TF"
        );
    }
}
