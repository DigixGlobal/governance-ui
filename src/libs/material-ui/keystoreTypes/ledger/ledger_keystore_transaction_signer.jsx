import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LedgerContianer from '@digix/react-ledger-container';
import Typography from '@material-ui/core/Typography';
import Fingerprint from '@material-ui/icons/Fingerprint';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  success: {
    color: '#4CAF50',
  },
};
class LedgerKeystoreTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.handleSign = this.handleSign.bind(this);
    this.state = { error: undefined };
    this.renderError = this.renderError.bind(this);
  }
  handleSign({ signTransaction }) {
    const { txData, address, hideTxSigningModal } = this.props;
    const { kdPath } = address;
    signTransaction(kdPath, txData)
      .then((signedTx) => {
        hideTxSigningModal({ signedTx });
      })
      .catch(error => this.setState({ error }));
  }
  renderError() {
    const { error } = this.state;
    if (error.includes('6985')) {
      this.props.hideTxSigningModal({ error: 'Cancelled Signing' });
      return null;
    }
    return <Typography color="error">{`Ledger Error - ${error}`}</Typography>;
  }
  render() {
    const { kdPath, address } = this.props.address;
    const { classes } = this.props;
    const { error } = this.state;
    if (error) {
      return this.renderError();
    }

    return (
      <LedgerContianer
        expect={{ kdPath, address }}
        onReady={this.handleSign}
        renderError={() => console.log('error')}
        onError={() => console.log('on error')}
        renderReady={({ config }) => (
          <Fragment>
            <Typography align="center">
              <Fingerprint classes={{ root: classes.success }} />
            </Typography>
            <Typography variant="title" align="center" className={classes.success}>
              Ready to Sign Transaction
            </Typography>
            <Typography variant="body2" align="center" className={classes.success}>{`Firmware ${
              config.version
            } - replay protection ${config.eip155 ? 'en' : 'dis'}abled!`}</Typography>
          </Fragment>
        )}
      />
    );
  }
}

LedgerKeystoreTransactionSigner.propTypes = {
  hideTxSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LedgerKeystoreTransactionSigner);
