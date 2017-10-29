import React from 'react';
import { Alert, FlatList, Linking } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Utils from '../Utils';
import { Group } from '../Models';
import { reloadAll, wipeAll } from '../redux/actions';


const settings = [
  [ // section 1
    {
      label: 'Wipe all master passwords',
      onPress: 'handleWipePassphrases',
    },
    {
      label: 'General',
      items: [
        [
          {
            label: 'Hacker mode',
          },
        ],
        [
          {
            label: 'Export',
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
    },
    {
      label: 'Categories',
    },
    {
      label: 'Vaults',
    },
    {
      label: 'Two-factor authentication',
    },
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

  [ // section 4
    {
      label: 'About',
    },
  ],
];

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    const navParams = this.props.navigation.state.params;
    this.state = {
      layout: (navParams && navParams.settings) || settings,
      config: {},
    };

    this.closeScreen = this.closeScreen.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.handleWipePassphrases = this.handleWipePassphrases.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSection = this.renderSection.bind(this);
  }

  closeScreen() {
    this.props.screenProps.rootNavigation.goBack(null);
  }

  handleImport() {
    Utils.getRemoteDocumentAsync()
      .then(() => {
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

  handleWipePassphrases() {
    Alert.alert(
      'Confirm wiping?',
      '',
      [
        { text: 'Cancel' },
        { text: 'OK',
          style: 'destructive',
          onPress: () => {
            const groups = this.props.groups;
            groups.forEach((g) => {
              if (g.deviceSecurity) {
                Utils.deletePassphraseFromSecureStoreAsync(g);
              }
            });
            this.props.dispatch(wipeAll());
            this.closeScreen();
          } },
      ],
      { cancelable: false },
    );
  }

  renderItem(item, i) {
    let hideChevron = false;
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

    return (
      <ListItem
        key={i}
        title={item.label}
        hideChevron={hideChevron}
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
    return (
      <FlatList
        style={{}}
        data={this.state.layout}
        renderItem={this.renderSection}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    // services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups) || [],
  };
}

SettingsScreen.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)).isRequired,
  // services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  dispatch: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SettingsScreen);
