import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import TrezorContainer from '@digix/react-trezor-container';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

import TrezorAddressList from './trezor_keystore_address_list';
import TrezorKeystoreAddressItem from './trezor_keystore_address_item';
import EnhancedTableToolbar from '../../components/common/EnhancedToolbar';

const defaultPath = "m/44'/60'/0'/0";
const customPath = "m/44'/60'/3'/0";
const preSelectedPaths = ["m/44'/60'/0'/0", "m/44'/60'/1'/0", "m/44'/60'/2'/0"];

const testnetPath = "m/44'/1'/0'/0";
const testnetCustmPath = "m/44'/1'/3'/0";
const testNetPreselectedPaths = [
  "m/44'/1'/0'/0",
  "m/44'/1'/1'/0",
  "m/44'/1'/2'/0"
];

const styles = theme => ({
  radio: {
    color: '#000',
    fontSize: '1.325rem'
  },
  subtext: {
    fontSize: '.975rem',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '96%'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    margin: '2em 0',
    '& label': {
      minWidth: '200px'
    }
  }
});

export class TrezorKeystoreCreationForm extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.renderContainer = this.renderContainer.bind(this);
    this.handleUpdatePath = this.handleUpdatePath.bind(this);
    this.handleRadioUpdate = this.handleRadioUpdate.bind(this);

    const { networks } = this.props.formData;
    const defaultNetwork = networks[0];
    this.paths = preSelectedPaths; //preSelectedPaths;
    if (defaultNetwork !== 'eth-mainnet') {
      this.onTestNet = true;
      this.paths = preSelectedPaths; //testNetPreselectedPaths;
    } else {
      this.onTestNet = false;
    }

    this.state = {
      hdPath: defaultPath,
      customPath: customPath,
      error: undefined,
      useCustom: false,
      loading: false
    };
  }

  handleUpdatePath(e) {
    const text = e.target.value;
    this.setState({
      customPath: e.target.value,
      useCustom: true,
      loading: true
    });
    setTimeout(() => {
      if (!text.endsWith('/')) this.setState({ loading: false });
    }, 100);
  }

  handleRadioUpdate(e) {
    const path = e.target.value;

    if (!this.paths.includes(path)) {
      this.setState({ customPath: path, useCustom: true, loading: true });
    } else {
      this.setState({ hdPath: path, useCustom: false, loading: true });
    }

    setTimeout(() => {
      this.setState({ loading: false });
    }, 100);
  }

  handleItemChange(e) {
    const { name, value } = e;
    const { enabled } = value;
    const addresses = (this.props.formData || {}).addresses || {};
    if (!enabled && addresses) {
      delete addresses[name];
      this.props.formChange({ name: 'addresses', value: { ...addresses } });
    } else {
      const update = {
        networks:
          (addresses[name] || {}).networks || this.props.formData.networks,
        tokens: (addresses[name] || {}).tokens || this.props.formData.tokens,
        ...value
      };
      this.props.formChange({
        name: 'addresses',
        value: { ...addresses, [name]: { ...addresses[name], ...update } }
      });
    }
  }

  renderContainer({ renderItems }) {
    const { showBalances } = this.props;
    const count = Object.values(this.props.formData.addresses || {}).filter(
      a => a.enabled
    ).length;
    return (
      <Fragment>
        <EnhancedTableToolbar numSelected={count} />
        <MuiTable aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              {showBalances && (
                <Fragment>
                  <TableCell numeric>ETH</TableCell>
                  <TableCell numeric>Tokens</TableCell>
                </Fragment>
              )}
            </TableRow>
          </TableHead>
          <TableBody>{renderItems()}</TableBody>
        </MuiTable>
      </Fragment>
    );
  }
  renderError({ error }) {
    return <Typography color="error">{`Trezor Error - ${error}`}</Typography>;
  }
  renderItem(item) {
    const { showBalances } = this.props;
    if (!item.address) {
      return (
        <TableRow disabled key={item.kdPath}>
          <TableCell colSpan={100}>Getting Address Info...</TableCell>
        </TableRow>
      );
    }
    const data =
      ((this.props.formData || {}).addresses || {})[item.kdPath] || {};
    return (
      <TrezorKeystoreAddressItem
        key={item.kdPath}
        {...item}
        data={data}
        onChange={this.handleItemChange}
        showBalances={showBalances}
      />
    );
  }
  renderPreselectedPaths() {
    const { classes } = this.props;

    const options = this.paths.map((path, i) => (
      <FormControlLabel
        key={`label-${i + 1}`}
        value={path}
        control={<Radio />}
        classes={{ label: classes.radio }}
        label={
          <div>
            {path}
            <br />
            <span className={classes.subtext}>
              {i === 0 && !this.onTestNet
                ? 'Trezor (Default)'
                : i === 0
                ? 'Trezor (TestNet Default)'
                : `Account #${i + 1}`}
            </span>
          </div>
        }
      />
    ));

    return options;
  }
  render() {
    const { renderContainer, renderItem } = this;
    const {
      hdPath,
      customPath: custom,
      error,
      loading,
      useCustom
    } = this.state;

    const { classes } = this.props;
    return (
      <div>
        <Grid container alignItems="center" alignContent="center" spacing={24}>
          <Grid item xs={12} md={12}>
            <FormControl>
              <FormLabel component="legend">
                Select HD derivation Path
              </FormLabel>
              <RadioGroup
                className={classes.radioGroup}
                aria-label="ledger-hdpath"
                name="hdPath"
                value={!useCustom ? hdPath : custom}
                onChange={this.handleRadioUpdate}
              >
                {this.renderPreselectedPaths()}
                <FormControlLabel
                  value={custom}
                  control={<Radio />}
                  label={
                    <TextField
                      id="name-simple"
                      value={custom}
                      error={error}
                      autoFocus
                      onChange={this.handleUpdatePath}
                      // fullWidth
                      placeholder="Enter HD path"
                      helperText="Custom Wallet HD path"
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
            {/* <TextField label="Name" placeholder="Address nickname" onChange={this.handleUpdatePassword} fullWidth /> */}
          </Grid>
        </Grid>
        {!loading && (
          <TrezorContainer
            expect={{ kdPath: !useCustom ? hdPath : custom }}
            renderError={this.renderError}
            getAddresses={props => (
              <TrezorAddressList
                {...props}
                {...{ renderContainer, renderItem }}
              />
            )}
          />
        )}
      </div>
    );
  }
}

TrezorKeystoreCreationForm.propTypes = {
  formData: PropTypes.object.isRequired,
  formChange: PropTypes.func.isRequired,
  showBalances: PropTypes.bool
};

TrezorKeystoreCreationForm.defaultProps = {
  showBalances: false
};

export default withStyles(styles)(TrezorKeystoreCreationForm);
