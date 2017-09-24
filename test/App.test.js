import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';


// TODO: test view

it('renders correctly', () => {
  renderer.create(
    <App />,
  );
});
