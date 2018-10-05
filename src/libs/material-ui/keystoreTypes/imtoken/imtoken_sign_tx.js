// import Wallet from 'ethereumjs-wallet';
// import EthTx from 'ethereumjs-tx';
import util from 'ethereumjs-util';
import Web3 from 'web3';

export const signMsg = ({ txData, address }) =>
  new Promise((resolve) => {
    const localWeb3 = new Web3(window.web3.currentProvider);
    if (localWeb3.eth.accounts[0] !== address) {
      const error = `Address: ${address} is not the current active address in imToken.
        Go to imToken and change to that address in order to proceed.`;
      resolve({ error });
    }
    const msgHash = util.addHexPrefix(util.sha3(JSON.stringify(txData)).toString('hex'));
    localWeb3.eth.sign(address, msgHash, (error, signedTx) => {
      if (error) resolve({ error });
      resolve({ signedTx });
    });
  });
