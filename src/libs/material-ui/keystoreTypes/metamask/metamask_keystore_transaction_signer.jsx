import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    };
  }

  componentDidMount() {
    this.props.hideAdvancedTab();

    const throwErr = (error) => {
      this.props.setLoading(false);
      this.setState({ error });
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

  render() {
    const { classes } = this.props;
    return (
      <div style={{ marginTop: '1em' }}>
        <Card className={classes.card} elevation={0}>
          <CardHeader
            avatar={<CircularProgress />}
            title="Waiting MetaMask Transaction Confirmation"
            subheader="Please confirm your transaction in MetaMask. If you wish to cancel, click the &quot;Reject&quot; button in MetaMask."
          />
        </Card>
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
};

MetaMaskTransactionSigner.defaultProps = {
  logTxn: undefined,
};

export default withStyles(styles)(MetaMaskTransactionSigner);
