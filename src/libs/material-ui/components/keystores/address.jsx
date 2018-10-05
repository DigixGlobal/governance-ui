import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Header, Image, Checkbox } from 'semantic-ui-react';
import EZModal from '@digix/sui-react-ezmodal';

import blockie from '~/helpers/blockie';
import QrCode from '~/libs/material-ui/components/common/qr_code';
import DownloadV3KeystoreButton from '~/libs/material-ui/keystoreTypes/v3/v3_keystore_download_button';

import AddressBalances from './address_balances';

export default class KeystoreAddress extends Component {
  render() {
    const { address, onChange, disabled, keystore } = this.props;
    return (
      <Table.Row>
        <Table.Cell width="1">
          <Header as="h4" image style={{ whiteSpace: 'nowrap' }}>
            <Image src={blockie(address.address)} shape="rounded" size="mini" />
            <Header.Content>
              {address.name}
              <Header.Subheader>
                <code style={{ fontSize: '0.8em' }}>{address.address}</code>
                <EZModal
                  size="small"
                  header={address.name}
                  content={<QrCode data={address.address} />}
                  trigger={<Icon name={'qrcode'} style={{ cursor: 'pointer' }} />}
                />
                <br />
                <Checkbox
                  radio
                  // disabled={disabled}
                  onClick={onChange}
                  checked={address.isDefault}
                  style={{ fontSize: '0.8em' }}
                  label="Set as default address"
                />
              </Header.Subheader>
            </Header.Content>
          </Header>
          {keystore.type.id === 'v3' && (
            <div style={{ marginLeft: '2.5em' }}>
              <DownloadV3KeystoreButton
                keystore={keystore}
                props={{ content: 'Download Keystore', icon: 'download', color: 'blue', size: 'mini' }}
              />
            </div>
          )}
        </Table.Cell>
        <AddressBalances address={address} />
      </Table.Row>
    );
  }
}
KeystoreAddress.propTypes = {
  address: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  keystore: PropTypes.object.isRequired,
};
