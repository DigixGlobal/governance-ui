import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Label } from 'semantic-ui-react';

import { resizeDataUri } from '~/helpers/fileUtils';

export default class FormImageField extends Component {
  static propTypes = {
    formChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    accept: PropTypes.string,
    multiple: PropTypes.string,
    resizeWidth: PropTypes.number,
    resizeQuality: PropTypes.number,
    maxFileSizeInKB: PropTypes.number,
  }
  static defaultProps = {
    accept: undefined,
    multiple: undefined,
    resizeWidth: undefined,
    resizeQuality: undefined,
    maxFileSizeInKB: undefined,
  }
  constructor(props) {
    super(props);
    this.state = { };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    e.target.nextSibling.click();
  }
  handleChange(e) {
    const { resizeWidth, resizeQuality, maxFileSizeInKB } = this.props;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ error: undefined });
      if (maxFileSizeInKB && file && maxFileSizeInKB < file.size) {
        this.setState({ error: 'Exceeds maximum image file size!' });
        this.props.formChange({ target: { name: this.props.name, value: undefined, file: undefined, error: true } });
      } else if (resizeWidth) {
        resizeDataUri(reader.result, resizeWidth, resizeQuality).then((value) => {
          this.props.formChange({ target: { name: this.props.name, value, file, error: false } });
        });
      } else {
        this.props.formChange({ target: { name: this.props.name, value: reader.result, file, error: false } });
      }
    };
    return reader.readAsDataURL(file);
  }
  render() {
    const { accept, multiple, resizeWidth, resizeQuality, maxFileSizeInKB, formChange, ...rest } = this.props;
    const { error } = this.state;
    return (
      <Form.Field>
        <Button
          {...rest}
          onClick={this.handleClick}
        />
        <input
          type="file"
          style={{ visibility: 'hidden', position: 'absolute' }}
          onChange={this.handleChange}
          {...{ accept, multiple }}
        />
        { error &&
          <Label basic color="red" pointing>{error}</Label>
        }
      </Form.Field>
    );
  }
}
