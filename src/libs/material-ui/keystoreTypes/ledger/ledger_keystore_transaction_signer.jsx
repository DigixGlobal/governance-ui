import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';

import Fingerprint from '@material-ui/icons/Fingerprint';
import LedgerContainer from '@digix/react-ledger-container';
import LedgerOutdatedVersionError from '~/libs/material-ui/keystoreTypes/ledger/version_outdated';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { injectTranslation, isVersionOutdated } from '~/helpers/stringUtils';
import { LATEST_ETHEREUM_APP_LEDGER } from '~/helpers/constants';

const styles = {
  success: {
    color: '#4CAF50',
  },
};

const CANCEL_SIGNING_ERROR = '6985';
const SETTINGS_ERROR = '6a80';

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
    let message = `Ledger Error - ${error}`;

    if (error.includes(CANCEL_SIGNING_ERROR)) {
      const t = this.props.translations.common;
      this.props.hideTxSigningModal({ error: t.cancelled });
      return null;
    }

    if (error.includes(SETTINGS_ERROR)) {
      const errorMessage = this.props.translations.Ledger.errors.settingsError;
      message = <Markdown source={errorMessage} escapeHtml={false} />;
    }

    return <Typography color="error">{message}</Typography>;
  }

  renderReady = ({ config }) => {
    const t = this.props.translations.Ledger;
    const isAppOutdated = isVersionOutdated(config.version, LATEST_ETHEREUM_APP_LEDGER);
    if (isAppOutdated) {
      return <LedgerOutdatedVersionError translations={t} />;
    }

    const { success } = this.props.classes;
    const { eip155, version } = config;
    const protectionStatus = eip155 ? 'enabled' : 'disabled';

    return (
      <Fragment>
        <Typography align="center">
          <Fingerprint classes={{ root: success }} />
        </Typography>
        <Typography align="center" className={success} variant="title">
          {t.ready}
        </Typography>
        <Typography align="center" className={success} variant="body2">
          {injectTranslation(t.firmware, { version })}
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

    const t = this.props.translations.common;
    return (
      <Fragment>
        <Markdown source={t.modifyInstructions} escapeHtml={false} />
        <Button variant="outlined" onClick={handleInitiateSigning} style={buttonStyle}>
          {t.sign}
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
  translations: PropTypes.object.isRequired,
};

LedgerKeystoreTransactionSigner.defaultProps = {
  logTxn: undefined,
};

export default withStyles(styles)(LedgerKeystoreTransactionSigner);
