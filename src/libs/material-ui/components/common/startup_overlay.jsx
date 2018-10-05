import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
// import EZModal from '@digix/sui-react-ezmodal';
import { withStyles } from '@material-ui/core/styles';
// import { Label, Button, Message, Icon } from 'semantic-ui-react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import Icon from '@material-ui/core/Icon';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class StartupOverlay extends Component {
  static propTypes = {
    initiallyOpen: PropTypes.bool,
    trigger: PropTypes.node.isRequired,
    title: PropTypes.string,
    content: PropTypes.node,
    source: PropTypes.string,
    hash: PropTypes.string,
  };
  static defaultProps = {
    initiallyOpen: true,
    trigger: undefined,
    title: undefined,
    content: undefined,
    source: undefined,
    hash: undefined,
  };
  constructor(props) {
    super(props);
    this.state = { hidden: !this.props.initiallyOpen, disableButton: true };
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleTriggerClick() {
    this.setState({ hidden: false });
  }
  handleClose() {
    const { source, hash } = this.props;
    if (hash && source) {
      localStorage.setItem(source, hash);
    }
    this.setState({ hidden: true });
  }
  handleScroll() {
    const element = document.getElementById('overlayDiv');
    if (element.scrollTop + 1000 >= element.scrollHeight) {
      this.setState({ disableButton: false });
    }
  }
  render() {
    const { trigger, content, title, classes, closeButtonText } = this.props;
    const { disableButton, hidden } = this.state;
    const wrappedTrigger = trigger && cloneElement(trigger, { onClick: this.handleTriggerClick });
    // console.log(content.toString());
    if (this.state.hidden) {
      return wrappedTrigger || null;
    }
    return (
      <div>
        <Modal
          open={!hidden}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          onClose={this.handleClose}
        >
          {
            <div style={getModalStyle()} className={classes.paper}>
              <Typography variant="title" color="error" id="modal-title">
                {title || (
                  <div>
                    <Icon>warning</Icon> Important Big Red Warning Message (Please Read)
                  </div>
                )}
              </Typography>
              {content ? (
                content()
              ) : (
                <Typography>
                  <ul>
                    <li>Tested on Chrome OSX & Android</li>
                    <li>TODO!</li>
                  </ul>
                  <p>
                    * For more infromation, including alternative redemption methods, please check the{' '}
                    <a href="https://github.com/digixglobal/spectrum" rel="noopener noreferrer" target="_blank">
                      Github Repo
                    </a>.
                  </p>
                </Typography>
              )}
              <Button variant="contained" color="secondary" onClick={this.handleClose}>
                {closeButtonText || 'Close'}
              </Button>
            </div>
          }
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(StartupOverlay);
