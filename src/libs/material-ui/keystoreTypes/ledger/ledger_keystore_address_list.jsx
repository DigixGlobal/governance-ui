import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mapSeries from 'promise-map-series';

import { LEDGER_ETH_KD_PATH } from '~/helpers/constants';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  menuItem: {
    color: theme.palette.primary.main,
  },
});

class LedgerAddressList extends Component {
  static propTypes = {
    ethLedger: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    renderItem: PropTypes.func,
    renderContainer: PropTypes.func,
    kdPath: PropTypes.string.isRequired,
  };
  static defaultProps = {
    renderItem: undefined,
    renderContainer: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { currentPage: 0, items: {}, loading: true, itemsPerPage: 5 };
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }
  componentDidMount() {
    this.getPage();
  }
  getPageItems() {
    const { itemsPerPage } = this.state;
    const { kdPath: path } = this.props;
    const start = this.state.currentPage * itemsPerPage;
    return Array(itemsPerPage)
      .fill()
      .map((x, i) => {
        const n = i + start;
        const kdPath = path !== undefined ? `${path}/${n}` : `${LEDGER_ETH_KD_PATH}${n}`;
        // m/44'/60'/0
        return { n, kdPath };
      });
  }
  getPage() {
    this.setState({ loading: true });
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
              return (
                this.props.ethLedger
                  .getAddress_async(kdPath)
                  .then((address) => {
                    this.setState({ items: { ...this.state.items, [kdPath]: { ...address, kdPath, n } } });
                    resolve(address);
                  })
                  /* eslint-disable no-console */
                  .catch((err) => {
                    console.log(err);
                  })
              );
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
  render() {
    return (
      <div>
        {/* <div style={{ float: 'right' }}>Ledger {this.props.config.version}</div>
        */}
        {this.renderContainer()}
        {this.renderNavigation()}
      </div>
    );
  }
}

export default withStyles(styles)(LedgerAddressList);
