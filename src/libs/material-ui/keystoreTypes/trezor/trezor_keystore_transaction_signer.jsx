import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import _ from 'lodash';
import TrezorContainer from '@digix/react-trezor-container';
import Typography from '@material-ui/core/Typography';
import Fingerprint from '@material-ui/icons/Fingerprint';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  success: {
    color: '#4CAF50',
  },
};

class TrezorKeystoreTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.CANCEL_SIGNING_ERROR = 'Action cancelled by user';

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
    const t = this.props.translations.Trezor;

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
            logTxn.completeTransaction(false, `${t.error} - ${error}`);
          }
        }, 100);
      });
  }

  renderError() {
    const { error } = this.state;
    const t = this.props.translations.common;

    if (error.includes(this.CANCEL_SIGNING_ERROR)) {
      this.props.hideTxSigningModal({ error: t.cancelled });
      return null;
    }

    return <Typography color="error">{`${t.error} - ${error}`}</Typography>;
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

    const t = this.props.translations.common;
    return (
      <Fragment>
        <Markdown source={t.modifyInstructions} escapeHtml={false} />
        <Button
          variant="outlined"
          onClick={handleInitiateSigning}
          style={buttonStyle}
        >
          {t.sign}
        </Button>
      </Fragment>
    );
  };

  render() {
    const { kdPath, address } = this.props.address;
    const { classes } = this.props;
    const { error, signed, signing } = this.state;
    const t = this.props.translations.Trezor;

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
              {t.ready}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              className={classes.success}
            >
              {t.instructions}
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
  logTxn: PropTypes.object,
  translations: PropTypes.object.isRequired,
};

TrezorKeystoreTransactionSigner.defaultProps = {
  logTxn: undefined,
};

export default withStyles(styles)(TrezorKeystoreTransactionSigner);
