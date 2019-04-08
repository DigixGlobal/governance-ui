import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

export default class MetamaskKeystoreCreationForm extends Component {
  static propTypes = {
    formChange: PropTypes.func.isRequired,
    translations: PropTypes.object.isRequired,
  };

  render() {
    const { formChange } = this.props;
    const t = this.props.translations.Name;
    return (
      <div>
        <TextField
          label={t.name}
          placeholder={t.addressNickname}
          onChange={({ target: { value } }) => {
            formChange({ name: 'name', value });
          }}
          fullWidth
        />
      </div>
    );
  }
}
