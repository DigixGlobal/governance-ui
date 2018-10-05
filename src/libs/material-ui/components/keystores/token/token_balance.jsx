import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import BalanceLabel from '~/libs/material-ui/components/common/balance_label';

import { parseBigNumber } from '~/helpers/stringUtils';

export default class TokenBalance extends Component {
  componentDidMount() {
    const { contract, address } = this.props;
    contract.balanceOf.call(address.address);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshToken !== this.props.refreshToken) {
      const { contract, address } = this.props;
      contract.balanceOf.call(address.address);
    }
  }
  render() {
    const { contract, token, address } = this.props;
    const balance = contract.balanceOf(address.address);
    const parsedBalance = parseBigNumber(balance, token.decimals);
    const unRoundedBalance = ((balance && balance.toNumber()) || 0) / (10 ** (token && token.decimals) || 0);
    return (
      <Popup
        inverted
        trigger={
          <span>
            <BalanceLabel item={token} value={parsedBalance || 0} />
          </span>
        }
        content={`${unRoundedBalance} ${token && token.symbol}`}
      />
    );
  }
}

TokenBalance.propTypes = {
  contract: PropTypes.object.isRequired,
  token: PropTypes.object.isRequired,
  address: PropTypes.object.isRequired,
  refreshToken: PropTypes.bool,
};

TokenBalance.defaultProps = {
  refreshToken: false,
};
