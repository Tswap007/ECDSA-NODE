import server from "./server";
// import * as secp from "ethereum-cryptography/secp256k1";
// import { toHex } from "ethereum-cryptography/utils";
// import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    //const publicKey = secp.getPublicKey(privateKey);
    //const address = "0x" + toHex(keccak256(publicKey.slice(0).slice(-20)));
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Your Address
        <input placeholder="Paste In Your Wallet Address..." value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
