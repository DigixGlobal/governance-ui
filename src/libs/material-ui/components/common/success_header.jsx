import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// import { Header, Icon } from 'semantic-ui-react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const styles = () => ({
  cardContent: {
    textAlign: 'center',
  },
  icon: {
    fontSize: '48px',
  },
  success: {
    color: green[600],
  },
  pending: {
    color: amber[700],
  },
});
class SuccessHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    failure: PropTypes.bool,
  };
  static defaultProps = {
    failure: false,
  };
  render() {
    const { title, children, failure, classes } = this.props;
    return (
      // <Header as="h2" color={failure ? 'red' : 'green'} icon textAlign="center">
      //   <Icon name={failure ? 'remove' : 'checkmark'} />
      //   {title}
      //   <Header.Subheader>
      //     {children}
      //   </Header.Subheader>
      // </Header>
      <Card elevation={0}>
        <CardContent className={classes.cardContent}>
          {!failure ? (
            <CheckIcon className={classnames(classes.icon, classes.success)} />
          ) : (
            <ClearIcon className={classnames(classes.icon, classes.failure)} />
          )}
          <Typography className={!failure ? classes.success : classes.failure} variant="headline">
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    );
  }
}
export default withStyles(styles)(SuccessHeader);
