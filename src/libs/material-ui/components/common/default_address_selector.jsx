import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateSession } from '~/actions/session';
import { getAddresses, getDefaultAddress } from '~/selectors';

import KeystoreButtons from '~/libs/material-ui/components/keystores/keystore_buttons';

import AddressSelector from './address_selector';

class DefaultAddressSelector extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    defaultAddress: PropTypes.object,
    updateSession: PropTypes.func.isRequired,
    renderNoAccounts: PropTypes.func,
    keystoreType: PropTypes.string,
    refreshToken: PropTypes.bool,
  };
  static defaultProps = {
    renderNoAccounts: undefined,
    keystoreType: undefined,
    defaultAddress: undefined,
    refreshToken: true,
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange({ address }) {
    this.props.updateSession({ defaultAddress: address });
  }
  render() {
    const { updateSession: ignoreMe, renderNoAccounts, addresses, keystoreType, ...rest } = this.props;

    const filteredAddress = keystoreType ? addresses.filter(addr => addr.keystore.type.id === keystoreType) : addresses;

    if (!filteredAddress.length) {
      return renderNoAccounts ? (
        renderNoAccounts()
      ) : (
        <span>
          No keystores: {' '} <KeystoreButtons skipImportConfirmation />
        </span>
      );
    }
    const initialAddress = (filteredAddress.find(a => a.isDefault) || {}).address;
    return <AddressSelector {...rest} {...{ addresses: filteredAddress, initialAddress }} onChange={this.handleChange} />;
  }
}

export default connect(
  state => ({
    addresses: getAddresses(state),
    defaultAddress: getDefaultAddress(state),
    // refreshToken: state.digixMarketplace.refreshDgx,
  }),
  { updateSession },
)(DefaultAddressSelector);
