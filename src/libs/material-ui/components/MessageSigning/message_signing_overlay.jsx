import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { Divider, Modal, Button, Dimmer, Loader } from 'semantic-ui-react';

import Dialog from '@digix/mui/lib/components/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { getKeystoreComponent } from '../../keystoreTypes';
import {
  getSigningMessageModalData,
  getDefaultAddressAndKeyStore
} from '~/selectors';
import web3Connect from '~/helpers/web3/connect';
import { hideMsgSigningModal } from '~/actions/session';
import { DialogContent } from '@material-ui/core';

const defaultState = {
  loading: false,
  autoBroadcast: true,
  signingAction: undefined,
  signedTx: null,
  sign: false
};

const styles = theme => ({
  walletIcon: {
    height: '60px',
    width: '100%',
    color: theme.palette.secondary.main
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  wrapper: {
    position: 'relative',
    margin: '0 auto'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  label: {
    color: theme.palette.primary.main
  },
  noMinHeight: {
    minHeight: 'none'
  },
  dialogContent: {
    margin: '0 auto',
    width: '100%'
  },
  loadingRoot: {
    display: 'flex',
    alignItems: 'center'
  },
  loadingWrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    top: '-20px',
    left: '-12px',
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -26,
    left: -18,
    zIndex: 1
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

class MessageSigningOverlay extends Component {
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
    this.props.hideMsgSigningModal(...args);
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
    this.props.hideMsgSigningModal({ error: 'Could not find Address' });
  }
  handleCancel() {
    this.setState(defaultState);
    this.props.hideMsgSigningModal({ error: 'Cancelled Signing' });
  }
  render() {
    const { data, address, web3Redux, classes } = this.props;

    if (!data) {
      return null;
    }
    const { network, txData } = data;
    const { keystore } = address;
    const { signedTx, loading, signingAction } = this.state;
    if (!txData || !keystore) {
      return null;
    }
    const SigningComponent = getKeystoreComponent({
      id: keystore.type.id,
      type: 'messageSigner'
    });
    return (
      <Dialog
        initiallyOpen
        className={classes.noMinHeight}
        contentClasses={{
          root: classes.dialogContent
        }}
        renderActions={({ hide }) => (
          <div>
            <Button onClick={this.handleCancel}>Cancel Signing</Button>
            {signingAction && !loading && signingAction()}
          </div>
        )}
      >
        <DialogTitle id="alert-dialog-title">Transaction Status</DialogTitle>
        <DialogContent>
          {!signedTx ? (
            <SigningComponent
              {...{ network, address, txData, web3Redux }}
              setLoading={this.handleSetLoading}
              hideMsgSigningModal={this.handleSign}
            />
          ) : (
            <div>
              <p>
                <b>Signed Transaction:</b>
                <br />
                <code style={{ wordWrap: 'break-word' }}>{signedTx}</code>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      // <Modal open size="small">
      //   <Modal.Header>Sign Message</Modal.Header>
      //   <Modal.Content>
      //     {this.state.loading && (
      //       <Dimmer active inverted>
      //         <Loader>{this.state.loading}</Loader>
      //       </Dimmer>
      //     )}
      //     {!signedTx ? (
      //       <div>
      //         <SigningComponent
      //           {...{ network, address, txData, web3Redux }}
      //           setLoading={this.handleSetLoading}
      //           hideMsgSigningModal={this.handleSign}
      //         />
      //       </div>
      //     ) : (
      //       <div>
      //         <p>
      //           <b>Signed Transaction:</b>
      //           <br />
      //           <code style={{ wordWrap: 'break-word' }}>{signedTx}</code>
      //         </p>
      //       </div>
      //     )}
      //   </Modal.Content>
      //   <Modal.Actions>
      //     <Button content="Cancel Signing" onClick={this.handleCancel} />
      //   </Modal.Actions>
      // </Modal>
    );
  }
}

MessageSigningOverlay.propTypes = {
  data: PropTypes.object,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object,
  classes: PropTypes.object.isRequired
};

MessageSigningOverlay.defaultProps = {
  data: undefined,
  address: undefined
};

export default withStyles(styles)(
  web3Connect(
    connect(
      state => ({
        data: getSigningMessageModalData(state),
        address: getDefaultAddressAndKeyStore(state)
      }),
      {
        hideMsgSigningModal
      }
    )(MessageSigningOverlay)
  )
);
