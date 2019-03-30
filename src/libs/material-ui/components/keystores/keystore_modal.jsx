import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { connect } from 'react-redux';
import { Divider } from 'semantic-ui-react';

import {
  getKeystoreTypes,
  getNetworksWithTokens,
  getDefaultNetworks,
  getKeystores
} from '~/selectors';

import config from '~/../spectrum.config';
import { getV3FileName } from '~/helpers/stringUtils';
import { downloadJSON } from '~/helpers/fileUtils';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import Dialog from '@digix/mui/lib/components/Dialog';
import Typography from '@material-ui/core/Typography';
import MetamaskIcon from '@digix/mui/lib/assets/icons/metamask';
import LedgerIcon from '@digix/mui/lib/assets/icons/ledger';
import TrezorIcon from '@digix/mui/lib/assets/icons/trezor';
import ImtokenIcon from '@digix/mui/lib/assets/icons/imtoken';

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
  }
});

const icons = {
  metamask: MetamaskIcon,
  trezor: TrezorIcon,
  ledger: LedgerIcon,
  imtoken: ImtokenIcon
};

class KeystoreModal extends Component {
  static propTypes = {
    initiallyOpen: PropTypes.bool,
    submitFunc: PropTypes.func.isRequired,
    header: PropTypes.string,
    form: PropTypes.func.isRequired,
    trigger: PropTypes.node.isRequired,
    removeFunc: PropTypes.func,
    hideMenu: PropTypes.bool,
    data: PropTypes.object,
    keystoreTypes: PropTypes.array.isRequired,
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
    networks: PropTypes.array.isRequired,
    skipConfirmation: PropTypes.bool,
    defaultNetworks: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    size: PropTypes.string,
    keystores: PropTypes.array,
    creatingKeyStore: PropTypes.bool,
    allowedKeystoreTypes: PropTypes.array,
    hideSelector: PropTypes.bool,
    showBalances: PropTypes.bool
  };

