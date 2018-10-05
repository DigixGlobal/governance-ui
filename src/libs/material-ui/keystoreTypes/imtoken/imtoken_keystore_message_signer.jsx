import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

import ErrorMessage from '~/libs/material-ui/components/common/error_message';

import { signMsg } from './imtoken_sign_tx';

export default class ImTokenKestoreMessageSigner extends Component {
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

      signMsg({ txData, address, password })
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
            <Message.Header>Waiting imToken Sign Confirmation</Message.Header>
            Please confirm your signature in imToken. If you wish to cancel, click the "Cancel" button in imToken.
          </Message.Content>
        </Message>
        {error && <ErrorMessage content={error} />}
      </div>
    );
  }
}

ImTokenKestoreMessageSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};
