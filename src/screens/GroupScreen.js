import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, View, Platform } from 'react-native';
import ActionButton from 'react-native-action-button';

import InitGroupScreen from './InitGroupScreen';
import SecretList from '../components/SecretList';
import { Service } from '../Models';
import Config from '../Config';

class GroupScreen extends React.Component {
  render() {
    const group = this.props.navigation.state.params.group;
    let view = null;
    if (group.isInitialized()) {
      if(Config.Android && Platform.OS === 'android') {
        view =
          <View style={{flex:1}}>
            <SecretList
              group={group}
              navigation={this.props.navigation}
              services={this.props.services}
            />
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            onPress={() => this.props.navigation.navigate('AddService')}
          />
         </View>;
      } else {
        view  = <SecretList group={group} navigation={this.props.navigation} services={this.props.services}/>;
      }
    } else {
      view = <InitGroupScreen group={group} navigation={this.props.navigation}/>;
    }
    return view;
  }
}

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
  };
}

GroupScreen.propTypes = {
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(GroupScreen);
