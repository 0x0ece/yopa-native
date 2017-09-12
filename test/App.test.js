import React from 'react';
import App from '../App';
import { StyleSheet, Text, View } from 'react-native';
import {YoPass, getPassword} from '../src/YoPa';

import renderer from 'react-test-renderer';

it('returns the password', () => {
  const password = getPassword("mypassword", "yopa.io", "0")
  const expected = "dedIHUJ8/gyNZRMD";
  expect(password).toBe(expected);
});

//TODO: test view

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
