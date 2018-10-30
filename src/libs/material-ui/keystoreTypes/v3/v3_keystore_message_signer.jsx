import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import { withStyles } from '@material-ui/core/styles';

import ErrorMessage from '~/libs/material-ui/components/common/error_message';
import Grid from '@material-ui/core/Grid';
// import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  form: {
    width: '100%'
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

import { v3SignMsg } from './v3_sign_tx';

export class V3KestoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { password: '', error: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.setLoading('Signing...');
    this.setState({ error: false });

    setTimeout(() => {
      const throwErr = error => {
        this.props.setLoading(false);
        this.setState({ error });
      };
      try {
        const { address, txData, web3Redux } = this.props;
        const { keystore } = address;
        const { password } = this.state;

        // const buff = new Buffer(util.stripHexPrefix(util.sha3(txData)), 'hex');
        v3SignMsg({ txData, keystore, password, web3Redux })
          .then(this.props.hideMsgSigningModal)
          .catch(throwErr);
      } catch (error) {
        throwErr(error);
      }
    }, 10);
  }

  handleChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    const { error } = this.state;
    const { classes } = this.props;
    return (
      // <div className={classes.root}>
      //   <form
      //     onSubmit={this.handleSubmit}
      //     noValidate
      //     autoComplete="off"
      //     className={classes.form}
      //   >
      //     <Grid
      //       container
      //       alignItems="center"
      //       alignContent="center"
      //       spacing={24}
      //     >
      //       <Grid item xs={8} md={12}>
      //         <FormControl className={classes.textField}>
      //           <Input
      //             label="Enter Password"
      //             id="name-simple"
      //             value={this.state.password}
      //             type="password"
      //             error={error}
      //             onChange={this.handleChange}
      //             autoFocus
      //             fullWidth
      //             placeholder="Enter Password"
      //             helperText="Enter your Password to Sign Message"
      //           />
      //         </FormControl>
      //         {/* <TextField label="Name" placeholder="Address nickname" onChange={this.handleUpdatePassword} fullWidth /> */}
      //       </Grid>
      //     </Grid>
      //     {error && (
      //       <Grid
      //         container
      //         alignItems="center"
      //         alignContent="center"
      //         spacing={24}
      //       >
      //         <Grid item xs={4} md={12}>
      //           <Typography align="center" color="error">
      //             {error.message}
      //           </Typography>
      //         </Grid>
      //       </Grid>
      //     )}
      //   </form>
      // </div>
      <Form onSubmit={this.handleSubmit} error={!!error}>
        <Form.Field>
          <Input
            fluid
            size="large"
            onChange={this.handleChange}
            value={this.state.password}
            action={{
              color: 'green',
              labelPosition: 'right',
              icon: 'checkmark',
              content: 'Sign Message'
            }}
            placeholder="Enter Password"
            type="password"
          />
          {error && <ErrorMessage content={error} />}
        </Form.Field>
      </Form>
    );
  }
}

V3KestoreMessageSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(V3KestoreMessageSigner);
