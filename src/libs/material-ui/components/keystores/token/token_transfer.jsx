import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TransactionModal from '~/libs/material-ui/components/transactions/transaction_modal';

import { toBigNumber } from '~/helpers/stringUtils';
import { showTxSigningModal } from '~/actions/session';
import { getAddresses } from '~/selectors';
import sanitizeData from '~/helpers/txUtils';
import TokenTransactionForm from './token_transfer_form';

class TokenTransfer extends Component {
  static propTypes = {
    data: PropTypes.object,
    trigger: PropTypes.node.isRequired,
    contract: PropTypes.object.isRequired,
    token: PropTypes.object.isRequired,
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
  handleTransaction({ tokenValue, to, ...rest }) {
    const {
      contract,
      token,
      token: { network },
      addresses,
      showTxSigningModal,
    } = this.props;
    if (!tokenValue) {
      throw new Error('You must enter a value');
    }
    if (!rest.from) {
      throw new Error('You must select a sender');
    }
    if (!to) {
      throw new Error('You must select a receipient');
    }
    const value = toBigNumber(tokenValue).shift(token.decimals);
    const ui = { type: 'tokenTx', token, value, to };
    const address = addresses.find(a => a.address === rest.from);
    const {
      keystore: {
        type: { id: keystoreType },
      },
    } = address;
    if (keystoreType === 'metamask') {
      const data = contract.transfer.getData(to, value);
      return showTxSigningModal({
        address,
        network,
        txData: sanitizeData({ ...rest, data, to: contract.address }, network),
        ui,
      });
    }
    return contract.transfer.sendTransaction(to, value, { ...rest, ui });
  }
  handleMined({ formData }) {
    const { contract } = this.props;
    contract.balanceOf.call(formData.to);
    contract.balanceOf.call(formData.from);
  }
  render() {
    const { data, trigger, token, contract } = this.props;
    const { network } = token;
    return (
      <TransactionModal
        header={`Send ${token.name} Tokens`}
        handleTransaction={this.handleTransaction}
        onMined={this.handleMined}
        form={TokenTransactionForm}
        {...{ data, trigger, network, token, contract }}
      />
    );
  }
}

export default connect(
  state => ({ addresses: getAddresses(state) }),
  { showTxSigningModal },
)(TokenTransfer);
