import uuid from 'uuid';
import Web3 from 'web3';

import { actions as keystoreActions } from '~/actions/keystore';
import { actions as addressActions } from '~/actions/address';
import { throwIfExistingAddress } from '~/helpers/validation';

export function create(formData) {
  return (dispatch, getState) => {
    const { name, type, updateDefaultAddress } = formData;
    if (!type) {
      throw new Error('Please select a wallet type');
    }
    if (!name) {
      throw new Error('You must provide a name');
    }

    const { networks, tokens } = formData;

    if (!window.imToken || !window.web3 || !window.web3.currentProvider) {
      throw new Error('Cannot connect to imToken.');
    }

    const localWeb3 = new Web3(window.web3.currentProvider);

    if (!localWeb3.eth.defaultAccount) {
      throw new Error('Cannot connect to imToken wallet.');
    }

    const address = localWeb3.eth.defaultAccount;
    // // ensure it doesnt already exist
    throwIfExistingAddress([address], getState);

    // new keystore id
    const id = uuid();
    // create keystore instance
    dispatch({ type: keystoreActions.CREATE_KEYSTORE, payload: { type, id } });
    // create address instance
    dispatch({
      type: addressActions.CREATE_ADDRESS,
      payload: { address, networks, name, tokens, keystore: id, updateDefaultAddress },
    });
  };
}

export function update({ networks, tokens, name }, data) {
  return (dispatch) => {
    if (!name) {
      throw new Error('You must provide a name');
    }

    const address = data.addresses[0].address;
    dispatch({ type: addressActions.UPDATE_ADDRESS, payload: { address, networks, tokens, name } });
  };
}
