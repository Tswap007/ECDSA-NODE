const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();

function getAddress(privateKey) {
    const publicKey = secp.getPublicKey(privateKey);
    const address = "0x" + toHex(keccak256(publicKey.slice(0).slice(-20)));
    return address;
}

console.log("Private Key:", toHex(privateKey));
//console.log("Public Key:", toHex(publicKey));
console.log("Address:", getAddress(privateKey));