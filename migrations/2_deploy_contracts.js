var Karma = artifacts.require("./Karma.sol");

module.exports = function(deployer) {
    deployer.deploy(Karma, '0xDc05009C82090BCa827f4f80D83A9D8D741011Db');
};