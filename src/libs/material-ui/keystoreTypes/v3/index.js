import creationForm from './v3_keystore_creation_form';
import editForm from './v3_keystore_edit_form';
import transactionSigner from './v3_keystore_transaction_signer';
import messageSigner from './v3_keystore_message_signer';
import * as actions from './v3_keystore_actions';

const components = {
  creationForm,
  editForm,
  transactionSigner,
  messageSigner,
  // transactionConfirm,
};

export default {
  components,
  actions,
};
