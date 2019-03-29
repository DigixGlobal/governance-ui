import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Fingerprint from '@material-ui/icons/Fingerprint';
import LedgerContainer from '@digix/react-ledger-container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  success: {
    color: '#4CAF50',
  },
};

const CANCEL_SIGNING_ERROR = '6985';

class LedgerKeystoreTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
    };

    this.handleSign = this.handleSign.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderInitSigning = this.renderInitSigning.bind(this);
  }

  handleSign({ signTransaction }) {
    const { txData, address, hideTxSigningModal } = this.props;
    const { kdPath } = address;
    signTransaction(kdPath, txData)
      .then((signedTx) => {
        hideTxSigningModal({ signedTx });
      })
      .catch((error) => {
        this.setState({ error });
        const { logTxn } = this.props;
        if (logTxn) {
          logTxn.completeTransaction(false, `Ledger Error - ${error}`);
        }
      });
  }

  renderError() {
    const { error } = this.state;
    if (error.includes(CANCEL_SIGNING_ERROR)) {
      this.props.hideTxSigningModal({ error: 'Cancelled Signing' });
      return null;
    }

    return <Typography color="error">{`Ledger Error - ${error}`}</Typography>;
  }

  renderReady = ({ config }) => {
    const { success } = this.props.classes;
    const { eip155, version } = config;
    const protectionStatus = eip155 ? 'enabled' : 'disabled';

    return (
      <Fragment>
        <Typography align="center">
          <Fingerprint classes={{ root: success }} />
        </Typography>
        <Typography align="center" className={success} variant="title">
          Ready to Sign Transaction
        </Typography>
        <Typography align="center" className={success} variant="body2">
          {`Firmware ${version} - replay protection ${protectionStatus}!`}
        </Typography>
      </Fragment>
    );
  }

  renderInitSigning = ({ initiateSigning }) => {
    const handleInitiateSigning = () => {
      this.props.hideAdvancedTab();
      initiateSigning();
    };

    const buttonStyle = {
      display: 'block',
      margin: '0 auto',
    };

    return (
      <Fragment>
        <p>
          You can modify the transaction details using the <b>Advanced</b> tab below.
          Once you are satisfied with the details, please click <b>Sign Transaction</b>
          to confirm the transaction with your ledger device.
        </p>
        <Button variant="outlined" onClick={handleInitiateSigning} style={buttonStyle}>
          Sign Transaction
        </Button>
      </Fragment>
    );
  };

  render() {
    const { kdPath, address } = this.props.address;
    const { error } = this.state;

    if (error) {
      return this.renderError();
    }

    return (
      <LedgerContainer
        expect={{ kdPath, address }}
        onReady={this.handleSign}
        renderInitSigning={this.renderInitSigning}
        renderReady={this.renderReady}
      />
    );
  }
}

LedgerKeystoreTransactionSigner.propTypes = {
  hideAdvancedTab: PropTypes.func.isRequired,
  hideTxSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logTxn: PropTypes.object,
};

LedgerKeystoreTransactionSigner.defaultProps = {
  logTxn: undefined,
};

export default withStyles(styles)(LedgerKeystoreTransactionSigner);
