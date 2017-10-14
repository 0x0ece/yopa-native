import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Service } from '../Models';
import SecretList from '../components/SecretList';


class GroupScreen extends React.Component {
  render() {
    return (
      <SecretList
        navigation={this.props.navigation}
        services={this.props.services}
        group={this.props.navigation.state.params.group}
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
