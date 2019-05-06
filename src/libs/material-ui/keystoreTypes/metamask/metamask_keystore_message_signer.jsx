import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

import ErrorMessage from '~/libs/material-ui/components/common/error_message';
import MetamaskSignMsg from './metamask_sign_tx';

export default class MetamaskKeystoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidMount() {
    const log = this.props.txData.logSignMessage.txn;
    const throwErr = (error) => {
      log.completeTransaction(false, error);
      this.props.setLoading(false);
      this.setState({ error });
    };

    try {
      const {
        address: { address },
        txData,
      } = this.props;
      const { password } = this.state;

      MetamaskSignMsg({ txData, address, password })
        .then((data) => {
          log.completeTransaction(true);
          this.props.hideMsgSigningModal(data);
        })
        .catch(throwErr);
    } catch (error) {
      throwErr(error);
    }
  }

  render() {
    const { error } = this.state;
    const t = this.props.txData.translations.Metamask.Name.proofOfControl;

    return (
      <div>
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>{t.description}</Message.Header>
            <p>{t.instructions}</p>
          </Message.Content>
        </Message>
        {error && <ErrorMessage content={error} />}
      </div>
    );
  }
}

MetamaskKeystoreMessageSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};
