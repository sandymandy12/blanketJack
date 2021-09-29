const BlackJack = artifacts.require("Blackjack");
const GameSetup = artifacts.require("GameSetup");

module.exports = function (deployer) {
  deployer.deploy(Blackjack);
  deployer.deploy(GameSetup);
};
