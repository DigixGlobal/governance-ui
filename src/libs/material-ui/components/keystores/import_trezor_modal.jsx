import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Button } from 'semantic-ui-react';
import TrezorContainer from '@digix/react-trezor-container';

// import ImportKeystoreForm from './import_keystore_form';
import KeystoreModal from './keystore_modal';
import KeystoreCreationForm from './keystore_creation_form';

export default class ImportTrezor extends Component {
  static propTypes = {
    trigger: PropTypes.node,
    createKeystore: PropTypes.func.isRequired,
    skipConfirmation: PropTypes.bool,
    updateDefaultAddress: PropTypes.bool,
  };
  static defaultProps = {
    skipConfirmation: false,
    updateDefaultAddress: undefined,
    trigger: undefined,
  };
  constructor(props) {
    super(props);
    this.state = { showTrezor: false, reload: false };
    this.renderError = this.renderError.bind(this);
    this.handleTrezorClick = this.handleTrezorClick.bind(this);
  }

  handleTrezorClick() {
    this.setState({ showTrezor: true });
  }

  renderImport() {
    return (
      <Button
        className={this.props.className}
        inverted={this.props.inverted}
        onClick={this.handleTrezorClick}
        basic={this.props.basic}
        color={this.props.color}
        icon="usb"
        content="Trezor"
        size={this.props.size}
      />
    );
  }

  renderError({ error }) {
    return (
      <Label color="red" pointing style={{ position: 'absolute', top: '23px', zIndex: '1', left: '0' }}>
        {error}
      </Label>
    );
  }
  renderTrezor() {
    const { updateDefaultAddress } = this.props;
    return (
      <TrezorContainer
        renderError={this.renderError}
        onError={() => {
          this.setState({ showTrezor: false });
        }}
        getAddresses={props => (
          <KeystoreModal
            {...props}
            initiallyOpen
            submitFunc={this.props.createKeystore}
            form={KeystoreCreationForm}
            creatingKeyStore
            data={{ type: 'trezor', updateDefaultAddress }}
            header="Load Trezor Wallet"
            onClose={() => {
              this.setState({ showTrezor: false });
            }}
            hideSelector
            trigger={<div />}
          />
        )}
      />
    );
  }
  render() {
    const { showTrezor } = this.state;
    if (showTrezor) {
      return (
        <div style={{ display: 'inline', position: 'relative' }}>
          {this.renderImport()}
          {this.renderTrezor()}
        </div>
      );
    }

    return this.renderImport();
  }
}
