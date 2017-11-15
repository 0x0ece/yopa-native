import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { Alert, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';


import Analytics from '../Analytics';
import Config from '../Config';
import Style from '../Style';
import { Group, Service } from '../Models';
import { addService } from '../redux/actions';


const Form = t.form.Form;


class AddServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    const useCurrent = props.navigation.state.params !== undefined &&
     props.navigation.state.params.group !== undefined &&
      props.navigation.state.params.group.isInitialized();
    const currentGroup = useCurrent ? props.navigation.state.params.group : undefined;
    const groupId = useCurrent ?
      this.props.groups.findIndex(g => g.id === currentGroup.id) : 0;
    const groupName = useCurrent ?
      currentGroup.group : Group.DEFAULT_GROUP;

    this.state = {
      group: groupName,
      value: { group: groupId },
      canAddService: false,
    };

    this.handlePress = this.handlePress.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // here we are: define your domain model
    this.InputService = t.struct({
      service: t.String,
      username: t.String,
      group: t.enums({
        ...this.props.groups.map(g => g.group),
      }),
    });
  }

  handleChange(value) {
    const newState = { value };
    if (value.service !== undefined && value.username !== undefined) {
      newState.canAddService = true;
    }
    this.setState(newState);
  }

  handlePress() {
    // call getValue() to get the values of the form
    const formData = this.form.getValue();
    if (formData) { // if validation fails, value will be null
      const service = formData.service;
      const username = formData.username;

      // auto description for google, facebook, ...
      let description = '';
      Object.keys(Config.SERVICE_AUTO_DESCRIPTION).forEach((key) => {
        if (service.includes(key)) {
          description = Config.SERVICE_AUTO_DESCRIPTION[key];
        }
      });

      const model = new Service({
        service,
        username,
        description,
        group: this.props.groups[formData.group].group,
      });

      if (this.props.services.find(s => s.id === model.id) !== undefined) {
        Alert.alert('This site with this username already exists.');
      } else {
        this.props.dispatch(addService(model));
        Analytics.logServiceAdd();
        this.props.navigation.goBack();
      }
    }
  }

  render() {
    return (
      <ScrollView
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="handled"
      >

        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputService}
          value={this.state.value}
          onChange={this.handleChange}
          options={{
            fields: {
              service: {
                label: 'Site',
                placeholder: 'example.com',
                autoCapitalize: 'none',
                autoCorrect: false,
              },
              username: {
                label: 'Username or email',
                placeholder: 'mempa',
                autoCapitalize: 'none',
                autoCorrect: false,
              },
              group: {
                label: 'Category',
                nullOption: false,
                hidden: this.props.groups.length === 1,
              },
            },
          }}
        />

        <View style={{ marginTop: 10 }}>
          <Button
            buttonStyle={Style.primaryButton}
            containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
            disabled={!this.state.canAddService}
            onPress={this.handlePress}
            title="Add site"
          />
        </View>

      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups.filter(g => g.isInitialized())) || [],
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
