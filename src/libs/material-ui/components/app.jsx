import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
// import { version } from '~/../package.json';

import GovernanceUi from '@digix/governance-ui-components/src/pages';
import GovUiComponents from '@digix/governance-ui-components/src/ui';

import TransactionSigningOverlay from './transactions/transaction_signing_overlay';

// import MenuSystem from './common/menu_system';

import Keystores from './keystores';

import Theme from '../../../themes/material-ui/digix';
export default class App extends Component {
  componentWillMount() {
    const { Typekit } = window;
    if (Typekit) {
      Typekit.load({ async: true });
    }
  }
  render() {
    return (
      <MuiThemeProvider theme={Theme}>
        <div>
          <TransactionSigningOverlay />
          <HashRouter>
            {/* <ScrollToTopRouter> */}
            <Switch>
              <Route path="/ui" component={GovUiComponents} />
              <Route path="/keystores" component={Keystores} />
              <Route path="/" component={GovernanceUi} />
            </Switch>
            {/* </ScrollToTopRouter> */}
          </HashRouter>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  theme: PropTypes.object
};

App.defaultProps = {
  theme: undefined
};
