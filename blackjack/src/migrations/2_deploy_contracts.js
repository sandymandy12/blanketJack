const GameSetup = artifacts.require("GameSetup");

module.exports = function (deployer) {
  deployer.deploy(GameSetup);
};
