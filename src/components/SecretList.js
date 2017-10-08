import React from 'react';
import { FlatList, Switch, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItem } from 'react-native-elements';

import GroupPassPrompt from './GroupPassPrompt';
import Secret from './Secret';
import Style from '../Style';
import { Group, Service } from '../Models';
import { createDefaultGroups, unlockGroup } from '../redux/actions';


class SecretList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      promptVisible: false,
      didUnlockCallback: null,
    };

    this.handleEnableGroups = this.handleEnableGroups.bind(this);
    this.handleGroupDidUnlock = this.handleGroupDidUnlock.bind(this);
    this.handleGroupWillUnlock = this.handleGroupWillUnlock.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  handleEnableGroups() {
    this.props.dispatch(createDefaultGroups());
  }

  handleGroupDidUnlock(group, inputPassphrase) {
    // hide the passphrase prompt
    const didUnlockCallback = this.state.didUnlockCallback;
    this.setState({
      promptVisible: false,
      didUnlockCallback: null,
    });

    // dispatch the action
    const data = new Group({
      ...group,
      inputPassphrase,
      unlocked: true,
    });
    this.props.dispatch(unlockGroup(data));

    // invoke the callback, if any, with the new data
    if (didUnlockCallback) {
      didUnlockCallback.call(this, data);
    }
  }

  handleGroupWillUnlock(callback) {
    // show the passphrase prompt
    this.setState({
      promptVisible: true,
      didUnlockCallback: callback,
    });
  }

  renderFooter() {
    if (!this.props.showAddButton) {
      return null;
    }
    return (
      <List containerStyle={{}}>
        <ListItem
          containerStyle={{}}
          leftIcon={{ name: 'add' }}
          title="Add Service"
          hideChevron
          onPress={() => this.props.navigate('AddService')}
        />
      </List>
    );
  }

  renderHeader() {
    const groupsProps = this.props.groups || [];
    const groups = groupsProps.filter(g => g.group !== 'default');

    if (this.props.services.length === 0 || !this.props.showGroups) {
      return null;
    }
    return groupsProps.length === 1 ? (
      <List containerStyle={Style.groupListContainer}>
        <ListItem
          containerStyle={Style.defaultBg}
          leftIcon={(
            <View>
              <Switch onValueChange={this.handleEnableGroups} />
            </View>
          )}
          title="Enable groups"
          subtitle="Keep services organized by security level"
          hideChevron
          onPress={() => this.props.navigate('AddService')}
        />
      </List>
    ) : (
      <List containerStyle={Style.groupListContainer}>
        {groups.map(g => (
          <ListItem
            containerStyle={Style.defaultBg}
            key={g.key}
            leftIcon={{ name: g.icon }}
            title={g.group}
            onPress={() => this.props.navigate('Group', { group: g })}
          />
        ))}
      </List>
    );
  }

  renderItem(item, mainGroup) {
    if (typeof item === 'string') {
      return (
        <ListItem
          containerStyle={{}}
          key={item}
          title="Tap to copy secret, swipe to edit service"
          hideChevron
        />
      );
    }
    return (
      <Secret
        navigate={this.props.navigate}
        service={item}
        group={mainGroup}
        onGroupWillUnlock={this.handleGroupWillUnlock}
      />
    );
  }

  render() {
    const groupsProps = this.props.groups || [];
    const servicesProps = this.props.services || [];
    const filter = this.props.group ? this.props.group.group : 'default';
    const services = servicesProps.filter(s => s.group === filter);
    const mainGroup = this.props.group || groupsProps[0];

    if (servicesProps.length === 1 && services.length === 1) {
      services.push('info');
    }

    return (
      <View>
        <GroupPassPrompt
          group={mainGroup}
          visible={this.state.promptVisible}
          onCancel={() => { this.setState({ promptVisible: false }); }}
          onGroupDidUnlock={this.handleGroupDidUnlock}
        />
        <FlatList
          style={{ height: '100%' }}
          data={services}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item }) => this.renderItem(item, mainGroup)}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

SecretList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)),
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  dispatch: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  group: PropTypes.instanceOf(Group),
  showAddButton: PropTypes.bool,
  showGroups: PropTypes.bool,
};

SecretList.defaultProps = {
  groups: [],
  group: null,
  showAddButton: false,
  showGroups: false,
};

export default connect()(SecretList);
