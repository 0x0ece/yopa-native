import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Secret from '../src/components/Secret';
import { Group, Service } from '../src/Models';


// TODO: test view

it('renders correctly', () => {
  const group = new Group({});
  const service = new Service({});
  const component = renderer.create(
    <Secret
      clipboard=""
      group={group}
      service={service}
      navigate={() => {}}
      onGroupWillUnlock={() => {}}
      onSecretCopied={() => {}}
    />,
  );

  expect(component).toBeTruthy();
  // TODO: write test here
});
