import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Dropdown, Container } from 'semantic-ui-react';
// import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

export default class MenuSystemDropdown extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  render() {
    const { children, ...rest } = this.props;
    return <Menu {...rest}>{children}</Menu>;
  }
}
