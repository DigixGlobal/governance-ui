import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import ErrorMessage from '~/components/common/error_message';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  card: {
    backgroundColor: '#eee',
  },
});

class MetaMaskTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidMount() {
    const throwErr = (error) => {
      this.props.setLoading(false);
      this.setState({ error });
    };
    try {
      const { txData } = this.props;
      window.web3.version.getNetwork((err, netId) => {
        const environment = process.env.ENVIRONMENT;
        if (environment === 'production' && netId !== '1') {
          this.props.hideTxSigningModal({ error: 'MetaMask should be in Mainnet!' });
        } else if ((environment === 'kovan' || environment === 'demo') && netId !== '42') {
          this.props.hideTxSigningModal({ error: 'MetaMask should be in Kovan Network!' });
        } else if (environment === 'development' && netId < 10000000) {
          this.props.hideTxSigningModal({ error: 'MetaMask should be in your Custom RPC Network!' });
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
    const { error } = this.state;
    const { classes } = this.props;
    return (
      <div style={{ marginTop: '1em' }}>
        <Card className={classes.card} elevation={0}>
          <CardHeader
            avatar={<CircularProgress />}
            title="Waiting MetaMask Transaction Confirmation"
            subheader="Please confirm your transaction in MetaMask. If you wish to cancel, click the &quot;Cancel&quot; button in MetaMask."
          />
        </Card>
      </div>
      // <div>
      //   <Message icon>
      //     <CircularProgress /* className={classes.progress} */ />
      //     <Message.Content>
      //       <Message.Header>Waiting MetaMask Transaction Confirmation</Message.Header>
      //       Please confirm your transaction in MetaMask. If you wish to cancel, click the "Cancel" button in MetaMask.
      //     </Message.Content>
      //   </Message>
      //   {error && <ErrorMessage content={error} />}
      // </div>
    );
  }
}

MetaMaskTransactionSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideTxSigningModal: PropTypes.func.isRequired,
  txData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MetaMaskTransactionSigner);
