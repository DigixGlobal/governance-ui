const environment = process.env.ENVIRONMENT || 'development';
const DEFAULT_NETWORKS = require(`../config/networks.${environment}.config.js`); // eslint-disable-line

module.exports = [
  {
    address: '0x987363d88854f9e4403f3a680d03afe388f1b787',
    symbol: 'DGX',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Gold Grams',
    color: 'yellow',
  },
  {
    address: '0x6d7c12789e70b1edef80a8d01faa7b1c20587ccb',
    symbol: 'DGD',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
  {
    address: '0x1f19249eca1759dc8120398a6ba5b8edd8e5ddd0',
    symbol: 'DGDb',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
];
