import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import Typography from '@material-ui/core/Typography';
import TrezorContainer from '@digix/react-trezor-container';
import _ from 'lodash';

export default class TrezorKeystoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { signed: false };
    this.handleSign = this.handleSign.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextState, this.state);
  }

  handleSign({ signMessage }) {
    const log = this.props.txData.logSignMessage.txn;
    const { txData, address, hideMsgSigningModal } = this.props;
    const { kdPath } = address;

    signMessage(kdPath, txData.message)
      .then((signedTx) => {
        log.completeTransaction(true);
        this.setState({ signed: true });
        hideMsgSigningModal({ signedTx });
      })
      .catch((error) => {
        setTimeout(() => {
          this.setState({ error });
          log.completeTransaction(false, error);
        }, 100);
      });
  }

  renderError() {
    const { error } = this.state;
    return (
      <Typography color="error">
        <br />
        {`Trezor Error - ${error}`}
      </Typography>
    );
  }

  render() {
    const { kdPath, address } = this.props.address;
    const { signed, error } = this.state;
    if (error) {
      return this.renderError();
    }

    const t = this.props.txData.translations.Trezor.chooseAddress.proofOfControl;
    return (
      <TrezorContainer
        expect={{ kdPath, address }}
        onReady={this.handleSign}
        signed={signed}
        renderReady={() => (
          <Message
            icon="check"
            positive
            header={t.description}
            content={t.instructions}
          />
        )}
      />
    );
  }
}

const { array, func, object, oneOfType } = PropTypes;
TrezorKeystoreMessageSigner.propTypes = {
  address: object.isRequired,
  hideMsgSigningModal: func.isRequired,
  txData: oneOfType([array, object]).isRequired,
};
