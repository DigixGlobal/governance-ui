import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, Modal, Button, Dimmer, Loader } from 'semantic-ui-react';

import { getKeystoreComponent } from '~/keystoreTypes';
import { getSigningMessageModalData, getDefaultAddressAndKeyStore } from '~/selectors';
import { hideMsgSigningModal } from '~/actions/session';

const defaultState = { loading: false, autoBroadcast: true, signedTx: null };

class MessageSigningOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleFailure = this.handleFailure.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSetLoading = this.handleSetLoading.bind(this);
    this.handleSign = this.handleSign.bind(this);
  }
  handleSetLoading(loading) {
    this.setState({ loading });
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
    const { data, address } = this.props;
    if (!data) {
      return null;
    }
    const { network, txData } = data;
    const { keystore } = address;
    const { signedTx } = this.state;
    if (!txData || !keystore) {
      return null;
    }
    const SigningComponent = getKeystoreComponent({ id: keystore.type.id, type: 'messageSigner' });
    return (
      <Modal open size="small">
        <Modal.Header>Sign Transaction</Modal.Header>
        <Modal.Content>
          {this.state.loading && (
            <Dimmer active inverted>
              <Loader>{this.state.loading}</Loader>
            </Dimmer>
          )}
          {!signedTx ? (
            <div>
              <SigningComponent
                {...{ network, address, txData }}
                setLoading={this.handleSetLoading}
                hideMsgSigningModal={this.handleSign}
              />
            </div>
          ) : (
            <div>
              <p>
                <b>Signed Transaction:</b>
                <br />
                <code style={{ wordWrap: 'break-word' }}>{signedTx}</code>
              </p>
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel Signing" onClick={this.handleCancel} />
        </Modal.Actions>
      </Modal>
    );
  }
}

MessageSigningOverlay.propTypes = {
  data: PropTypes.object,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object,
};

MessageSigningOverlay.defaultProps = {
  data: undefined,
  address: undefined,
};

export default connect(state => ({ data: getSigningMessageModalData(state), address: getDefaultAddressAndKeyStore(state) }), {
  hideMsgSigningModal,
})(MessageSigningOverlay);
