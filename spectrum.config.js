// import { THEME_SELECTOR } from '~/helpers/contstants';

// const digix = require('./src/themes/material-ui/digix');


const env = process.env.ENVIRONMENT === 'production' ? 'eth-mainnet' : 'eth-kovan';

module.exports = {
  publicPath: '/',
  appTitle: 'Digix Spectrum',
  menuStyle: 'hamburger',
  keystoreTypes: ['v3', 'ledger', 'metamask', 'trezor', 'imtoken'],
  defaultNetworks: [env],
  enabledNetworks: [env],
  availableNetworks: [env],
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
