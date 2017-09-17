import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import secretApp from './src/redux/reducers';
import Main from './src/Main';
import Utils from './src/Utils';


const store = createStore(secretApp, {
  // initial store - load a YML file for real data
  secrets: {
    services: [
      { service: 'Zero', group: 'default' },
      { service: 'One', group: 'default' },
      { service: 'Two', group: 'default' },
      { service: 'WOne', group: 'Work' },
      { service: 'WTwo', group: 'Work' },
      { service: 'IOne', group: 'Important' },
      { service: 'ITwo', group: 'Important' },
    ],
    groups: [
      { group: 'Work' },
      { group: 'Important' },
    ],
  },
});

export default class App extends React.Component {
  componentDidMount() {
    Utils.loadDataFromStoreAsync()
      .then(data => {
        store.dispatch({
          type: 'RELOAD_ALL',
          data: data,
        });
      })
      .catch(error => {
        // ignore error for file not found
        // console.error(error);
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
