import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu, Container } from 'semantic-ui-react';

import { withRouter } from 'react-router-dom';

import { kycConnect } from '@digix/kyc-system-ui/spectrum/auth';

import SpectrumConfig from '../../../spectrum.config';

import digixLogo from '../../assets/digix_logo_minimal_blue_mini.png';
import ActiveLink from '../common/active_link';
import { ERC20_ABI } from '../../helpers/constants';
import { getKeystores, getDefaultAddress, getTokens } from '../../selectors';
import web3Connect from '../../helpers/web3/connect';
import { parseBigNumber } from '../../helpers/stringUtils';
import { getRoleName } from '../../helpers/roleUtils';
import BaseTokenButton from '../../components/keystores/base_token';
import TokenButton from '../../components/keystores/token';
import AddressLabel from '../../components/common/address_label';

const environment = process.env.ENVIRONMENT || 'development';
const production = process.env.ENVIRONMENT === 'production';
const DEFAULT_NETWORKS = require(`../../config/networks.${environment}.config.js`); // eslint-disable-line

const network = SpectrumConfig.defaultNetworks[0];
const locations = [
  {
    key: 'provenance',
    name: 'Proof of Provenance',
    url: '/app/#/provenance',
    description: 'Beta Release: DO NOT USE REAL ASSETS',
  },
  {
    key: 'marketplace',
    name: 'Marketplace',
    url: '/app/#/marketplace',
    description: 'Beta Release: DO NOT USE REAL ASSETS',
  },
  {
    key: 'identity',
    name: 'KYC Early Access',
    url: '/app/#/identity',
    description: 'Beta Release: DO NOT USE REAL ASSETS',
  },
  {
    key: 'wallet',
    name: 'Wallet',
    url: '/app/#/wallet',
    description: 'Beta Release: DO NOT USE REAL ASSETS',
  },
  {
    key: 'kyc',
    name: 'Identity',
    url: '/app/#/identity',
    description: 'Beta Release: DO NOT USE REAL ASSETS',
  },
];

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { userRole: undefined, tokens: undefined };
  }

  componentWillMount() {
    const { defaultAddress } = this.props; /* this.getDefaultKeyStore(); */
    if (defaultAddress) {
      this.getUserRoleId(defaultAddress.address).then((role) => {
        const roleInfo = getRoleName(role);
        this.setState({ defaultAddress, userRole: roleInfo });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultAddress && nextProps.defaultAddress !== this.props.defaultAddress) {
      const { defaultAddress } = nextProps;
      this.getUserRoleId(defaultAddress.address).then((role) => {
        const roleInfo = getRoleName(role);
        this.setState({ userRole: roleInfo });
      });
    }
  }

  getDefaultKeyStore() {
    const { keystores } = this.props;
    let defaultAddress;
    if (keystores[0] && keystores[0].addresses) {
      const addresses = keystores.map(store => store.addresses).find(x => x[0].isDefault);
      if (addresses) defaultAddress = addresses[0];
    }
    return defaultAddress;
  }

  getContract({ abi, address }) {
    return this.props.web3Redux
      .web3(network)
      .eth.contract(abi)
      .at(address);
  }

  render() {
    const {
      kycSystem: {
        userInfo,
        userInfo: { email, admin, kyc_approver },
      },
      location: { pathname },
      web3Redux,
      web3Redux: { web3 },
      refreshToken,
      defaultAddress,
      tokens,
    } = this.props;
    const path = pathname.split('/')[1] || 'marketplace';
    const dappInfo = locations.find(x => x.key === path.toLowerCase());

    const { userRole } = this.state;
    const token = tokens ? tokens.find(x => x.symbol === 'DGX') : undefined;
    // const tokenNetwork = addressTokens ? addressTokens.networks[0] : undefined;
    const contract = token
      ? web3(network)
          .eth.contract(ERC20_ABI)
          .at(token.address)
      : undefined;

    return (
      <Menu borderless>
        <Container fluid style={{ padding: '0 4rem' }}>
          <Menu.Item header as="a" href="/">
            <img src={digixLogo} alt="Digix Global" />
          </Menu.Item>
          <Menu.Item
            as="a"
            href={dappInfo.url}
            header
            content={dappInfo.name}
            style={{ textTransform: 'uppercase', fontWeight: 'normal', letterSpacing: '0.15em' }}
          />
          {!production && (
            <Menu.Item content={dappInfo.description} style={{ fontWeight: 'normal', background: 'red', color: 'white' }} />
          )}
          <Menu.Menu position="right">
            {!email && <Menu.Item as={ActiveLink} to="/marketplace/register" content="Sign-Up" />}
            <Menu.Item as={ActiveLink} to="/marketplace/dgx" content="Purchase" />
            <Menu.Item as={ActiveLink} to="/provenance" content="Assets Explorer" />
            {(admin || kyc_approver) && <Menu.Item as={ActiveLink} to="/identity" content="Identity" />}
            <Menu.Item as={ActiveLink} to="/wallet" content="Wallet" />
            <Menu.Item header as="label">
              &nbsp;
            </Menu.Item>
            {email && <AccountMenu {...{ userInfo }} />}
            {defaultAddress && (
              <Menu.Item>
                <span>
                  <AddressLabel
                    address={defaultAddress.address}
                    role={userRole ? userRole.name.toUpperCase() : undefined}
                    notAsLink
                  />
                  <BaseTokenButton {...{ web3Redux, refreshToken }} address={defaultAddress} network={token.network} />
                  {token && contract && <TokenButton {...{ token, web3Redux, refreshToken }} address={defaultAddress} />}
                </span>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    keystores: getKeystores(state),
    refreshToken: state.digixMarketplace.refreshDgx,
    defaultAddress: getDefaultAddress(state),
    tokens: getTokens(state),
  };
}

MainMenu.propTypes = {
  web3Redux: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  keystores: PropTypes.array.isRequired,
  kycSystem: PropTypes.object.isRequired,
  refreshToken: PropTypes.bool.isRequired,
  defaultAddress: PropTypes.object,
  tokens: PropTypes.array.isRequired,
};

MainMenu.defaultProps = {
  defaultAddress: undefined,
};

export default withRouter(
  kycConnect(
    web3Connect(
      connect(
        () => mapStateToProps,
        {},
      )(MainMenu),
    ),
  ),
);
