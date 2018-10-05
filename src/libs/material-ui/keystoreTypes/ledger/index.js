import creationForm from './ledger_keystore_creation_form';
import editForm from './ledger_keystore_edit_form';
import transactionSigner from './ledger_keystore_transaction_signer';
import messageSigner from './ledger_keystore_message_signer';
import * as actions from './ledger_keystore_actions';

const components = {
  creationForm,
  editForm,
  transactionSigner,
  messageSigner,
};

export default {
  components,
  actions,
};
