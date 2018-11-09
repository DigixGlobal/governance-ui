import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Form, Input } from 'semantic-ui-react';

import Input from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import signTx from './v3_sign_tx';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  form: {
    width: '98%'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    width: '100%',
    marginTop: '2rem'
  }
});

class V3KestoreTransactionSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { password: '', error: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);

    this.signingButton = () => (
      <Button onClick={this.triggerSubmit}>Sign Transaction</Button>
    );
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.triggerSubmit();
    }
  }

  handleChange(e) {
    const hasValue = e.target.value;
    this.props.setLoading(false, hasValue ? this.signingButton : null);
    this.setState({ password: e.target.value, error: !hasValue });
  }

  handleHideError() {
    this.setState({ error: false });
  }

  triggerSubmit() {
    this.props.setLoading('Signing...');
    this.setState({ error: false });

    setTimeout(() => {
      const throwErr = error => {
        this.props.setLoading(false, this.signingButton);
        this.setState({ error });
      };
      try {
        const { address, txData } = this.props;
        const { keystore } = address;
        const { password } = this.state;
        signTx({ txData, keystore, password })
          .then(this.props.hideTxSigningModal)
          .catch(throwErr);
      } catch (error) {
        throwErr(error);
      }
    }, 10);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.triggerSubmit();
  }

  render() {
    const { error, password } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <form
          onSubmit={this.handleSubmit}
          noValidate
          autoComplete="off"
          className={classes.form}
        >
          <Grid
            container
            alignItems="center"
            alignContent="center"
            spacing={24}
          >
            <Grid item xs={8} md={12}>
              <FormControl className={classes.textField}>
                <Input
                  label="Enter Password"
                  id="name-simple"
                  value={password}
                  type="password"
                  error={error}
                  onChange={this.handleChange}
                  autoFocus
                  fullWidth
                  placeholder="Enter Password"
                  helperText="Enter your Password to Sign your Transaction"
                />
              </FormControl>
              {/* <TextField label="Name" placeholder="Address nickname" onChange={this.handleUpdatePassword} fullWidth /> */}
            </Grid>
          </Grid>
          {error && (
            <Grid
              container
              alignItems="center"
              alignContent="center"
              spacing={24}
            >
              <Grid item xs={4} md={12}>
                <Typography align="center" color="error">
                  {error.message}
                </Typography>
              </Grid>
            </Grid>
          )}
        </form>
      </div>
    );
  }
}

V3KestoreTransactionSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideTxSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(V3KestoreTransactionSigner);
