const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  tokenName,
  tokenSymbol,
  tokenTotalValue,
  rewardAmount,
} = require("./testdata.json");

describe("Healthcare", function () {
  // =================================
  // Deploy contracts function
  // =================================

  async function deploy() {
    //Get signers from ethers
    const [owner, provider, patient, newProvider] = await ethers.getSigners();

    // =================================
    // LongevityToken
    // =================================

    const FactoryLongevityToken = await ethers.getContractFactory(
      "LongevityToken"
    );
    const longToken = await FactoryLongevityToken.deploy(
      tokenName,
      tokenSymbol,
      provider.address
    );
    await longToken.deployed();

    // =================================
    // Healthcare contract
    // =================================

    const FactoryHealthcare = await ethers.getContractFactory("Healthcare");
    const healthcare = await FactoryHealthcare.deploy(
      longToken.address,
      provider.address,
      rewardAmount
    );
    await healthcare.deployed();

    //Minting LONG tokens to the Healthcare contract
    const mintToHealthcare = await longToken.mint(
      healthcare.address,
      tokenTotalValue
    );
    await mintToHealthcare.wait();

    return {
      owner,
      provider,
      patient,
      newProvider,
      longToken,
      healthcare,
    };
  }

  describe("Check initial values", function () {
    it("should sets values correctly", async function () {
      //Call deploy() function
      const { owner, provider, longToken, healthcare } = await loadFixture(
        deploy
      );

      //All contracts have proper addresses
      expect(longToken.address).to.be.properAddress;
      expect(healthcare.address).to.be.properAddress;

      //All token's properties are sets correctly
      expect(await longToken.name()).to.equal(tokenName);
      expect(await longToken.symbol()).to.equal(tokenSymbol);
      expect(await longToken.decimals()).to.equal(18);

      //Owner, provider are sets correctly
      expect(await healthcare.owner()).to.equal(owner.address);
      expect(await healthcare.healthcareProvider()).to.equal(provider.address);
      expect(await longToken.healthcareProvider()).to.equal(provider.address);

      //Variables are sets correctly
      expect(await healthcare.LONGToken()).to.equal(longToken.address);
      expect(await healthcare.healthcareProvider()).to.equal(provider.address);
      expect(await healthcare.rewardAmount()).to.equal(rewardAmount);

      //Contract's token balance is sets correctly
      expect(await longToken.balanceOf(healthcare.address)).to.equal(
        tokenTotalValue
      );
    });
  });

  describe("rewardAmountSet()", function () {
    it("should change amount correctly", async function () {
      //Call deploy() function
      const { provider, patient, longToken, healthcare } = await loadFixture(
        deploy
      );
      const newReward = 200;

      //Set new reward amount
      const rewardAmountSet = await healthcare
        .connect(provider)
        .rewardAmountSet(newReward);
      await rewardAmountSet.wait();

      expect(await healthcare.rewardAmount()).to.equal(newReward);
    });

    it("should revert with 'Reward amount should be greater than 0'", async function () {
      //Call deploy() function
      const { provider, patient, longToken, healthcare } = await loadFixture(
        deploy
      );

      await expect(
        healthcare.connect(provider).rewardAmountSet(0)
      ).to.be.revertedWith("Reward amount should be greater than 0");
    });

    it("should revert if called not buy the provider", async function () {
      //Call deploy() function
      const { owner, provider, patient, longToken, healthcare } =
        await loadFixture(deploy);

      await expect(
        healthcare.connect(owner).rewardAmountSet(200)
      ).to.be.revertedWith("You're are not a provider");
    });
  });

  describe("rewardGrant()", function () {
    it("should grant reward correctly", async function () {
      //Call deploy() function
      const { provider, patient, longToken, healthcare } = await loadFixture(
        deploy
      );
      const reward = 1000;

      //Add patient to list
      const addPatient = await healthcare
        .connect(provider)
        .addPatient(patient.address);
      await addPatient.wait();

      //Grant reward to the patient
      const grantReward = await healthcare
        .connect(provider)
        .rewardGrant(patient.address, reward);
      await grantReward.wait();

      expect(await healthcare.patientsRewards(patient.address)).to.equal(
        reward
      );
    });

    it("should revert with 'No patient in list'", async function () {
      //Call deploy() function
      const { provider, patient, longToken, healthcare } = await loadFixture(
        deploy
      );
      const reward = 1000;

      await expect(
        healthcare
        .connect(provider)
        .rewardGrant(patient.address, reward)
      ).to.be.revertedWith("No patient in list");
    });

    it("should revert with 'You're are not a provider'", async function () {
      //Call deploy() function
      const { owner, provider, patient, longToken, healthcare } =
        await loadFixture(deploy);

      const reward = 1000;

      await expect(
        healthcare
        .connect(owner)
        .rewardGrant(patient.address, reward)
      ).to.be.revertedWith("You're are not a provider");
    });

  });

  describe("rewardClaim()", function () {
    it("should allows to claim rewards and change balances", async function () {
      //Call deploy() function
      const { provider, patient, longToken, healthcare } = await loadFixture(
        deploy
      );

      const reward = 1000;
      //Add patient to list
      const addPatient = await healthcare
        .connect(provider)
        .addPatient(patient.address);
      await addPatient.wait();

      //Grant reward to the patient
      const grantReward = await healthcare
        .connect(provider)
        .rewardGrant(patient.address, reward);
      await grantReward.wait();

      //Calculate token amonut to withdraw
      const patientReward = await healthcare.patientsRewards(patient.address);
      const tokenAmount = patientReward / rewardAmount;

      //Claim reward
      const claimReward = await healthcare.connect(patient).rewardClaim();
      await claimReward.wait();

      //Changes patient's balance in the contract
      expect(await healthcare.patientsRewards(patient.address)).to.equal(0);

      //Changes patient's token balance
      await expect(() => claimReward).to.changeTokenBalance(
        longToken,
        patient.address,
        tokenAmount
      );

      //Changes Healthcare contract's token balance
      await expect(() => claimReward).to.changeTokenBalance(
        longToken,
        healthcare.address,
        -tokenAmount
      );
    });

    it("should emit RewardsClaimed", async function () {
      //Call deploy() function
      const { provider, patient, longToken, healthcare } = await loadFixture(
        deploy
      );

      const reward = 1000;

      //Add patient to list
      const addPatient = await healthcare
        .connect(provider)
        .addPatient(patient.address);
      await addPatient.wait();

      //Grant reward to the patient
      const grantReward = await healthcare
        .connect(provider)
        .rewardGrant(patient.address, reward);
      await grantReward.wait();

      //Calculate token amonut to withdraw
      const patientReward = await healthcare.patientsRewards(patient.address);
      const tokenAmount = patientReward / rewardAmount;

      //Claim reward
      const claimReward = await healthcare.connect(patient).rewardClaim();
      await claimReward.wait();

      //Event
      await expect(claimReward)
        .to.emit(healthcare, "RewardsClaimed")
        .withArgs(patient.address, tokenAmount);
    });

    it("should revert if 'You're not a patient'", async function () {
      //Call deploy() function
      const { patient, healthcare } = await loadFixture(deploy);

      //Try to claim reward
      await expect(
        healthcare.connect(patient).rewardClaim()
      ).to.be.revertedWith("You're not a patient");
    });

    it("should revert if 'No reward for you'", async function () {
      //Call deploy() function
      const { provider, patient, healthcare } = await loadFixture(deploy);

      //Add patient to list
      const addPatient = await healthcare
        .connect(provider)
        .addPatient(patient.address);
      await addPatient.wait();

      //Try to claim reward
      await expect(
        healthcare.connect(patient).rewardClaim()
      ).to.be.revertedWith("No reward for you");
    });
  });

  describe("setProvider()", function() {
    it("should sets new provider correctly'", async function () {
      //Call deploy() function
      const { owner, provider, patient, newProvider, healthcare } = await loadFixture(deploy);

      //Change provider
      const setProvider = await healthcare.connect(owner).setProvider(newProvider.address);
      await setProvider.wait();

      expect(await healthcare.healthcareProvider()).to.equal(newProvider.address);
    });

    it("should revert with 'Address zero isn't required'", async function () {
      //Call deploy() function
      const { owner, provider, patient, newProvider, longToken, healthcare } =
        await loadFixture(deploy);

      await expect(
        healthcare
        .connect(owner)
        .setProvider(ethers.constants.AddressZero)
      ).to.be.revertedWith("Address zero isn't required");
    });

    it("should revert with 'Ownable: caller is not the owner'", async function () {
      //Call deploy() function
      const { owner, provider, patient, newProvider, longToken, healthcare } =
        await loadFixture(deploy);

      await expect(
        healthcare
        .connect(provider)
        .setProvider(newProvider.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("addPatient()", function() {
    it("should adds new patient correctly'", async function () {
      //Call deploy() function
      const { owner, provider, patient, newProvider, healthcare } = await loadFixture(deploy);

      //Change provider
      const addPatient = await healthcare.connect(provider).addPatient(patient.address);
      await addPatient.wait();

      expect(await healthcare.isPatientExists(patient.address)).to.equal(true);
    });

    it("should revert with 'Address zero isn't required'", async function () {
      //Call deploy() function
      const { owner, provider, patient, newProvider, longToken, healthcare } =
        await loadFixture(deploy);

      await expect(
        healthcare
        .connect(provider)
        .addPatient(ethers.constants.AddressZero)
      ).to.be.revertedWith("Address zero isn't required");
    });

    it("should revert with 'You're are not a provider'", async function () {
      //Call deploy() function
      const { owner, provider, patient, longToken, healthcare } =
        await loadFixture(deploy);

      await expect(
        healthcare
        .connect(owner)
        .addPatient(patient.address)
      ).to.be.revertedWith("You're are not a provider");
    });

    it("should revert with 'Patient already exists'", async function () {
      //Call deploy() function
      const { owner, provider, patient, newProvider, longToken, healthcare } =
        await loadFixture(deploy);

      const addPatient = await healthcare.connect(provider).addPatient(patient.address);
      await addPatient.wait();

      await expect(
        healthcare
        .connect(provider)
        .addPatient(patient.address)
      ).to.be.revertedWith("Patient already exists");
    });
  })
});
