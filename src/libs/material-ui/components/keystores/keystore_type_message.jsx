import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  message: {
    color: '#000',
    marginBottom: '20px !important',
  },
});

class KeystoreTypeMessage extends React.Component {
  render() {
    const { keystoreType, classes } = this.props;
    return <Typography className={classes.message}>{keystoreType.description}</Typography>;
    // return (

    //   // <InfoArea message={keystoreType.description} color="info" close icon={keystoreType.icon || null} />
    //   // <Message info icon>
    //   //   <Icon className={keystoreType.icon || 'info circle'} />
    //   //   <Message.Content>
    //   //     <Message.Header>{keystoreType.name}</Message.Header>
    //   //     {keystoreType.description}
    //   //   </Message.Content>
    //   // </Message>
    // );
  }
}

KeystoreTypeMessage.propTypes = {
  keystoreType: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(KeystoreTypeMessage);
