import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { getAddresses, getNetworks } from '~/selectors';
import { showTxSigningModal } from '~/actions/session';
import sanitizeData from '~/helpers/txUtils';

import { toBigNumber } from '~/helpers/stringUtils';

import TransactionModal from '~/libs/material-ui/components/transactions/transaction_modal';
// import MenuSystem from '~/components/common/menu_system';

import GenericTransactionForm from './generic_transaction_form';

class GenericTransaction extends Component {
  static propTypes = {
    networks: PropTypes.array.isRequired,
    addresses: PropTypes.array.isRequired,
    showTxSigningModal: PropTypes.func.isRequired,
  };

  render() {
    return (
      <TransactionModal
        disableAdvanced
        header="Generic Transaction Signer"
        handleTransaction={({ ethValue, ...rest }, web3) => {
          const { addresses, networks } = this.props;
          if (!ethValue) {
            throw new Error('You must enter a value');
          }
          const value = toBigNumber(ethValue).shift(18);
          const address = addresses.find(a => a.address.toLowerCase() === rest.from.toLowerCase());
          const network = networks.find(({ id }) => id === rest.networkId);
          const {
            keystore: {
              type: { id: keystoreType },
            },
          } = address;

          if (keystoreType === 'metamask') {
            return this.props.showTxSigningModal({
              address,
              network,
              txData: sanitizeData({ ...rest, value }, network),
            });
          }
          return web3.eth.sendTransaction({ ...rest, value });
        }}
        renderForm={props => <GenericTransactionForm {...props} />}
        //   TODO add additional signing methods
        //   <MenuSystem
        //     equalWidths
        //     // TODO reset form data on navigate
        //     tabs={[
        //       { name: 'Generic Data', icon: 'list', component: <GenericTransactionForm {...props} /> },
        //       { name: 'Contract Method', icon: 'file text outline', component: <p>TODO</p> },
        //       { name: 'Raw Transaction', icon: 'code', component: <p>TODO</p> },
        //       { name: 'Text Message', icon: 'pencil', component: <p>TODO</p> },
        //     ]}
        //   />
        // )}
        trigger={<Button onClick={e => e.preventDefault()} primary icon="pencil" content="Sign" />}
      />
    );
  }
}

export default connect(
  s => ({ addresses: getAddresses(s), networks: getNetworks(s) }),
  { showTxSigningModal },
)(GenericTransaction);
