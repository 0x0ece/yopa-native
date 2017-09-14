import React from 'react';
import {Main} from './src/Main';
import {styles} from './styles/Main';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.updateState = this.updateState.bind(this);
  }
  updateState(state) {
    this.setState(state)
  }
  componentWillMount() {
    this.updateState({"password": "", "site": "", "counter": "", "selectedTab": "List"});
  }
  render() {
    return (
      <Main updateState={this.updateState}
            state={this.state} />
    )
  }
}


