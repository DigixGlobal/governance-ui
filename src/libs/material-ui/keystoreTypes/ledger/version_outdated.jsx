import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { injectTranslation } from '~/helpers/stringUtils';
import { LATEST_ETHEREUM_APP_LEDGER } from '~/helpers/constants';

class LedgerOutdatedVersionError extends Component {
  constructor(props) {
    super(props);
    this.LEDGER_ETHEREUM_APP_LINK = 'https://support.ledger.com/hc/en-us/articles/360002731113-Update-device-firmware';
  }

  render() {
    const t = this.props.translations.errors.outdatedVersion;
    return (
      <div>
        <Typography color="error" variant="body2">
          {t.title}
        </Typography>
        <Typography color="error" variant="body1" component="div">
          {injectTranslation(t.instructions, {
            version: LATEST_ETHEREUM_APP_LEDGER,
            link: this.LEDGER_ETHEREUM_APP_LINK,
          })}
        </Typography>
      </div>
    );
  }
}

const { object } = PropTypes;
LedgerOutdatedVersionError.propTypes = {
  translations: object.isRequired,
};

export default LedgerOutdatedVersionError;
