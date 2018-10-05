import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ScrollToTopRouter extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTopRouter);
