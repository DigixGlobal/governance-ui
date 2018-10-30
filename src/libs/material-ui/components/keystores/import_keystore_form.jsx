import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dropzone from 'react-dropzone';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PublishIcon from '@material-ui/icons/Publish';

import Wallet from 'ethereumjs-wallet';

import { getFileContents } from '~/helpers/fileUtils';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '96%'
  },
  dropZone: {
    width: 500,
    /* height: 200px; */
    borderWidth: 1,
    borderColor: 'rgb(102, 102, 102)',
    boxShadow: 'inset 0 0 0 1px #a9d5de, 0 0 0 0 transparent',
    // borderStyle: 'solid',
    borderRadius: 5,
    // backgroundColor: '#f8ffff',
    fontFamily: 'futura-pt,"Futura PT",Roboto,Arial,sans-serif',
    fontSize: '1.2em',
    color: theme.palette.primary.main,
    cursor: 'pointer'
  },
  padded: {
    margin: 0,
    textAlign: 'center',
    paddingTop: '1rem',
    paddingBottom: '1rem'
  },
  address: {
    fontSize: '23px'
  }
});

class ImportKeystoreForm extends Component {
  static propTypes = {
    setError: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired,
    onGetPrivateKey: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      fileContent: null,
      error: null,
      password: '',
      keystore: null,
      loading: false
    };
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleUnlock = this.handleUnlock.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }
  handleUnlock(e) {
    // e.preventDefault();
    const { fileContent, password, keystore } = this.state;
    if (!password) {
      return this.setState({ error: 'Please Enter your Password' });
    }
    const { setError, setLoading, onGetPrivateKey } = this.props;
    setError(false);
    this.setState({ error: undefined, loading: true });
    setLoading(true, keystore.address);
    return setTimeout(() => {
      try {
        const wallet = Wallet.fromV3(fileContent, password, true);
        const privateKey = wallet.getPrivateKey().toString('hex');
        return onGetPrivateKey(
          { privateKey, password, name: keystore.name },
          this.props
        );
      } catch (error) {
        this.props.setError(error);
        this.setState({ error, loading: false });
        setLoading(false, keystore.address, this.handleUnlock);
        return undefined;
      }
    }, 500);
  }
  handleUpdatePassword(e) {
    const withValue = e.target.value;
    this.setState({ password: e.target.value, error: !withValue });
  }
  handleFileDrop(file) {
    this.props.setError(false);
    getFileContents(file)
      .then(fileContent => {
        try {
          const keystore = JSON.parse(fileContent);
          if (keystore.version !== 3) {
            throw new Error('Keystore type not supported');
          }
          this.setState({ fileContent, keystore });
          this.props.setLoading(false, keystore.address, this.handleUnlock);
        } catch (e) {
          throw new Error('Keystore type not supported');
        }
      })
      .catch(error => this.props.setError(error));
  }
  handleKeydown = event => {
    if (event.keyCode === 13) {
      this.handleUnlock();
    }
  };

  renderDropzone() {
    return (
      <Dropzone
        className={this.props.classes.dropZone}
        onDrop={files => this.handleFileDrop(files[0])}
      >
        <div className={this.props.classes.padded}>
          <div className="center aligned column">
            <PublishIcon />
            <Typography variant="body1" color="primary">
              Click or drag and drop here to load your wallet file.
            </Typography>
          </div>
        </div>
      </Dropzone>
    );
  }
  renderUnlock() {
    const { keystore, password, error } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {/* <form onSubmit={this.handleUnlock}> */}
        <Grid container alignItems="center" alignContent="center" spacing={24}>
          <Grid item xs={12} md={12}>
            <Typography
              align="center"
              variant="title"
              className={classes.address}
            >
              0x
              {keystore.address}
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" alignContent="center" spacing={24}>
          <Grid item xs={12} md={12}>
            <FormControl className={classes.formControl}>
              <TextField
                label="Enter Password"
                id="name-simple"
                value={password}
                type="password"
                error={error}
                autoFocus
                onChange={this.handleUpdatePassword}
                // fullWidth
                placeholder="Enter Password"
                helperText="Enter your Password to Unlock your Wallet"
                inputProps={{
                  onKeyDown: event => this.handleKeydown(event)
                }}
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
        {/* </form> */}
      </div>
    );
  }
  render() {
    return !this.state.fileContent
      ? this.renderDropzone()
      : this.renderUnlock();
  }
}

export default withStyles(styles)(ImportKeystoreForm);
