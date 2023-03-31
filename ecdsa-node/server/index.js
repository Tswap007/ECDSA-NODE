const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");



app.use(cors());
app.use(express.json());

const balances = {
  "0x93b8600d133420512db87ab3d91675fc3aeff245f0adaa492586f44fbc596fa2": 100,
  "0xa0e0642284dc46231259a15ac815f175c4626197fd1ea2ea6181e8ce5d3a7d74": 50,
  "0x2b01f24bc3cd3d78254d35f90fde834e15b966b3d1e318f0e3f58d3e6c07f138": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

//vefify signature endpoint
app.post("/verify", (req, res) => {
  const { message, signature } = req.body;
  const messageHash = keccak256(utf8ToBytes(message));
  const publicKey = secp.recoverPublicKey(messageHash, signature);
  const address = "0x" + toHex(keccak256(publicKey.slice(0).slice(-20)));
  const isValid = address === sender;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.send({ isValid });
});

app.post("/send", (req, res) => {
  //TODO get a signature from the client-side application
  //recover the public address from the signature
  //then the address is going to be our sender down below

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
