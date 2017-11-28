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

    const group = this.props.group;
    this.state = {
      isReady: !group.deviceSecurity,  // only needed when group.deviceSecurity === true
      passphrase: undefined,
      errorMessage: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.savePassphraseIfNotSaved = this.savePassphraseIfNotSaved.bind(this);
    this.shouldShowFingerprint = this.shouldShowFingerprint.bind(this);
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

  handleCancel() {
    if (this.state.errorMessage) {
      this.setState({ errorMessage: '' });
    }
    this.props.onCancel();
  }

  handleChangeText() {
    if (this.state.errorMessage) {
      this.setState({ errorMessage: '' });
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
        this.setState({ errorMessage: `Wrong ${this.props.group.getPromptTitle()}` });
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

  shouldShowFingerprint() {
    /* eslint no-multi-spaces:off */
    return Config.DeviceSecurity          // fingerprint is available on the device
      && this.props.group.deviceSecurity  // group is configured for fingerprint
      && this.state.passphrase            // passphrase is stored in the secure storage
      && this.props.visible;              // prompt should be shown
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }

    const group = this.props.group;
    const showFingerprint = this.shouldShowFingerprint();
    if (showFingerprint) {
      Fingerprint.authenticateAsync()
        .then((res) => {
          if (res.success) {
            this.props.onGroupDidUnlock.call(this, group, this.state.passphrase);
          } else {
            switch (res.error) {
              case 'system_cancel':
                // do nothing
                break;
              // case 'not_available':          // fingerprint is not available
              // case 'lockout':                // user failed and fingerprint is now disabled
              // case 'authentication_failed':  // user failed
              // case 'user_fallback':          // user failed once and tapped "enter password"
              // case 'user_cancel':            // user tapped "cancel"
              default:
                this.setState({ passphrase: '' });
            }
          }
        })
        .catch(() => {
        });
    }

    return (
      <Prompt
        title={group.getPromptTitle()}
        visible={this.props.visible && !showFingerprint}
        textInputProps={{
          secureTextEntry: true,
        }}
        onCancel={this.handleCancel}
        onSubmit={this.handleSubmit}
        onChangeText={this.handleChangeText}
        errorMessage={this.state.errorMessage}
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
