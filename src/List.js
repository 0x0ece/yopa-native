import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles/Main';


export default class List extends React.Component {
  render() {
    return (
      <View style={styles.body}>
        <Text>List of passwords</Text>
      </View>
    );
  }
}
