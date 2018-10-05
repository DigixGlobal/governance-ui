import { getAddresses, getNetworks } from '~/selectors';
import HookedWalletEthTx from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';
import sanitizeData from '~/helpers/txUtils';

import { showTxSigningModal } from '~/actions/session';

export default class ReduxSubProvider extends HookedWalletEthTx {
  constructor({ store, networkId }, opts) {
    super({
      ...opts,
      getAccounts(cb) {
        // TODO filter by networkId?
        const addresses = getAddresses(store.getState()).map(a => a.address);
        cb(null, addresses);
      },
    });
    this.rpcStore = store;
    this.rpcNetworkId = networkId;

    // overriding https://github.com/MetaMask/provider-engine/blob/master/subproviders/hooked-wallet-ethtx.js
    this.signTransaction = ({ ui, ...data }, cb) => {
      const network = getNetworks(this.rpcStore.getState()).find(({ id }) => id === this.rpcNetworkId) || {};
      const txData = sanitizeData(data, network);
      const address = getAddresses(this.rpcStore.getState()).find(a => a.address === txData.from);
      this.rpcStore
        .dispatch(showTxSigningModal({ address, txData, ui, network }))
        .then(({ signedTx }) => {
          cb(null, signedTx);
        })
        .catch(cb);
    };
  }
}
