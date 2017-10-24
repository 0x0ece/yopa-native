import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import ActionButton from 'react-native-action-button';

import InitGroupScreen from './InitGroupScreen';
import SecretList from '../components/SecretList';
import { Service } from '../Models';


class GroupScreen extends React.Component {
  render() {
    const group = this.props.navigation.state.params.group;
    return group.isInitialized() ? (
      <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        <SecretList
        group={group}
        navigation={this.props.navigation}
        services={this.props.services}
      />
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        onPress={() => this.props.navigation.navigate('AddService')}
      />
      </View>
    ) : (
      <InitGroupScreen
        group={group}
        navigation={this.props.navigation}
      />
    );
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
