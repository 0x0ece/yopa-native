import React from 'react';
import { Alert, FlatList, Linking, View, Share } from 'react-native';
import { Divider, List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Prompt from '../components/Prompt';
import RectButton from '../components/RectButton';
import Style, { Color } from '../Style';
import Utils from '../Utils';
import { Group, Service } from '../Models';
import {
  addGroup,
  deleteGroup,
  initGroup,
  renameGroup,
  reloadAll,
  eraseAll,
} from '../redux/actions';


/* eslint react/no-multi-comp:off */
class SettingsSelectScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected,
    };

    this.handleCompleted = this.handleCompleted.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSection = this.renderSection.bind(this);
  }

  handleCompleted(newIndex) {
    this.setState({ selected: newIndex });
  }

  handlePress(index) {
    this.props.onPress(index, this.handleCompleted);
  }

  renderItem(item, index) {
    const selected = this.state.selected;
    return (
      <RectButton
        key={index}
        onPress={index !== selected ? this.handlePress.bind(this, index) : () => {}}
      >
        { index > 0 ? <Divider style={Style.settingsDivider} /> : null }
        <ListItem
          title={item.title}
          rightIcon={index === selected ? { name: 'check' } : undefined}
          hideChevron={index !== selected}
          containerStyle={Style.settingsItem}
        />
      </RectButton>
    );
  }

  renderSection({ item }) {
    return (
      <List containerStyle={Style.settingsList}>
        {item.map(this.renderItem)}
      </List>
    );
  }

  render() {
    return (
      <FlatList
        data={[this.props.settings]}
        renderItem={this.renderSection}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

SettingsSelectScreen.propTypes = {
  selected: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  settings: PropTypes.array.isRequired,
};


class SettingsInputScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.initialValue,
    };

    this.handleChanged = this.handleChanged.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  handleChanged() {
    if (this.state.value && (this.state.value !== this.props.initialValue)) {
      this.props.onChange(this.state.value);
    }
  }

  renderItem({ index }) {
    return (
      <List containerStyle={Style.settingsList}>
        <ListItem
          key={index}
          hideChevron
          textInput
          textInputAutoFocus
          textInputPlaceholder={this.props.placeholder}
          textInputValue={this.state.value}
          textInputOnChangeText={(value) => { this.setState({ value }); }}
          textInputOnBlur={this.handleChanged}
          textInputReturnKeyType="done"
          textInputContainerStyle={{ marginLeft: 20 }}
          textInputStyle={{ textAlign: 'left' }}
          wrapperStyle={{ flexDirection: 'row-reverse' }}
          containerStyle={Style.settingsInputItem}
        />
      </List>
    );
  }

  render() {
    return (
      <FlatList
        data={[{}]}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

SettingsInputScreen.propTypes = {
  initialValue: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


class SettingsScreen extends React.Component {
  static getLayout(groups) {
    const settings = [
      [ // section 1
        {
          title: 'Erase master passwords',
          titleColor: Color.primary,
          onPress: 'handleErasePassphrases',
        },
        {
          title: 'General',
          items: [
            // [
            //   {
            //     title: 'Hacker mode',
            //   },
            // ],
            [
              {
                title: 'Export',
                onPress: 'handleExport',
              },
              {
                title: 'Import',
                onPress: 'handleImport',
              },
            ],
          ],
        }, // General
      ],

      [ // section 2
        {
          title: 'Master password security',
          select: {
            getValue: 'getDefaultGroupSecurityLevel',
            setValue: 'setDefaultGroupSecurityLevel',
            items: Utils.getGroupSecurityLevels(),
          }, // Master password security
        },
        // {
        //   title: 'Vaults',
        // },
        // {
        //   title: 'Two-factor authentication',
        // },
      ],

      [ // section 3
        {
          title: 'Any issue?',
          rightTitle: 'support@mempa.io',
          link: 'mailto:support@mempa.io',
        },
        {
          title: 'Rate us',
          rightTitle: '☆☆☆☆☆',
          link: 'itms-apps://itunes.apple.com/app/id1312657167',
        },
      ],

      // [ // section 4
      //   {
      //     title: 'About',
      //   },
      // ],
    ];

    const groupsSettings = {
      title: 'Categories',
      items: [
        groups.filter(g => (!g.isDefaultGroup()))
          .map(g => ({
            title: g.group,
            items: [
              [
                {
                  title: 'Name',
                  rightTitle: g.group,
                  input: {
                    value: g.group,
                    placeholder: g.group,
                  },
                  param: g,
                  onInput: 'handleRenameGroup',
                },
                // {
                //   title: 'Icon',
                // },
                {
                  title: 'Master password security',
                  param: g,
                  select: {
                    getValue: 'getGroupSecurityLevel',
                    setValue: 'setGroupSecurityLevel',
                    items: Utils.getGroupSecurityLevels(),
                  }, // Master password security
                },
              ],
              [
                {
                  title: 'Delete category',
                  titleColor: Color.alert,
                  param: g,
                  onPress: 'handleDeleteGroup',
                },
              ],
            ],
          })),
        [
          {
            title: 'Add category',
            input: {
              placeholder: 'Category',
            },
            onInput: 'handleAddGroup',
          },
        ],
      ],
    };
    const layout = settings;
    const groupsSection = layout[1];

    if (groupsSection.length === 0) {
      groupsSection.push(groupsSettings);
    } else {
      groupsSection[1] = groupsSettings;
    }

    return layout;
  }

  constructor(props) {
    super(props);

    const navParams = this.props.navigation.state.params;
    this.state = {
      layout: (navParams && navParams.settings) ? navParams.settings :
        SettingsScreen.getLayout(this.props.groups),
      config: {
      },
      promptData: null,
      promptTitle: 'Master password',
      promptVisible: false,
    };

    this.closeScreen = this.closeScreen.bind(this);
    this.getGroupSecurityLevel = this.getGroupSecurityLevel.bind(this);
    this.setGroupSecurityLevel = this.setGroupSecurityLevel.bind(this);
    this.getDefaultGroupSecurityLevel = this.getDefaultGroupSecurityLevel.bind(this);
    this.setDefaultGroupSecurityLevel = this.setDefaultGroupSecurityLevel.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
    this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    this.handleRenameGroup = this.handleRenameGroup.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handlePromptSubmit = this.handlePromptSubmit.bind(this);
    this.handleErasePassphrases = this.handleErasePassphrases.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSection = this.renderSection.bind(this);
  }

  /* eslint class-methods-use-this:off */
  getGroupSecurityLevel(group) {
    return group.getSecurityLevel();
  }

  setGroupSecurityLevel(group, index, callback) {
    const promptTitle = group.getPromptTitle();

    // State machine:
    // 2 -> 1 delete from secure store
    // 1 -> 0 delete from store + lock
    // 2 -> 0 composition
    // 0 -> 1 store - if unlocked use the passphrase
    // 1 -> 2 secure store - if unlocked use the passphrase
    const currentSecurityLevel = group.getSecurityLevel();
    const shouldShowPrompt = (currentSecurityLevel === 0)
      || (index > currentSecurityLevel && !group.isUnlocked());
    const promptData = {
      callback,
      group,
      index,
    };
    if (shouldShowPrompt) {
      this.setState({ promptTitle, promptVisible: true, promptData });
    } else {
      this.handlePromptSubmit(group.inputPassphrase, promptData);
    }
  }

  getDefaultGroupSecurityLevel() {
    return this.getGroupSecurityLevel(this.props.groups[0]);
  }

  setDefaultGroupSecurityLevel(j, callback) {
    return this.setGroupSecurityLevel(this.props.groups[0], j, callback);
  }

  closeScreen() {
    this.props.screenProps.rootNavigation.goBack(null);
  }

  handlePromptSubmit(passphrase, promptData) {
    const {
      callback,
      group,
      index,
    } = promptData || this.state.promptData;
    this.setState({ promptData: null, promptVisible: false });
    if (passphrase || promptData) {
      const currentSecurityLevel = group.getSecurityLevel();
      if (currentSecurityLevel === 2) {
        Utils.deletePassphraseFromSecureStoreAsync(group);
      }

      const g = Utils.updateGroup(group, passphrase, index);
      this.props.dispatch(initGroup(g));

      if (callback) {
        callback.call(this, index);
      }
    }
  }

  handleAddGroup(name) {
    const newGroup = new Group({
      group: name,
    });
    this.props.dispatch(addGroup(newGroup));
    this.closeScreen();
  }

  handleRenameGroup(group, name) {
    const newGroup = new Group({
      ...group,
      group: name,
    });
    this.props.dispatch(renameGroup(group.id, newGroup));
    this.closeScreen();
  }

  handleDeleteGroup(group) {
    const services = this.props.services || [];
    const groupServices = services.filter(s => (s.group === group.id));

    const message = groupServices.length === 1 ?
      `Attention! This will also delete the site saved in ${group.group}.` :
      `Attention! This will also delete the ${groupServices.length} sites saved in ${group.group}.`;

    Alert.alert(
      `Delete ${group.group}?`,
      groupServices.length === 0 ? '' : message,
      [
        { text: 'Cancel' },
        { text: 'OK',
          style: 'destructive',
          onPress: () => {
            this.props.dispatch(deleteGroup(group));
            this.closeScreen();
          } },
      ],
      { cancelable: false },
    );
  }

  handleExport() {
    const content = Utils.serializeStore({
      services: this.props.services,
      groups: this.props.groups,
    });
    Share.share({
      message: content,
    });
  }

  handleImport() {
    Utils.getRemoteDocumentAsync()
      .then(() => {
        Utils.deleteAllPassphrasesFromSecureStore(this.props.groups);
        Utils.loadDataFromStoreAsync()
          .then((data) => {
            this.props.dispatch(reloadAll(data));
            this.closeScreen();
          });
      })
      .catch((error) => {
        /* eslint no-console:off */
        console.error(error);
      });
  }

  handleErasePassphrases() {
    Alert.alert(
      'Confirm?',
      [
        'Switch to Paranoic mode: erase your master passwords from this device.',
        '(You can readd them anytime.)',
        '',
        'This only affects master passwords,',
        'all your sites will remain intact.',
        '',
        'Erase them anytime you feel unsafe.',
      ].join('\n'),
      [
        { text: 'Cancel' },
        { text: 'OK',
          style: 'destructive',
          onPress: () => {
            Utils.deleteAllPassphrasesFromSecureStore(this.props.groups);
            this.props.dispatch(eraseAll());
            this.closeScreen();
          } },
      ],
      { cancelable: false },
    );
  }

  renderItem(item, index) {
    let hideChevron = false;
    let rightIcon;
    let rightTitle;
    let onPress = () => {};
    let titleStyle = {};

    if (item.onPress) {
      hideChevron = true;
      const param = item.param;
      onPress = () => { this[item.onPress].call(this, param); };
    }

    if (item.rightTitle) {
      rightTitle = item.rightTitle;
    }

    if (item.titleColor) {
      titleStyle = { color: item.titleColor };
    }

    if (item.link) {
      hideChevron = true;
      onPress = () => { Linking.openURL(item.link); };
    }

    if (item.items) {
      onPress = () => {
        this.props.navigation.navigate('Settings', {
          title: item.title,
          settings: item.items,
        });
      };
    }

    if (item.select) {
      onPress = () => {
        const param = item.param;
        const selected = this[item.select.getValue].call(this, param);
        const callback = this[item.select.setValue];

        this.props.navigation.navigate('Settings', {
          title: item.title,
          settings: item.select.items,
          selected,
          onPress: param ? callback.bind(this, param) : callback,
        });
      };
    }

    if (item.input) {
      onPress = () => {
        const param = item.param;
        const callback = this[item.onInput];

        this.props.navigation.navigate('Settings', {
          title: item.title,
          input: item.input,
          onChange: param ? callback.bind(this, param) : callback,
        });
      };
    }

    return (
      <RectButton key={index} onPress={onPress}>
        { index > 0 ? <Divider style={Style.settingsDivider} /> : null }
        <ListItem
          title={item.title}
          hideChevron={hideChevron}
          rightIcon={rightIcon}
          rightTitle={rightTitle}
          titleStyle={titleStyle}
          containerStyle={Style.settingsItem}
        />
      </RectButton>
    );
  }

  renderSection({ item }) {
    return (
      <List containerStyle={Style.settingsList}>
        {item.map(this.renderItem)}
      </List>
    );
  }

  render() {
    const params = this.props.navigation.state.params;

    const selected = params && params.selected;
    if (selected !== undefined) {
      return (
        <SettingsSelectScreen
          selected={selected}
          settings={params && params.settings}
          onPress={params && params.onPress}
        />
      );
    }

    const input = params && params.input;
    if (input !== undefined) {
      return (
        <SettingsInputScreen
          initialValue={input.value || ''}
          placeholder={input.placeholder || ''}
          onChange={params && params.onChange}
        />
      );
    }

    return (
      <View>
        <Prompt
          title={this.state.promptTitle}
          visible={this.state.promptVisible}
          textInputProps={{
            secureTextEntry: true,
          }}
          onCancel={() => {
            this.setState({ promptData: null, promptCallback: null, promptVisible: false });
          }}
          onSubmit={this.handlePromptSubmit}
        />
        <FlatList
          data={this.state.layout}
          renderItem={this.renderSection}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups) || [],
  };
}

SettingsScreen.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)).isRequired,
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  dispatch: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SettingsScreen);
