const lib = require("proxy-recrypt-js-seed");
var Crypto = require('crypto-js');
const Proxy = lib.Proxy;
const PRE = lib;

var kp_A = Proxy.generate_key_pair();
var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());

var kp_B = Proxy.generate_key_pair();
var sk_B = Proxy.to_hex(kp_B.get_private_key().to_bytes());
var pk_B = Proxy.to_hex(kp_B.get_public_key().to_bytes());

var kp_C = Proxy.generate_key_pair();
var sk_C = Proxy.to_hex(kp_C.get_private_key().to_bytes());
var pk_C = Proxy.to_hex(kp_C.get_public_key().to_bytes());

let obj = PRE.encryptData(pk_A, "teasasdasdsadsadasds  dsfdsfdsfdsfjshadjhsajkdhajskhdjkashdjkashdjhjkasdhjkashdjkashdjkhasjkh")
let rk = PRE.generateReEncrytionKey(sk_A, pk_B);
PRE.reEncryption(rk, obj)

let decryptData = PRE.decryptData(sk_B, obj)
console.log(decryptData.toString(Crypto.enc.Utf8))
