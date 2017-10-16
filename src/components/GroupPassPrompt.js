import React from 'react';
import Prompt from 'react-native-prompt';
import PropTypes from 'prop-types';

import Crypto from '../Crypto';
import { Group } from '../Models';


export default class GroupPassPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(value) {
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
  }

  render() {
    const group = this.props.group;
    const title = group.group === 'default' ? 'Master password'
      : `Master password for ${group.group}`;

    return (
      <Prompt
        title={title}
        visible={this.props.visible}
        textInputProps={{
          secureTextEntry: true,
        }}
        onCancel={this.props.onCancel}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

GroupPassPrompt.propTypes = {
  group: PropTypes.instanceOf(Group).isRequired,
  onCancel: PropTypes.func.isRequired,
  onGroupDidUnlock: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};
