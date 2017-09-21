import React from 'react';
import { Button, Clipboard, Text } from 'react-native';

import Swipeable from './Swipeable';


export default class Secret extends React.Component {

  getSecret = () => {
    // TODO(ec): core algo
    const s = this.props.service;
    return 'super secret for ' + s.service;
  };

  navigateToServiceScreen = () => {
    this.props.navigate('Service', { service: this.props.service });
  };

  copySecretToClipboard = () => {
    const secret = this.getSecret();
    Clipboard.setString(secret);
  };

  handlePress = () => {
    return this.copySecretToClipboard();
    // TODO
    if (this.props.group.unlocked) {
      this.copySecretToClipboard();
    } else {
      this.props.onGroupUnlock(this.props.group);
    }
  };

  render = () => {
    const s = this.props.service;
    const group = this.props.group;
    const secretShown = group.unlocked ? "123-..." : "xxx-...";

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
