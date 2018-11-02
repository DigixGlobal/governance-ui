module.exports = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    description: 'Official Ethereum Mainnet',
    provider: 'https://mainnet.infura.io',
    id: 'eth-mainnet',
    color: 'violet',
    chainId: 1,
    enabled: true,
    default: true,
    explorerAddressPrefix: 'https://etherscan.io/address/',
    explorerBlockPrefix: 'https://etherscan.io/block/',
    explorerTransactionPrefix: 'https://etherscan.io/tx/',
  },
  {
    name: 'Kovan',
    symbol: 'KETH',
    description: 'Kovan PoA Testnet',
    provider: 'https://kovan.infura.io/',
    id: 'eth-kovan',
    color: 'pink',
    enabled: false,
    default: false,
    chainId: 42,
    explorerAddressPrefix: 'https://kovan.etherscan.io/address/',
    explorerBlockPrefix: 'https://kovan.etherscan.io/block/',
    explorerTransactionPrefix: 'https://kovan.etherscan.io/tx/',
  },
  {
    name: 'Ropsten',
    symbol: 'RETH',
    description: 'Ropsten Testnet',
    provider: 'https://ropsten.infura.io/OtIiCFXWXH3d2eeIFQhK',
    id: 'eth-ropsten',
    color: 'pink',
    enabled: false,
    default: false,
    chainId: 42,
    explorerAddressPrefix: 'https://ropsten.etherscan.io/address/',
    explorerBlockPrefix: 'https://ropsten.etherscan.io/block/',
    explorerTransactionPrefix: 'https://ropsten.etherscan.io/tx/',
  },
  {
    name: 'Rinkeby',
    symbol: 'RETH',
    description: 'Ropsten Testnet',
    provider: 'https://rinkeby.infura.io/OtIiCFXWXH3d2eeIFQhK',
    id: 'eth-rinkeby',
    color: 'pink',
    enabled: false,
    default: false,
    chainId: 42,
    explorerAddressPrefix: 'https://rinkeby.etherscan.io/address/',
    explorerBlockPrefix: 'https://rinkeby.etherscan.io/block/',
    explorerTransactionPrefix: 'https://rinkeby.etherscan.io/tx/',
  },
  {
    name: 'Ethereum Classic',
    symbol: 'ETC',
    description: 'Old Unforked Chain',
    provider: 'https://mewapi.epool.io/',
    id: 'etc-mainnet',
    chainId: 61,
    color: 'green',
    enabled: false,
    default: false,
    explorerAddressPrefix: 'https://gastracker.io/addr/',
    explorerBlockPrefix: 'https://gastracker.io/block/',
    explorerTransactionPrefix: 'https://gastracker.io/tx/',
  },
  {
    name: 'TestRPC',
    symbol: 'ETH-testrpc',
    description: 'Local Virtual Test Chain',
    provider: 'http://localhost:8545',
    id: 'testrpc',
    color: 'blue',
    chainId: 67,
    enabled: false,
    default: false,
  },
];
