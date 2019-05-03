import React, { Component } from 'react';
import PropTypes from 'prop-types';

import blockie from '~/helpers/blockie';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  text: {
    textAlign: 'center',
  },
  card: {
    boxShadow: 'none ',
  },
  truncate: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
  },
  image: {
    height: 60,
    width: 60,
    margin: '0 auto',
  },
});

class TxVisualisation extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
  };

  renderItem = (item, i) => {
    const { classes } = this.props;
    const {
      data,
      dataLink,
      header,
      identicon,
      subheader,
    } = item;

    return (
      <Grid key={i} item xs={4} md={4}>
        <Card className={classes.card}>
          {identicon && <Avatar className={classes.image} src={blockie(identicon)} />}
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {header}
            </Typography>
            {subheader && <Typography component="p">{subheader}</Typography>}
            <Typography component="p">
              {dataLink ? (
                <a className={classes.truncate} rel="noopener noreferrer" target="_blank" href={dataLink}>
                  {data}
                </a>
              ) : (
                <div style={{ color: 'black' }}>{data}</div>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  render() {
    const { items, classes } = this.props;
    return (
      <Grid container spacing={24} className={classes.text}>
        {items.map(this.renderItem)}
      </Grid>
    );
  }
}

export default withStyles(styles)(TxVisualisation);
