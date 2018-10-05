import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import BottomNavigation from '@material-ui/core/BottomNavigation';
// import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { MuiThemeProvider } from '@material-ui/core/styles';
// import { version } from '~/../package.json';

// import '@digix/mui/lib/assets/css/main.css';

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
      <MuiThemeProvider theme={theme}>
        <div>
          <TransactionSigningOverlay />
          {/* <StartupOverlay content={() => <h1>Hi</h1>} /> */}
          <MenuSystem
            // renderLastItem={() => <ConnectionStatus />}
            tabs={[{ name: 'Keystores', icon: 'settings', component: <Keystores /> }]}
          />
          {/* <div className="root">
            <BottomNavigation position="static">
              <BottomNavigationAction label="test" />
            </BottomNavigation>
          </div> */}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  theme: PropTypes.object,
};

App.defaultProps = {
  theme: undefined,
};
