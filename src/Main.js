import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import AddServiceScreen from './screens/AddServiceScreen';
import GroupScreen from './screens/GroupScreen';
import HomeScreen from './screens/HomeScreen';
import ServiceScreen from './screens/ServiceScreen';
import SettingsScreen from './screens/SettingsScreen';
import Style from './Style';


const StackNav = StackNavigator({
  Home: { screen: HomeScreen,
    navigationOptions: {
      title: 'MemPa',
      headerLeft: (
        <Ionicons
          name="ios-settings-outline"
          size={28}
          style={Style.headerIcon}
          onPress={() => this.navigate('Settings')}
        />
      ),
      headerRight: (
        <Ionicons
          name="ios-add"
          size={28}
          style={Style.headerIcon}
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
      title: `${navigation.state.params.group.group}`,
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
      headerLeft: null,
      headerRight: (
        <Ionicons
          name="ios-close"
          size={28}
          style={Style.headerIcon}
          onPress={() => { this.navigate('back'); }}
        />
      ),
    },
  },
  AddService: {
    screen: AddServiceScreen,
    navigationOptions: {
      title: 'New',
      headerLeft: null,
      headerRight: (
        <Ionicons
          name="ios-close"
          size={28}
          style={Style.headerIcon}
          onPress={() => { this.navigate('back'); }}
        />
      ),
    },
  },
}, {
  mode: 'modal',
});

export default ModalNav;
