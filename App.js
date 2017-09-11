import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CryptoJS from 'crypto-js';

export default class App extends React.Component {
  render() {
    const secret = CryptoJS.SHA256("mypassword:yopa.io:0").toString(CryptoJS.enc.Base64).substring(0, 16);

    return (
      <View style={styles.container}>
        <Text>YoPa!</Text>
        <Text>secret("mypassword:yopa.io:0") =</Text>
        <Text>{secret}</Text>
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
