import React from 'react';
import { Alert, ActionSheetIOS, FlatList, Linking, View } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Prompt from '../components/Prompt';
import Utils from '../Utils';
import { Group, Service } from '../Models';
import { initGroup, reloadAll, eraseAll } from '../redux/actions';


const settings = [
  [ // section 1
    {
      label: 'Erase master passwords',
      onPress: 'handleErasePassphrases',
    },
    {
      label: 'General',
      items: [
        // [
        //   {
        //     label: 'Hacker mode',
        //   },
        // ],
        [
          {
            label: 'Export',
            onPress: 'handleExport',
          },
          {
            label: 'Import',
            onPress: 'handleImport',
          },
        ],
      ],
    }, // General
  ],

  [ // section 2
    {
      label: 'Master password',
      select: {
        getValue: 'getDefaultGroupSecurityLevel',
        setValue: 'setDefaultGroupSecurityLevel',
        items: [
          {
            label: 'Paranoic',
            desc: [
              'Never store the master password.',
              "Type it every time to unlock - MemPa won't check if it's correct or not.",
            ],
          },
          {
            label: 'Armored',
            desc: [
              'Store the master password encrypted.',
              'Type it every time to unlock.',
            ],
          },
          {
            label: 'Secure',
            desc: [
              'Store the master password in the device secure storage.',
              'Use your fingerprint to unlock.',
            ],
          },
        ],
      }, // Master password
    },
    // {
    //   label: 'Categories',
    // },
    // {
    //   label: 'Vaults',
    //   selected: true,
    // },
    // {
    //   label: 'Two-factor authentication',
    // },
  ],

  [ // section 3
    {
      label: 'Any issue?',
      link: 'mailto:support@mempa.io',
    },
    {
      label: 'Rate us',
      link: 'itms-apps://itunes.apple.com/app/id429047995',
    },
  ],

  // [ // section 4
  //   {
  //     label: 'About',
  //   },
  // ],
];


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
  }

  handleCompleted(newIndex) {
    this.setState({ selected: newIndex });
  }

  handlePress(index) {
    this.props.onPress(index, this.handleCompleted);
  }

  renderItem({ item, index }) {
    const selected = this.state.selected;
    return (
      <ListItem
        key={index}
        title={item.label}
        rightIcon={index === selected ? { name: 'check' } : undefined}
        hideChevron={index !== selected}
        onPress={index !== selected ? this.handlePress.bind(this, index) : () => {}}
      />
    );
  }

  render() {
    return (
      <FlatList
        style={{}}
        data={this.props.settings}
        renderItem={this.renderItem}
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


class SettingsScreen extends React.Component {
  static getGroupSecurityLevel(group) {
    return group.getSecurityLevel();
  }

  constructor(props) {
    super(props);

    const navParams = this.props.navigation.state.params;
    this.state = {
      layout: (navParams && navParams.settings) || settings,
      config: {
      },
      promptData: null,
      promptTitle: 'Master password',
      promptVisible: false,
    };

    this.closeScreen = this.closeScreen.bind(this);
    this.getDefaultGroupSecurityLevel = this.getDefaultGroupSecurityLevel.bind(this);
    this.setDefaultGroupSecurityLevel = this.setDefaultGroupSecurityLevel.bind(this);
    this.setGroupSecurityLevel = this.setGroupSecurityLevel.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handlePromptSubmit = this.handlePromptSubmit.bind(this);
    this.handleErasePassphrases = this.handleErasePassphrases.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSection = this.renderSection.bind(this);
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
    return SettingsScreen.getGroupSecurityLevel(this.props.groups[0]);
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

  handleExport() {
    const content = Utils.serializeStore({
      services: this.props.services,
      groups: this.props.groups,
    });

    ActionSheetIOS.showShareActionSheetWithOptions({
      subject: 'MemPa',
      message: content,
    }, () => {}, () => {});
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
      '',
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

  renderItem(item, i) {
    let hideChevron = false;
    let rightIcon;
    let onPress = () => {};

    if (item.onPress) {
      hideChevron = true;
      onPress = () => { this[item.onPress].call(); };
    }

    if (item.link) {
      hideChevron = true;
      onPress = () => { Linking.openURL(item.link); };
    }

    if (item.items) {
      onPress = () => {
        this.props.navigation.navigate('Settings', {
          title: item.label,
          settings: item.items,
        });
      };
    }

    if (item.select) {
      onPress = () => {
        const selected = this[item.select.getValue].call();

        this.props.navigation.navigate('Settings', {
          title: item.label,
          settings: item.select.items,
          selected,
          onPress: this[item.select.setValue],
        });
      };
    }

    return (
      <ListItem
        key={i}
        title={item.label}
        hideChevron={hideChevron}
        rightIcon={rightIcon}
        onPress={onPress}
      />
    );
  }

  renderSection({ item }) {
    return (
      <List containerStyle={{}}>
        {item.map(this.renderItem)}
      </List>
    );
  }

  render() {
    const params = this.props.navigation.state.params;
    const selected = params && params.selected;
    return selected !== undefined ? (
      <SettingsSelectScreen
        selected={selected}
        settings={params && params.settings}
        onPress={params && params.onPress}
      />
    ) : (
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
          style={{}}
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
