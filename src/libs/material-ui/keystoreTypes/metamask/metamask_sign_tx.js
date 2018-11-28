
import util from 'ethereumjs-util';

export const v3SignMsg = ({ txData, address }) =>
  new Promise((resolve) => {
    if (window.web3.eth.accounts[0] !== address) {
      const error = `Address: ${address} is not the current active address in MetaMask.
        Go to MetaMask and change to that address in order to proceed.`;
      resolve({ error });
    }

    const msgBuffer = new Buffer(txData.message);
    const prefix = new Buffer('\x19Ethereum Signed Message:\n');
    const prefixedMsg = util.sha3(Buffer.concat([prefix, new Buffer(String(msgBuffer.length)), msgBuffer]));
    const msgHash = util.addHexPrefix(prefixedMsg.toString('hex'));

    window.web3.eth.sign(address, msgHash, (error, signedTx) => {
      if (error) resolve({ error });
      resolve({ signedTx });
    });
  });

