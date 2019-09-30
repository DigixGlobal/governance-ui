/* eslint-disable react/jsx-no-duplicate-props */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import { GasPrice } from '@digix/governance-ui-components/src/components/common';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getSigningModalData } from '~/selectors';
import { hideTxSigningModal } from '~/actions/session';

import { getKeystoreComponent } from '../../keystoreTypes';

import TransactionInfo from './transaction_info';

const defaultState = {
  loading: false,
  autoBroadcast: true,
  signedTx: null,
  signingAction: undefined,
  gasPrice: 20,
  showAdvancedTab: true,
};

class TransactionSigningOverlay extends Component {
  static propTypes = {
    data: PropTypes.object,
    hideTxSigningModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: undefined,
  };

  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleFailure = this.handleFailure.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSetLoading = this.handleSetLoading.bind(this);
    this.handleSign = this.handleSign.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    const { data } = nextProps;
    if (data) {
      const { txData } = data;
      const { gasPrice } = txData;
      this.setState({ gasPrice: gasPrice / 1e9 });
    }
  };

  setGasPrice = (gasPrice) => {
    // this.props.setTxFee(gasPrice);
    this.setState({
      gasPrice,
    });
  };

  handleSetLoading(loading, signingAction) {
    const { logTxn } = this.props.data;
    if (loading && logTxn) {
      logTxn.sign();
    }

    this.setState({ loading, signingAction });
  }

  handleBroadcast(...args) {
    this.setState(defaultState);
    this.props.hideTxSigningModal(...args);
  }

  handleSign(...args) {
    this.handleSetLoading(false);
    if (args.error || this.state.autoBroadcast) {
      this.handleBroadcast(...args);
    } else {
      this.setState({ signedTx: args[0].signedTx });
    }
  }

  handleFailure() {
    this.setState(defaultState);
    this.props.hideTxSigningModal({ error: 'Could not find Address' });
  }

  handleCancel() {
    const { logTxn } = this.props.data;
    const t = this.props.data.translations.common;

    if (logTxn) {
      logTxn.cancel();
    }

    this.setState(defaultState);
    this.props.hideTxSigningModal({ error: t.cancelled });
  }

  handleChange = (name, { min, max }) => (event) => {
    const value = parseFloat(event.target.value) || min;
    this.setState({
      [name]: value > max ? max : value,
    });
  };

  hideAdvancedTab = () => {
    this.setState({ showAdvancedTab: false });
  }

  render() {
    const { data } = this.props;
    if (!data) {
      return null;
    }

    const { network, address, txData, ui, logTxn, translations } = data;
    const logToggleDetails = logTxn && logTxn.toggleDetails ? logTxn.toggleDetails : undefined;

    const t = translations.common;
    const { keystore } = address;
    const {
      signedTx,
      signingAction,
      loading,
    } = this.state;

    if (!txData || !keystore) {
      return null;
    }

    const { gasPrice: txGas, ...rest } = txData;
    const newTxData = {
      gasPrice: `0x${(Number(this.state.gasPrice) * 1e9).toString(16)}`,
      ...rest,
    };

    const SigningComponent = getKeystoreComponent({
      id: keystore.type.id,
      type: 'transactionSigner',
    });

    return (
      <Dialog
        open
        onClose={this.handleCloseTracker}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          <span>{t.title}</span>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={16} direction="column">
            <Grid item xs={12}>
              {this.state.loading && <LinearProgress />}
            </Grid>
            <Grid item xs={12}>
              <TransactionInfo
                logToggleDetails={logToggleDetails}
                translations={translations}
                {...{ address, ui, txData: newTxData, network }}
              />
            </Grid>
            <Grid item xs={12}>
              {!signedTx ? (
                <div>
                  <SigningComponent
                    {...{ network, address, txData: newTxData }}
                    setLoading={this.handleSetLoading}
                    hideTxSigningModal={this.handleSign}
                    hideAdvancedTab={this.hideAdvancedTab}
                    translations={translations}
                    logTxn={logTxn}
                  />
                  {this.state.showAdvancedTab && (
                    <GasPrice
                      gas={newTxData.gas}
                      onGasPriceChange={this.setGasPrice}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <p>
                    <b>Signed Transaction:</b>
                    <br />
                    <code style={{ wordWrap: 'break-word' }}>{signedTx}</code>
                  </p>
                  <Button
                    content="Broadcast Transaction"
                    icon="bullhorn"
                    color="green"
                    onClick={(e) => {
                      e.preventDefault();
                      this.handleBroadcast({ signedTx });
                    }}
                  />
                </div>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {this.state.showAdvancedTab && (
            <Button color="primary" onClick={this.handleCancel}>
              {t.cancel}
            </Button>
          )}
          {signingAction && !loading && signingAction()}
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(
  state => ({ data: getSigningModalData(state) }),
  { hideTxSigningModal },
)(TransactionSigningOverlay);
