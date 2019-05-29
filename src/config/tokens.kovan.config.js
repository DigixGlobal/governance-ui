import { getContract } from '../helpers/contracts';

const environment = process.env.ENVIRONMENT || 'development';
const DEFAULT_NETWORKS = require(`../config/networks.${environment}.config.js`); // eslint-disable-line
const kovanToken = getContract('dgd', DEFAULT_NETWORKS, 'eth-kovan');
const testRpcToken = getContract('dgd', DEFAULT_NETWORKS, 'testrpc');

module.exports = [
  {
    address: '0xcb010731f19680a4559445d7d8694d729e95d6f0',
    symbol: 'DGX',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Gold Grams',
    color: 'yellow',
  },
  {
    address: kovanToken.address,
    symbol: 'DGD',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
  {
    address: '0x1ed8364eaabf655882dca0c01b19519f8acaed0b',
    symbol: 'DGDb',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
];
