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
      new Service({ service: 'Zero', group: 'default' }),
      new Service({ service: 'One', group: 'default' }),
      new Service({ service: 'Two', group: 'default' }),
      new Service({ service: 'WOne', group: 'Work' }),
      new Service({ service: 'WTwo', group: 'Work' }),
      new Service({ service: 'IOne', group: 'Important' }),
      new Service({ service: 'ITwo', group: 'Important' }),
    ],
    groups: [
      new Group({ group: 'default' }),
      new Group({ group: 'Important' }),
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
