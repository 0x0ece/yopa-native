import React from 'react';
import { Clipboard, FlatList, Switch, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItem, SearchBar } from 'react-native-elements';

import GroupPassPrompt from './GroupPassPrompt';
import Secret from './Secret';
import Style from '../Style';
import { Group, Service } from '../Models';
import { createDefaultGroups, unlockGroup } from '../redux/actions';


class SecretList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      clipboard: '',
      promptVisible: false,
      didUnlockCallback: null,
      searchString: '',
      searchBarVisible: false,
    };

    this.handleEnableGroups = this.handleEnableGroups.bind(this);
    this.handleGroupDidUnlock = this.handleGroupDidUnlock.bind(this);
    this.handleGroupWillUnlock = this.handleGroupWillUnlock.bind(this);
    this.readFromClipboard = this.readFromClipboard.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.handleSearchChangeText = this.handleSearchChangeText.bind(this);
    this.handleSecretListScroll = this.handleSecretListScroll.bind(this);
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


  handleSecretListScroll(event) {
    const currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset < 0 || this.offset <= 0) {
      this.setState({ searchBarVisible: true });
    } else if (this.state.searchString.length === 0) {
      this.setState({ searchBarVisible: false });
    }
    this.offset = currentOffset;
  }

  readFromClipboard() {
    Clipboard.getString().then(
      (clipboard) => { this.setState({ clipboard }); },
    );
  }

  filterServices() {
    const servicesProps = this.props.services || [];
    if (this.state.searchString.length > 0) {
      return servicesProps.filter(s => (s.service + s.username + s.description).toLowerCase()
        .includes(this.state.searchString.toLowerCase()));
    }
    const filter = this.props.group ? this.props.group.group : 'default';
    return servicesProps.filter(s => s.group === filter);
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
          onPress={() => this.props.navigation.navigate('AddService')}
        />
      </List>
    );
  }

  renderHeader() {
    const groupsProps = this.props.groups || [];
    const groups = groupsProps.filter(g => g.group !== 'default' &&
      g.group.toLowerCase().includes(this.state.searchString.toLowerCase()));

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
          onPress={() => this.props.navigation.navigate('AddService')}
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
            onPress={() => this.props.navigation.navigate('Group', { group: g })}
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
          title="Tap to copy the secret, swipe for more options"
          hideChevron
        />
      );
    }
    return (
      <Secret
        clipboard={this.state.clipboard}
        navigate={this.props.navigation.navigate}
        service={item}
        group={mainGroup}
        onGroupWillUnlock={this.handleGroupWillUnlock}
        onSecretCopied={this.readFromClipboard}
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

    const searchBarElement = (this.state.searchBarVisible) ? (
      <SearchBar
        lightTheme
        clearIcon
        ref={(ref) => { this.searchBar = ref; }}
        autoCorrect={false}
        onChangeText={this.handleSearchChangeText}
        autoCapitalize="none"
        blurOnSubmit
        autoFocus
      />
    ) : null;

    return (
      <View>
        { searchBarElement }
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
          onScroll={this.handleSecretListScroll}
        />
      </View>
    );
  }
}

SecretList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)),
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  dispatch: PropTypes.func.isRequired,
  group: PropTypes.instanceOf(Group),
  showAddButton: PropTypes.bool,
  showGroups: PropTypes.bool,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

SecretList.defaultProps = {
  groups: [],
  group: null,
  showAddButton: false,
  showGroups: false,
};

export default connect()(SecretList);
