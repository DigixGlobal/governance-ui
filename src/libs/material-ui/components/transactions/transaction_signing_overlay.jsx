import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Divider, Modal, Button, Dimmer, Loader } from 'semantic-ui-react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
// import Divider from '@material-ui/core/Divider';

import { getSigningModalData } from '~/selectors';
import { hideTxSigningModal } from '~/actions/session';

import { getKeystoreComponent } from '../../keystoreTypes';

import TransactionInfo from './transaction_info';
// import Advanced from '../common/advanced';

const defaultState = { loading: false, autoBroadcast: true, signedTx: null, signingAction: undefined };

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
  handleSetLoading(loading, signingAction) {
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
    this.setState(defaultState);
    this.props.hideTxSigningModal({ error: 'Cancelled Signing' });
  }
  render() {
    const { data } = this.props;
    if (!data) {
      return null;
    }
    const { network, address, txData, ui } = data;
    const { keystore } = address;
    const { autoBroadcast, signedTx, signingAction, loading } = this.state;
    if (!txData || !keystore) {
      return null;
    }
    const SigningComponent = getKeystoreComponent({ id: keystore.type.id, type: 'transactionSigner' });
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
        <DialogTitle id="alert-dialog-title">Transaction Status</DialogTitle>
        <DialogContent>
          <Grid container spacing={16} direction="column">
            <Grid item xs={12}>
              {this.state.loading && <LinearProgress />}
            </Grid>
            <Grid item xs={12}>
              <TransactionInfo {...{ address, ui, txData, network }} />
            </Grid>
            <Grid item xs={12}>
              {!signedTx ? (
                <div>
                  <SigningComponent
                    {...{ network, address, txData }}
                    setLoading={this.handleSetLoading}
                    hideTxSigningModal={this.handleSign}
                  />
                  <br />
                  {/* <Advanced>
                    <br />
                    <br />
                    <Button
                      content="Broadcast Transaction"
                      icon={autoBroadcast ? 'checkmark' : 'remove'}
                      color={autoBroadcast ? 'green' : 'red'}
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ autoBroadcast: !autoBroadcast });
                      }}
                    />
                  </Advanced> */}
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
          <Button color="primary" onClick={this.handleCancel}>
            Cancel Signing
          </Button>
          {signingAction && !loading && signingAction()}
        </DialogActions>
      </Dialog>
      // <Modal open size="small">
      //   <Modal.Header>Sign Transaction</Modal.Header>
      //   <Modal.Content>
      //     {this.state.loading && (
      //       <Dimmer active inverted>
      //         <Loader>{this.state.loading}</Loader>
      //       </Dimmer>
      //     )}
      //     <TransactionInfo {...{ address, ui, txData, network }} />
      //     <Divider hidden />
      // {!signedTx ? (
      //   <div>
      //     <SigningComponent
      //       {...{ network, address, txData }}
      //       setLoading={this.handleSetLoading}
      //       hideTxSigningModal={this.handleSign}
      //     />
      //     <br />
      //     <Advanced>
      //       <br />
      //       <br />
      //       <Button
      //         content="Broadcast Transaction"
      //         icon={autoBroadcast ? 'checkmark' : 'remove'}
      //         color={autoBroadcast ? 'green' : 'red'}
      //         onClick={(e) => {
      //           e.preventDefault();
      //           this.setState({ autoBroadcast: !autoBroadcast });
      //         }}
      //       />
      //     </Advanced>
      //   </div>
      // ) : (
      //   <div>
      //     <p>
      //       <b>Signed Transaction:</b>
      //       <br />
      //       <code style={{ wordWrap: 'break-word' }}>{signedTx}</code>
      //     </p>
      //     <Button
      //       content="Broadcast Transaction"
      //       icon="bullhorn"
      //       color="green"
      //       onClick={(e) => {
      //         e.preventDefault();
      //         this.handleBroadcast({ signedTx });
      //       }}
      //     />
      //   </div>
      //     )}
      //   </Modal.Content>
      //   <Modal.Actions>
      //     <Button content="Cancel Signing" onClick={this.handleCancel} />
      //   </Modal.Actions>
      // </Modal>
    );
  }
}

export default connect(
  state => ({ data: getSigningModalData(state) }),
  { hideTxSigningModal },
)(TransactionSigningOverlay);
