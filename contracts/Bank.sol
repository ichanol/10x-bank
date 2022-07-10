// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.12;

import "./DaiToken.sol";

contract Bank {
    DaiToken public daiToken;
    uint256 public fee = 1;
    address owner;

    struct Accounts {
        string name;
        uint256 balance;
    }

    mapping(string => address) accounts;
    mapping(address => Accounts[]) belongingAccounts;

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    constructor(DaiToken _daiToken) {
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function updateFee(uint256 _fee) public ownerOnly returns (bool) {
        require(_fee >= 0 && _fee < 100);
        fee = _fee;
        return true;
    }

    function getAdddressByAccountName(string memory _accountName)
        public
        view
        returns (address)
    {
        return accounts[_accountName];
    }

    function getMyAccounts() public view returns (Accounts[] memory) {
        return belongingAccounts[msg.sender];
    }

    function createAccount(string memory _accountName)
        public
        returns (Accounts[] memory)
    {
        require(
            accounts[_accountName] == address(0x0),
            "This account name already existed"
        );
        accounts[_accountName] = msg.sender;
        belongingAccounts[msg.sender].push(Accounts(_accountName, 0));

        return belongingAccounts[msg.sender];
    }

    function deposit(uint256 _amount, string memory _accountName)
        public
        returns (bool)
    {
        isAccountNameExisted(_accountName);
        daiToken.transferFrom(msg.sender, address(this), _amount);
        Accounts[] memory belonging = belongingAccounts[msg.sender];
        for (uint256 i = 0; i < belonging.length; i++) {
            if (compareString(belonging[i].name, _accountName)) {
                belongingAccounts[msg.sender][i].balance =
                    belonging[i].balance +
                    _amount;
            }
        }
        return true;
    }

    function withdraw(uint256 _amount, string memory _accountName)
        public
        returns (bool)
    {
        isAccountNameExisted(_accountName);
        Accounts[] memory belonging = belongingAccounts[msg.sender];
        for (uint256 i = 0; i < belonging.length; i++) {
            if (compareString(belonging[i].name, _accountName)) {
                require(
                    belonging[i].balance >= _amount,
                    "Insufficient Balance"
                );
                daiToken.transfer(msg.sender, _amount);

                belongingAccounts[msg.sender][i].balance =
                    belonging[i].balance -
                    _amount;
            }
        }

        return true;
    }

    function transfer(
        string memory _from,
        string memory _to,
        uint256 _amount
    ) public returns (bool) {
        uint256 feeAmount = 0;
        isAccountNameExisted(_from);
        require(accounts[_to] != address(0x0), "Destination account not exist");
        if (accounts[_from] != accounts[_to]) {
            feeAmount = (fee * _amount) / 100;
        }

        Accounts[] memory senderBelonging = belongingAccounts[msg.sender];
        Accounts[] memory receiverBelonging = belongingAccounts[accounts[_to]];

        for (uint256 i = 0; i < senderBelonging.length; i++) {
            if (compareString(senderBelonging[i].name, _from)) {
                require(
                    senderBelonging[i].balance >= _amount,
                    "Insufficient Balance"
                );

                for (uint256 j = 0; j < receiverBelonging.length; j++) {
                    if (compareString(receiverBelonging[j].name, _to)) {
                        belongingAccounts[msg.sender][i].balance =
                            senderBelonging[i].balance -
                            _amount;

                        belongingAccounts[accounts[_to]][j].balance =
                            receiverBelonging[j].balance +
                            (_amount - feeAmount);
                    }
                }
            }
        }

        return true;
    }

    function isAccountNameExisted(string memory _accountName) private view {
        require(
            accounts[_accountName] == msg.sender,
            "This account doesn't exist"
        );
    }

    function compareString(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        if (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b))) {
            return true;
        } else {
            return false;
        }
    }
}
