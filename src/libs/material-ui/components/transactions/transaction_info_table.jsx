import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

import { parseBigNumber, camelToCapitalized } from '~/helpers/stringUtils';

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  button: {
    fontSize: '12px',
    backgroundColor: 'none',
  },
});

const numberValues = {
  gasPrice: true,
  nonce: true,
  gas: true,
  value: true,
};

class TransactionInfoTable extends Component {
  static propTypes = {
    open: PropTypes.bool,
    txData: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logToggleDetails: PropTypes.func,
    translations: PropTypes.object.isRequired,
  };

  static defaultProps = {
    open: false,
    logToggleDetails: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  renderTable() {
    const { txData } = this.props;
    return (
      <Table>
        <TableBody>
          {Object.keys(txData).map((key) => {
            const value = txData[key];
            return (
              <TableRow key={key}>
                <TableCell style={{ minWidth: '8em' }}>
                  <strong>{camelToCapitalized(key)}</strong>
                </TableCell>
                <TableCell>
                  <span className="wrapping">{numberValues[key] ? parseBigNumber(value, 0, false) : value}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
  render() {
    const { classes } = this.props;
    if (this.props.open) {
      return this.renderTable();
    }
    const t = this.props.translations.common;
    const { open } = this.state;

    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={(e) => {
              e.preventDefault();
              const { logToggleDetails } = this.props;
              if (logToggleDetails) {
                logToggleDetails(!open);
              }

              this.setState({ open: !open });
            }}
          >
            <ExpandMoreIcon
              className={classnames(classes.expand, {
                [classes.expandOpen]: open,
              })}
            />
            {t.details}
          </Button>
        </div>
        <Collapse in={open}>{this.renderTable()}</Collapse>
      </div>
    );
  }
}

export default withStyles(styles)(TransactionInfoTable);
