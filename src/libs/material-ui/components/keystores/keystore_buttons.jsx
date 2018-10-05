import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlusIcon from '@material-ui/icons/Add';
import JsonWallet from '@digix/mui/lib/assets/icons/wallet';
import LedgerWallet from '@digix/mui/lib/assets/icons/ledger';
import MetamaskWallet from '@digix/mui/lib/assets/icons/metamask';
import TrezorWallet from '@digix/mui/lib/assets/icons/trezor';

import { createKeystore, updateKeystore, deleteKeystore } from '~/actions/keystore';

import ImportKeystoreModal from './import_keystore_modal';

import KeystoreModal from './keystore_modal';
// import TrezorModal from './import_trezor_modal';
import KeystoreCreationForm from './keystore_creation_form';

import GenericTransaction from './generic_transaction';

class KeystoreButtons extends Component {
  static propTypes = {
    createKeystore: PropTypes.func.isRequired,
    inverted: PropTypes.bool,
    keystores: PropTypes.array,
    skipImportConfirmation: PropTypes.bool,
    showCreateButton: PropTypes.bool,
    showImportButton: PropTypes.bool,
    showTrezorButton: PropTypes.bool,
    showLedgerButton: PropTypes.bool,
    basic: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
    updateDefaultAddress: PropTypes.bool,
    shortContent: PropTypes.bool,
  };
  static defaultProps = {
    size: undefined,
    keystores: [],
    inverted: false,
    skipImportConfirmation: false,
    showCreateButton: true,
    showImportButton: true,
    showTrezorButton: true,
    showLedgerButton: true,
    basic: false,
    color: 'blue',
    className: undefined,
    updateDefaultAddress: undefined,
    shortContent: true,
  };
  render() {
    const {
      showCreateButton,
      showImportButton,
      showLedgerButton,
      showTrezorButton,
      size,
      updateDefaultAddress,
      shortContent,
    } = this.props;
    const classNameCreator = classNames => classNames.filter(name => name).join(' ');
    return (
      <Fragment>
        {!!this.props.keystores.length && <GenericTransaction />}
        {showCreateButton && (
          <KeystoreModal
            {...this.props}
            submitFunc={this.props.createKeystore}
            form={KeystoreCreationForm}
            creatingKeyStore
            data={{ type: 'v3' }}
            header="Create V3 Wallet"
            hideSelector
            trigger={
              <Tooltip title="Create new Wallet">
                <IconButton>
                  <PlusIcon />
                </IconButton>
              </Tooltip>
            }
          />
        )}
        {showLedgerButton && (
          <KeystoreModal
            {...this.props}
            submitFunc={this.props.createKeystore}
            form={KeystoreCreationForm}
            creatingKeyStore
            data={{ type: 'ledger', updateDefaultAddress }}
            header="Load Ledger Wallet"
            hideSelector
            trigger={
              <Tooltip title="Import from Ledger Wallet">
                <IconButton>
                  <LedgerWallet />
                </IconButton>
              </Tooltip>
            }
          />
        )}
        {showTrezorButton && (
          <KeystoreModal
            {...this.props}
            submitFunc={this.props.createKeystore}
            form={KeystoreCreationForm}
            creatingKeyStore
            data={{ type: 'trezor', updateDefaultAddress }}
            header="Load Trezor Wallet"
            hideSelector
            trigger={
              // written this way to eliminate the warning when using custom icon icon-trezor
              <Tooltip title="Import from Trezor Wallet">
                <IconButton>
                  <TrezorWallet />
                </IconButton>
              </Tooltip>
            }
          />
        )}
        {showImportButton && (
          <ImportKeystoreModal
            {...this.props}
            skipConfirmation={this.props.skipImportConfirmation}
            updateDefaultAddress={updateDefaultAddress}
            trigger={
              <Tooltip title="Import Wallet File">
                <IconButton>
                  <JsonWallet />
                </IconButton>
              </Tooltip>
            }
          />
        )}
        <KeystoreModal
          {...this.props}
          skipConfirmation={this.props.skipImportConfirmation}
          submitFunc={this.props.createKeystore}
          form={KeystoreCreationForm}
          data={{ type: 'metamask', updateDefaultAddress }}
          header="Load MetaMask Wallet"
          hideSelector
          trigger={
            // written this way to eliminate the warning when using custom icon icon-metamask
            <Tooltip title="Import from Metamask Wallet">
              <IconButton>
                <MetamaskWallet />
              </IconButton>
            </Tooltip>
          }
        />
      </Fragment>
    );
  }
}

const actions = {
  createKeystore,
  updateKeystore,
  deleteKeystore,
};

export default connect(
  null,
  actions,
)(KeystoreButtons);
