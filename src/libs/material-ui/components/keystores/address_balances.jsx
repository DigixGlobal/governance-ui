import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import web3Connect from '~/helpers/web3/connect';

import BaseTokenButton from './base_token';
import TokenButton from './token';

class AddressBalances extends Component {
  renderNetworkBalances() {
    const { address, web3Redux, useLabel } = this.props;
    return address.networks.map(network => (
      <BaseTokenButton key={network.id} {...{ network, address, web3Redux }} useLabel={useLabel} />
    ));
  }
  renderTokens() {
    const { address, web3Redux } = this.props;
    return address.tokens.map(token => <TokenButton key={token.id} {...{ token, address, web3Redux }} />);
  }
  render() {
    return (
      <Table.Cell style={{ minWidth: '10em' }}>
        <div>{this.renderNetworkBalances()}</div>
        <div>{this.renderTokens()}</div>
      </Table.Cell>
    );
  }
}

AddressBalances.propTypes = {
  address: PropTypes.object.isRequired,
  web3Redux: PropTypes.object.isRequired,
  useLabel: PropTypes.bool,
};

AddressBalances.defaultProps = {
  useLabel: false,
};

export default web3Connect(AddressBalances);
