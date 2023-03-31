import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, toBuffer } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const inputPrivateKey = evt.target.value;
    setPrivateKey(inputPrivateKey);
    const publicKey = secp.getPublicKey(inputPrivateKey);
    const address = "0x" + toHex(keccak256(publicKey.slice(0).slice(-20)));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onSign(evt) {
    evt.preventDefault();
    const message = "I am the owner";
    const messageHash = keccak256(utf8ToBytes(message));
    const signature = secp.sign(messageHash, toBuffer(privateKey), { recovered: true });
    const { data: { isValid } } = await server.post("/verify", { message, signature });
    console.log("Signature is valid:", isValid);

    if (isValid) {
      toast.success("Signature verified!");
    } else {
      toast.error("Failed to verify signature. Please try again.");
    }
  }

  return (
    <div className="container wallet">
      <ToastContainer />
      <h1>Your Wallet</h1>

      <form onSubmit={onSign}>
        <label>
          Your PrivateKey
          <input placeholder="Paste in your private Key.." value={privateKey} onChange={onChange}></input>
        </label>

        <div>Address: {address.slice(0, 6)}....{address.slice(0).slice(-4)}</div>

        <div className="balance">Balance: {balance}</div>

        <button type="submit">Sign Message and Verify</button>
      </form>
    </div>
  );
}

export default Wallet;