import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

import ErrorMessage from '~/libs/material-ui/components/common/error_message';

import { v3SignMsg } from './metamask_sign_tx';

export default class V3KestoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidMount() {
    const throwErr = (error) => {
      this.props.setLoading(false);
      this.setState({ error });
    };
    try {
      const {
        address: { address },
        txData,
      } = this.props;
      const { password } = this.state;

      v3SignMsg({ txData, address, password })
        .then(this.props.hideMsgSigningModal)
        .catch(throwErr);
    } catch (error) {
      throwErr(error);
    }
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Waiting MetaMask Sign Confirmation</Message.Header>
            Please confirm your signature in MetaMask. If you wish to cancel, click the "Cancel" button in MetaMask.
          </Message.Content>
        </Message>
        {error && <ErrorMessage content={error} />}
      </div>
    );
  }
}

V3KestoreMessageSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};
