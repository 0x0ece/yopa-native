import React from 'react';
import { Text } from 'react-native';
import CryptoJS from 'crypto-js';


export function getPassword(pass, site, counter) {
  const clear = `${pass}:${site}:${counter}`;
  const secret = CryptoJS.SHA256(clear).toString(CryptoJS.enc.Base64).substring(0, 16);
  return secret;
}

export class YoPass extends React.Component {
  render() {
    const secret = getPassword(this.props.pass, this.props.site, this.props.counter);

    return (
      <Text style={styles.yopa}>{secret}</Text>
    );
  }
}

