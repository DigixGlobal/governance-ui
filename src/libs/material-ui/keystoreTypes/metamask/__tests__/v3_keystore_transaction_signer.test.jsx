import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MetamaskKeystoreTransactionSigner from '../metamask_keystore_transaction_signer';

const address = {
  keystore: {
    type: {
      color: 'black',
      icon: 'testIcon',
    },
  },
  name: 'test network',
  address: '0x213452',
  color: 'blue',
};

describe('<MetamaskKeystoreTransactionSigner />', () => {
  test('renders correctly', () => {
    const component = shallow(
      <MetamaskKeystoreTransactionSigner setLoading={jest.fn} hideTxSigningModal={jest.fn} address={address} txData={{}} />,
    );

    expect(toJson(component)).toMatchSnapshot();
  });
});
