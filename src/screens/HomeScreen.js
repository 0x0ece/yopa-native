import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Group, Service } from '../Models';
import SecretList from '../components/SecretList';


// TODO(ec) not sure how to get navigation working AND linting passing
const HomeScreen = ({ navigation, services, groups }) => {
  /* eslint no-undef:off */
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
      showAddButton={(services.length < 5)}
    />
  );
};

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups) || [],
  };
}

HomeScreen.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)).isRequired,
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(HomeScreen);
