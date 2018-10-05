import creationForm from './imtoken_keystore_creation_form';
import editForm from './imtoken_keystore_edit_form';
import transactionSigner from './imtoken_keystore_transaction_signer';
import messageSigner from './imtoken_keystore_message_signer';
import * as actions from './imtoken_keystore_actions';

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
