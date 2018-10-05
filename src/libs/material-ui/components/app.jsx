import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
// import { version } from '~/../package.json';

import GovernanceUi from '@digix/governance-ui-components/src/pages';

import TransactionSigningOverlay from './transactions/transaction_signing_overlay';

import MenuSystem from './common/menu_system';

import Keystores from './keystores';

export default class App extends Component {
  componentWillMount() {
    const { Typekit } = window;
    if (Typekit) {
      Typekit.load({ async: true });
    }
  }
  render() {
    const { theme } = this.props;

    return (
      // <MuiThemeProvider theme={theme}>
      <div>
        <TransactionSigningOverlay />
        <HashRouter>
          {/* <ScrollToTopRouter> */}
          <Switch>
            <Route path="/" component={GovernanceUi} />
          </Switch>
          {/* </ScrollToTopRouter> */}
        </HashRouter>
      </div>
      // </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  theme: PropTypes.object
};

App.defaultProps = {
  theme: undefined
};
