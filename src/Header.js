import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import {styles} from '../styles/Main';


export class Header extends React.Component {
  render() {
    return(
      <Text style={styles.header}>YoPa -- Your Passwords Manager!</Text>
    )
  }
}