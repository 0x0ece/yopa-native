import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Secret from '../src/components/Secret';
import { Group, Service } from '../src/Models';


jest.mock('../src/components/SwipeableRow', () => 'SwipeableRow');

it('renders correctly', () => {
  const group = new Group({});
  const service = new Service({});

  const component = renderer.create(
    <Secret
      clipboard=""
      group={group}
      service={service}
      navigation={{}}
      onGroupWillUnlock={() => {}}
      onSecretCopied={() => {}}
    />,
  );

  expect(component).toBeTruthy();
  // TODO: write test here
});
