import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from 'ethereum-cryptography/utils';

function signMessage(privateKey) {
    const message = "I am the owner";
    const messageByte = utf8ToBytes(message);
    const messageHash = keccak256(messageByte);
    const signature = secp.sign(privateKey, messageHash);
    return signature;
}

const privateKey = "193f5b9f3ba3a9a55ae58d05c5834223ba0081eeb15d4e3a4cda32aebd0b08f5";

console.log(signMessage(privateKey));