  static defaultProps = {
    size: undefined,
    initiallyOpen: undefined,
    header: undefined,
    removeFunc: undefined,
    hideMenu: undefined,
    data: undefined,
    onClose: undefined,
    onSuccess: undefined,
    skipConfirmation: false,
    keystores: undefined,
    creatingKeyStore: false,
    allowedKeystoreTypes: undefined,
    hideSelector: false,
    showBalances: false
  };
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      loading: false,
      error: false,
      createdAccount: false,
      data: { ...props.data, ...this.getDefaultData() }
    };
    this.mounted = false;
  }

  componentDidMount() {
    if (this.props.skipConfirmation) {
      // populate the name autoamtically
      this.handleSubmit({
        ...this.getDefaultData(),
        name: 'Imported Keystore'
      }).then(() => {
        this.handleClose();
      });
    }
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    const { keystores } = nextProps;
    const { keystores: oldStores = [] } = this.props;
    const { createdAccount } = this.state;

    let newStore;
    if (this.props.keystores !== nextProps.keystores && createdAccount) {
      oldStores.forEach(old => {
        if (old.type.id === 'v3' && old.addresses.length === 0) {
          newStore = keystores.reduce((store, keystore) => {
            if (keystore.id === old.id) return keystore;
          }, {});

          if (newStore) {
            this.setState({ createdAccount: false });
            this.downloadKeystore(newStore).then(({ name, content }) => {
              downloadJSON(content, name);
            });
          }
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getDefaultData() {
    const { data = {}, networks, defaultNetworks } = this.props;
    // set the default network if it's not defined (can be blank array if no networks set)
    return {
      ...data,
      networks: data.networks || defaultNetworks,
      tokens:
        data.tokens ||
        (networks || []).reduce(
          (o, network) =>
            o.concat(
              (network.tokens || [])
                .map(token => token.default && token.id)
                .filter(a => a)
            ),
          []
        )
    };
  }

  downloadKeystore(keystore) {
    return new Promise(resolve => {
      const { data, addresses } = keystore;
      const parsed = JSON.parse(data);
      const { address } = parsed;
      // update the name
      const content = JSON.stringify({ ...parsed, name: addresses[0].name });
      const name = getV3FileName(address);
      resolve({ name, content });
    });
  }

  handleSubmit(newFormData) {
    const { creatingKeyStore } = this.props;
    this.setState({ error: false });
    // it's async, lets show some loading UI
    return new Promise((resolve, reject) => {
      this.setState({ loading: true });
      setTimeout(() => {
        let func;
        // sync
        try {
          if (creatingKeyStore) {
            this.setState({ createdAccount: true });
          }
          func = this.props.submitFunc(newFormData || { ...this.state.data }, {
            ...this.state.data
          });
        } catch (error) {
          this.setState({ loading: false, error });
          return reject();
        }
        // async promise
        if (func && func.then) {
          func
            .then(() => {
              this.setState({ loading: false });
              resolve();
            })
            .catch(error => {
              this.setState({ loading: false, error });
              reject();
            });
        } else {
          // sync
          const { onClose, onSuccess } = this.props;

          if (onClose) {
            onClose();
          }

          if (onSuccess) {
            resolve(onSuccess());
          }

          resolve();
        }
      }, 10);
    });
  }
  handleRemove() {
    // TODO some validation?
    this.props.removeFunc(this.props.data.id);
  }
  handleClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.resetState();
  }
  resetState() {
    if (this.mounted) {
      this.setState({ loading: false, error: false });
    }
  }

  handleCancel(func) {
    if (func) {
      func();
    }
    this.handleClose();
  }

  enableMetamask = (e) => {
    e.preventDefault();
    if (!window.ethereum) {
      this.setState({ error: 'Cannot connect to MetaMask wallet. Make sure to login to your MetaMask wallet.' });
      return;
    }

    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable()
    .then(() => {
      this.handleSubmit();
    })
    .catch(() => {
      this.setState({ error: 'Cannot connect to MetaMask wallet. Make sure to login to your MetaMask wallet.' });
    });
  }

  render() {
    const KeystoreForm = this.props.form;
    // const handleRemove = this.props.removeFunc && this.handleRemove;
    const {
      keystoreTypes: rawKeystores,
      hideMenu,
      hideSelector,
      trezor,
      onSuccess,
      classes,
      showBalances,
      data: { type },
      skipConfirmation
    } = this.props;
    if (skipConfirmation) return null;
    const keystoreTypes = !config.keystoreTypes
      ? rawKeystores
      : rawKeystores.filter(({ id }) => {
          if (this.props.allowedKeystoreTypes) {
            return this.props.allowedKeystoreTypes.indexOf(id) > -1;
          }
          return config.keystoreTypes.indexOf(id) > -1;
        });
    const Icon = icons[type];
    return (
      <Dialog
        trigger={this.props.trigger}
        maxWidth={showBalances ? 'md' : 'sm'}
        className={classes.noMinHeight}
        title={
          <div className={classes.root}>
            <div className={classes.wrapper}>
              <Icon className={classes.walletIcon} />
              <Typography variant="title" align="center">
                {this.props.header}
              </Typography>
            </div>
          </div>
        }
        renderActions={({ hide }) => {
          const showLoadButton =
            (this.state.data.addresses &&
              Object.keys(this.state.data.addresses).length) ||
            this.state.data.type === 'v3' ||
            this.state.data.type === 'metamask' ||
            this.state.data.type === 'imtoken';

          return (
            <div>
              <Button onClick={() => this.handleCancel(hide)}>Cancel</Button>
              {showLoadButton && (
                <Button
                  color="primary"
                  className={classes.button}
                  onClick={this.enableMetamask}
                >
                  Load
                  <DoneIcon className={classes.rightIcon}>send</DoneIcon>
                </Button>
              )}
            </div>
          );
        }}
      >
        {this.props.skipConfirmation && !this.state.error ? (
          <Divider hidden />
        ) : (
          <div>
            <KeystoreForm
              // {...this.props}
              formData={this.state.data}
              formChange={({ value, name }) =>
                this.setState({ data: { ...this.state.data, [name]: value } })
              }
              {...{
                keystoreTypes,
                hideMenu,
                hideSelector,
                trezor,
                onSuccess,
                showBalances
              }}
            />
            {this.state.error && (
              <Typography color="error" variant="caption" align="center">
                {this.state.error.message}
              </Typography>
            )}
          </div>
        )}
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  keystoreTypes: getKeystoreTypes(state),
  networks: getNetworksWithTokens(state),
  defaultNetworks: getDefaultNetworks(state),
  keystores: getKeystores(state)
  // default networks
});

export default connect(mapStateToProps)(withStyles(styles)(KeystoreModal));
