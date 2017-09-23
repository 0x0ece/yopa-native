import React from 'react';
import { Button, Clipboard, Text } from 'react-native';
import Prompt from 'react-native-prompt';

import Crypto from '../Crypto';


export default class GroupPassPrompt extends React.Component {

  handleSubmit = (value) => {
    if (!this.props.onGroupDidUnlock) {
      return;
    }

    const group = this.props.group;
    if (group.passphrase) {
      // group with passphrase - verify then unlock
      if (Crypto.verifyPassphrase(value, group.passphrase)) {
        this.props.onGroupDidUnlock.call(this, group, value);
      } else {
        // TODO(ec): handle error
      }
    } else {
      // group without passphrase - always unlock
      this.props.onGroupDidUnlock.call(this, group, value);
    }
  };

  render = () => {
    const group = this.props.group;

    return (
      <Prompt
        title={`Passphrase for ${group.group}`}
        placeholder="Passphrase"
        visible={this.props.visible}
        textInputProps={{
          secureTextEntry: true,
        }}
        onCancel={this.props.onCancel}
        onSubmit={this.handleSubmit}
      />
    );
  };
}
