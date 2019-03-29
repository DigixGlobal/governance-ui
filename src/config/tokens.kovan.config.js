import { getContract } from '../helpers/contracts';

const environment = process.env.ENVIRONMENT || 'development';
const DEFAULT_NETWORKS = require(`../config/networks.${environment}.config.js`); // eslint-disable-line
const kovanToken = getContract('dgd', DEFAULT_NETWORKS, 'eth-kovan');
const testRpcToken = getContract('dgd', DEFAULT_NETWORKS, 'testrpc');

module.exports = [
  {
    address: '0x693df01689a820ff7f907672ce7973d412c84419',
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
    address: '0xc2179bba7d9515417c56638a7b1f208f23b13d23',
    symbol: 'DGDb',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
];
