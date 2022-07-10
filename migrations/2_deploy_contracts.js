const Bank = artifacts.require("./Bank.sol");
const DaiToken = artifacts.require("./DaiToken.sol");

module.exports = async function (deployer, network, accounts) {
  //   const CHAIN_ID = "1337";
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(Bank, daiToken.address);
  const bank = await Bank.deployed();

  await daiToken.transfer(accounts[1], "100000000000000000000");
  await daiToken.transfer(accounts[2], "100000000000000000000");
};
