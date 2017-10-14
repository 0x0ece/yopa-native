import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';

import Style from '../Style';
import Crypto from '../Crypto';
import { Group } from '../Models';
import { initGroup } from '../redux/actions';


const Form = t.form.Form;


class InitGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: 'default',
      saveDisabled: true,
      value: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePress = this.handlePress.bind(this);

    // here we are: define your domain model
    this.InputGroup = t.struct({
      passphrase: t.String,
      // securityLevel: t.String,
    });
  }

  handleChange(value) {
    this.setState({
      value,
      saveDisabled: value.passphrase.length === 0,
    });
  }

  handlePress() {
    // TODO(ec): save data from form
    const formData = this.form.getValue();
    if (formData) {
      const group = new Group({
        ...this.props.group,
        inputPassphrase: formData.passphrase,
        passphrase: Crypto.encryptPassphrase(formData.passphrase),
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
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="always"
      >
        <Text>
          Set passphrase for group {this.props.group.group}
        </Text>

        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputGroup}
          value={this.state.value}
          onChange={this.handleChange}
          options={{
            fields: {
              passphrase: {
                autoCapitalize: 'none',
                autoCorrect: false,
                autoFocus: true,
              },
            },
          }}
        />

        <Button
          small
          raised
          disabled={this.state.saveDisabled}
          icon={{ name: 'done', size: 32 }}
          textStyle={{ textAlign: 'center' }}
          buttonStyle={Style.primaryButton}
          onPress={this.handlePress}
          title={'Save'}
        />

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
