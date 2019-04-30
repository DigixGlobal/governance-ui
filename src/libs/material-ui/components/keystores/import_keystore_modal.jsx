import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LockOpen from '@material-ui/icons/LockOpen';
import Lock from '@material-ui/icons/Lock';
import Dialog from '@digix/mui/lib/components/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import WalletIcon from '@digix/mui/lib/assets/icons/wallet';
import { withStyles } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';
import CircularProgress from '@material-ui/core/CircularProgress';

import ImportKeystoreForm from './import_keystore_form';
import KeystoreModal from './keystore_modal';
import KeystoreCreationForm from './keystore_creation_form';

const styles = theme => ({
  walletIcon: {
    height: '60px',
    width: '100%',
    color: theme.palette.secondary.main,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  wrapper: {
    position: 'relative',
    margin: '0 auto',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  label: {
    color: theme.palette.primary.main,
  },
  noMinHeight: {
    minHeight: 'none',
  },
  dialogContent: {
    margin: '0 auto',
  },
  loadingRoot: {
    display: 'flex',
    alignItems: 'center',
  },
  loadingWrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    top: '-20px',
    left: '-12px',
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -26,
    left: -18,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class ImportKeystore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: false,
      address: undefined,
      error: undefined,
      unlockFunc: () => null,
    };

    this.handleGotPrivateKey = this.handleGotPrivateKey.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSetError = this.handleSetError.bind(this);
    this.handleSetLoading = this.handleSetLoading.bind(this);
    this.mounted = false;
    this.TYPE = 'json';
  }

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  onKeystoreLoaded(keystore, fileContent) {
    this.setState({ keystoreLoaded: true, keystore, fileContent });
    this.props.onSuccess();
  }

  handleGotPrivateKey({ privateKey, password, name }) {
    this.setState({ privateKey, password, name });
  }

  handleReset() {
    const { onReset } = this.props;
    if (this.mounted && onReset) {
      this.setState({ privateKey: false, password: null, address: undefined }, () => {
        onReset();
      });
    }
  }

  handleSetError(error, errorHeader) {
    if (this.mounted) {
      this.setState({ error, errorHeader: error && errorHeader });
    }
  }

  handleSetLoading(loading, address, unlockFunc) {
    if (this.mounted) {
      this.setState({ loading, address, unlockFunc });
    }
  }

  handleCancel(func) {
    const { logLoadWallet } = this.props;
    logLoadWallet.cancel(this.TYPE);

    if (func) {
      func();
    }

    this.handleReset();
  }

  renderUnlocked() {
    const { privateKey, password, name } = this.state;
    const { logLoadWallet } = this.props;

    return (
      <KeystoreModal
        initiallyOpen
        size={this.props.skipConfirmation ? 'small' : undefined}
        hideMenu
        skipConfirmation={this.props.skipConfirmation}
        header="Import Unlocked Wallet"
        data={{
          type: 'v3',
          privateKey,
          password,
          confirmPassword: password,
          name,
          updateDefaultAddress: this.props.updateDefaultAddress,
        }}
        onClose={this.handleReset}
        onSuccess={this.props.onSuccess}
        submitFunc={this.props.createKeystore}
        form={KeystoreCreationForm}
        trigger={this.props.trigger}
        logLoadWallet={logLoadWallet}
      />
    );
  }

  renderImport() {
    const { classes, logLoadWallet } = this.props;
    const { address, loading, error, unlockFunc, privateKey } = this.state;
    const t = this.props.translations;
    const tCommon = this.props.commonTranslations;

    return (
      <Dialog
        trigger={this.props.trigger}
        onEnter={() => logLoadWallet.selectWalletType(this.TYPE)}
        className={classes.noMinHeight}
        contentClasses={{
          root: classes.dialogContent,
        }}
        title={
          <div className={classes.root}>
            <div className={classes.wrapper}>
              <WalletIcon className={classes.walletIcon} />
              <Typography variant="title" align="center">
                {t.title}
              </Typography>
            </div>
          </div>
        }
        renderActions={({ hide }) => (
          <div>
            {!loading && <Button onClick={() => this.handleCancel(hide)}>{tCommon.cancel}</Button>}
            {(address || error) &&
              !loading && (
                <Button
                  className={classes.button}
                  onClick={(e) => {
                    e.preventDefault();
                    unlockFunc();
                  }}
                >
                  {tCommon.unlock}
                </Button>
              )}
            {loading && (
              <div className={classes.loadingRoot}>
                <div className={classes.loadingWrapper}>
                  <Button variant="fab" color="primary" className={classes.buttonSuccess}>
                    {privateKey ? <LockOpen /> : <Lock />}
                  </Button>
                  <CircularProgress size={68} className={classes.fabProgress} />
                </div>
              </div>
            )}
          </div>
        )}
      >
        <div>
          <ImportKeystoreForm
            setError={this.handleSetError}
            setLoading={this.handleSetLoading}
            onGetPrivateKey={this.handleGotPrivateKey}
            onKeystoreLoaded={this.onKeystoreLoaded}
            translations={t}
          />
        </div>
      </Dialog>
    );
  }
  render() {
    return !this.state.privateKey ? this.renderImport() : this.renderUnlocked();
  }
}

ImportKeystore.propTypes = {
  trigger: PropTypes.node.isRequired,
  createKeystore: PropTypes.func.isRequired,
  skipConfirmation: PropTypes.bool,
  updateDefaultAddress: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  translations: PropTypes.object.isRequired,
  commonTranslations: PropTypes.object.isRequired,
  logLoadWallet: PropTypes.object,
};

ImportKeystore.defaultProps = {
  onReset: undefined,
};

ImportKeystore.defaultProps = {
  logLoadWallet: {},
  skipConfirmation: false,
  updateDefaultAddress: undefined,
};

export default withStyles(styles)(ImportKeystore);
