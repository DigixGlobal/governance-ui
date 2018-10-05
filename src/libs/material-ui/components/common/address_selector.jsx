import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Image, Dropdown } from 'semantic-ui-react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';

import blockie from '~/helpers/blockie';
import KeystoreButtons from '../keystores/keystore_buttons';

import DropdownSelector from './dropdown_selector';

export default class AddressSelector extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    initialAddress: PropTypes.string,
    onChange: PropTypes.func,
    preText: PropTypes.string,
    renderBottom: PropTypes.bool,
    showAddressOnly: PropTypes.bool,
  };
  static defaultProps = {
    initialAddress: null,
    onChange: null,
    preText: null,
    renderBottom: true,
    showAddressOnly: false,
  };
  renderItem({ name, address = '', keystore } = {}) {
    const { showAddressOnly } = this.props;
    return (
      <span>
        {name ? (
          <Image
            src={blockie(address)}
            avatar
            circular={showAddressOnly}
            style={
              !showAddressOnly
                ? {
                  margin: '-1.5em 1em -1.2em -1em',
                  height: '2.8em',
                  width: '2.8em',
                  borderRadius: '0',
                }
                : {}
            }
          />
        ) : (
          <span>Please select address</span>
        )}{' '}
        <span style={{ maxWidth: showAddressOnly ? '65%' : '35%' }} className="truncated">
          {address.substr(0, address.length - 4)}
        </span>
        <span className="truncated">{address.substr(-4)}</span>
        {!showAddressOnly && (
          <span style={{ maxWidth: '20%' }} className="truncated">
            {' '}
            - {name}
          </span>
        )}
        {!showAddressOnly &&
          keystore && (
            <Label color={keystore.type.color} content={keystore.type.name} style={{ float: 'right', margin: '-0.42em' }} />
          )}
      </span>
    );
  }

  renderAddresses({ name, address = '', keystore } = {}) {
    const { showAddressOnly } = this.props;
    return (
      <MenuItem key={address} value={address}>
        <Avatar alt={address} src={blockie(address)} /> {address.substr(0, address.length - 4)}
      </MenuItem>
    );
  }

  render() {
    const { initialAddress, onChange, addresses, preText, renderBottom, ...rest } = this.props;
    const items = addresses.map(a => ({
      ...a,
      name: a.name,
      id: a.address,
      // color: a.keystore.type.color,
    }));
    const initiallySelected = items.find(a => a.address === initialAddress);
    const bottomSection = renderBottom
      ? () => (
        <Dropdown.Item className="non-selectable">
            New Address: <KeystoreButtons skipImportConfirmation />
        </Dropdown.Item>
        )
      : undefined;

    return (
      <Select
        displayEmpty
        value={initialAddress}
        onChange={e => onChange({ address: e.target.value })}
        inputProps={{
          name: 'address',
          id: 'address',
        }}
      >
        {items.map(address => this.renderAddresses(address))}
      </Select>
    );

    // return (
    //   <DropdownSelector
    //     props={rest}
    //     onChange={onChange}
    //     items={items}
    //     preText={preText}
    //     initiallySelected={initiallySelected}
    //     renderTrigger={({ selectedItem } = {}) => this.renderItem(selectedItem)}
    //     renderItem={({ item, props: { onClick } }) => <Dropdown.Item onClick={onClick}>{this.renderItem(item)}</Dropdown.Item>}
    //     renderBottom={bottomSection}
    //   />
    // );
  }
}
