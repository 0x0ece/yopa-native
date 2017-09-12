import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import {YoPass, getPassword} from './src/YoPa';

export default class App extends React.Component {
  componentWillMount() {
    this.setState({"password": "", "site": "", "counter": ""});
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>YoPa!</Text>
        <TextInput
          placeholder="Password"
          onChangeText={(text) => this.setState({"password": text})} />

        <TextInput
          placeholder="Site"
          onChangeText={(text) => this.setState({"site": text})} />

        <TextInput
          placeholder="Counter"
          onChangeText={(text) => this.setState({"counter": text})} />


        <YoPass pass={this.state.password}
                site={this.state.site}
                counter={this.state.counter} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
