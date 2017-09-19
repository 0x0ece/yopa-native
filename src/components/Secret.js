import React from 'react';
import { Button, Clipboard } from 'react-native';

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

  render = () => {
    const s = this.props.service;

    return (
      <Swipeable onSwipeLeft={this.navigateToServiceScreen}>
        <Button
          title={`Service: ${s.service}`}
          onPress={this.copySecretToClipboard}
        />
      </Swipeable>
    );
  };
}
