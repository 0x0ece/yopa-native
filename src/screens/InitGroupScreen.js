import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';

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
      securityLevel: 0,
      value: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePress = this.handlePress.bind(this);

    // here we are: define your domain model
    this.InputGroup = t.struct({
      passphrase: t.String,
    });
  }

  getGroupInstance(formData) {
    switch (this.state.securityLevel) {
      case 0:
        // TODO
        return new Group({
          ...this.props.group,
          inputPassphrase: formData.passphrase,
          passphrase: Crypto.encryptPassphrase(formData.passphrase),
        });
      case 1:
        return new Group({
          ...this.props.group,
          inputPassphrase: formData.passphrase,
          passphrase: Crypto.encryptPassphrase(formData.passphrase),
        });
      case 2:
        return new Group({
          ...this.props.group,
          inputPassphrase: formData.passphrase,
          storePassphrase: false,
        });
      default:
        return null;
    }
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
      const group = this.getGroupInstance(formData);
      this.props.dispatch(initGroup(group));
      this.props.navigation.setParams({ group });
    }
  }

  render() {
    const options = [
      {
        title: 'Secure',
        desc: [
          'Store your passphrase in the device secure storage.',
          'Use your fingerprint to unlock.',
        ],
      },
      {
        title: 'Armored',
        desc: [
          'Store your passphrase encrypted.',
          'Type your passphrase every time to unlock.',
        ],
      },
      {
        title: 'Paranoic',
        desc: [
          'Never store your passphrase.',
          "Type your passphrase every time to unlock - MemPa won't check if it's correct or no.",
        ],
      },
    ];

    return (
      <ScrollView
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="always"
      >
        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputGroup}
          value={this.state.value}
          onChange={this.handleChange}
          options={{
            fields: {
              passphrase: {
                label: 'Choose a very long and very strong passphrase',
                placeholder: 'correcthorsebatterystaple',
                autoCapitalize: 'none',
                autoCorrect: false,
                autoFocus: true,
              },
            },
          }}
        />

        <List
          style={{ marginBottom: 30 }}
        >
          {options.map((o, i) => (
            <ListItem
              key={o.title}
              containerStyle={{}}
              leftIcon={{ name: (i === this.state.securityLevel) ? 'check-box' : 'check-box-outline-blank' }}
              title={o.title}
              subtitle={o.desc.join('\n')}
              subtitleNumberOfLines={4}
              hideChevron
              onPress={() => { this.setState({ securityLevel: i }); }}
            />
          ))}
        </List>

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
