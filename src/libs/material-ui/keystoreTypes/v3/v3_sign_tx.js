import Wallet from 'ethereumjs-wallet';
import EthTx from 'ethereumjs-tx';
import util from 'ethereumjs-util';

export default function v3SignTx({ txData, keystore, password }) {
  return new Promise((resolve) => {
    let privateKey = Wallet.fromV3(keystore.data, password).getPrivateKey();
    const tx = new EthTx(txData);
    tx.sign(privateKey);
    privateKey = null;
    const signedTx = `0x${tx.serialize().toString('hex')}`;
    resolve({ signedTx });
  });
}

const concatSig = (signature) => {
  let v = signature.v;
  let r = signature.r;
  let s = signature.s;
  r = util.fromSigned(r);
  s = util.fromSigned(s);
  v = util.bufferToInt(v);
  r = util.setLengthLeft(util.toUnsigned(r), 32).toString('hex');
  s = util.setLengthLeft(util.toUnsigned(s), 32).toString('hex');
  v = util.stripHexPrefix(util.intToHex(v));
  return util.addHexPrefix(r.concat(s, v).toString('hex'));
};

const signMsgHash = (privKey, msgHash) =>
  util.ecsign(new Buffer(util.stripHexPrefix(msgHash), 'hex'), new Buffer(privKey, 'hex'));

export const v3SignMsg = ({ txData, keystore, password }) =>
  new Promise((resolve) => {
    const privateKey = Wallet.fromV3(keystore.data, password).getPrivateKey();
    const msgHash = util.addHexPrefix(util.sha3(JSON.stringify(txData)).toString('hex'));
    const signedMsgHash = signMsgHash(privateKey, msgHash);
    const signedTx = concatSig(signedMsgHash);
    resolve({ signedTx });
  });

const recoverAddress = (rawMsg, v, r, s) => {
  const msgHash = util.sha3(rawMsg);
  return util.pubToAddress(util.ecrecover(msgHash, v, r, s));
};

export const v3VerifySignature = (sig, address, message) => {
  const rpcSignature = util.fromRpcSig(sig);
  const convertedMessage = JSON.stringify(message);
  const recoveredAddress = recoverAddress(JSON.stringify(message), rpcSignature.v, rpcSignature.r, rpcSignature.s);

  let sameAddress = address.toLowerCase() === `0x${recoveredAddress.toString('hex')}`.toLowerCase();

  // Ledger Nano Signed Message need tobe handled differently
  if (!sameAddress) {
    const recovered = util.ecrecover(
      util.sha3(Buffer.from(`\x19Ethereum Signed Message:\n${convertedMessage.length}${convertedMessage}`, 32)),
      rpcSignature.v,
      new Buffer(rpcSignature.r, 'hex'),
      new Buffer(rpcSignature.s, 'hex'),
    );
    sameAddress = address.toLowerCase() === `0x${util.publicToAddress(recovered).toString('hex')}`.toLowerCase();
  }

  return sameAddress;
};
