

const NETWORKS =
  (process.env.ENVIRONMENT === 'production' && 'eth-mainnet') ||
  (process.env.ENVIRONMENT === 'kovan' && 'eth-kovan') ||
  'testrpc';

module.exports = {
  publicPath: '/',
  appTitle: 'DAO Governance',
  menuStyle: 'hamburger',
  keystoreTypes: ['v3', 'ledger', 'metamask', 'trezor', 'imtoken'],
  defaultNetworks: [NETWORKS],
  enabledNetworks: [NETWORKS],
  availableNetworks: [NETWORKS],
  persistCore: false,
  dappletName: 'DAO Governance',
  dappletIcon: 'cubes',
  dappletPath: '/',
  uiLibrary: {
    name: 'material-ui',
    theme: undefined,
  },
};
