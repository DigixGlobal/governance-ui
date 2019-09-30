import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Markdown from 'react-markdown';

const styles = () => ({
  card: {
    backgroundColor: '#eee',
  },
});

const ERROR_MESSAGES = {
  shouldBeInMainnet: 'MetaMask should be in Mainnet!',
  shouldBeInKovan: 'MetaMask should be in Kovan Network!',
  shouldBeInRpc: 'MetaMask should be in your Custom RPC Network!',
};

class MetaMaskTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isSigning: false,
    };

    this.renderInitSigning = this.renderInitSigning.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.initiateSigning = this.initiateSigning.bind(this);
  }

  initiateSigning() {
    const throwErr = (error) => {
      this.props.setLoading(false);
      this.setState({ error, isSigning: false });
      const { logTxn } = this.props;
      if (logTxn) {
        logTxn.completeTransaction(false, error);
      }
    };

    try {
      const { logTxn, txData } = this.props;
      window.web3.version.getNetwork((err, netId) => {
        const environment = process.env.ENVIRONMENT;
        if (environment === 'production' && netId !== '1') {
          if (logTxn) {
            logTxn.completeTransaction(false, ERROR_MESSAGES.shouldBeInMainnet);
          }
          this.props.hideTxSigningModal({ error: ERROR_MESSAGES.shouldBeInMainnet });
        } else if ((environment === 'kovan' || environment === 'demo') && netId !== '42') {
          if (logTxn) {
            logTxn.completeTransaction(false, ERROR_MESSAGES.shouldBeInKovan);
          }
          this.props.hideTxSigningModal({ error: ERROR_MESSAGES.shouldBeInKovan });
        } else if (environment === 'development' && netId < 10000000) {
          if (logTxn) {
            logTxn.completeTransaction(false, ERROR_MESSAGES.shouldBeInRpc);
          }
          this.props.hideTxSigningModal({ error: ERROR_MESSAGES.shouldBeInRpc });
        } else {
          this.setState({ isSigning: true });
          window.web3.eth.sendTransaction(txData, (sendTransactionError, txHash) => {
            const result = sendTransactionError ? { error: sendTransactionError } : txHash;
            this.props.hideTxSigningModal(result);
          });
        }
      });
    } catch (error) {
      throwErr(error);
    }
  }

  renderInitSigning = () => {
    const handleInitiateSigning = () => {
      this.props.hideAdvancedTab();
      this.initiateSigning();
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

  renderLoading = () => {
    const { classes } = this.props;
    const t = this.props.translations.Metamask;

    return (
      <Card className={classes.card} elevation={0}>
        <CardHeader
          avatar={<CircularProgress />}
          title={t.title}
          subheader={t.description}
        />
      </Card>
    );
  };

  render() {
    return (
      <div style={{ marginTop: '1em' }}>
        {this.state.isSigning ? this.renderLoading() : this.renderInitSigning()}
      </div>
    );
  }
}

MetaMaskTransactionSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideTxSigningModal: PropTypes.func.isRequired,
  hideAdvancedTab: PropTypes.func.isRequired,
  txData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logTxn: PropTypes.object,
  translations: PropTypes.object.isRequired,
};

MetaMaskTransactionSigner.defaultProps = {
  logTxn: undefined,
};

export default withStyles(styles)(MetaMaskTransactionSigner);
