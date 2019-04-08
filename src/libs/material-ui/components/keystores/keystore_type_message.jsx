import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  message: {
    color: '#000',
    marginBottom: '20px !important',
  },
});

class KeystoreTypeMessage extends React.Component {
  render() {
    const { keystoreType, classes } = this.props;
    const t = this.props.translations;

    let description = keystoreType.description;
    if (keystoreType.id === 'metamask') {
      description = t.Name.instructions;
    } else if (['ledger', 'trezor'].includes(keystoreType.id)) {
      description = t.chooseAddress.description;
    }

    return <Typography className={classes.message}>{description}</Typography>;
  }
}

KeystoreTypeMessage.propTypes = {
  keystoreType: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  translations: PropTypes.object.isRequired,
};

export default withStyles(styles)(KeystoreTypeMessage);
