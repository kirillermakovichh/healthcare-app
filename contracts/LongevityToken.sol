// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title LongevityToken
 * @dev A contract for the Longevity token
 */
contract LongevityToken is Ownable, ERC20 {
    address public healthcareProvider;

    // Modifier: Only owner or provider
    modifier onlyOwnerOrProvider() {
        require(
            msg.sender == healthcareProvider || msg.sender == owner(),
            "You are not available to call this function"
        );
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _provider
    ) ERC20(_name, _symbol) {
        healthcareProvider = _provider;
    }

    /**
     * @dev Mint new tokens
     * @param _to The address to mint tokens to
     * @param _amount The amount of tokens to mint
     */
    function mint(address _to, uint256 _amount) external onlyOwnerOrProvider {
        _mint(_to, _amount);
    }

    /**
     * @dev Burn tokens
     * @param _from The address to burn tokens from
     * @param _amount The amount of tokens to burn
     */
    function burn(address _from, uint256 _amount) external onlyOwnerOrProvider {
        _burn(_from, _amount);
    }

    /**
     * @dev Set a new healthcare provider
     * @param _provider The address of the new healthcare provider
     */
    function setProvider(address _provider) external onlyOwner {
        healthcareProvider = _provider;
    }
}
