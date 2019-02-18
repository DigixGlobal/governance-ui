import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import '@digix/governance-ui-components/src/global-styles';

import './helpers/offlinePlugin';

const renderApp = () => {
  /* eslint-disable global-require */

  const NewApp = require('~/libs/material-ui/components/app').default; //loadedUi.component;
  const store = require('./store').default;
  /* eslint-enable global-require */
  render(
    <AppContainer>
      <Provider store={store}>
        <NewApp />
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./libs/material-ui/components/app', () => {
    renderApp();
  });
}
