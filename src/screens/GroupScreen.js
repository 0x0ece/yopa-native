import React from 'react';
import { connect } from 'react-redux';

import SecretList from '../components/SecretList';


const GroupScreen = ({ navigation, services, groups, dispatch }) => (
  <SecretList
    navigate={navigation.navigate}
    services={services}
    group={navigation.state.params.group}
  />
);

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups) || [],
  };
}

export default connect(mapStateToProps)(GroupScreen);
