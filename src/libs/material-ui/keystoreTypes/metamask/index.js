import creationForm from './metamask_keystore_creation_form';
import editForm from './metamask_keystore_edit_form';
import transactionSigner from './metamask_keystore_transaction_signer';
import messageSigner from './metamask_keystore_message_signer';
import * as actions from './metamask_keystore_actions';

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
