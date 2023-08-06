const { network, getNamedAccounts, deployments } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

describe("Lottery Unit Tests", async () => {
  let lottery, vrfCoordinatorV2Mock;
  const chainId = network.config.chainId;

  beforeEach(async () => {
    const { deployer } = await getNamedAccounts();
    await deployments.fixture(["all"]);
    lottery = await ethers.getContract("Lottery", deployer);
    vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock",
      deployer
    );
  });
  describe("Constructor", async () => {
    it("Initializes the Lottery correctly", async () => {
      const lotteryState = await lottery.getLotteryState();
      const interval = await lottery.getInterval();
      assert.equal(lotteryState.toString(), "0");
      assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
    });
  });

  describe("Enter Lottery", async () => {
    it("Revert when you don't pay enough", async () => {
      var asd = await expect(
        lottery.enterLottery()
      ).to.be.revertedWithCustomError(lottery, "Lottery__NotEnoughETHEntered");
    });
  });
});
