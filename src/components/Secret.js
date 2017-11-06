import React from 'react';
import { Clipboard } from 'react-native';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

import RectButton from './RectButton';
import SwipeableRow from './SwipeableRow';
import { Group, Service } from '../Models';


export default class Secret extends React.Component {
  static clearSecretFromClipboard() {
    Clipboard.setString('');
  }

  constructor(props) {
    super(props);
    this.navigateToServiceScreen = this.navigateToServiceScreen.bind(this);
    this.copySecretToClipboard = this.copySecretToClipboard.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  navigateToServiceScreen() {
    this.props.navigation.navigate('Service', {
      service: this.props.service,
      group: this.props.group,
    });
  }

  copySecretToClipboard() {
    const secret = this.props.service.getSecret(this.props.group);
    Clipboard.setString(secret);
  }

  handlePress() {
    if (this.props.group.isUnlocked()) {
      const service = this.props.service;
      if (service.copied) {
        Secret.clearSecretFromClipboard();
      } else {
        this.copySecretToClipboard();
      }

      const newService = new Service({
        ...service,
        copied: !service.copied,
      });
      this.props.onSecretCopied(newService);
    } else {
      // pass copySecretToClipboard as callback, that will eventually
      // be invoked with the unlocked group as parameter
      this.props.onGroupWillUnlock(this.copySecretToClipboard);
    }
  }

  render() {
    const s = this.props.service;
    const group = this.props.group;

    return (
      <SwipeableRow
        swipedText={s.getSecret(group)}
        onActionPress={this.navigateToServiceScreen}
      >
        <RectButton onPress={this.handlePress}>
          <ListItem
            containerStyle={{ borderBottomWidth: 0 }}
            avatar={{ uri: s.getIconUrl() }}
            avatarOverlayContainerStyle={{ backgroundColor: 'transparent' }}
            avatarStyle={{ width: 16, height: 16, marginBottom: 14 }}
            hideChevron
            title={s.service}
            subtitle={s.username}
            rightTitle={s.getSecretPreview(group)}
          />
        </RectButton>
      </SwipeableRow>
    );
  }
}

Secret.propTypes = {
  group: PropTypes.instanceOf(Group).isRequired,
  service: PropTypes.instanceOf(Service).isRequired,
  onGroupWillUnlock: PropTypes.func.isRequired,
  onSecretCopied: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};
