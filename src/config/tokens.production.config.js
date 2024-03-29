const environment = process.env.ENVIRONMENT || 'development';
const DEFAULT_NETWORKS = require(`../config/networks.${environment}.config.js`); // eslint-disable-line

module.exports = [
  {
    address: '0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf',
    symbol: 'DGX',
    default: true,
    decimals: 9,
    network: 'eth-mainnet',
    name: 'Digix Gold Grams',
    color: 'yellow',
  },

  {
    address: '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a',
    symbol: 'DGD',
    default: true,
    decimals: 9,
    network: 'eth-mainnet',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },

  {
    address: '0x54BDa709FED875224EAe569bb6817d96ef7Ed9ad',
    symbol: 'DGDb',
    default: true,
    decimals: 0,
    network: 'eth-mainnet',
    name: 'Digix Governance Badges',
    color: 'green',
  },

  {
    address: '0x0825c96db02b08dce25c67037d68b8bf83593e71',
    symbol: 'DAI',
    default: true,
    decimals: 18,
    network: 'eth-mainnet',
    name: 'DAI Stablecoin',
    color: 'yellow',
  },
];
