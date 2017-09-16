import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import secretApp from './src/redux/reducers';
import Main from './src/Main';


const store = createStore(secretApp);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      site: '',
      counter: '',
      selectedTab: 'List',
    };
  }

  render() {
    return (
      <Provider store={store}>
        <Main
          updateState={this.setState}
          state={this.state}
        />
      </Provider>
    );
  }
}
