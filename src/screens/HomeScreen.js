import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Group, Service } from '../Models';
import SecretList from '../components/SecretList';


class HomeScreen extends React.Component {
  render() {
    return (
      <SecretList
        navigate={this.props.navigation.navigate}
        services={this.props.services}
        groups={this.props.groups}
        showGroups
        showAddButton={(this.props.services.length < 5)}
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
