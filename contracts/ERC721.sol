// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ERC721 {
    struct Metadata {
        string cipher;
        string hash;
        string reencrypted;
    }

    address immutable owner;
    uint public totalMinted = 0;
    mapping (uint => address) tokens;
    mapping (uint => Metadata) metadata;

    constructor() {
        owner = msg.sender;
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

    modifier onlyOwner {
        require(msg.sender == owner, "only owner is allowed");
        _;
    }
}
