import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import AddServiceScreen from './screens/AddServiceScreen';
import GroupScreen from './screens/GroupScreen';
import HomeScreen from './screens/HomeScreen';
import ServiceScreen from './screens/ServiceScreen';
import SettingsScreen from './screens/SettingsScreen';
import Style, { Color } from './Style';


const StackNav = StackNavigator({
  Home: { screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'MemPa',
      headerStyle: {
        backgroundColor: Color.mustard,
      },
      headerTintColor: 'white',
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
          onPress={() => navigation.navigate('AddService')}
        />
      ),
    }),
  },
  Service: {
    screen: ServiceScreen,
    path: 'service/:service',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.service.service}`,
      headerStyle: {
        backgroundColor: Color.mustard,
      },
      headerTintColor: 'white',
    }),
  },
  Group: {
    screen: GroupScreen,
    path: 'group/:group',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.group.getNavTitle()}`,
      headerStyle: {
        backgroundColor: Color.mustard,
      },
      headerTintColor: 'white',
      headerRight: (
        <Ionicons
          name="ios-add"
          size={28}
          style={Style.headerIcon}
          onPress={() => navigation.navigate('AddService')}
        />
      ),
    }),
  },
});

const ModalNav = StackNavigator({
  Home: {
    screen: StackNav,
    navigationOptions: {
      header: null,
      headerStyle: {
        backgroundColor: Color.mustard,
      },
      headerTintColor: 'white',
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      headerStyle: {
        backgroundColor: Color.mustard,
      },
      headerTintColor: 'white',
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
      headerStyle: {
        backgroundColor: Color.mustard,
      },
      headerTintColor: 'white',
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
});

const SimplifiedNav = StackNavigator({
  Home: { screen: HomeScreen,
    navigationOptions: {
      title: 'MemPa',
      headerStyle: {
        backgroundColor: Color.mustard,
      },
      headerTintColor: 'white',
    },
  },
});

export default ModalNav;
export {
  SimplifiedNav,
};
