import creationForm from './trezor_keystore_creation_form';
import editForm from './trezor_keystore_edit_form';
import transactionSigner from './trezor_keystore_transaction_signer';
import messageSigner from './trezor_keystore_message_signer';
import * as actions from './trezor_keystore_actions';

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
