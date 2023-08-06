# Solidity API

## Healthcare

_A contract for managing healthcare rewards for patients_

### LONGToken

```solidity
address LONGToken
```

### healthcareProvider

```solidity
address healthcareProvider
```

### rewardAmount

```solidity
uint256 rewardAmount
```

### patientsRewards

```solidity
mapping(address => uint256) patientsRewards
```

### onlyProvider

```solidity
modifier onlyProvider()
```

_Modifier to restrict access to only the healthcare provider_

### RewardsClaimed

```solidity
event RewardsClaimed(address patient, uint256 rewardAmount)
```

_Event emitted when a patient claims their rewards_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| patient | address | The address of the patient |
| rewardAmount | uint256 | The amount of rewards claimed |

### constructor

```solidity
constructor(address _LONGToken, address _provider, uint256 _rewardAmount) public
```

### rewardAmountSet

```solidity
function rewardAmountSet(uint256 _rewardAmount) public
```

_Set the reward amount_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardAmount | uint256 | The new reward amount |

### rewardGrant

```solidity
function rewardGrant(address patient, uint256 patientReward) public
```

_Grant reward to a patient_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| patient | address | The address of the patient |
| patientReward | uint256 | The reward amount for the patient |

### rewardClaim

```solidity
function rewardClaim() public
```

_Claim rewards by a patient_

### addPatient

```solidity
function addPatient(address patient) public
```

_Add a patient to the list_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| patient | address | The address of the patient to add |

### isPatientExists

```solidity
function isPatientExists(address patient) public view returns (bool)
```

_Check if a patient exists_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| patient | address | The address of the patient to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool indicating if the patient exists |

### setProvider

```solidity
function setProvider(address _provider) public
```

_Set a new healthcare provider_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _provider | address | The address of the new healthcare provider |

## LongevityToken

_A contract for the Longevity token_

### healthcareProvider

```solidity
address healthcareProvider
```

### onlyOwnerOrProvider

```solidity
modifier onlyOwnerOrProvider()
```

### constructor

```solidity
constructor(string _name, string _symbol, address _provider) public
```

### mint

```solidity
function mint(address _to, uint256 _amount) external
```

_Mint new tokens_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address | The address to mint tokens to |
| _amount | uint256 | The amount of tokens to mint |

### burn

```solidity
function burn(address _from, uint256 _amount) external
```

_Burn tokens_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _from | address | The address to burn tokens from |
| _amount | uint256 | The amount of tokens to burn |

### setProvider

```solidity
function setProvider(address _provider) external
```

_Set a new healthcare provider_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _provider | address | The address of the new healthcare provider |

## TransferHelper

_A library for safe token transfers_

### safeTransfer

```solidity
function safeTransfer(address token, address to, uint256 value) internal
```

_Safely transfer tokens_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The address of the token |
| to | address | The address to transfer tokens to |
| value | uint256 | The amount of tokens to transfer |

