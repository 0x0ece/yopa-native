import React from 'react';
import { Clipboard } from 'react-native';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

import Crypto from '../Crypto';
import Swipeable from './Swipeable';
import { Group, Service } from '../Models';


export default class Secret extends React.Component {
  static clearSecretFromClipboard() {
    Clipboard.setString('');
  }

  constructor(props) {
    super(props);
    this.getSecret = this.getSecret.bind(this);
    this.isCopied = this.isCopied.bind(this);
    this.navigateToServiceScreen = this.navigateToServiceScreen.bind(this);
    this.copySecretToClipboard = this.copySecretToClipboard.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  getSecret(group) {
    const s = this.props.service;
    const g = group || this.props.group;
    return Crypto.computeSecret(s.username, g.inputPassphrase, s.counter, s.service, s.extra);
  }

  navigateToServiceScreen() {
    // console.log('about to pass');
    // console.log(this.props.service);
    // this.props.navigation.setParams({ service: this.props.service });
    // this.props.navigation.navigate('Service');
    this.props.navigation.navigate('Service', {
      service: this.props.service,
      group: this.props.group,
    });
  }

  copySecretToClipboard(group) {
    const secret = this.getSecret(group);
    Clipboard.setString(secret);
    // console.log(`copied: ${secret}`);
  }

  isCopied() {
    const group = this.props.group;
    return (this.props.clipboard && group.isUnlocked()
      && this.getSecret(group) === this.props.clipboard);
  }

  handlePress() {
    if (this.props.group.isUnlocked()) {
      if (this.isCopied()) {
        Secret.clearSecretFromClipboard();
      } else {
        this.copySecretToClipboard();
      }
      this.props.onSecretCopied();
    } else {
      // pass copySecretToClipboard as callback, that will eventually
      // be invoked with the unlocked group as parameter
      this.props.onGroupWillUnlock(this.copySecretToClipboard);
    }
  }

  render() {
    const s = this.props.service;
    const group = this.props.group;

    let secretShown = group.isUnlocked() ? 'XXX-...' : 'xxx-...';
    if (this.isCopied()) {
      secretShown = 'copied';
    }

    return (
      <Swipeable onSwipeLeft={this.navigateToServiceScreen}>
        <ListItem
          containerStyle={{ borderBottomWidth: 0 }}
          avatar={{ uri: `https://${s.icon}/favicon.ico` }}
          avatarOverlayContainerStyle={{ backgroundColor: 'transparent' }}
          avatarStyle={{ width: 16, height: 16, marginBottom: 14 }}
          hideChevron
          title={s.service}
          subtitle={s.username}
          rightTitle={secretShown}
          onPress={this.handlePress}
        />
      </Swipeable>
    );
  }
}

Secret.propTypes = {
  clipboard: PropTypes.string.isRequired,
  group: PropTypes.instanceOf(Group).isRequired,
  service: PropTypes.instanceOf(Service).isRequired,
  navigate: PropTypes.func.isRequired,
  onGroupWillUnlock: PropTypes.func.isRequired,
  onSecretCopied: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};
