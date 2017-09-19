import React from 'react';
import { connect } from 'react-redux';

import SecretList from '../components/SecretList';


const HomeScreen = ({ navigation, services, groups, dispatch }) => {
  navigate = (page, options) => {
    if (page === 'back') {
      navigation.goBack(null);
    } else {
      navigation.navigate(page, options);
    }
  };

  return (
    <SecretList
      navigate={navigation.navigate}
      services={services}
      groups={groups}
      showGroups
    />
  );
};

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups) || [],
  };
}

export default connect(mapStateToProps)(HomeScreen);
