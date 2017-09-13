import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import { Header } from './Header';
import { InputBar } from './InputBar';
import { YoPass } from './YoPa';
import { styles } from '../styles/Main';


export class Main extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header />

        <InputBar updateState={this.props.updateState} />

        <YoPass pass={this.props.state.password}
                site={this.props.state.site}
                counter={this.props.state.counter} />
      </View>
    );
  }
}