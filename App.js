import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Main from './src/Main';
import Utils from './src/Utils';
import secretApp from './src/redux/reducers';
import { reloadAll } from './src/redux/actions';
import { Group, Service } from './src/Models';


const store = createStore(secretApp, {
  // initial store - load a YML file for real data
  secrets: {
    services: [
      new Service({ service: 'mempa.io', username: 'mempa', group: 'default' }),
      new Service({ service: 'github.com', username: 'mempa', group: 'default' }),
      new Service({ service: 'twitter.com', username: 'mempassword', group: 'default' }),
      new Service({ service: 'google.com', username: 'mempa@example.com', group: 'Important' }),
      new Service({ service: 'google.com', username: 'mempa2@example.com', group: 'Important' }),
      new Service({ service: 'facebook.com', username: 'mempa@example.com', group: 'Important' }),
      new Service({ service: 'bankofamerica.com', username: 'mempa@example.com', group: 'Banks' }),
    ],
    groups: [
      new Group({ group: 'default' }),
      new Group({ group: 'Important', icon: 'star' }),
      new Group({ group: 'Banks', icon: 'account-balance' }),
    ],
  },
});

export default class App extends React.Component {
  componentDidMount() {
    Utils.loadDataFromStoreAsync()
      .then((data) => {
        store.dispatch(reloadAll(data));
      })
      .catch(() => {
        // ignore error for file not found
      });
  }

  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
