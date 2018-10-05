import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import AddressBalances from './address_balances';

const styles = theme => ({
  label: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
  },
  kdPath: {
    fontSize: '1rem',
    width: '8em',
  },
});

class TrezorKeystoreAddressItem extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    kdPath: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    showAddressInput: PropTypes.bool,
    showBalances: PropTypes.bool,
  };
  static defaultProps = {
    showAddressInput: false,
    showBalances: false,
  };
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleToggle() {
    const value = { enabled: !this.props.data.enabled };
    // set the address & kdPath if it's not set before
    if (!this.props.data.address) {
      value.address = this.props.address;
      value.kdPath = this.props.kdPath;
      value.name = value.kdPath; // set default name to the kdpath
    }
    this.props.onChange({ name: this.props.kdPath, value });
  }
  handleChange(e) {
    this.props.onChange({ name: this.props.kdPath, value: { [e.target.name]: e.target.value } });
  }
  render() {
    const { address, data, classes, showAddressInput, showBalances } = this.props;
    return (
      <TableRow>
        <TableCell>
          <FormGroup row>
            <FormControlLabel
              classes={{ label: classes.label }}
              control={<Checkbox checked={data.enabled} onChange={this.handleToggle} value={address} />}
              label={<Fragment>{address}</Fragment>}
            />
            {showAddressInput &&
              data.enabled && (
                <Input
                  placeholder="Enter Name"
                  className={classes.kdPath}
                  name="name"
                  onChange={this.handleChange}
                  value={data.name || ''}
                />
              )}
          </FormGroup>
        </TableCell>
        {showBalances && <AddressBalances address={address} />}
      </TableRow>
    );
  }
}
export default withStyles(styles)(TrezorKeystoreAddressItem);
