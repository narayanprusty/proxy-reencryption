import { ethers } from "hardhat";
import { ERC721__factory } from "../typechain-types";
import ProxyLib from "proxy-recrypt-js-seed";
import Crypto from "crypto-js";
import sha256 from "sha256";

const Proxy = ProxyLib.Proxy;
const PRE = ProxyLib;

async function main() {
  const [,user1, user2] = await ethers.getSigners()

  const ERC721:ERC721__factory = await ethers.getContractFactory("ERC721");
  const erc721 = await ERC721.deploy();
  await erc721.deployed();

  var keyPair_Minter = Proxy.generate_key_pair();
  var privateKey_Minter = Proxy.to_hex(keyPair_Minter.get_private_key().to_bytes());
  var publicKey_Minter = Proxy.to_hex(keyPair_Minter.get_public_key().to_bytes());

  let metadata = `{"artistName":"narayan"}`;
  let metadataCipher = PRE.encryptData(publicKey_Minter, metadata);
  let metadataHash = sha256(metadata)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
