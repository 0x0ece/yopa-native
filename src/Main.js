import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import AddServiceScreen from './screens/AddServiceScreen';
import GroupScreen from './screens/GroupScreen';
import HomeScreen from './screens/HomeScreen';
import ServiceScreen from './screens/ServiceScreen';
import SettingsScreen from './screens/SettingsScreen';
import Style, { Color } from './Style';
import Config from './Config';


const headerCommon = {
  headerStyle: {
    backgroundColor: Color.headerBg,
    borderBottomColor: Color.headerBorder,
  },
  headerTintColor: Color.headerTitle,
};

const StackNav = StackNavigator({
  Home: { screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'MemPa',
      ...headerCommon,
      headerLeft: (
        <Ionicons
          name="ios-settings-outline"
          size={28}
          style={Style.headerIcon}
          onPress={() => navigation.navigate('Settings')}
        />
      ),
      headerRight: (
        <Ionicons
          name="ios-add"
          size={28}
          style={Style.headerIcon}
          onPress={() => {
            navigation.navigate('AddService', {
              group: navigation.state.params.group,
            });
          }}
        />
      ),
    }),
  },
  Service: {
    screen: ServiceScreen,
    path: 'service/:service',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.service.service}`,
      ...headerCommon,
    }),
  },
  Group: {
    screen: GroupScreen,
    path: 'group/:group',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.group.getNavTitle()}`,
      ...headerCommon,
      headerRight: (Config.Android && Platform.OS === 'android')?
        null :(
        <Ionicons
          name="ios-add"
          size={28}
          style={Style.headerIcon}
          onPress={() => {
            navigation.navigate('AddService', {
              group: navigation.state.params.group,
            });
          }}
        />
      ),
    }),
  },
}, {
  cardStyle: {
    backgroundColor: Color.appBg,
  },
});

const ModalNav = StackNavigator({
  Home: {
    screen: StackNav,
    navigationOptions: {
      header: null,
      ...headerCommon,
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      ...headerCommon,
      headerLeft: null,
      headerRight: (
        <Ionicons
          name="ios-close"
          size={28}
          style={Style.headerIcon}
          onPress={() => { navigation.goBack(); }}
        />
      ),
    }),
  },
  AddService: {
    screen: AddServiceScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Add Site',
      ...headerCommon,
      headerLeft: null,
      headerRight: (
        <Ionicons
          name="ios-close"
          size={28}
          style={Style.headerIcon}
          onPress={() => { navigation.goBack(); }}
        />
      ),
    }),
  },
}, {
  mode: 'modal',
  cardStyle: {
    backgroundColor: Color.appBg,
  },
});

const SimplifiedNav = StackNavigator({
  Home: { screen: HomeScreen,
    navigationOptions: {
      title: '👋  MemPa',
      ...headerCommon,
    },
  },
});

export default ModalNav;
export {
  SimplifiedNav,
};
