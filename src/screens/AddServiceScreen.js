import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-elements';


import Analytics from '../Analytics';
import Style from '../Style';
import { Group, Service } from '../Models';
import { addService } from '../redux/actions';


const Form = t.form.Form;


class AddServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: 'default',
      value: { group: 0 },
      canAddService: false,
    };

    this.onPress = this.onPress.bind(this);
    this.onChange = this.onChange.bind(this);

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

  onChange(value) {
    const newState = { value };
    if (value.service !== undefined && value.username !== undefined) {
      newState.canAddService = true;
    }
    this.setState(newState);
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
      Analytics.logServiceAdd();
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <ScrollView
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="always"
      >

        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputService}
          value={this.state.value}
          onChange={this.onChange}
          options={{
            fields: {
              service: {
                label: 'Site',
                placeholder: 'example.com',
              },
              username: {
                label: 'Username or email',
                placeholder: 'mempa',
              },
              group: {
                nullOption: false,
                hidden: this.props.groups.length === 1,
              },
            },
          }}
        />

        <Button
          buttonStyle={Style.primaryButton}
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          disabled={!this.state.canAddService}
          onPress={this.onPress}
          title="Add site"
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
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AddServiceScreen);
