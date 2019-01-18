const environment = process.env.ENVIRONMENT || 'development';
const DEFAULT_NETWORKS = require(`../config/networks.${environment}.config.js`); // eslint-disable-line

module.exports = [
  {
    address: '0x4a1baf2e40fca20d0640b5a48766865da316b508',
    symbol: 'DGX',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Gold Grams',
    color: 'yellow',
  },
  {
    address: '0xfee1fb14dafb5d0dc560e525648d77b853e6d1b6',
    symbol: 'DGD',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
  {
    address: '0x1d0d85c699bc46eeff9267596a5f132b03e05029',
    symbol: 'DGDb',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
];
