import React from 'react';
import { FlatList, Switch, Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, ListItem } from 'react-native-elements';
import ActionButton from 'react-native-action-button';

import Analytics from '../Analytics';
import GroupPassPrompt from './GroupPassPrompt';
import RectButton from './RectButton';
import Search from './SearchBox';
import Secret from './Secret';
import Style, { Color } from '../Style';
import { Group, Service } from '../Models';
import { createDefaultGroups, unlockGroup, copyServiceSecret } from '../redux/actions';
import Config from '../Config';

const SEARCH_MIN_SERVICES = 5;

class SecretList extends React.Component {
  static renderEmpty() {
    return (
      <View style={Style.container}>
        <Text style={{ fontSize: 16, fontStyle: 'italic' }}>
          {'“The best way of keeping a secret is to pretend there isn\'t one.”'}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          - Margaret Atwood, The Blind Assassin
        </Text>
      </View>
    );
  }

  constructor(props, context) {
    super(props, context);

    const promptVisible = this.props.group.isUnlocked() ? false : this.props.forceGroupUnlock;
    this.state = {
      promptVisible,
      didUnlockCallback: null,
      searchString: '',
    };

    this.handleEnableGroups = this.handleEnableGroups.bind(this);
    this.handleGroupDidUnlock = this.handleGroupDidUnlock.bind(this);
    this.handleGroupWillUnlock = this.handleGroupWillUnlock.bind(this);
    this.handleSearchChangeText = this.handleSearchChangeText.bind(this);
    this.handleSecretCopied = this.handleSecretCopied.bind(this);
    this.filterServices = this.filterServices.bind(this);
    this.renderAddButton = this.renderAddButton.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.showSearch = this.showSearch.bind(this);
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
    });
    this.props.dispatch(unlockGroup(data));
    this.props.navigation.setParams({ group: data });

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

  handleSearchChangeText(text) {
    this.setState({ searchString: text });
  }

  handleSecretCopied(service) {
    if (service.copied) {
      let screen = this.props.showGroups ? Analytics.SCREEN_HOME : Analytics.SCREEN_GROUP;
      if (this.state.searchString) {
        screen = Analytics.SCREEN_SEARCH;
      }
      Analytics.logSecretGet(Analytics.SECRET_ACTION_COPY, screen);
    }
    this.props.dispatch(copyServiceSecret(service));
  }

  filterServices() {
    const servicesProps = this.props.services || [];
    if (this.state.searchString.length > 0) {
      return servicesProps.filter(s => (s.service + s.description).toLowerCase()
        .includes(this.state.searchString.toLowerCase()));
    }
    return servicesProps.filter(s => s.group === this.props.group.id);
  }

  showSearch() {
    return (this.props.services.length >= SEARCH_MIN_SERVICES) &&
      (this.props.showGroups);
  }

  renderAddButton() {
    if (Config.Android) {
      const group = this.props.group;
      return (
        <ActionButton
          buttonColor={Color.primary}
          onPress={() => {
            this.props.navigation.navigate('AddService', {
              group,
            });
          }}
        />
      );
    }

    if (!this.props.showAddButton) {
      return null;
    }

    const title = (this.props.services.length === 0) ?
      'Add your first site' : 'Add another site';

    return (
      <List containerStyle={{ borderTopWidth: 0 }}>
        <View style={Style.container}>
          <Button
            buttonStyle={Style.primaryButton}
            containerViewStyle={{ marginLeft: 0, marginRight: 0, marginBottom: 20 }}
            onPress={() => {
              this.props.navigation.navigate('AddService');
            }}
            title={title}
          />
        </View>
      </List>
    );
  }

  renderSearch() {
    return this.showSearch() ? (
      <Search
        ref={(ref) => { this.searchBar = ref; }}
        autoCorrect={false}
        onChangeText={this.handleSearchChangeText}
        onCancel={() => { this.setState({ searchString: '' }); this.list.scrollToIndex({ animated: true, index: 1 }); }}
        onDelete={() => { this.setState({ searchString: '' }); }}
        autoCapitalize="none"
        cancelButtonTextStyle={Style.cancelButtonText}
        blurOnSubmit
        backgroundColor="white"
        style={Style.searchBox}
      />
    ) : null;
  }

  renderGroups() {
    const groupsProps = this.props.groups || [];
    const groups = groupsProps.filter(g => !g.isDefaultGroup() &&
      g.group.toLowerCase().includes(this.state.searchString.toLowerCase()));

    if (this.props.services.length === 0 || !this.props.showGroups ||
      (groupsProps.length > 1 && groups.length === 0)) {
      return null;
    }
    return groupsProps.length === 1 ? (
      <List containerStyle={Style.groupListContainer}>
        <ListItem
          containerStyle={{ borderBottomWidth: 0 }}
          rightIcon={(
            <View>
              <Switch
                onTintColor={Color.switch}
                onValueChange={this.handleEnableGroups}
              />
            </View>
          )}
          title="Enable categories"
          subtitle="Keep your passwords organized"
        />
      </List>
    ) : (
      <List containerStyle={Style.groupListContainer}>
        <Divider style={{ marginLeft: 16 }} />
        {groups.map((g, index) => (
          <RectButton
            key={g.key}
            onPress={() => this.props.navigation.navigate('Group', { group: g })}
          >
            {index > 0 ? <Divider style={{ marginLeft: 54 }} /> : null}
            <ListItem
              containerStyle={{ borderBottomWidth: 0 }}
              leftIcon={{ name: g.icon }}
              title={g.group}
              titleStyle={{ color: Color.primary, paddingLeft: 2 }}
            />
          </RectButton>
        ))}
        <Divider style={{ marginLeft: 16 }} />
      </List>
    );
  }

  renderHeader() {
    return (
      <View>
        {this.renderSearch()}
        {this.renderGroups()}
      </View>
    );
  }

  renderItem(item, index, mainGroup) {
    if (typeof item === 'string') {
      return (
        <ListItem
          containerStyle={{ borderBottomWidth: 0, paddingLeft: 34 }}
          key={item}
          title={'Tap to copy the password,\nswipe for more options'}
          titleNumberOfLines={2}
          titleStyle={{ fontStyle: 'italic' }}
          hideChevron
        />
      );
    }
    return (
      <Secret
        navigation={this.props.navigation}
        service={item}
        group={mainGroup}
        onGroupWillUnlock={this.handleGroupWillUnlock}
        onSecretCopied={this.handleSecretCopied}
      />
    );
  }

  render() {
    const groupsProps = this.props.groups || [];
    const servicesProps = this.props.services || [];
    const mainGroup = this.props.group || groupsProps[0];
    const services = this.filterServices();

    if (servicesProps.length === 1 && services.length === 1) {
      services.push('info');
    }

    const isEmpty = servicesProps.length === 0;
    const mainComponent = isEmpty ? SecretList.renderEmpty() : (
      <FlatList
        getItemLayout={(data, index) => (
          { length: 48, offset: 48 * index, index }
        )}
        initialScrollIndex={this.showSearch() && services.length > 1 ? 1 : 0}
        ref={(ref) => { this.list = ref; }}
        style={{ marginBottom: 40 }}
        data={services}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => (<Divider style={{ marginLeft: 54 }} />)}
        ListHeaderComponent={this.renderHeader}
        ListEmptyComponent={this.state.searchString ?
          <Text style={{ paddingLeft: 15 }}>Ops, nothing here</Text> : null}
        renderItem={({ item, index }) => this.renderItem(item, index, mainGroup)}
        disableVirtualization
      />
    );

    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <GroupPassPrompt
          key="prompt"
          group={mainGroup}
          visible={this.state.promptVisible}
          onCancel={() => { this.setState({ promptVisible: false }); }}
          onGroupDidUnlock={this.handleGroupDidUnlock}
        />
        {mainComponent}
        {this.renderAddButton()}
      </View>
    );
  }
}

SecretList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)),
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  dispatch: PropTypes.func.isRequired,
  group: PropTypes.instanceOf(Group).isRequired,
  showAddButton: PropTypes.bool,
  showGroups: PropTypes.bool,
  forceGroupUnlock: PropTypes.bool,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

SecretList.defaultProps = {
  groups: [],
  showAddButton: false,
  showGroups: false,
  forceGroupUnlock: false,
};

export default connect()(SecretList);
