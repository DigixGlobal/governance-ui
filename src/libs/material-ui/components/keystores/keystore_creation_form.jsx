import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

import { getKeystoreComponent } from '../../keystoreTypes';

import KeystoreSelector from './keystore_selector';

export default class KeystoreCreationForm extends Component {
  static propTypes = {
    hideMenu: PropTypes.bool,
    formData: PropTypes.object.isRequired,
    keystoreTypes: PropTypes.array.isRequired,
    translations: PropTypes.object.isRequired,
    commonTranslations: PropTypes.object.isRequired,
  };

  static defaultProps = {
    hideMenu: false,
  };

  render() {
    const { hideMenu, formData, keystoreTypes } = this.props;
    const KeystoreTypeCreationForm = getKeystoreComponent({ type: 'creationForm', id: formData.type });
    const keystoreType = formData.type && keystoreTypes.find(ks => ks.id === formData.type);

    return (
      <Form.Field>
        {!hideMenu && (
          <KeystoreSelector
            {...this.props}
            resetFormData={() => console.log('not implemented')}
            keystoreType={keystoreType}
            translations={this.props.translations}
          />
        )}

        {keystoreType && (
          <Form.Field>
            <KeystoreTypeCreationForm
              {...this.props}
              translations={this.props.translations}
              commonTranslations={this.props.commonTranslations}
              keystoreType={keystoreType}
            />
          </Form.Field>
        )}
      </Form.Field>
    );
  }
}
