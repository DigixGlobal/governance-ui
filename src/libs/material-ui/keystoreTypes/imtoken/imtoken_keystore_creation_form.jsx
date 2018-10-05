import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

export default class ImtokenKeystoreCreationForm extends Component {
  static propTypes = {
    formData: PropTypes.object.isRequired,
    formChange: PropTypes.func.isRequired,
  };
  render() {
    const { formChange, formData } = this.props;
    return (
      <div>
        <TextField
          label="Name"
          placeholder="Address nickname"
          onChange={({ target: { value } }) => {
            formChange({ name: 'name', value });
          }}
          fullWidth
        />
        {/* <FormField placeholder="Nickname for the Address" label="Name" name="name" {...{ formChange, formData }} /> */}
        {/* <Form.Group widths="equal">
          <FormField
            placeholder="Enter Password"
            type="password"
            label="Password"
            name="password"
            {...{ formChange, formData }}
          />
          <FormField
            placeholder="Confirm Password"
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            {...{ formChange, formData }}
          />
        </Form.Group> */}
        {/* <Advanced>
          <NetworkTokensSelector {...{ formChange, formData }} />
          <p>Optionally override the default crypto and encryption values (do not prefix hex strings):</p>
          <Form.Group widths="equal">
            <EntropyField label="Private Key (hex)" name="privateKey" {...{ formChange, formData }} />
            <EntropyField bits={128} label="Initialization Vector (hex)" name="iv" {...{ formChange, formData }} />
            <EntropyField label="Salt (hex)" name="salt" {...{ formChange, formData }} />
            <FormField placeholder="1024" type="number" label="Iteration Count" name="n" {...{ formChange, formData }} />
          </Form.Group>
        </Advanced> */}
      </div>
    );
  }
}
