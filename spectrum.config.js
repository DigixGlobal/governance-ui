// import { THEME_SELECTOR } from '~/helpers/contstants';

// const digix = require('./src/themes/material-ui/digix');

const NETWORKS =
  (process.env.ENVIRONMENT === 'production' && 'eth-kovan') ||
  (process.env.ENVIRONMENT === 'kovan' && 'eth-kovan') ||
  'testrpc';

// const env = process.env.ENVIRONMENT === 'production' ? 'eth-mainnet' : 'eth-kovan';

module.exports = {
  publicPath: '/',
  appTitle: 'DAO Governance',
  menuStyle: 'hamburger',
  keystoreTypes: ['v3', 'ledger', 'metamask', 'trezor', 'imtoken'],
  defaultNetworks: [NETWORKS],
  enabledNetworks: [NETWORKS],
  availableNetworks: [NETWORKS],
  persistCore: false,
  // themeFolder: '@digix/sui-theme/semantic-ui',
  dappletName: 'Digix Carbon Voting',
  dappletIcon: 'cubes',
  dappletPath: '/',
  uiLibrary: {
    name: 'material-ui',
    theme: undefined,
  },
};
