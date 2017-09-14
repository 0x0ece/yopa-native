import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import {styles} from '../styles/Main';


export class List extends React.Component {
  render() {
    return(
      <View style={styles.body}>
        <Text>List of passwords</Text>
      </View>
    )
  }
}