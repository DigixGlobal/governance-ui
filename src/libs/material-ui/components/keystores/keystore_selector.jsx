import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

import DropdownSelector from '../common/dropdown_selector';

import KeystoreTypeMessage from './keystore_type_message';
import KeystoreMenu from './keystore_menu';

export default class KeystoreSelector extends Component {
  static propTypes = {
    formChange: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    resetFormData: PropTypes.func.isRequired,
    keystoreType: PropTypes.object,
    keystoreTypes: PropTypes.array.isRequired,
    hideSelector: PropTypes.bool,
    translations: PropTypes.object.isRequired,
  };

  static defaultProps = {
    keystoreType: undefined,
    hideSelector: false,
  };

  renderDropdown() {
    const { formChange, formData, resetFormData, keystoreType, keystoreTypes, hideSelector } = this.props;
    return (
      <Form.Field>
        {!hideSelector && (
          <DropdownSelector
            defaultText="Select Keystore Type"
            name="type"
            items={keystoreTypes}
            button
            {...{ formChange, formData, resetFormData }}
          />
        )}

        <KeystoreTypeMessage keystoreType={keystoreType} translations={this.props.translations} />
      </Form.Field>
    );
  }
  render() {
    const { keystoreType } = this.props;
    return keystoreType ? this.renderDropdown() : <KeystoreMenu {...this.props} />;
  }
}
