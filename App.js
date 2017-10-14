import React from 'react';
import { Provider } from 'react-redux';
import { AppState } from 'react-native';
import { createStore } from 'redux';
import { AppLoading } from 'expo';

import Main, { SimplifiedNav } from './src/Main';
import Utils from './src/Utils';
import secretApp from './src/redux/reducers';
import { reloadAll } from './src/redux/actions';
import { Group, Service } from './src/Models';


const EXAMPLE_DATA = true;

const store = createStore(secretApp, {
  // initial store - load a YML file for real data
  secrets: EXAMPLE_DATA ? {
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
      new Group({ group: 'default', storePassphrase: false }),
      new Group({ group: 'Important', icon: 'star' }),
      new Group({ group: 'Banks', icon: 'account-balance' }),
    ],
  } : {
    services: [],
    groups: [
      new Group({ group: 'default' }),
    ],
  },
});


export default class App extends React.Component {
  static isFirstLaunch() {
    const state = store.getState();
    const groups = (state.secrets && state.secrets.groups) || [];
    return (groups.length === 1) && (!groups[0].isInitialized());
  }

  constructor(props) {
    super(props);

    this.startAsync = this.startAsync.bind(this);

    this.state = {
      isReady: 0,
      appState: AppState.currentState,
    };

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // trigger state change, so we re-render (and switch from SimplifiedNav to Main)
    if (App.isFirstLaunch()) {
      store.subscribe(() => this.setState({ isReady: 2 }));
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'background') {
      // lock all groups
    }
    this.setState({ appState: nextAppState });
  }

  async startAsync() {
    // Utils.deleteDataFromStoreAsync()
    Utils.loadDataFromStoreAsync()
      .then((data) => {
        store.dispatch(reloadAll(data));
        this.setState({ isReady: 1 });
      })
      .catch(() => {
        // ignore error for file not found
        this.setState({ isReady: 1 });
      });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.startAsync}
          onFinish={() => {}}
          onError={() => {}}
        />
      );
    }

    const Component = App.isFirstLaunch() ? SimplifiedNav : Main;
    return (
      <Provider store={store}>
        <Component />
      </Provider>
    );
  }
}
