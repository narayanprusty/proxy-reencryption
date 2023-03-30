import { ethers } from "hardhat";
import { ERC721__factory } from "../typechain-types";
import ProxyLib from "proxy-recrypt-js-seed";
import Crypto from "crypto-js";
import sha256 from "sha256";

const Proxy = ProxyLib.Proxy;
const PRE = ProxyLib;

async function main() {
  const [,user1, user2, gallery] = await ethers.getSigners()

  const ERC721:ERC721__factory = await ethers.getContractFactory("ERC721");
  const erc721 = await ERC721.deploy();
  await erc721.deployed();

  var keyPair_Minter = Proxy.generate_key_pair();
  var privateKey_Minter = Proxy.to_hex(keyPair_Minter.get_private_key().to_bytes());
  var publicKey_Minter = Proxy.to_hex(keyPair_Minter.get_public_key().to_bytes());


  /**
   * Mint Token
   */
  let metadata = JSON.stringify({ artistName: "narayan" });
  let metadataCipher = PRE.encryptData(publicKey_Minter, metadata);
  let metadataHash = sha256(metadata)

  await erc721.mint(user1.address, metadataHash, JSON.stringify(metadataCipher));

  const tokenId = (await erc721.totalMinted()).sub(1);
  console.log(
    `Minted new token. Owner of token ID ${tokenId} is ${(await erc721.tokens(tokenId))}`
  )

  /**
   * Create Consignment
   */
  var keyPair_Consignee = Proxy.generate_key_pair();
  var privateKey_Consignee = Proxy.to_hex(keyPair_Consignee.get_private_key().to_bytes());
  var publicKey_Consignee = Proxy.to_hex(keyPair_Consignee.get_public_key().to_bytes());

  await erc721.connect(gallery).registerPublicKey(publicKey_Consignee)
  const galleryPublicKey = await erc721.keys(gallery.address)
  let reencryptionKey = PRE.generateReEncrytionKey(privateKey_Minter, galleryPublicKey)

  await erc721.connect(user1).createConsignment(tokenId, gallery.address, reencryptionKey);
  
  let cipher = JSON.parse((await erc721.metadata(tokenId)).cipher)
  let consignmentId = (await erc721.nextConsignmentId()).sub(1)
  let reKey = (await erc721.consignments(tokenId, consignmentId)).reencryptionKey
  PRE.reEncryption(reKey, cipher)
  let decryptData = (PRE.decryptData(privateKey_Consignee, cipher)).toString(Crypto.enc.Utf8)
  console.log(`Consignee Decrypted Data: ${decryptData}`)
  let hashOnChain = (await erc721.metadata(tokenId)).hash
  console.log(`Hash of Decrypted data is ${sha256(decryptData)} and hash on-chain is ${hashOnChain}`)

  /**
   * Transfer NFT
   */
  var keyPair_User = Proxy.generate_key_pair();
  var privateKey_User = Proxy.to_hex(keyPair_User.get_private_key().to_bytes());
  var publicKey_User = Proxy.to_hex(keyPair_User.get_public_key().to_bytes());
  await erc721.connect(user2).registerPublicKey(publicKey_User)

  let userPublicKey = await erc721.keys(user2.address)
  let newCipher = PRE.encryptData(userPublicKey, metadata)
  await erc721.connect(user1).transfer(tokenId, user2.address, JSON.stringify(newCipher))
  console.log(
    `Transferred new token. Owner of token ID ${tokenId} is ${(await erc721.tokens(tokenId))}`
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
