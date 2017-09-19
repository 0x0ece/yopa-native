import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import AddServiceScreen from './screens/AddServiceScreen';
import GroupScreen from './screens/GroupScreen';
import HomeScreen from './screens/HomeScreen';
import ServiceScreen from './screens/ServiceScreen';
import SettingsScreen from './screens/SettingsScreen';
import styles from '../styles/Main';


const StackNav = StackNavigator({
  Home: { screen: HomeScreen,
    navigationOptions: {
      title: 'YoPa',
      headerLeft: (
        <Ionicons
          name="ios-settings-outline"
          size={28}
          style={styles.headerIcon}
          onPress={() => this.navigate('Settings')}
        />
      ),
      headerRight: (
        <Ionicons
          name="ios-add"
          size={28}
          style={styles.headerIcon}
          onPress={() => this.navigate('AddService')}
        />
      ),
    },
  },
  Service: {
    screen: ServiceScreen,
    path: 'service/:service',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.service.service}`,
    }),
  },
  Group: {
    screen: GroupScreen,
    path: 'group/:group',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.group}`,
    }),
  },
});

const ModalNav = StackNavigator({
  Home: {
    screen: StackNav,
    navigationOptions: {
      header: null,
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: 'Settings',
    },
  },
  AddService: {
    screen: AddServiceScreen,
    navigationOptions: {
      title: 'New',
    },
  },
}, {
  mode: 'modal',
});

export default ModalNav;
