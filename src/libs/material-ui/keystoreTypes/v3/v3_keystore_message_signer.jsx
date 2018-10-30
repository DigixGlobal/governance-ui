import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
// import util from 'ethereumjs-util';

import ErrorMessage from '~/libs/material-ui/components/common/error_message';

import { v3SignMsg } from './v3_sign_tx';

export default class V3KestoreMessageSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { password: '', error: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.setLoading('Signing...');
    this.setState({ error: false });

    setTimeout(() => {
      const throwErr = error => {
        this.props.setLoading(false);
        this.setState({ error });
      };
      try {
        const { address, txData, web3Redux } = this.props;
        const { keystore } = address;
        const { password } = this.state;

        // const buff = new Buffer(util.stripHexPrefix(util.sha3(txData)), 'hex');
        v3SignMsg({ txData, keystore, password, web3Redux })
          .then(this.props.hideMsgSigningModal)
          .catch(throwErr);
      } catch (error) {
        throwErr(error);
      }
    }, 10);
  }

  handleChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    const { error } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} error={!!error}>
        <Form.Field>
          <Input
            fluid
            size="large"
            onChange={this.handleChange}
            value={this.state.password}
            action={{
              color: 'green',
              labelPosition: 'right',
              icon: 'checkmark',
              content: 'Sign Message'
            }}
            placeholder="Enter Password"
            type="password"
          />
          {error && <ErrorMessage content={error} />}
        </Form.Field>
      </Form>
    );
  }
}

V3KestoreMessageSigner.propTypes = {
  setLoading: PropTypes.func.isRequired,
  hideMsgSigningModal: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  txData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired
};
