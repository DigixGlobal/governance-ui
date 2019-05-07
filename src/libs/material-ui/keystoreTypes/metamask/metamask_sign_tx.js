import util from 'ethereumjs-util';

const MetamaskSignMsg = ({ txData, address }) =>
  new Promise((resolve, reject) => {
    if (window.web3.eth.accounts[0] !== address) {
      const error = `Address: ${address} is not the current active address in MetaMask.
        Go to MetaMask and change to that address in order to proceed.`;
      reject(error);
    }

    const msgBuffer = new Buffer(txData.message);
    const prefix = new Buffer('\x19Ethereum Signed Message:\n');
    const prefixedMsg = util.sha3(Buffer.concat([prefix, new Buffer(String(msgBuffer.length)), msgBuffer]));
    const msgHash = util.addHexPrefix(prefixedMsg.toString('hex'));

    const throwErr = (error, signedTx) => {
      if (error) {
        reject('Transaction rejected.');
      }

      resolve({ signedTx });
    };

    window.web3.eth.sign(address, msgHash, throwErr);
  });

export default MetamaskSignMsg;
