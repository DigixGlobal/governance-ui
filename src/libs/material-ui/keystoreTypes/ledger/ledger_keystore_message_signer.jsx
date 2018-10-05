import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import LedgerContianer from '@digix/react-ledger-container';

export default class LedgerKeystoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.handleSign = this.handleSign.bind(this);
  }
  handleSign({ signMessage }) {
    const { txData, address, hideMsgSigningModal } = this.props;
    const { kdPath } = address;
    signMessage(kdPath, txData).then((signedTx) => {
      hideMsgSigningModal({ signedTx });
    });
  }
  render() {
    const { kdPath, address } = this.props.address;
    return (
      <LedgerContianer
        expect={{ kdPath, address }}
        onReady={this.handleSign}
        renderReady={({ config }) => (
          <Message
            icon={config.eip155 ? 'checkmark' : 'warning'}
            positive={config.eip155}
            warning={!config.eip155}
            header={'Ready to Sign Message'}
            content={`Firmware ${config.version} - replay protection ${config.eip155 ? 'en' : 'dis'}abled!`}
          />
        )}
      />
    );
  }
}

LedgerKeystoreMessageSigner.propTypes = {
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};
