import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import TrezorContainer from '@digix/react-trezor-container';
import Typography from '@material-ui/core/Typography';
import Fingerprint from '@material-ui/icons/Fingerprint';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  success: {
    color: '#4CAF50'
  }
};

class TrezorKeystoreTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.handleSign = this.handleSign.bind(this);
    this.state = { signed: false, error: false, signing: false };
    this.renderError = this.renderError.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextState, this.state) || !_.isEqual(nextProps, this.props)
    );
  }

  handleSign({ signTransaction }) {
    const { txData, address, hideTxSigningModal } = this.props;
    const { kdPath } = address;
    signTransaction(kdPath, txData, hideTxSigningModal)
      .then(signedTx => {
        this.setState({ signed: true });
        hideTxSigningModal({ signedTx });
      })
      .catch(error => {
        setTimeout(() => {
          this.setState({ error });
          const { logTxn } = this.props;
          if (logTxn) {
            logTxn.completeTransaction(false, `Trezor Error - ${error}`);
          }
        }, 100);
      });
  }
  renderError() {
    const { error } = this.state;
    return <Typography color="error">{`Trezor Error - ${error}`}</Typography>;
  }

  renderInitSigning = () => {
    const handleInitiateSigning = () => {
      this.props.hideAdvancedTab();
      this.setState({ signing: true });
    };

    const buttonStyle = {
      display: 'block',
      margin: '0 auto'
    };

    return (
      <Fragment>
        <p>
          You can modify the transaction details using the <b>Advanced</b> tab
          below. Once you are satisfied with the details, please click{' '}
          <b>Sign Transaction</b>
          to confirm the transaction with your ledger device.
        </p>
        <Button
          variant="outlined"
          onClick={handleInitiateSigning}
          style={buttonStyle}
        >
          Sign Transaction
        </Button>
      </Fragment>
    );
  };

  render() {
    const { kdPath, address } = this.props.address;
    const { classes } = this.props;
    const { error, signed, signing } = this.state;
    if (error) {
      return this.renderError();
    }
    return (
      <TrezorContainer
        expect={{ kdPath, address }}
        onReady={this.handleSign}
        renderInitSigning={this.renderInitSigning}
        signed={signed}
        signing={signing}
        renderReady={() => (
          <Fragment>
            <Typography align="center">
              <Fingerprint classes={{ root: classes.success }} />
            </Typography>
            <Typography
              variant="body2"
              align="center"
              className={classes.success}
            >
              Ready to Sign Transaction
            </Typography>
            <Typography
              variant="body2"
              align="center"
              className={classes.success}
            >
              Please follow instructions on your Trezor Wallet
            </Typography>
          </Fragment>
        )}
      />
    );
  }
}

TrezorKeystoreTransactionSigner.propTypes = {
  hideTxSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logTxn: PropTypes.object
};

TrezorKeystoreTransactionSigner.defaultProps = {
  logTxn: undefined
};

export default withStyles(styles)(TrezorKeystoreTransactionSigner);
