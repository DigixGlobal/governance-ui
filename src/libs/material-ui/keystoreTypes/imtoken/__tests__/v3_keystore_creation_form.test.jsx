import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import MetamaskKeystoreCreationForm from '../metamask_keystore_creation_form';

describe('<MetamaskKeystoreCreationForm />', () => {
  test('renders correctly', () => {
    const component = shallow(<MetamaskKeystoreCreationForm formData={{}} formChange={jest.fn} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
