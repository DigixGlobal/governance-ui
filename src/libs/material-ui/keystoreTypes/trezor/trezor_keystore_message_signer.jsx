import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import TrezorContainer from '@digix/react-trezor-container';

export default class TrezorKeystoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.handleSign = this.handleSign.bind(this);
    this.state = { signed: false };
  }
  handleSign({ signMessage }) {
    const { txData, address, hideMsgSigningModal } = this.props;
    const { kdPath } = address;
    signMessage(kdPath, txData.message).then(signedTx => {
      this.setState({ signed: true });
      hideMsgSigningModal({ signedTx });
    });
  }
  render() {
    const { kdPath, address } = this.props.address;
    const { signed } = this.state;
    return (
      <TrezorContainer
        expect={{ kdPath, address }}
        onReady={this.handleSign}
        signed={signed}
        renderReady={() => (
          <Message
            icon="check"
            positive
            header={'Ready to Sign Message'}
            content="Trezor Popup window is loading. Please follow instructions from the popup and your Trezor Wallet to continue."
          />
        )}
      />
    );
  }
}

TrezorKeystoreMessageSigner.propTypes = {
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired
};
