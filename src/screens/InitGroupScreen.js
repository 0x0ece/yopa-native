import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView, Text } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';

import Style, { Color } from '../Style';
import Crypto from '../Crypto';
import { Group } from '../Models';
import { initGroup } from '../redux/actions';


const Form = t.form.Form;


class InitGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: 'default',
      buttonLoading: false,
      buttonDisabled: true,
      securityLevel: this.props.group.defaultSecurityLevel || 0,
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
      buttonDisabled: value.passphrase.length === 0,
    });
  }

  handlePress() {
    this.setState({ buttonLoading: true });

    // HACK(ec): async otherwise the loading spinner doesn't work on iphone7/ios11.0.3
    setTimeout(() => {
      const formData = this.form.getValue();
      if (formData) {
        const group = this.getGroupInstance(formData);
        this.props.navigation.setParams({ group });
        this.props.dispatch(initGroup(group));
      }
    }, 0);
  }

  render() {
    const options = [
      {
        title: 'Secure',
        desc: [
          'Store the master password in the device secure storage.',
          'Use your fingerprint to unlock.',
        ],
      },
      {
        title: 'Armored',
        desc: [
          'Store the master password encrypted.',
          'Type it every time to unlock.',
        ],
      },
      {
        title: 'Paranoic',
        desc: [
          'Never store the master password.',
          "Type it every time to unlock - MemPa won't check if it's correct or not.",
        ],
      },
    ];

    return (
      <ScrollView
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="never"
      >
        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputGroup}
          value={this.state.value}
          onChange={this.handleChange}
          options={{
            fields: {
              passphrase: {
                label: 'Choose a very strong master password',
                placeholder: 'correcthorsebatterystaple',
                autoCapitalize: 'none',
                autoCorrect: false,
                // EC: autoFocus removed based on user testing
                // (it seems better to see the full page and explicitly input the master pass)
                // autoFocus: true,
              },
            },
          }}
        />

        <Text style={[Style.formLabel, { marginTop: 10 }]}>
          {'Choose your security'}
        </Text>
        <Text>{'If unsure, leave the default'}</Text>
        <List
          style={{ marginBottom: 30 }}
        >
          {options.map((o, i) => (
            <ListItem
              key={o.title}
              containerStyle={{}}
              leftIcon={{
                name: (i === this.state.securityLevel) ? 'check-box' : 'check-box-outline-blank',
                color: (i === this.state.securityLevel) ? Color.checkboxChecked
                  : Color.checkboxBlank,
              }}
              leftIconContainerStyle={{ justifyContent: 'flex-start' }}
              title={o.title}
              titleStyle={[Style.formLabel, { marginBottom: 0 }]}
              subtitle={o.desc.join('\n')}
              subtitleNumberOfLines={4}
              subtitleStyle={{ fontWeight: 'normal' }}
              hideChevron
              onPress={() => { this.setState({ securityLevel: i }); }}
            />
          ))}
        </List>

        <Button
          buttonStyle={Style.primaryButton}
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          loading={this.state.buttonLoading}
          onPress={this.handlePress}
          title="Save"
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
