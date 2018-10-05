import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mapSeries from 'promise-map-series';

import { TREZOR_ETH_KD_PATH } from '~/helpers/constants';
import TablePagination from '@material-ui/core/TablePagination';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  menuItem: {
    color: theme.palette.primary.main,
  },
});

class TrezorAddressList extends Component {
  static propTypes = {
    trezor: PropTypes.object.isRequired,
    renderItem: PropTypes.func,
    renderContainer: PropTypes.func,
    renderError: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  };
  static defaultProps = {
    renderItem: undefined,
    renderContainer: undefined,
    renderError: undefined,
    error: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { currentPage: 0, items: {}, loading: true, itemsPerPage: 5 };
    this.handleNavigate = this.handleNavigate.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }
  componentDidMount() {
    this.getPage();
  }
  getPageItems() {
    const { itemsPerPage } = this.state;
    const start = this.state.currentPage * itemsPerPage;
    return Array(itemsPerPage)
      .fill()
      .map((x, i) => {
        const n = i + start;
        const kdPath = `${TREZOR_ETH_KD_PATH}${n}`;
        return { n, kdPath };
      });
  }
  getPage() {
    this.setState({ loading: true });
    // const wallet = this.props.trezor.wallet.deriveChild(0).getWallet();

    new Promise(resolve => setTimeout(resolve, 1))
      .then(() => {
        const { currentPage } = this.state;
        return mapSeries(
          this.getPageItems(),
          ({ n, kdPath }) =>
            new Promise((resolve, reject) => {
              if (currentPage !== this.state.currentPage) {
                return reject();
              }
              if (this.state.items[kdPath]) {
                return resolve(this.state.items[kdPath]);
              }

              try {
                const address = `0x${this.props.trezor.hdWallet
                  .deriveChild(n)
                  .getWallet()
                  .getAddress()
                  .toString('hex')}`;
                this.setState({ items: { ...this.state.items, [kdPath]: { address, kdPath, n } } });
                return resolve(address);
              } catch (error) {
                return reject(error);
              }

              /* eslint-enable no-console */
            }),
        );
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }
  handleNavigate(event, page) {
    // const currentPage = this.state.currentPage + direction;
    this.setState({ currentPage: page });
    this.getPage();
  }

  handleChangeRowsPerPage(event) {
    this.setState({ itemsPerPage: event.target.value }, () => this.getPage());
  }
  renderNavigation() {
    const { loading, currentPage, itemsPerPage } = this.state;
    if (loading) return null;
    return (
      <TablePagination
        component="div"
        classes={{ menuItem: this.props.classes.menuItem }}
        count={100}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={this.handleNavigate}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />
    );
  }
  renderItems() {
    const { renderItem } = this.props;
    return this.getPageItems().map(({ kdPath }) => {
      const item = this.state.items[kdPath];
      if (renderItem) {
        return renderItem({ ...item, kdPath });
      }
      return <div>{item.address}</div>;
    });
  }
  renderContainer() {
    const { renderContainer } = this.props;
    const { renderItems } = this;
    if (renderContainer) {
      return renderContainer({ renderItems });
    }
    return renderItems();
  }

  renderError() {
    const { renderError, error } = this.props;

    if (renderError && error) {
      return renderError(error);
    }
    return null;
  }
  render() {
    const { error } = this.props;
    if (error) {
      return this.renderError();
    }

    return (
      <div>
        {/* <div style={{ float: 'right' }}>Ledger {this.props.config.version}</div> */}
        {this.renderContainer()}
        {this.renderNavigation()}
      </div>
    );
  }
}

export default withStyles(styles)(TrezorAddressList);
