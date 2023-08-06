# Smart Contract Documentation

## Healthcare

The Healthcare smart contract is designed for managing healthcare rewards for patients. It allows a healthcare provider to assign and distribute rewards to patients for their participation in healthcare programs or services. The rewards are in the form of a specific token (LONGToken).

### LONGToken

- `address LONGToken`: The address of the LONGToken contract.

### healthcareProvider

- `address healthcareProvider`: The address of the healthcare provider.

### rewardAmount

- `uint256 rewardAmount`: The amount of rewards to be distributed to each patient.

### patientsRewards

- `mapping(address => uint256) patientsRewards`: A mapping that stores the reward balance for each patient.

### onlyProvider

- `modifier onlyProvider()`: A modifier that restricts access to only the healthcare provider.

### RewardsClaimed

- `event RewardsClaimed(address patient, uint256 rewardAmount)`: An event emitted when a patient claims their rewards.

### constructor

- `constructor(address _LONGToken, address _provider, uint256 _rewardAmount)`: The constructor function that initializes the Healthcare contract with the LONGToken contract address, the healthcare provider address, and the initial reward amount.

### rewardAmountSet

- `function rewardAmountSet(uint256 _rewardAmount) public`: A function to set the reward amount. Only the healthcare provider can call this function.

### rewardGrant

- `function rewardGrant(address patient, uint256 patientReward) public`: A function to grant rewards to a patient. Only the healthcare provider can call this function.

### rewardClaim

- `function rewardClaim() public`: A function for a patient to claim their rewards. The patient must be in the list of patients and have a non-zero reward balance.

### addPatient

- `function addPatient(address patient) public`: A function to add a patient to the list. Only the healthcare provider can call this function.

### isPatientExists

- `function isPatientExists(address patient) public view returns (bool)`: A function to check if a patient exists in the list.

### setProvider

- `function setProvider(address _provider) public`: A function to set a new healthcare provider. Only the contract owner can call this function.

## LongevityToken

The LongevityToken smart contract represents a token contract for the Longevity token.

### healthcareProvider

- `address healthcareProvider`: The address of the healthcare provider.

### onlyOwnerOrProvider

- `modifier onlyOwnerOrProvider()`: A modifier that restricts access to only the contract owner or the healthcare provider.

### constructor

- `constructor(string _name, string _symbol, address _provider) public`: The constructor function that initializes the LongevityToken contract with the token name, symbol, and the healthcare provider address.

### mint

- `function mint(address _to, uint256 _amount) external`: A function to mint new tokens. Only the contract owner or the healthcare provider can call this function.

### burn

- `function burn(address _from, uint256 _amount) external`: A function to burn tokens. Only the contract owner or the healthcare provider can call this function.

### setProvider

- `function setProvider(address _provider) external`: A function to set a new healthcare provider. Only the contract owner can call this function.

## TransferHelper

### safeTransfer

- `function safeTransfer(address token, address to, uint256 value) internal`: A library function for safely transferring tokens. It uses the `call` function to invoke the `transfer` function of the specified token contract. It checks the success of the transfer and reverts if it fails.

#### Parameters

- `token`: The address of the token contract.
- `to`: The address to transfer tokens to.
- `value`: The amount of tokens to transfer.

## Key Functionalities and Additional Considerations

### Healthcare Contract

The Healthcare contract allows a healthcare provider to manage healthcare rewards for patients. The key functionalities of the contract include:

- Setting the reward amount: The healthcare provider can set the amount of rewards to be distributed to each patient using the `rewardAmountSet` function.

- Granting rewards to patients: The healthcare provider can grant rewards to patients using the `rewardGrant` function.

- Patients claiming rewards: Patients can claim their rewards using the `rewardClaim` function.

- Adding patients to the list: The healthcare provider can add patients to the list using the `addPatient` function.

- Checking patient existence: The contract provides a function `isPatientExists` to check if a patient exists in the list.

- Changing the healthcare provider: The contract owner can change the healthcare provider address using the `setProvider` function.

### LongevityToken Contract

The LongevityToken contract represents a token contract for the Longevity token. The key functionalities of the contract include:

- Minting new tokens: The contract owner or the healthcare provider can mint new tokens using the `mint` function.

- Burning tokens: The contract owner or the healthcare provider can burn tokens using the `burn` function.

- Changing the healthcare provider: The contract owner can change the healthcare provider address using the `setProvider` function.

### TransferHelper Library

The TransferHelper library provides a function `safeTransfer` for safely transferring tokens. It uses the `call` function to invoke the `transfer` function of the specified token contract and checks the success of the transfer.

During the development of these contracts, considerations were made to ensure the following:

- Security: The contracts implement access control using modifiers to restrict certain functions to authorized addresses only.

- Usability: The contracts provide functions to set reward amounts, grant rewards, and allow patients to claim their rewards, making it easy for healthcare providers and patients to interact with the contracts.

- Flexibility: The contracts allow for the change of healthcare provider address, providing flexibility in managing healthcare rewards.

- Safety: The TransferHelper library is used to ensure safe token transfers, mitigating the risk of potential vulnerabilities.

- Compliance: SPDX-License-Identifier is included to indicate that the contracts are unlicensed.

These considerations aim to ensure the contracts are secure, user-friendly, and adaptable to different healthcare reward scenarios.