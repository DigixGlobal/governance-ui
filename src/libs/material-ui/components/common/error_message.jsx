import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

function parseContent(content) {
  if (!content) { return null; }
  if (typeof content === 'string') {
    return content;
  }
  if (content instanceof Error) {
    const errorMsg = content;
    errorMsg.name = '';
    return errorMsg.toString();
  }

  return <pre>{JSON.stringify(content, null, 2)}</pre>;
}
export default class ErrorMessage extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.func,
  };
  static defaultProps = {
    children: undefined,
    content: undefined,
  }
  render() {
    const { content, children } = this.props;
    return (
      <Message
        negative
        header="Error"
        icon="warning sign"
        content={children || parseContent(content)}
      />
    );
  }
}
