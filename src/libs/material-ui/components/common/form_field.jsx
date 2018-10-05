import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, TextArea } from 'semantic-ui-react';
import { isEqual } from 'underscore';

export default class FormField extends Component {
  static propTypes = {
    formChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    inlineLabel: PropTypes.string,
    inlineLabelRight: PropTypes.bool,
  };
  static defaultProps = {
    defaultValue: undefined,
    options: undefined,
    placeholder: undefined,
    label: undefined,
    inlineLabel: undefined,
    inlineLabelRight: false,
    formData: {},
  }
  componentDidMount() {
    const { formChange, defaultValue, name } = this.props;
    if (defaultValue) {
      formChange({ target: { name, value: defaultValue } });
    }
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps.name !== this.props.name) { return true; }
    if (this.props.formData[this.props.name] !== nextProps.formData[nextProps.name]) { return true; }
    if (!isEqual(nextProps.options, this.props.options)) { return true; }
    return false;
  }
  render() {
    const { formChange, formData, name, options, placeholder, label, inlineLabel, inlineLabelRight, ...rest } = this.props;
    const inlinePosition = inlineLabelRight ? 'right' : 'left';
    const value = formData[name] === undefined ? '' : formData[name];
    if (rest.type === 'select') {
      const mappedOptions = options.map(({ id, name: text }) => ({ key: id, value: id, text }));
      return (
        <Form.Select
          {...rest}
          options={mappedOptions}
          onChange={(e, data) => formChange({ target: { name: data.name, value: data.value } })}
          label={label}
          placeholder={placeholder}
          name={name}
          value={value}
        />
      );
    }
    if (rest.type === 'textarea') {
      return (
        <Form.Field>
          { label && <label htmlFor={name}>{label}</label>}
          <TextArea
            {...rest}
            placeholder={placeholder}
            onChange={e => formChange({ target: { name: e.target.name, value: e.target.value } })}
            label={inlineLabel && { basic: true, content: inlineLabel }}
            name={name}
            value={value}
          />
        </Form.Field>
      );
    }
    return (
      <Form.Field>
        { label && <label htmlFor={name}>{label}</label>}
        <Input
          {...rest}
          placeholder={placeholder}
          onChange={e => formChange({ target: { name: e.target.name, value: e.target.value } })}
          label={inlineLabel && { basic: true, content: inlineLabel }}
          labelPosition={inlinePosition}
          name={name}
          value={value}
        />
      </Form.Field>
    );
  }
}
