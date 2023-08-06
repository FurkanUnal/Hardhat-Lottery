const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const FUND_AMOUNT = ethers.parseEther("1");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  var vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

  if (chainId == 31337) {
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.target;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.logs[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  const arguments = [
    vrfCoordinatorV2Address,
    networkConfig[chainId]["entranceFee"],
    networkConfig[chainId]["gasLane"],
    subscriptionId,
    networkConfig[chainId]["callbackGasLimit"],
    networkConfig[chainId]["interval"],
  ];

  const lottery = await deploy("Lottery", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(lottery.address, arguments);
  }
  log("Verified Complited!");
};

module.exports.tags = ["all", "lottery"];
