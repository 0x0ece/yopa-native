import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';


jest.mock('../src/components/SwipeableRow', () => 'SwipeableRow');

it('does nothing', () => {
  expect(1).toBe(1);
});

it('renders correctly', () => {
  const component = renderer.create(
    <App />,
  );
  expect(component).toBeTruthy();
});
