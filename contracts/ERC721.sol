// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ERC721 {
    struct Metadata {
        string cipher;
        string hash;
    }

    struct Consignment {
        string reencryptionKey;
        address consignor;
        address consignee;
    }

    address immutable owner;
    uint public totalMinted = 0;
    mapping (uint => address) public tokens;
    mapping (uint => Metadata) public metadata;
    mapping (uint => mapping (uint => Consignment)) public consignments;
    mapping (address => string) public keys;
    uint public nextConsignmentId;

    constructor() {
        owner = msg.sender;
        nextConsignmentId = 1;
    }

    function mint(
        address to,
        string memory hash,
        string memory cipher
    ) external onlyOwner {
        tokens[totalMinted] = to;
        metadata[totalMinted].cipher = cipher;
        metadata[totalMinted].hash = hash;
        
        totalMinted++; 
    }

    function registerPublicKey(string memory publicKey) external {
        keys[msg.sender] = publicKey;
    }

    function createConsignment(
        uint tokenId,
        address consignee,
        string memory reencryptionKey
    ) external {
        require(msg.sender == tokens[tokenId], "you are not owner of the token");
        consignments[tokenId][nextConsignmentId] = Consignment(reencryptionKey, msg.sender, consignee);
        nextConsignmentId++;
    }

    function transfer(
        uint tokenId,
        address to,
        string memory cipher
    ) external {
        require(msg.sender == tokens[tokenId], "you are not owner of the token");
        tokens[tokenId] = to;
        metadata[tokenId].cipher = cipher;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "only owner is allowed");
        _;
    }
}
