import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView, TouchableHighlight, Text } from 'react-native';

import Style from '../Style';
import { Group, Service } from '../Models';
import { addService } from '../redux/actions';


const Form = t.form.Form;


class AddServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: 'default',
    };

    this.onPress = this.onPress.bind(this);

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

  onPress() {
    // call getValue() to get the values of the form
    const formData = this.form.getValue();
    if (formData) { // if validation fails, value will be null
      const service = new Service({
        service: formData.service,
        username: formData.username,
        group: this.props.groups[formData.group].group,
      });
      this.props.dispatch(addService(service));
      this.props.navigation.navigate('Home');
    }
  }

  render() {
    return (
      <ScrollView
        style={Style.defaultBg}
        keyboardShouldPersistTaps="always"
      >

        <Form
          ref={(c) => { this.form = c; }}
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
        <TouchableHighlight style={Style.button} onPress={this.onPress} underlayColor="#99d9f4">
          <Text style={Style.buttonText}>Save</Text>
        </TouchableHighlight>

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
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AddServiceScreen);
