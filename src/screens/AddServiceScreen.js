import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView } from 'react-native';

import Style from '../Style';
import { Group, Service } from '../Models';


const Form = t.form.Form;


class AddServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: 'default',
    };

    // here we are: define your domain model
    this.InputService = t.struct({
      service: t.String,
      username: t.String,
      group: t.enums({
        ...this.props.groups.map(g => g.group),
      }),
    });

    // this.onImport = this.onImport.bind(this);
  }

  render() {
    return (
      <ScrollView
        style={Style.defaultBg}
        keyboardShouldPersistTaps="always"
      >

        <Form
          type={this.InputService}
          options={{
            fields: {
              service: {
                placeholder: 'example.com',
              },
              username: {
                label: 'Username or email',
                placeholder: 'yopa',
              },
              group: {
                nullOption: false,
              },
            },
          }}
          value={{
            group: 0,
          }}
        />

      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups) || [],
  };
}

AddServiceScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)).isRequired,
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AddServiceScreen);
