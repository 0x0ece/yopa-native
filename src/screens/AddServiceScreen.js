import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-elements';


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

  // TODO: add enable/disable button #30
  /*
  onChange() {
    this.setState({canAddService: true})
  }
  */

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
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="always"
      >

        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputService}
          onChange={this.onChange}
          options={{
            fields: {
              service: {
                placeholder: 'example.com',
              },
              username: {
                label: 'Username or email',
                placeholder: 'mempa',
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

        <Button
          small
          raised
          // disabled={this.state.canAddService} // TODO: #30
          icon={{ name: 'done', size: 32 }}
          textStyle={{ textAlign: 'center' }}
          buttonStyle={Style.primaryButton}
          onPress={this.onPress}
          title={'Add service'}
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
