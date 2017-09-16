import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';
import { getPassword } from '../src/YoPa';


it('returns the password', () => {
  const password = getPassword('mypassword', 'yopa.io', '0');
  const expected = 'dedIHUJ8/gyNZRMD';
  expect(password).toBe(expected);
});

// TODO: test view

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
