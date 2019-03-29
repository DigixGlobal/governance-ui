/* eslint-disable react/jsx-no-duplicate-props */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@digix/mui/lib/components/SimpleSlider';

import '@digix/mui/lib/assets/css/simpleSlider.css';

import { withStyles } from '@material-ui/core/styles';

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
  openAdvanced: false,
  gasPrice: 20,
  showAdvancedTab: true,
};

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  slider: {
    margin: '3em 0 0 0'
  },
  advancedBtn: {
    fontWeight: '300',
    border: 0,
    marginTop: '1.5em',
    padding: 0,
    fontSize: '0.8em',
    textAlign: 'center'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  card: {
    padding: '2rem',
    borderRadius: '.5rem',
    background: 'rgba(70, 78, 91, 0.2);',
    boxShadow: 'none',
    textAlign: 'center',
    [theme.breakpoints.between('xs', 'sm')]: {
      padding: '2em 1em'
    }
  },
  noPadding: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 !important'
  },
  typography: {
    margin: '1em 0 2em 0',
    color: '#000'
  },
  voteSelection: {
    background: '#E2CE98',
    borderRadius: '50px',
    textAlign: 'center',
    padding: '0 !important'
  },
  selected: {
    margin: '0',
    // color: globalVars.tertiaryColor,
    fontSize: '1.5em',
    paddingRight: '1rem'
  },
  textField: {
    // color: globalVars.tertiaryColor,
    width: 'auto',
    textAlign: 'center',
    fontSize: '1.1em',
    fontWeight: '600',
    '&': {
      '-moz-appearance': 'textfield'
    },
    '&::-webkit-inner-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  noBorder: {
    border: '0',
    '&::before': {
      borderBottom: '0'
    },
    ':hover': {
      border: 'none'
    }
  },
  minValue: {
    textAlign: 'left',
    fontSize: '1.3em',
    color: '#000',
    marginTop: '1em'
  },
  maxValue: {
    textAlign: 'right',
    fontSize: '1.3em',
    color: '#000',
    marginTop: '1em'
  }
});

class TransactionSigningOverlay extends Component {
  static propTypes = {
    data: PropTypes.object,
    hideTxSigningModal: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {
    data: undefined
  };

  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleFailure = this.handleFailure.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSetLoading = this.handleSetLoading.bind(this);
    this.handleSign = this.handleSign.bind(this);
  }

  componentWillReceiveProps = nextProps => {
    const { data } = nextProps;
    if (data) {
      const { txData } = data;
      const { gasPrice } = txData;
      this.setState({ gasPrice: gasPrice / 1e9 });
    }
  };

  setGasPrice = gasPrice => {
    // this.props.setTxFee(gasPrice);
    this.setState({
      gasPrice
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
    if (logTxn) {
      logTxn.cancel();
    }

    this.setState(defaultState);
    this.props.hideTxSigningModal({ error: 'Cancelled Signing' });
  }

  handleChange = (name, { min, max }) => event => {
    const value = parseFloat(event.target.value) || min;
    this.setState({
      [name]: value > max ? max : value
    });
  };

  hideAdvancedTab = () => {
    this.setState({ showAdvancedTab: false });
  }

  toggleAdvancedTab = (e) => {
    e.preventDefault();
    const { logTxn } = this.props.data;
    const { openAdvanced } = this.state;

    if (logTxn) {
      logTxn.toggleAdvanced(!openAdvanced);
    }

    this.setState({ openAdvanced: !openAdvanced });
  }

  renderAdvancedTab() {
    const { classes } = this.props;
    const { gasPrice, openAdvanced, showAdvancedTab } = this.state;

    if (!showAdvancedTab) {
      return null;
    }

    const MIN_GWEI = 1;
    const MAX_GWEI = 100;
    const range = {
      min: MIN_GWEI,
      max: MAX_GWEI,
    };

    const inputProps = {
      step: 1,
      ...range,
      className: classes.textField,
    };

    const classProps = {
      classes: {
        root: classes.textField,
        input: classes.noBorder,
        underline: classes.noBorder,
      },
    };

    return (
      <div>
        <Button
          className={classes.advancedBtn}
          disableRipple
          disableTouchRipple
          onClick={this.toggleAdvancedTab}
          variant="outlined"
        >
          Advanced
          <ExpandMoreIcon
            className={classnames(classes.expand, {
              [classes.expandOpen]: openAdvanced,
            })}
          />
        </Button>

        <Collapse in={openAdvanced}>
          <Card className={classes.card}>
            <Grid container>
              <Grid item xs={9} className={classes.noPadding}>
                <Typography className={classes.typography}>GAS PRICE</Typography>
              </Grid>
              <Grid item xs={3} className={classes.voteSelection}>
                <Typography className={classes.selected} variant="caption">
                  <TextField
                    inputProps={inputProps}
                    InputProps={classProps}
                    onChange={this.handleChange('gasPrice', range)}
                    value={gasPrice}
                    type="number"
                  />
                  &nbsp;GWEI
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.slider}>
                  <Slider onUpdate={this.setGasPrice} range={range} start={[gasPrice]} step={1} />
                  <Grid container>
                    <Grid item xs={6} className={classes.minValue}>{MIN_GWEI}</Grid>
                    <Grid item xs={6} className={classes.maxValue}>{MAX_GWEI}</Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Card>
        </Collapse>
      </div>
    );
  }

  render() {
    const { data } = this.props;
    if (!data) {
      return null;
    }

    const { network, address, txData, ui, logTxn } = data;
    const logToggleDetails = logTxn && logTxn.toggleDetails ? logTxn.toggleDetails : undefined;

    const { keystore } = address;
    const {
      signedTx,
      signingAction,
      loading,
      gasPrice,
    } = this.state;

    if (!txData || !keystore) {
      return null;
    }

    const { gasPrice: txGas, ...rest } = txData;
    const newTxData = {
      gasPrice: `0x${(Number(gasPrice) * 1e9).toString(16)}`,
      ...rest,
    };

    const SigningComponent = getKeystoreComponent({
      id: keystore.type.id,
      type: 'transactionSigner'
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
        <DialogTitle id="alert-dialog-title">Transaction Status</DialogTitle>
        <DialogContent>
          <Grid container spacing={16} direction="column">
            <Grid item xs={12}>
              {this.state.loading && <LinearProgress />}
            </Grid>
            <Grid item xs={12}>
              <TransactionInfo
                logToggleDetails={logToggleDetails}
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
                    logTxn={logTxn}
                  />
                  {this.renderAdvancedTab()}
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
                    onClick={e => {
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
              Cancel Signing
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
  { hideTxSigningModal }
)(withStyles(styles)(TransactionSigningOverlay));
