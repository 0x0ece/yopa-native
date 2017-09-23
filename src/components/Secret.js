import React from 'react';
import { Button, Clipboard, Text } from 'react-native';

import Crypto from '../Crypto';
import Swipeable from './Swipeable';


export default class Secret extends React.Component {

  getSecret = (group) => {
    const s = this.props.service;
    const g = group || this.props.group;
    return Crypto.computeSecret(s.username, g.inputPassphrase, s.service, s.counter, s.extra);
  };

  navigateToServiceScreen = () => {
    this.props.navigate('Service', { service: this.props.service });
  };

  copySecretToClipboard = (group) => {
    const secret = this.getSecret(group);
    Clipboard.setString(secret);
    console.log('copied: '+secret);
  };

  handlePress = () => {
    if (this.props.group.unlocked) {
      this.copySecretToClipboard();
    } else {
      // pass copySecretToClipboard as callback, that will eventually
      // be invoked with the unlocked group as parameter
      this.props.onGroupWillUnlock(this.copySecretToClipboard);
    }
  };

  render = () => {
    const s = this.props.service;
    const group = this.props.group;
    const secretShown = group.unlocked ? "123-..." : "***-...";

    return (
      <Swipeable onSwipeLeft={this.navigateToServiceScreen}>
        <Button
          title={`Service: ${s.service}`}
          onPress={this.handlePress}
        />
        <Text>{secretShown}</Text>
      </Swipeable>
    );
  };
}
