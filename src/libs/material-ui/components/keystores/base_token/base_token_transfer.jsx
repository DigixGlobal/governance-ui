import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toBigNumber } from '~/helpers/stringUtils';
import TransactionModal from '~/libs/material-ui/components/transactions/transaction_modal';
import { showTxSigningModal } from '~/actions/session';
import { getAddresses } from '~/selectors';
import sanitizeData from '~/helpers/txUtils';

import BaseTokenTransferForm from './base_token_transfer_form';

class BaseTokenTransfer extends Component {
  static propTypes = {
    data: PropTypes.object,
    trigger: PropTypes.node.isRequired,
    network: PropTypes.object.isRequired,
    addresses: PropTypes.array.isRequired,
    showTxSigningModal: PropTypes.func.isRequired,
  };
  static defaultProps = {
    data: undefined,
  };
  constructor(props) {
    super(props);
    this.state = {};
    this.handleTransaction = this.handleTransaction.bind(this);
    this.handleMined = this.handleMined.bind(this);
  }
  handleTransaction({ ethValue, ...rest }, web3) {
    const { addresses, showTxSigningModal, network } = this.props;

    if (!ethValue) {
      throw new Error('You must enter a value');
    }
    if (!rest.from) {
      throw new Error('You must select a sender');
    }
    if (!rest.to) {
      throw new Error('You must select a receipient');
    }
    const value = toBigNumber(ethValue).shift(18);
    const address = addresses.find(a => a.address === rest.from);
    const {
      keystore: {
        type: { id: keystoreType },
      },
    } = address;

    if (keystoreType === 'metamask') {
      return showTxSigningModal({
        address,
        network,
        txData: sanitizeData({ ...rest, value }, network),
        ui: { type: 'baseTokenTx' },
      });
    }

    return web3.eth.sendTransaction({ ...rest, value, ui: { type: 'baseTokenTx' } });
  }
  handleMined({ formData }, web3) {
    web3.eth.getBalance(formData.to);
    web3.eth.getBalance(formData.from);
  }
  render() {
    const { data, trigger, network } = this.props;
    return (
      <TransactionModal
        header={`Send ${network.name} Ether`}
        handleTransaction={this.handleTransaction}
        onMined={this.handleMined}
        form={BaseTokenTransferForm}
        {...{ data, trigger, network }}
      />
    );
  }
}

export default connect(
  state => ({ addresses: getAddresses(state) }),
  { showTxSigningModal },
)(BaseTokenTransfer);
