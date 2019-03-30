import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import { ERC20_ABI } from '~/helpers/constants';

import web3Connect from '~/helpers/web3/connect';
import SpectrumConfig from '~/../spectrum.config';
import { connect } from 'react-redux';

import { getTokens } from '~/selectors';

import { parseBigNumber } from '~/helpers/stringUtils';

const network = SpectrumConfig.defaultNetworks[0];

class AdressBalances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: 0,
      tokenBalances: undefined
    };
  }
  componentDidMount() {
    const { address, web3Redux, tokens } = this.props;
    const { web3 } = web3Redux.networks[network];
    const tokenBalances = [];
    tokens.map(token => {
      const contract = web3.eth.contract(ERC20_ABI).at(token.address);
      return contract.balanceOf.call(address).then(balance =>
        tokenBalances.push({
          symbol: token.symbol,
          balance:
            token.symbol === 'DGDb'
              ? parseBigNumber(balance)
              : parseBigNumber(balance, 9)
        })
      );
    });
    setTimeout(() => {
      web3.eth.getBalance(address).then(balance =>
        this.setState({
          ethBalance: parseBigNumber(balance, 18),
          tokenBalances
        })
      );
    }, 100);
  }

  renderTokenBalances() {
    const { tokenBalances } = this.state;
    if (!tokenBalances || tokenBalances.length === 0)
      return <TableCell>loading...</TableCell>;
    const sorted = tokenBalances.sort((a, b) => {
      const left = a.symbol.toLowerCase();
      const right = b.symbol.toLowerCase();
      if (left < right) return -1;
      if (left > right) return 1;
      return 0;
    });
    const tokens = sorted
      .map(token => `${token.balance} ${token.symbol}`)
      .join(', ');
    return <TableCell>{tokens}</TableCell>;
  }

  render() {
    const { ethBalance } = this.state;
    return (
      <Fragment>
        <TableCell>{ethBalance}</TableCell>
        {this.renderTokenBalances()}
      </Fragment>
    );
  }
}

AdressBalances.propTypes = {
  web3Redux: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  tokens: PropTypes.array.isRequired
};

AdressBalances.defaultProps = {
  useLabel: false,
  role: undefined,
  refreshToken: false
};

export default web3Connect(
  connect(state => ({ tokens: getTokens(state) }))(AdressBalances)
);
