import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import secretApp from './src/redux/reducers';
import Main from './src/Main';


let store = createStore(secretApp, {
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

// store.dispatch({
//   type: 'ADD_SERVICE',
//   service: { service: 'Three' },
// });

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
