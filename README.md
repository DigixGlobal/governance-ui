# Spectrum (Digix POP, Marketplace, KYC-UI)

### Pre-requisites

* POP-UI = clone [POP-UI](https://github.com/DigixGlobal/poa-ui/tree/deploy-production) `deploy-production` branch, run `npm i`. See README for details
* Marketplace-UI = clone [Marketplace-UI](https://github.com/DigixGlobal/marketplace-ui/tree/deploy-production) `deploy-production` branch, run `npm i`. See README for details
* KYC-UI = clone [KYC-UI](https://github.com/DigixGlobal/kyc-ui/tree/deploy-production) `deploy-production` branch, run `npm i`. See README for details
* Main Net = clone [Core](https://github.com/DigixGlobal/core2) Master branch, run `npmi i`. See README for details.

### Spectrum Config

See `spectrum.config.js`. Make sure that networks are set to `eth-mainnet`.

For specific builds (including a standalone dapplet), you can customise the config file with the following options:

````
#### Main Net

``` javascript
module.exports = {
  publicPath: '/identity',
  appTitle: 'Digix Marketplace',
  menuStyle: 'hamburger',
  keystoreTypes: ['v3', 'ledger'],
  defaultNetworks: ['eth-mainnet'],
  enabledNetworks: ['eth-mainnet'],
  availableNetworks: ['eth-mainnet'],
  persistCore: false,
  // themeFolder: '@digix/sui-theme/semantic-ui',
  dappletName: 'Digix Marketplace',
  dappletIcon: 'cubes',
  dappletPath: '/kyc',
};
````

## IPFS Config

* Spectrum IPFS Config = refer to `/src/config/ipfs.production.config.js` and verify the setting

```javascript
module.exports = {
  GATEWAY: 'https://ipfs.digix.global/ipfs',
  ENDPOINT: 'https://ipfs-api.digix.global',
  CONFIG: { host: 'ipfs.digix.global', protocol: 'https' }
};
```

## Deployment Scripts

See `package.json` for scripts:

* `npm run build` Build static files to `./dist/production`
* fonts = Receipt Stitcher (using Jimp) requires bitmap fonts, these fonts need to be copied over. Need to run `cp -pr fonts ./dist/production/fonts`

## TODO:

Have the production build copied over to the main-site to automate the updates.

## License

BSD-3-clause, 2018

Distributions must include the "Powered by Spectrum" link in the Main Menu or Footer.
