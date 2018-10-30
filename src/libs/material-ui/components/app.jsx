import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
// import { version } from '~/../package.json';

import GovernanceUi from '@digix/governance-ui-components/src';

import TransactionSigningOverlay from './transactions/transaction_signing_overlay';
import MessageSigningOverlay from './MessageSigning/message_signing_overlay';

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
          <MessageSigningOverlay />
          <HashRouter>
            <Switch>
              <Route path="/keystores" component={Keystores} />
              <Route path="/" component={GovernanceUi} />
            </Switch>
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
