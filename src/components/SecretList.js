import React from 'react';
import { Clipboard, FlatList, Switch, Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, ListItem } from 'react-native-elements';
import Search from './SearchBox';

import Analytics from '../Analytics';
import GroupPassPrompt from './GroupPassPrompt';
import Secret from './Secret';
import Style, { Color } from '../Style';
import { Group, Service } from '../Models';
import { createDefaultGroups, unlockGroup } from '../redux/actions';

const SEARCH_MIN_SERVICES = 5;

class SecretList extends React.Component {
  constructor(props, context) {
    super(props, context);

    const promptVisible = this.props.group.isUnlocked() || this.props.services.length === 0 ?
      false : this.props.forceGroupUnlock;
    this.state = {
      clipboard: '',
      promptVisible,
      didUnlockCallback: null,
      searchString: '',
    };

    this.handleEnableGroups = this.handleEnableGroups.bind(this);
    this.handleGroupDidUnlock = this.handleGroupDidUnlock.bind(this);
    this.handleGroupWillUnlock = this.handleGroupWillUnlock.bind(this);
    this.handleSearchChangeText = this.handleSearchChangeText.bind(this);
    this.handleSecretCopied = this.handleSecretCopied.bind(this);
    this.readFromClipboard = this.readFromClipboard.bind(this);
    this.renderAddButton = this.renderAddButton.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.showSearch = this.showSearch.bind(this);
  }

  componentDidMount() {
    this.readFromClipboard();
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

  handleSecretCopied(copied) {
    this.readFromClipboard();

    if (copied) {
      let screen = this.props.showGroups ? Analytics.SCREEN_HOME : Analytics.SCREEN_GROUP;
      if (this.state.searchString) {
        screen = Analytics.SCREEN_SEARCH;
      }
      console.log(screen);
      Analytics.logSecretGet(Analytics.SECRET_ACTION_COPY, screen);
    }
  }

  filterServices() {
    const servicesProps = this.props.services || [];
    if (this.state.searchString.length > 0) {
      return servicesProps.filter(s => (s.service + s.description).toLowerCase()
        .includes(this.state.searchString.toLowerCase()));
    }
    const filter = this.props.group ? this.props.group.group : 'default';
    return servicesProps.filter(s => s.group === filter);
  }

  readFromClipboard() {
    Clipboard.getString().then(
      (clipboard) => { this.setState({ clipboard }); },
    );
  }

  showSearch() {
    return (this.props.services.length >= SEARCH_MIN_SERVICES) &&
      (this.props.showGroups);
  }

  renderAddButton() {
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
            containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
            onPress={() => this.props.navigation.navigate('AddService')}
            title={title}
          />
        </View>
      </List>
    );
  }

  renderEmpty() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <View style={Style.container}>
          <Text style={{ fontSize: 16, fontStyle: 'italic' }}>
            {'“The best way of keeping a secret is to pretend there isn\'t one.”'}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            - Margaret Atwood, The Blind Assassin
          </Text>
        </View>
        {this.renderAddButton()}
      </View>
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
        placeholder="search"
        backgroundColor="white"
        style={Style.searchBox}
      />
    ) : null;
  }

  renderGroups() {
    const groupsProps = this.props.groups || [];
    const groups = groupsProps.filter(g => g.group !== 'default' &&
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
          <View key={g.key}>
            {index > 0 ? <Divider style={{ marginLeft: 54 }} /> : null}
            <ListItem
              containerStyle={{ borderBottomWidth: 0 }}
              leftIcon={{ name: g.icon }}
              title={g.group}
              titleStyle={{ color: Color.primary, paddingLeft: 2 }}
              onPress={() => this.props.navigation.navigate('Group', { group: g })}
            />
          </View>
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
        clipboard={this.state.clipboard}
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

    return isEmpty ? this.renderEmpty() : (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <GroupPassPrompt
          group={mainGroup}
          visible={this.state.promptVisible}
          onCancel={() => { this.setState({ promptVisible: false }); }}
          onGroupDidUnlock={this.handleGroupDidUnlock}
        />
        <FlatList
          getItemLayout={(data, index) => (
            { length: 48, offset: 48 * index, index }
          )}
          initialScrollIndex={this.showSearch() ? 1 : 0}
          ref={(ref) => { this.list = ref; }}
          style={{}}
          data={services}
          keyboardShouldPersistTaps="always"
          ItemSeparatorComponent={() => (<Divider style={{ marginLeft: 54 }} />)}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={<Text style={{ paddingLeft: 20 }}>Ops, nothing here</Text>}
          renderItem={({ item, index }) => this.renderItem(item, index, mainGroup)}
          keyExtractor={(item, index) => index}
        />
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
