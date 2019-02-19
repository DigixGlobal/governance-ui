import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';
import Web3 from 'web3';

import ErrorMessage from '~/libs/material-ui/components/common/error_message';

export default class ImTokenKestoreTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidMount() {
    const throwErr = (error) => {
      this.props.setLoading(false);
      this.setState({ error });
      const { logTxn } = this.props;
      if (logTxn) {
        logTxn.completeTransaction(false, error);
      }
    };

    try {
      const localWeb3 = new Web3(window.web3.currentProvider);
      const { txData } = this.props;
      localWeb3.eth.sendTransaction(txData, (sendTransactionError, txHash) => {
        const result = sendTransactionError ? { error: sendTransactionError } : txHash;
        this.props.hideTxSigningModal(result);
      });
    } catch (error) {
      throwErr(error);
    }
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Waiting ImToken Transaction Confirmation</Message.Header>
            Please confirm your transaction in ImToken. If you wish to cancel, click the "Cancel" button in ImToken.
          </Message.Content>
        </Message>
        {error && <ErrorMessage content={error} />}
      </div>
    );
  }
}

ImTokenKestoreTransactionSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideTxSigningModal: PropTypes.func.isRequired,
  txData: PropTypes.object.isRequired,
  logTxn: PropTypes.object,
};

ImTokenKestoreTransactionSigner.defaultProps = {
  logTxn: undefined,
};
