import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';

// import Lazyload from '~/components/common/lazyload';
// import MarketPlace from '@digix/marketplace-ui';
// import PoaUi from '@digix/poa-ui';
// import KycSystem from '@digix/kyc-system/spectrum';


import MenuSystem from '~/components/common/menu_system';
// import Placeholder from './placeholder';

// const EtcRedemption = Lazyload(() => System.import('@digix/etc-redemption/spectrum'));
// const DigixKyc = Lazyload(() => System.import('@digix/etc-redemption/spectrum'));

export default class Dapplets extends Component {
  static propTypes = {

  }
  render() {
    return (
      <Grid>
        <Grid.Column width={16}>
          <Header>
            Dapplets
            <Header.Subheader>
              Sample of some Dapplets built in spectrum. This section will soon be replaced with an on-chain registry.
            </Header.Subheader>
          </Header>
        </Grid.Column>
        {/* <Grid.Column width={16}>
          <MenuSystem
            tabs={[
              { name: 'Market Place', icon: 'pencil', path: '/marketplace', component: <MarketPlace /> },
              // { name: 'Proof of Asset', icon: 'pencil', path: '/assets', component: <PoaUi /> },
              // { name: 'Identity', icon: 'pencil', path: '/identity', component: <KycSystem /> },
              // { name: 'ETC Redemption', icon: 'fork', component: <EtcRedemption /> },
            ]}
          />
        </Grid.Column> */}
      </Grid>
    );
  }
}
