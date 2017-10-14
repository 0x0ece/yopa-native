import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import InitGroupScreen from './InitGroupScreen';
import SecretList from '../components/SecretList';
import { Group, Service } from '../Models';


class HomeScreen extends React.Component {
  render() {
    const homeGroup = this.props.groups[0];
    return homeGroup.isInitialized() ? (
      <SecretList
        navigation={this.props.navigation}
        services={this.props.services}
        groups={this.props.groups}
        group={homeGroup}
        forceGroupUnlock
        showGroups
        showAddButton={(this.props.services.length < 5)}
      />
    ) : (
      <InitGroupScreen
        group={homeGroup}
        navigation={this.props.navigation}
      />
    );
  }
}

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
