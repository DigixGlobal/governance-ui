import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader, Divider } from 'semantic-ui-react';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import green from '@material-ui/core/colors/green';

import Message from '@digix/mui/lib/components/Message';

import Web3Connect from '~/helpers/web3/connect';
import { getNetworks } from '~/selectors';

import SuccessHeader from '../common/success_header';

const styles = () => ({
  button: {
    fontSize: '11px',
    color: 'white',
    boxShadow: 'none',
    border: 'none',
  },
  pending: {
    backgroundColor: '#FF6F00',
  },
  success: {
    backgroundColor: green[600],
  },
  icon: {
    marginRight: '2px',
  },
  circularIcon: {
    marginRight: '6px',
  },
});

class TransactionTracker extends Component {
  static propTypes = {
    networks: PropTypes.array.isRequired,
    txHash: PropTypes.string.isRequired,
    networkId: PropTypes.string.isRequired,
    broadcast: PropTypes.object.isRequired,
    renderConfirmation: PropTypes.func,
    onMined: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    web3Redux: PropTypes.object.isRequired,
    renderFailure: PropTypes.func,
    handleValidation: PropTypes.func.isRequired,
    failure: PropTypes.bool,
  };
  static defaultProps = {
    renderConfirmation: undefined,
    renderFailure: undefined,
    onMined: undefined,
    failure: false,
  };
  componentDidMount() {
    const { networkId, web3Redux, txHash, onMined, handleValidation } = this.props;
    const web3 = web3Redux.web3(networkId);
    web3.eth.waitForMined(txHash).then((txData) => {
      onMined(txData, web3);
      handleValidation(txData, web3);
    });
  }
  renderConfirmation() {
    return <SuccessHeader title="Confirmed">Transaction was Successful</SuccessHeader>;
  }
  renderFailure() {
    return (
      <SuccessHeader title="Failed" failure>
        Something went wrong!
      </SuccessHeader>
    );
  }
  renderStatus(transaction) {
    const { failure, renderConfirmation, renderFailure, txHash, networkId, broadcast, formData } = this.props;
    const props = {
      txHash,
      networkId,
      broadcast,
      formData,
      transaction,
    };
    if (failure) {
      return renderFailure ? renderFailure(props) : this.renderFailure(props);
    }
    return renderConfirmation ? renderConfirmation(props) : this.renderConfirmation(props);
  }
  render() {
    const { broadcast, networkId, web3Redux, networks, txHash, classes } = this.props;
    const web3 = web3Redux.web3(networkId);
    if (!web3) {
      return <Loader active />;
    }
    const network = networks.find(({ id }) => id === web3.networkId);
    const { explorerTransactionPrefix, explorerBlockPrefix } = network;
    const transaction = web3.eth.transaction(txHash);
    const { blockNumber } = transaction || {};
    const linkParams = explorerTransactionPrefix
      ? {
        as: 'a',
        href: `${explorerTransactionPrefix}${txHash}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
      : {};
    const outOfGas = new Date() - broadcast > 60 * 1000;
    const href = `${explorerTransactionPrefix}${txHash}`;
    return (
      <div>
        {blockNumber && (
          <div>
            {this.renderStatus(transaction)}
            <Divider hidden />
          </div>
        )}
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Transaction</strong>
              </TableCell>
              <TableCell>
                {!explorerTransactionPrefix ? (
                  txHash
                ) : (
                  <a href={href} rel="noopener noreferrer" target="_blank">
                    {txHash}
                  </a>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <Button
                  rel="noopener noreferrer"
                  target="_blank"
                  href={href}
                  className={classnames(classes.button, classes[blockNumber ? 'success' : 'pending'])}
                  variant="outlined"
                >
                  {blockNumber ? (
                    <CheckIcon className={classes.icon} />
                  ) : (
                    <CircularProgress className={classes.circularIcon} color="inherit" size={18} />
                  )}
                  {blockNumber ? 'Created' : 'Pending'}
                </Button>
                {blockNumber && (
                  <span>
                    {' '}
                    in block{' '}
                    {!explorerBlockPrefix ? (
                      `#${blockNumber}`
                    ) : (
                      <a href={href} rel="noopener noreferrer" target="_blank">
                        #{blockNumber}
                      </a>
                    )}
                  </span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {!blockNumber && (
          <div style={{ marginTop: '1em' }}>
            <Message
              variant="info"
              message="If the transaction is taking some time, please check the transaction ID on etherscan to see its current status. If
            it is still pending, please give it some time for the transaction to clear on the blockchain"
            />
          </div>
        )}
      </div>
    );
  }
}

export default Web3Connect(connect(s => ({ networks: getNetworks(s) }))(withStyles(styles)(TransactionTracker)));
