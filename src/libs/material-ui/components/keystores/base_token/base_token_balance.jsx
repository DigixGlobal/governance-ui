import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import BalanceLabel from '~/libs/material-ui/components/common/balance_label';
import AddressLabel from '~/libs/material-ui/components/common/address_label';

import { parseBigNumber } from '~/helpers/stringUtils';

export default class BaseTokenBalance extends Component {
  componentDidMount() {
    const { address, web3 } = this.props;
    web3.eth.getBalance(address.address);
  }
  componentWillReceiveProps(nextProps) {
    const { address, web3 } = nextProps;
    if (address.address !== this.props.address.address) {
      web3.eth.getBalance(address.address);
    }
  }
  render() {
    const { web3, network, address, useLabel, role, refreshToken } = this.props;
    const balance = web3.eth.balance(address.address);
    const parsedBalance = parseBigNumber(balance, 18);
    return !useLabel ? (
      <Popup
        inverted
        trigger={
          <span>
            <BalanceLabel item={network} value={parsedBalance} />
          </span>
        }
        content={`${balance && balance.toNumber() / 10 ** 18} ${network && network.symbol}`}
      />
    ) : (
      <AddressLabel address={address.address} role={role} />
    );
  }
}

BaseTokenBalance.propTypes = {
  web3: PropTypes.object.isRequired,
  network: PropTypes.object.isRequired,
  address: PropTypes.object.isRequired,
  useLabel: PropTypes.bool,
  role: PropTypes.string,
  refreshToken: PropTypes.bool,
};

BaseTokenBalance.defaultProps = {
  useLabel: false,
  role: undefined,
  refreshToken: false,
};
