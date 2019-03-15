import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';

import GovernanceUi from '@digix/governance-ui-components/src';

import TransactionSigningOverlay from './transactions/transaction_signing_overlay';
import MessageSigningOverlay from './MessageSigning/message_signing_overlay';

import Keystores from './keystores';

import Theme from '../../../themes/material-ui/digix';
class App extends Component {
  componentWillMount() {
    const { Typekit } = window;
    if (Typekit) {
      Typekit.load({ async: true });
    }
  }
  render() {
    if (!this.props.ready) return null;
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
  theme: PropTypes.object,
  ready: PropTypes.bool.isRequired
};

App.defaultProps = {
  theme: undefined
};

// only render when the redux state is ready; TODO use a flag after rehydrating
export default connect(({ orm: { Session: { itemsById: { main } } } }) => ({
  ready: !!main
}))(App);
