import React from 'react';
import { Fingerprint } from 'expo';
import PropTypes from 'prop-types';

import Config from '../Config';
import Crypto from '../Crypto';
import Prompt from './Prompt';
import Utils from '../Utils';
import { Group } from '../Models';


export default class GroupPassPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      passphrase: undefined,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.savePassphraseIfNotSaved = this.savePassphraseIfNotSaved.bind(this);
    this.showFingerprint = this.showFingerprint.bind(this);
  }

  componentDidMount() {
    const group = this.props.group;
    if (group.deviceSecurity) {
      Utils.loadPassphraseFromSecureStoreAsync(group)
        .then((passphrase) => {
          this.setState({ isReady: true, passphrase });
        })
        .catch(() => {
          this.setState({ isReady: true });
        });
    }
  }

  handleSubmit(value) {
    if (!this.props.onGroupDidUnlock) {
      return;
    }

    const group = this.props.group;
    if (group.passphrase) {
      // group with passphrase - verify then unlock
      if (Crypto.verifyPassphrase(value, group.passphrase)) {
        this.savePassphraseIfNotSaved(group, value);
        this.props.onGroupDidUnlock.call(this, group, value);
      } else {
        // TODO(ec): handle error
      }
    } else {
      // group without passphrase - always unlock
      this.savePassphraseIfNotSaved(group, value);
      this.props.onGroupDidUnlock.call(this, group, value);
    }
  }

  savePassphraseIfNotSaved(group, passphrase) {
    if (Config.DeviceSecurity && group.deviceSecurity && !this.state.passphrase) {
      Utils.savePassphraseToSecureStoreAsync(group, passphrase);
    }
  }

  showFingerprint() {
    /* eslint no-multi-spaces:off */
    return Config.deviceSecurity          // fingerprint is available on the device
      && this.props.group.deviceSecurity  // group is configured for fingerprint
      && this.state.passphrase            // passphrase is stored in the secure storage
      && this.props.visible;              // prompt should be shown
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }

    const group = this.props.group;
    if (this.showFingerprint()) {
      Fingerprint.authenticateAsync()
        .then((res) => {
          if (res.success) {
            this.props.onGroupDidUnlock.call(this, group, this.state.passphrase);
          }
        })
        .catch(() => {
        });
      return null;
    }

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
