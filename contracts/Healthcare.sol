// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TransferHelper.sol";

/**
 * @title Healthcare
 * @dev A contract for managing healthcare rewards for patients
 */

contract Healthcare is Ownable {
    address public immutable LONGToken;
    address public healthcareProvider;
    uint256 public rewardAmount;

    //List of patients
    mapping(address => bool) private patients;

    // Patient rewards
    mapping(address => uint256) public patientsRewards;

    // Modifier: Only provider
    /**
     * @dev Modifier to restrict access to only the healthcare provider
     */
    modifier onlyProvider() {
        require(msg.sender == healthcareProvider, "You're are not a provider");
        _;
    }

    // Event: Rewards claimed
    /**
     * @dev Event emitted when a patient claims their rewards
     * @param patient The address of the patient
     * @param rewardAmount The amount of rewards claimed
     */
    event RewardsClaimed(address indexed patient, uint rewardAmount);

    constructor(address _LONGToken, address _provider, uint _rewardAmount) {
        LONGToken = _LONGToken;
        healthcareProvider = _provider;
        rewardAmount = _rewardAmount;
    }

    /**
     * @dev Set the reward amount
     * @param _rewardAmount The new reward amount
     */
    function rewardAmountSet(uint256 _rewardAmount) public onlyProvider {
        require(_rewardAmount > 0, "Reward amount should be greater than 0");
        rewardAmount = _rewardAmount;
    }

    /**
     * @dev Grant reward to a patient
     * @param patient The address of the patient
     * @param patientReward The reward amount for the patient
     */
    function rewardGrant(
        address patient,
        uint256 patientReward
    ) public onlyProvider {
        require(isPatientExists(patient), "No patient in list");
        patientsRewards[patient] += patientReward;
    }

    /**
     * @dev Claim rewards by a patient
     */
    function rewardClaim() public {
        require(isPatientExists(msg.sender), "You're not a patient");
        require(patientsRewards[msg.sender] > 0, "No reward for you");

        uint256 tokenAmount = patientsRewards[msg.sender] / rewardAmount;

        patientsRewards[msg.sender] = 0;
        TransferHelper.safeTransfer(LONGToken, msg.sender, tokenAmount);

        emit RewardsClaimed(msg.sender, tokenAmount);
    }

    /**
     * @dev Add a patient to the list
     * @param patient The address of the patient to add
     */
    function addPatient(address patient) public onlyProvider {
        require(patient != address(0), "Address zero isn't required");
        require(!isPatientExists(patient), "Patient already exists");
        patients[patient] = true;
    }

    /**
     * @dev Check if a patient exists
     * @param patient The address of the patient to check
     * @return bool indicating if the patient exists
     */
    function isPatientExists(address patient) public view returns (bool) {
        return patients[patient];
    }

    /**
     * @dev Set a new healthcare provider
     * @param _provider The address of the new healthcare provider
     */
    function setProvider(address _provider) public onlyOwner {
        require(_provider != address(0), "Address zero isn't required");
        healthcareProvider = _provider;
    }
}
