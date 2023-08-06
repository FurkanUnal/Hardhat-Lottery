const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const BASE_FEE = ethers.parseEther("0.25");
const GAS_PRICE_FEE = 1e9;

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");

    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      args: [BASE_FEE, GAS_PRICE_FEE],
      log: true,
    });
    log("Mocks successfully deployed!");
  }
};

module.exports.tags = ["all", "mocks"];
