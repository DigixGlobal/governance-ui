
import { getContract } from '../helpers/contracts';

const environment = process.env.ENVIRONMENT || 'development';
const DEFAULT_NETWORKS = require(`../config/networks.${environment}.config.js`); // eslint-disable-line
const kovanToken = getContract('dgd', DEFAULT_NETWORKS, 'eth-kovan');
const testRpcToken = getContract('dgd', DEFAULT_NETWORKS, 'testrpc');



module.exports = [
  {
    address: '0x0825c96db02b08dce25c67037d68b8bf83593e71',
    symbol: 'DGX',
    default: true,
    decimals: 9,
    network: 'eth-mainnet',
    name: 'Digix Gold Grams',
    color: 'yellow',
  },
  {
    address: '0x0825c96db02b08dce25c67037d68b8bf83593e71',
    symbol: 'DGD',
    default: true,
    decimals: 9,
    network: 'eth-mainnet',
    name: 'Digix Governance Tokens',
    color: 'blue',
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
    address: '0x0aab3aa38399040791600ad395c3fab82bf5ed0b',
    symbol: 'DGDb',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
  {
    address: '0xaed4fc9663420ec8a6c892065bba49c935581dce',
    symbol: 'DGX',
    default: true,
    decimals: 9,
    network: 'eth-kovan',
    name: 'Digix Gold Grams',
    color: 'yellow',
  },
  {
    address: testRpcToken.address,
    symbol: 'DGD',
    default: true,
    decimals: 9,
    network: 'testrpc',
    name: 'Digix Governance Tokens',
    color: 'blue',
  },
];
