import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getUI } from '~/helpers/uiRegistry';
import TransactionInfoTable from './transaction_info_table';

export default class TransactionInfo extends Component {
  static propTypes = {
    ui: PropTypes.object,
    txData: PropTypes.object.isRequired,
    logToggleDetails: PropTypes.func,
    translations: PropTypes.object.isRequired,
  }

  static defaultProps = {
    ui: undefined,
    logToggleDetails: undefined,
  }

  render() {
    const { logToggleDetails, ui, txData, translations } = this.props;

    const defaultRender = (
      <TransactionInfoTable
        open
        logToggleDetails={logToggleDetails}
        translations={translations}
        {...{ txData }}
      />
    );

    if (!ui) {
      return defaultRender;
    }

    const uiEntry = getUI(ui.type);
    if (!uiEntry || !uiEntry.component) {
      return defaultRender;
    }

    const TransactionUI = uiEntry.component;
    return (
      <div>
        <TransactionUI {...this.props} />
        <TransactionInfoTable
          logToggleDetails={logToggleDetails}
          translations={translations}
          {...{ txData }}
        />
      </div>
    );
  }
}
