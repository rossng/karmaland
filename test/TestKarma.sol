pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Karma.sol";

contract TestKarma {
    Karma karma = Karma(DeployedAddresses.Karma());

    // Testing the adopt() function
    //function testGetCitizens() {
    //    address[] citizens = karma.getCitizens();

    //    Assert.equal(citizens[0], address(0), "Maybe this will work");
    //}
}
