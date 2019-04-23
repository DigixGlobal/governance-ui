import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LedgerContainer from '@digix/react-ledger-container';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

import EnhancedTableToolbar from '~/libs/material-ui/components/common/EnhancedToolbar';

import LedgerAddressList from './ledger_keystore_address_list';
import LedgerKeystoreAddressItem from './ledger_keystore_address_item';

const defaultPath = "m/44'/60'/0'";
const customPath = "m/44'/60'/0'/0";
const preSelectedPaths = ["m/44'/60'/0'", "m/44'/60'/1'", "m/44'/60'/2'"];

const styles = theme => ({
  radio: {
    color: '#000',
    fontSize: '1.325rem',
  },
  subtext: {
    fontSize: '.975rem',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '96%',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    margin: '2em 0',
    '& label': {
      minWidth: '200px',
    },
  },
});

class LedgerKeystoreCreationForm extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.renderContainer = this.renderContainer.bind(this);
    this.handleUpdatePath = this.handleUpdatePath.bind(this);
    this.handleRadioUpdate = this.handleRadioUpdate.bind(this);
    this.paths = preSelectedPaths;
    this.state = {
      hdPath: defaultPath,
      customPath,
      error: undefined,
      useCustom: false,
      loading: false,
    };
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
        networks: (addresses[name] || {}).networks || this.props.formData.networks,
        tokens: (addresses[name] || {}).tokens || this.props.formData.tokens,
        ...value,
      };
      this.props.formChange({ name: 'addresses', value: { ...addresses, [name]: { ...addresses[name], ...update } } });
    }
  }

  handleUpdatePath(e) {
    const text = e.target.value;
    this.setState({ customPath: e.target.value, useCustom: true, loading: true });
    setTimeout(() => {
      if (!text.endsWith('/')) this.setState({ loading: false });
    }, 100);
  }

  handleRadioUpdate(e) {
    const path = e.target.value;
    if (!preSelectedPaths.includes(path)) {
      this.setState({ customPath: path, useCustom: true, loading: true });
    } else {
      this.setState({ hdPath: path, useCustom: false, loading: true });
    }

    setTimeout(() => {
      this.setState({ loading: false });
    }, 100);
  }

  renderContainer({ renderItems }) {
    const { showBalances } = this.props;
    const count = Object.values(this.props.formData.addresses || {}).filter(a => a.enabled).length;
    const t = this.props.translations.chooseAddress.selectAddress;

    return (
      <div>
        <EnhancedTableToolbar numSelected={count} />
        <MuiTable aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell>{t.Address}</TableCell>
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
      </div>
    );
  }

  renderItem(item) {
    const { showBalances } = this.props;
    const t = this.props.translations.chooseAddress.selectPath;

    if (!item.address) {
      return (
        <TableRow disabled key={item.kdPath}>
          <TableCell colSpan={100}>{t.loading}</TableCell>
        </TableRow>
      );
    }
    const data = ((this.props.formData || {}).addresses || {})[item.kdPath] || {};
    return (
      <LedgerKeystoreAddressItem
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
    const t = this.props.translations.chooseAddress.selectPath;

    const options = this.paths.map((path, i) => (
      <FormControlLabel
        key={`preselected-${i}`}
        value={path}
        control={<Radio />}
        classes={{ label: classes.radio }}
        label={
          <div>
            {path}
            <br />
            <span className={classes.subtext}>
              {i === 0 && !this.onTestNet ? t.default : `${t.account} #${i + 1}`}
            </span>
          </div>
        }
      />
    ));

    return options;
  }

  render() {
    const { renderContainer, renderItem } = this;
    const { hdPath, customPath: custom, error, loading, useCustom } = this.state;
    const { classes } = this.props;
    const t = this.props.translations.chooseAddress.selectPath;

    // TODO manage 'edit' mode (without ledger)
    return (
      <div>
        <Grid container alignItems="center" alignContent="center" spacing={24}>
          <Grid item xs={12} md={12}>
            <FormControl>
              <FormLabel component="legend">{t.instructions}</FormLabel>
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
                      placeholder="Enter HD path"
                      helperText={t.custom}
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        {!loading && (
          <Typography color="error" component="div">
            <LedgerContainer
              expect={!useCustom ? { kdPath: hdPath } : custom}
              renderReady={props => (
                <LedgerAddressList kdPath={!useCustom ? hdPath : custom} {...props} {...{ renderContainer, renderItem }} />
              )}
            />
          </Typography>
        )}
      </div>
    );
  }
}

LedgerKeystoreCreationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  formChange: PropTypes.func.isRequired,
  showBalances: PropTypes.bool,
  translations: PropTypes.object.isRequired,
};

LedgerKeystoreCreationForm.defaultProps = {
  showBalances: false,
};

export default withStyles(styles)(LedgerKeystoreCreationForm);
