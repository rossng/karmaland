pragma solidity ^0.4.11;

contract Karma {
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => bool) public isCitizen;
    address public karmaMaster;
    address[] public citizens;

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function Karma(
    address _karmaMaster
    ) {
        karmaMaster = _karmaMaster;
        isCitizen[karmaMaster] = true;
        citizens.push(karmaMaster);
    }

    function mint(uint256 _amount) {
        require(msg.sender == karmaMaster);

        balanceOf[msg.sender] += _amount;
    }

    function makeCitizen(address _citizen) {
        require(msg.sender == karmaMaster);
        require(!isCitizen[_citizen]);
        isCitizen[_citizen] = true;
        citizens.push(_citizen);
    }

    function getCitizens() public returns(address[]) {
        return citizens;
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        require(isCitizen[msg.sender]);
        require(isCitizen[_to]);
        require(balanceOf[msg.sender] >= _value);           // Check if the sender has enough
        require(balanceOf[_to] + _value >= balanceOf[_to]); // Check for overflows
        balanceOf[msg.sender] -= _value;                    // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient
    }
}

