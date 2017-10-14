import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView, TouchableHighlight, Text } from 'react-native';

import Style from '../Style';
import { Group } from '../Models';
import { initGroup } from '../redux/actions';


const Form = t.form.Form;


class InitGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: 'default',
    };

    this.onPress = this.onPress.bind(this);

    // here we are: define your domain model
    this.InputGroup = t.struct({
      passphrase: t.String,
      // securityLevel: t.String,
    });
  }

  onPress() {
    // TODO(ec): save data from form
    const formData = this.form.getValue();
    if (formData) {
      const group = new Group({
        ...this.props.group,
        inputPassphrase: formData.passphrase,
        passphrase: formData.passphrase,
        // securityLevel: formData.securityLevel,
      });
      // const group = new Group({
      //   ...this.props.group,
      //   inputPassphrase: formData.passphrase,
      //   storePassphrase: false,
      //   securityLevel: formData.securityLevel,
      // });
      this.props.dispatch(initGroup(group));
      this.props.navigation.setParams({ group });
    }
  }

  render() {
    return (
      <ScrollView
        style={Style.defaultBg}
        keyboardShouldPersistTaps="always"
      >
        <Text>
          Set passphrase for group {this.props.group.group}
        </Text>

        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputGroup}
        />
        <TouchableHighlight style={Style.button} onPress={this.onPress} underlayColor="#99d9f4">
          <Text style={Style.buttonText}>Save</Text>
        </TouchableHighlight>

      </ScrollView>
    );
  }
}

InitGroupScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  group: PropTypes.instanceOf(Group).isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect()(InitGroupScreen);
