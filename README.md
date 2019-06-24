# License

Note: This license has also been called the "New BSD License" or "Modified BSD License". See also the 2-clause BSD License.
Copyright 2019 Digix Global Pte. Ltd.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Copyright DIGIXGLOBAL PRIVATE LIMITED
The code in this repository is licensed under the [BSD-3 Clause](https://opensource.org/licenses/BSD-3-Clause)

# Introduction

## Spectrum (Digix DAO)

This Project is based on [Spectrum](https://github.com/DigixGlobal/spectrum/tree/develop) to support interaction with Ethereum. This project has been customized to specifically support the requirements for the Governance Project to perform Ethereum Transactions such as Loading a Wallet, Signing Personal Message and Signing Transactions.

The [governance-ui-components](https://github.com/DigixGlobal/governance-ui-components/tree/develop) contains the components that serves the Governance UI. Changes that require UI changes are mostly done on that Project.

-[ 🤝 Contribution Guide](https://github.com/DigixGlobal/governance-ui/wiki/Contribution-Guide)

### Features

Supported Wallets

- JSON (V3) wallet
- Metamask
- Ledger
- Trezor

Supported Ethereum Transactions

- Signing Personal Message
- Signing Transactions

### Pre-requisites

_Note: Clone `governance-ui-components` on the same folder as this project_

- dao-contracts = clone [dao-contracts](https://github.com/DigixGlobal/dao-contracts). See project README for details
- dao-server = clone [dao-server](https://github.com/DigixGlobal/dao-server). See project README for details
- info-server = clone [info-server](https://github.com/DigixGlobal/info-servern). See project README for details
- governance-ui-components = clone [governance-ui-components](https://github.com/DigixGlobal/governance-ui-components). See project README for details.

Clone this repo

```
git clone https://github.com/DigixGlobal/governance-ui.git
git checkout develop

```

Ensure you have the following installed:

```
node 8.x
npm 5.x

```

Run `npm i`

### Developing

Please make sure you have all dependencies configured as described on the Pre-requisites section

Local development

- Run DAO-contracts
- Run DAO-server
- Run info-server
- Follow setup instructions below

### Configuration

Please see [spectrum.config.js](https://github.com/DigixGlobal/governance-ui/blob/develop/spectrum.config.js) for configuration details. By default, it is pointing to `testrpc` network. Should you wish to target a different environment, kindly set your target as needed.

`src/config` - contains configuration files for IPFS url, supported tokens, networks and keystores per target environment.

### Running the app

- Run `npm start` for local development
