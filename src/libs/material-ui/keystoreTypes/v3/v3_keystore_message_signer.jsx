import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { v3SignMsg } from './v3_sign_tx';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  form: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    width: '100%',
    marginTop: '2rem',
  },
  caption: {
    marginTop: '2rem',
  },
});

function parseContent(content) {
  if (!content) {
    return null;
  }
  if (typeof content === 'string') {
    return content;
  }
  if (content instanceof Error) {
    const errorMsg = content;
    errorMsg.name = '';
    return errorMsg.toString();
  }

  return <pre>{JSON.stringify(content, null, 2)}</pre>;
}

export class V3KestoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { password: '', error: false, signing: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.signingButton = () => (
      <Button onClick={this.handleSubmit}>Sign Message</Button>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.setLoading(true);
    this.signMessage();
  }

  signMessage() {
    this.setState({ error: false, signing: true });

    setTimeout(() => {
      const throwErr = error => {
        this.props.setLoading(false);
        this.setState({ error, signing: false });
      };
      try {
        const { address, txData, web3Redux } = this.props;
        const { keystore } = address;
        const { password } = this.state;
        const { message } = txData;

        v3SignMsg({ txData: message, keystore, password, web3Redux })
          .then(this.props.hideMsgSigningModal)
          .catch(throwErr);
      } catch (error) {
        throwErr(error);
      }
    }, 10);
  }

  handleChange(e) {
    const hasValue = e.target.value;
    this.props.setLoading(false, hasValue ? this.signingButton : null);
    this.setState({ password: e.target.value });
  }

  render() {
    const { error, signing } = this.state;
    const { classes, txData } = this.props;
    const { caption } = txData;
    const t = txData.translations.Json;

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
            {caption && (
              <Grid item xs={8} md={12} className={classes.caption}>
                {caption}
              </Grid>
            )}
            <Grid item xs={8} md={12}>
              <FormControl className={classes.textField}>
                <Input
                  label={t.password}
                  id="name-simple"
                  value={this.state.password}
                  type="password"
                  error={!!error}
                  onChange={this.handleChange}
                  autoFocus
                  fullWidth
                  placeholder={t.password}
                  helperText={t.signInstructions}
                />
              </FormControl>
            </Grid>
            {signing && (
              <Grid item xs={8} md={12}>
                <LinearProgress />
                Signing message...
              </Grid>
            )}
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
                  {parseContent(error)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </form>
      </div>
    );
  }
}

V3KestoreMessageSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(V3KestoreMessageSigner);
