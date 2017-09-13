import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import {styles} from '../styles/Main';


export class InputBar extends React.Component {
  render() {
    return(
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Password"
          onChangeText={(text) => this.props.updateState({"password": text})} />

        <TextInput
          placeholder="Site"
          onChangeText={(text) => this.props.updateState({"site": text})} />

        <TextInput
          placeholder="Counter"
          onChangeText={(text) => this.props.updateState({"counter": text})} />
      </View>
    )
  }
}