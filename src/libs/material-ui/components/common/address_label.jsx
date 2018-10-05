import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

export default class AddressLabel extends Component {
  render() {
    const { address, role, notAsLink } = this.props;
    return (
      <Label as={notAsLink ? undefined : 'a'} className="padded" color="blue">
        {address.substr(2, 4)}...{address.substr(-4)}
        <Label.Detail>{role}</Label.Detail>
      </Label>
    );
  }
}

AddressLabel.propTypes = {
  address: PropTypes.string.isRequired,
  role: PropTypes.string,
  notAsLink: PropTypes.bool,
};

AddressLabel.defaultProps = {
  role: undefined,
  notAsLink: false,
};
