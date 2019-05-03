import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LedgerContainer from '@digix/react-ledger-container';
import { Message } from 'semantic-ui-react';
import { injectTranslation } from '~/helpers/stringUtils';

export default class LedgerKeystoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.handleSign = this.handleSign.bind(this);
  }

  handleSign({ signMessage }) {
    const { txData, address, hideMsgSigningModal } = this.props;
    const { kdPath } = address;
    const log = this.props.txData.logSignMessage.txn;

    signMessage(kdPath, txData.message)
      .then((signedTx) => {
        log.completeTransaction(true);
        hideMsgSigningModal({ signedTx });
      })
      .catch((error) => {
        log.completeTransaction(false, error);
      });
  }

  render() {
    const { kdPath, address } = this.props.address;
    const t = this.props.txData.translations.Ledger.chooseAddress.proofOfControl;

    return (
      <LedgerContainer
        expect={{ kdPath, address }}
        onReady={this.handleSign}
        renderReady={({ config }) => (
          <Message
            icon={config.eip155 ? 'checkmark' : 'warning'}
            positive={config.eip155}
            warning={!config.eip155}
            header={t.description}
            content={injectTranslation(t.firmware, { version: config.version })}
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
