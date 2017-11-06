import React from 'react';
import { Provider } from 'react-redux';
import { AppState } from 'react-native';
import { createStore } from 'redux';
import { AppLoading, Fingerprint } from 'expo';

import Analytics from './src/Analytics';
import Config from './src/Config';
import Main, { SimplifiedNav } from './src/Main';
import Utils from './src/Utils';
import secretApp from './src/redux/reducers';
import { reloadAll } from './src/redux/actions';
import { Group, Service } from './src/Models';


const EXAMPLE_DATA = true;
const PERSIST_DATA = true;

const store = createStore(secretApp, {
  /* eslint no-nested-ternary:off */
  secrets: Config.PRODUCTION ? {
    services: [],
    groups: [
      new Group(),
    ],
  } : (EXAMPLE_DATA ? {
    services: [
      new Service({ service: 'medium.com', username: 'mempa' }),
      new Service({ service: 'github.com', username: 'mempa' }),
      new Service({ service: 'twitter.com', username: 'mempassword' }),
      new Service({ service: 'google.com', username: 'mempa@example.com', description: 'gmail gplus gdocs', group: 'Important' }),
      new Service({ service: 'google.com', username: 'mempa2@example.com', description: 'gmail gplus gdocs', group: 'Important' }),
      new Service({ service: 'facebook.com', username: 'mempa@example.com', description: 'messenger', group: 'Important' }),
      new Service({ service: 'bankofamerica.com', username: 'mempa@example.com', group: 'Financial' }),
    ],
    groups: [
      new Group({ storePassphrase: false, inputPassphrase: 'x' }),
      new Group({ group: 'Important', icon: 'star', defaultSecurityLevel: 0 }),
      new Group({ group: 'Financial', icon: 'account-balance', defaultSecurityLevel: 0 }),
    ],
  } : {
    services: [
      // new Service({ service: 'medium.com', username: 'mempa' }),
    ],
    groups: [
      // new Group({ storePassphrase: false, inputPassphrase: 'x' }),
      new Group(),
    ],
  }),
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
    Analytics.initialize();
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
    const storeAction = (Config.PRODUCTION || PERSIST_DATA) ? Utils.loadDataFromStoreAsync
      : Utils.deleteDataFromStoreAsync;

    // TODO(ec): this is a dirty hack, find a better way
    const fpHasHardware = await Fingerprint.hasHardwareAsync();
    const fpIsEnrolled = await Fingerprint.isEnrolledAsync();
    Config.DeviceSecurity = (fpHasHardware && fpIsEnrolled);

    storeAction()
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
